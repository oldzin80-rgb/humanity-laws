import type { ApiRequest, ApiResponse } from "../src/server/http.js";
import { methodNotAllowed, readRawBody, sendJson } from "../src/server/http.js";
import { persistMembershipStatus } from "../src/server/supabaseMembership.js";
import { verifyStripeWebhookSignature } from "../src/server/stripeRest.js";

function stripeSignature(req: ApiRequest): string | undefined {
  const signature = req.headers["stripe-signature"];
  return Array.isArray(signature) ? signature[0] : signature;
}

export async function handleStripeWebhookRequest(req: ApiRequest): Promise<{ status: number; body: Record<string, unknown> }> {
  if (req.method !== "POST") return methodNotAllowed(req.method);

  const rawBody = await readRawBody(req);
  const verified = verifyStripeWebhookSignature({
    payload: rawBody,
    signatureHeader: stripeSignature(req),
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  });
  if (!verified) return { status: 400, body: { success: false, error: "Stripe webhook signature verification failed." } };

  const event = JSON.parse(rawBody) as Record<string, unknown>;
  const eventType = typeof event.type === "string" ? event.type : "";
  const data = event.data && typeof event.data === "object" ? (event.data as Record<string, unknown>) : {};
  const object = data.object && typeof data.object === "object" ? (data.object as Record<string, unknown>) : {};

  if (eventType !== "checkout.session.completed") {
    return { status: 200, body: { success: true, ignored: true, eventType } };
  }

  const metadata = object.metadata && typeof object.metadata === "object" ? (object.metadata as Record<string, unknown>) : {};
  const customerDetails = object.customer_details && typeof object.customer_details === "object" ? (object.customer_details as Record<string, unknown>) : {};
  const paymentStatus = typeof object.payment_status === "string" ? object.payment_status : "";
  const sessionStatus = typeof object.status === "string" ? object.status : "";
  const memberId = typeof metadata.member_id === "string" ? metadata.member_id : typeof object.client_reference_id === "string" ? object.client_reference_id : undefined;

  if (!memberId) return { status: 400, body: { success: false, error: "Webhook did not include member_id." } };
  if (paymentStatus !== "paid" && sessionStatus !== "complete") {
    return { status: 200, body: { success: true, ignored: true, reason: "Checkout session is not paid or complete." } };
  }

  const persisted = await persistMembershipStatus(
    {
      supabaseUrl: process.env.SUPABASE_URL,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    {
      memberId,
      email: typeof customerDetails.email === "string" ? customerDetails.email : undefined,
      status: "ACTIVE",
      stripeCustomerId: typeof object.customer === "string" ? object.customer : undefined,
      stripeSubscriptionId: typeof object.subscription === "string" ? object.subscription : undefined,
    },
  );

  if (!persisted.success) return { status: 500, body: { success: false, error: persisted.error ?? "Membership persistence failed." } };
  return { status: 200, body: { success: true, membershipStatus: "ACTIVE" } };
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    const result = await handleStripeWebhookRequest(req);
    sendJson(res, result.status, result.body);
  } catch (error) {
    sendJson(res, 500, { success: false, error: error instanceof Error ? error.message : "Webhook failed." });
  }
}
