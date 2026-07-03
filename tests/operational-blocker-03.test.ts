import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { handleCheckoutRequest } from "../api/checkout.ts";
import { handleMembershipStatusRequest } from "../api/membership-status.ts";
import { handleStripeWebhookRequest } from "../api/stripe-webhook.ts";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import type { ApiRequest } from "../src/server/http.js";
import { createStripeCheckoutSession, verifyStripeWebhookSignature } from "../src/server/stripeRest.js";

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

function resetEnv(): void {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function stripeSignature(payload: string, secret: string, timestamp = Math.floor(Date.now() / 1000)): string {
  const signature = crypto.createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

test.afterEach(resetEnv);

test("Operational Blocker 03 checkout session creation calls Stripe and fails closed without env", async () => {
  const missing = await createStripeCheckoutSession({
    memberId: "member_1",
    planId: "MONTHLY_7",
    publicAppUrl: "https://humanity-laws.vercel.app",
  });
  assert.equal(missing.success, false);
  assert.match(missing.error ?? "", /STRIPE_SECRET_KEY/);

  let stripeBody = "";
  globalThis.fetch = (async (_url, init) => {
    stripeBody = String(init?.body);
    return jsonResponse(200, { id: "cs_test_123", url: "https://checkout.stripe.com/c/pay/cs_test_123" });
  }) as typeof fetch;

  const created = await createStripeCheckoutSession({
    secretKey: "sk_test",
    monthlyPriceId: "price_monthly",
    yearlyPriceId: "price_yearly",
    publicAppUrl: "https://humanity-laws.vercel.app",
    memberId: "member_1",
    email: "member@example.com",
    planId: "MONTHLY_7",
  });

  assert.equal(created.success, true);
  assert.equal(created.sessionId, "cs_test_123");
  assert.equal(created.url, "https://checkout.stripe.com/c/pay/cs_test_123");
  assert.ok(stripeBody.includes("mode=subscription"));
  assert.ok(stripeBody.includes("line_items%5B0%5D%5Bprice%5D=price_monthly"));
  assert.ok(stripeBody.includes("metadata%5Bmember_id%5D=member_1"));
});

test("Operational Blocker 03 checkout API requires Supabase auth and returns Stripe URL", async () => {
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.STRIPE_SECRET_KEY = "sk_test";
  process.env.STRIPE_MONTHLY_7_PRICE_ID = "price_monthly";
  process.env.STRIPE_YEARLY_70_PRICE_ID = "price_yearly";
  process.env.PUBLIC_APP_URL = "https://humanity-laws.vercel.app";

  globalThis.fetch = (async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return jsonResponse(200, { id: "00000000-0000-4000-8000-000000000001", email: "member@example.com" });
    if (url.includes("api.stripe.com/v1/checkout/sessions")) return jsonResponse(200, { id: "cs_live", url: "https://checkout.stripe.com/c/pay/cs_live" });
    return jsonResponse(404, {});
  }) as typeof fetch;

  const result = await handleCheckoutRequest({
    method: "POST",
    headers: { authorization: "Bearer access_token" },
    body: { planId: "MONTHLY_7" },
  } as ApiRequest);

  assert.equal(result.status, 200);
  assert.equal(result.body.success, true);
  assert.equal(result.body.checkoutUrl, "https://checkout.stripe.com/c/pay/cs_live");
});

test("Operational Blocker 03 webhook signature verification activates membership", async () => {
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";

  let persisted = false;
  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    if (url.includes("/rest/v1/memberships") && init?.method === "POST") {
      persisted = true;
      assert.ok(String(init.body).includes("ACTIVE"));
      return new Response(null, { status: 204 });
    }
    return jsonResponse(404, {});
  }) as typeof fetch;

  const payload = JSON.stringify({
    type: "checkout.session.completed",
    data: {
      object: {
        payment_status: "paid",
        status: "complete",
        customer: "cus_test",
        subscription: "sub_test",
        metadata: { member_id: "00000000-0000-4000-8000-000000000001" },
        customer_details: { email: "member@example.com" },
      },
    },
  });
  const result = await handleStripeWebhookRequest({
    method: "POST",
    headers: { "stripe-signature": stripeSignature(payload, "whsec_test") },
    body: payload,
  } as unknown as ApiRequest);

  assert.equal(result.status, 200);
  assert.equal(result.body.membershipStatus, "ACTIVE");
  assert.equal(persisted, true);
});

test("Operational Blocker 03 invalid webhook signature is rejected", () => {
  const payload = JSON.stringify({ type: "checkout.session.completed" });
  assert.equal(
    verifyStripeWebhookSignature({
      payload,
      signatureHeader: stripeSignature(payload, "correct_secret"),
      webhookSecret: "wrong_secret",
    }),
    false,
  );
});

test("Operational Blocker 03 success route verifies Stripe session before dashboard unlock", async () => {
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";
  process.env.STRIPE_SECRET_KEY = "sk_test";

  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return jsonResponse(200, { id: "00000000-0000-4000-8000-000000000001", email: "member@example.com" });
    if (url.includes("api.stripe.com/v1/checkout/sessions/cs_paid")) {
      return jsonResponse(200, {
        id: "cs_paid",
        payment_status: "paid",
        status: "complete",
        customer: "cus_test",
        subscription: "sub_test",
        metadata: { member_id: "00000000-0000-4000-8000-000000000001" },
        customer_details: { email: "member@example.com" },
      });
    }
    if (url.includes("/rest/v1/memberships") && init?.method === "POST") return new Response(null, { status: 204 });
    if (url.includes("/rest/v1/memberships") && !init?.method) return jsonResponse(200, [{ membership_status: "ACTIVE" }]);
    return jsonResponse(404, {});
  }) as typeof fetch;

  const result = await handleMembershipStatusRequest({
    method: "POST",
    headers: { authorization: "Bearer access_token" },
    body: { sessionId: "cs_paid" },
  } as ApiRequest);

  assert.equal(result.status, 200);
  assert.equal(result.body.active, true);
  assert.equal(result.body.membershipStatus, "ACTIVE");
});

test("Operational Blocker 03 dashboard and book expose operational unlock wiring without changing source text", () => {
  const dashboard = renderPageModelToHtml(routePage("/dashboard"));
  const book = renderPageModelToHtml(routePage("/book"));
  const checkout = renderPageModelToHtml(routePage("/checkout/monthly"));

  assert.ok(dashboard.includes("/api/membership-status"));
  assert.ok(dashboard.includes("membership=required"));
  assert.ok(checkout.includes("/api/checkout"));
  assert.ok(checkout.includes("Opening secure Stripe checkout"));
  assert.ok(book.includes("The preserved book archive is available") || book.includes("The book source is preserved"));
});
