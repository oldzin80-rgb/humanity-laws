import test from "node:test";
import assert from "node:assert/strict";
import { StripeClientBoundary } from "../src/infrastructure/index.js";

test("Stripe boundary does not fake success when unconfigured", async () => {
  const stripe = new StripeClientBoundary({});
  const result = await stripe.createCheckoutSession({ memberId: "m", planId: "MONTHLY_7", successUrl: "/s", cancelUrl: "/c" });
  assert.equal(result.success, false);
});

test("Stripe boundary creates configured checkout session", async () => {
  const stripe = new StripeClientBoundary({ secretKey: "sk", monthlyPriceId: "price_m", yearlyPriceId: "price_y" });
  const result = await stripe.createCheckoutSession({ memberId: "m", planId: "YEARLY_70", successUrl: "/s", cancelUrl: "/c" });
  assert.equal(result.success, true);
  assert.ok(result.sessionId);
});
