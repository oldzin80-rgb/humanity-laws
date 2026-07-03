import type { ApiRequest, ApiResponse } from "../src/server/http.js";
import { bearerToken, methodNotAllowed, readJsonBody, sendJson } from "../src/server/http.js";
import { verifySupabaseAccessToken } from "../src/server/supabaseMembership.js";
import { createStripeCheckoutSession } from "../src/server/stripeRest.js";
import type { CommercePlanId } from "../src/member/index.js";

function isPlanId(value: unknown): value is CommercePlanId {
  return value === "MONTHLY_7" || value === "YEARLY_70" || value === "DIGITAL_BOOK";
}

function envValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value || value === name) return undefined;
  return value;
}

const planPriceEnv: Record<CommercePlanId, string> = {
  MONTHLY_7: "STRIPE_MONTHLY_7_PRICE_ID",
  YEARLY_70: "STRIPE_YEARLY_70_PRICE_ID",
  DIGITAL_BOOK: "STRIPE_DIGITAL_BOOK_PRICE_ID",
};

export async function handleCheckoutRequest(req: ApiRequest): Promise<{ status: number; body: Record<string, unknown> }> {
  if (req.method !== "POST") return methodNotAllowed(req.method);

  const auth = await verifySupabaseAccessToken(
    {
      supabaseUrl: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    bearerToken(req),
  );
  if (!auth.success || !auth.user) return { status: 401, body: { success: false, error: auth.error ?? "Authentication required." } };

  const body = await readJsonBody(req);
  if (!isPlanId(body.planId)) return { status: 400, body: { success: false, error: "Valid planId is required." } };

  const monthlyPriceId = body.planId === "MONTHLY_7" ? envValue(planPriceEnv.MONTHLY_7) : undefined;
  const yearlyPriceId = body.planId === "YEARLY_70" ? envValue(planPriceEnv.YEARLY_70) : undefined;
  const digitalBookPriceId = body.planId === "DIGITAL_BOOK" ? envValue(planPriceEnv.DIGITAL_BOOK) : undefined;
  const selectedPriceId = body.planId === "MONTHLY_7" ? monthlyPriceId : body.planId === "YEARLY_70" ? yearlyPriceId : digitalBookPriceId;
  if (!selectedPriceId) {
    return {
      status: 503,
      body: {
        success: false,
        error: `${planPriceEnv[body.planId]} is missing or still set to a placeholder value.`,
      },
    };
  }

  const checkout = await createStripeCheckoutSession({
    secretKey: envValue("STRIPE_SECRET_KEY"),
    monthlyPriceId,
    yearlyPriceId,
    digitalBookPriceId,
    publicAppUrl: envValue("PUBLIC_APP_URL"),
    memberId: auth.user.id,
    email: auth.user.email,
    planId: body.planId,
  });

  if (!checkout.success) return { status: 503, body: { success: false, error: checkout.error ?? "Checkout unavailable." } };
  return { status: 200, body: { success: true, checkoutUrl: checkout.url, sessionId: checkout.sessionId } };
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    const result = await handleCheckoutRequest(req);
    sendJson(res, result.status, result.body);
  } catch (error) {
    sendJson(res, 500, { success: false, error: error instanceof Error ? error.message : "Checkout failed." });
  }
}
