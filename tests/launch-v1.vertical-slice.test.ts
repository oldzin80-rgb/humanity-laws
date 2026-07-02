import test from "node:test";
import assert from "node:assert/strict";
import { createLaunchRuntime } from "../src/runtime/index.js";

test("Launch V1 primary member journey reaches ACTIVE dashboard path", async () => {
  const runtime = createLaunchRuntime({ STRIPE_SECRET_KEY: "sk_test", STRIPE_MONTHLY_7_PRICE_ID: "price_m", STRIPE_YEARLY_70_PRICE_ID: "price_y" });
  const { member, session } = await runtime.auth.signUp("member@example.com", "Launch Member");
  assert.equal(session.authenticated, true);
  const checkout = await runtime.checkout.createCheckout({ memberId: member.memberId, planId: "MONTHLY_7", successUrl: "/success", cancelUrl: "/cancel" });
  assert.equal(checkout.success, true);
  const active = await runtime.subscriptionStatus.markActiveFromPayment(member.memberId);
  assert.equal(active.membershipStatus, "ACTIVE");
});
