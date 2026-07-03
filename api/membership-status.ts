import type { ApiRequest, ApiResponse } from "../src/server/http.js";
import { bearerToken, methodNotAllowed, readJsonBody, sendJson } from "../src/server/http.js";
import { getMembershipStatus, persistMembershipStatus, verifySupabaseAccessToken } from "../src/server/supabaseMembership.js";
import { checkoutSessionIsPaid, retrieveStripeCheckoutSession } from "../src/server/stripeRest.js";

export async function handleMembershipStatusRequest(req: ApiRequest): Promise<{ status: number; body: Record<string, unknown> }> {
  if (req.method !== "GET" && req.method !== "POST") return methodNotAllowed(req.method);

  const auth = await verifySupabaseAccessToken(
    {
      supabaseUrl: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    bearerToken(req),
  );
  if (!auth.success || !auth.user) return { status: 401, body: { success: false, error: auth.error ?? "Authentication required." } };

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : undefined;
    const stripeSession = await retrieveStripeCheckoutSession({ secretKey: process.env.STRIPE_SECRET_KEY, sessionId });
    if (!stripeSession.success || !stripeSession.session) {
      return { status: 400, body: { success: false, error: stripeSession.error ?? "Stripe checkout session could not be verified." } };
    }
    if (!checkoutSessionIsPaid(stripeSession.session)) {
      return { status: 402, body: { success: false, active: false, error: "Stripe checkout session is not paid." } };
    }

    const memberId = stripeSession.session.memberId ?? auth.user.id;
    if (memberId !== auth.user.id) return { status: 403, body: { success: false, error: "Stripe session does not belong to the authenticated member." } };
    const isDigitalBookOnly = stripeSession.session.mode === "payment";

    const persisted = await persistMembershipStatus(
      {
        supabaseUrl: process.env.SUPABASE_URL,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      {
        memberId: auth.user.id,
        email: stripeSession.session.email ?? auth.user.email,
        status: isDigitalBookOnly ? "FREE" : "ACTIVE",
        digitalBookAccess: true,
        stripeCustomerId: stripeSession.session.customerId,
        stripeSubscriptionId: stripeSession.session.subscriptionId,
      },
    );
    if (!persisted.success) return { status: 500, body: { success: false, error: persisted.error ?? "Membership persistence failed." } };
  }

  const membership = await getMembershipStatus(
    {
      supabaseUrl: process.env.SUPABASE_URL,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    auth.user.id,
  );

  if (!membership.success) return { status: 503, body: { success: false, active: false, bookAccess: false, error: membership.error ?? "Membership status unavailable." } };
  return { status: 200, body: { success: true, active: membership.active, bookAccess: membership.bookAccess, membershipStatus: membership.status ?? "FREE" } };
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    const result = await handleMembershipStatusRequest(req);
    sendJson(res, result.status, result.body);
  } catch (error) {
    sendJson(res, 500, { success: false, active: false, error: error instanceof Error ? error.message : "Membership status failed." });
  }
}
