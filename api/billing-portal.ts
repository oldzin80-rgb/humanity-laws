import type { ApiRequest, ApiResponse } from "../src/server/http.js";
import { bearerToken, methodNotAllowed, sendJson } from "../src/server/http.js";
import { getMembershipStatus, verifySupabaseAccessToken } from "../src/server/supabaseMembership.js";
import { createStripeBillingPortalSession } from "../src/server/stripeRest.js";

function envValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value !== name ? value : undefined;
}

export async function handleBillingPortalRequest(req: ApiRequest): Promise<{ status: number; body: Record<string, unknown> }> {
  if (req.method !== "POST") return methodNotAllowed(req.method);

  const auth = await verifySupabaseAccessToken(
    { supabaseUrl: process.env.SUPABASE_URL, anonKey: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    bearerToken(req),
  );
  if (!auth.success || !auth.user) return { status: 401, body: { success: false, error: auth.error ?? "Authentication required." } };

  const membership = await getMembershipStatus(
    { supabaseUrl: process.env.SUPABASE_URL, serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY },
    auth.user.id,
  );
  if (!membership.success) return { status: 503, body: { success: false, error: membership.error ?? "Membership status unavailable." } };

  const appUrl = envValue("PUBLIC_APP_URL")?.replace(/\/$/, "");
  const portal = await createStripeBillingPortalSession({
    secretKey: envValue("STRIPE_SECRET_KEY"),
    customerId: membership.stripeCustomerId,
    returnUrl: appUrl ? `${appUrl}/settings` : undefined,
  });
  if (!portal.success || !portal.url) return { status: 503, body: { success: false, error: portal.error ?? "Billing portal unavailable." } };
  return { status: 200, body: { success: true, portalUrl: portal.url } };
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    const result = await handleBillingPortalRequest(req);
    sendJson(res, result.status, result.body);
  } catch (error) {
    sendJson(res, 500, { success: false, error: error instanceof Error ? error.message : "Billing portal failed." });
  }
}
