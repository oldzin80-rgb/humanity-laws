import crypto from "node:crypto";
import type { SubscriptionPlanId } from "../member/index.js";

export interface StripeCheckoutSessionRequest {
  secretKey?: string;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  publicAppUrl?: string;
  memberId: string;
  email?: string;
  planId: SubscriptionPlanId;
  fetchImpl?: typeof fetch;
}

export interface StripeCheckoutSessionResult {
  success: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
}

export interface StripeCheckoutSessionSummary {
  id: string;
  paymentStatus?: string;
  status?: string;
  mode?: string;
  customerId?: string;
  subscriptionId?: string;
  email?: string;
  memberId?: string;
}

export function priceForPlan(params: {
  planId: SubscriptionPlanId;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
}): string | undefined {
  return params.planId === "MONTHLY_7" ? params.monthlyPriceId : params.yearlyPriceId;
}

export async function createStripeCheckoutSession(params: StripeCheckoutSessionRequest): Promise<StripeCheckoutSessionResult> {
  if (!params.secretKey) return { success: false, error: "STRIPE_SECRET_KEY is missing." };
  if (!params.publicAppUrl) return { success: false, error: "PUBLIC_APP_URL is missing." };

  const price = priceForPlan(params);
  if (!price) return { success: false, error: `Stripe price is missing for ${params.planId}.` };

  const baseUrl = params.publicAppUrl.replace(/\/$/, "");
  const body = new URLSearchParams({
    mode: "subscription",
    client_reference_id: params.memberId,
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel?plan=${params.planId}`,
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    "metadata[member_id]": params.memberId,
    "metadata[plan_id]": params.planId,
  });

  if (params.email) body.set("customer_email", params.email);

  const fetcher = params.fetchImpl ?? fetch;
  const response = await fetcher("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${params.secretKey}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const stripeError = json.error && typeof json.error === "object" ? (json.error as Record<string, unknown>).message : undefined;
    return { success: false, error: typeof stripeError === "string" ? stripeError : "Stripe checkout session creation failed." };
  }

  return {
    success: true,
    url: typeof json.url === "string" ? json.url : undefined,
    sessionId: typeof json.id === "string" ? json.id : undefined,
  };
}

export function verifyStripeWebhookSignature(params: {
  payload: string;
  signatureHeader?: string;
  webhookSecret?: string;
  toleranceSeconds?: number;
  nowSeconds?: number;
}): boolean {
  if (!params.webhookSecret || !params.signatureHeader) return false;

  const parts = Object.fromEntries(
    params.signatureHeader.split(",").map((part) => {
      const [key, ...value] = part.split("=");
      return [key, value.join("=")];
    }),
  );
  const timestamp = parts.t;
  const expectedSignature = parts.v1;
  if (!timestamp || !expectedSignature) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;

  const tolerance = params.toleranceSeconds ?? 300;
  const now = params.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNumber) > tolerance) return false;

  const signedPayload = `${timestamp}.${params.payload}`;
  const actualSignature = crypto.createHmac("sha256", params.webhookSecret).update(signedPayload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(actualSignature), Buffer.from(expectedSignature));
}

export async function retrieveStripeCheckoutSession(params: {
  secretKey?: string;
  sessionId?: string;
  fetchImpl?: typeof fetch;
}): Promise<{ success: boolean; session?: StripeCheckoutSessionSummary; error?: string }> {
  if (!params.secretKey) return { success: false, error: "STRIPE_SECRET_KEY is missing." };
  if (!params.sessionId) return { success: false, error: "session_id is missing." };

  const fetcher = params.fetchImpl ?? fetch;
  const response = await fetcher(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(params.sessionId)}`, {
    headers: { authorization: `Bearer ${params.secretKey}` },
  });
  const json = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const stripeError = json.error && typeof json.error === "object" ? (json.error as Record<string, unknown>).message : undefined;
    return { success: false, error: typeof stripeError === "string" ? stripeError : "Stripe checkout session retrieval failed." };
  }

  const metadata = json.metadata && typeof json.metadata === "object" ? (json.metadata as Record<string, unknown>) : {};
  const customerDetails = json.customer_details && typeof json.customer_details === "object" ? (json.customer_details as Record<string, unknown>) : {};

  return {
    success: true,
    session: {
      id: String(json.id ?? params.sessionId),
      paymentStatus: typeof json.payment_status === "string" ? json.payment_status : undefined,
      status: typeof json.status === "string" ? json.status : undefined,
      mode: typeof json.mode === "string" ? json.mode : undefined,
      customerId: typeof json.customer === "string" ? json.customer : undefined,
      subscriptionId: typeof json.subscription === "string" ? json.subscription : undefined,
      email: typeof customerDetails.email === "string" ? customerDetails.email : undefined,
      memberId: typeof metadata.member_id === "string" ? metadata.member_id : undefined,
    },
  };
}

export function checkoutSessionIsPaid(session: StripeCheckoutSessionSummary): boolean {
  return session.paymentStatus === "paid" || session.status === "complete";
}
