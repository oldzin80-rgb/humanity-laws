import assert from "node:assert/strict";
import test from "node:test";
import { LaunchRoutes, renderPageModelToHtml, routePage } from "../src/application/index.js";
import { createLaunchRuntime } from "../src/runtime/index.js";

test("Path 2 checkout routes exist for monthly, yearly, success, and cancel", () => {
  const routes = new Map(LaunchRoutes.map((route) => [route.path, route]));

  assert.equal(routes.get("/checkout/monthly")?.requiresAuth, true);
  assert.equal(routes.get("/checkout/yearly")?.requiresAuth, true);
  assert.equal(routes.get("/checkout/success")?.requiresAuth, true);
  assert.equal(routes.get("/checkout/cancel")?.requiresAuth, false);
});

test("Path 2 Join buttons resolve to implemented checkout routes", () => {
  const html = renderPageModelToHtml(routePage("/join"));

  assert.ok(html.includes("/checkout/monthly"));
  assert.ok(html.includes("/checkout/book"));
  assert.ok(html.includes("/book/hardcover"));
  assert.equal(routePage("/checkout/monthly").pageId, "checkout-monthly");
  assert.equal(routePage("/checkout/book").pageId, "checkout-book");
  assert.equal(routePage("/checkout/yearly").pageId, "checkout-yearly");
});

test("Path 2 checkout pages describe payment success, cancel, and membership unlock guardrails", () => {
  const monthly = renderPageModelToHtml(routePage("/checkout/monthly"));
  const success = renderPageModelToHtml(routePage("/checkout/success"));
  const cancel = renderPageModelToHtml(routePage("/checkout/cancel"));

  assert.ok(monthly.includes("Payment must be verified before membership unlocks"));
  assert.ok(monthly.includes("No fake payment success"));
  assert.ok(success.includes("Stripe session_id"));
  assert.ok(cancel.includes("No membership change was made"));
});

test("Path 2 checkout flow starts Stripe checkout and unlocks membership after success", async () => {
  const runtime = createLaunchRuntime({
    STRIPE_SECRET_KEY: "sk_test",
    STRIPE_MONTHLY_7_PRICE_ID: "price_monthly",
    STRIPE_YEARLY_70_PRICE_ID: "price_yearly",
  });
  const { member } = await runtime.auth.signUp("stripe-member@example.com", "Stripe Member");

  const started = await runtime.checkoutFlow.startCheckout({
    memberId: member.memberId,
    planId: "MONTHLY_7",
    appUrl: "https://staging.example",
  });

  assert.equal(started.success, true);
  assert.ok(started.checkoutUrl?.startsWith("https://staging.example/checkout/success"));
  assert.ok(started.sessionId);

  const completed = await runtime.checkoutFlow.completeSuccessfulCheckout({
    memberId: member.memberId,
    sessionId: started.sessionId,
  });

  assert.equal(completed.success, true);
  assert.equal(completed.member?.membershipStatus, "ACTIVE");
  assert.equal((await runtime.members.findById(member.memberId))?.membershipStatus, "ACTIVE");
});

test("Path 2 membership does not unlock without Stripe session_id", async () => {
  const runtime = createLaunchRuntime({
    STRIPE_SECRET_KEY: "sk_test",
    STRIPE_MONTHLY_7_PRICE_ID: "price_monthly",
    STRIPE_YEARLY_70_PRICE_ID: "price_yearly",
  });
  const { member } = await runtime.auth.signUp("locked-member@example.com", "Locked Member");

  const completed = await runtime.checkoutFlow.completeSuccessfulCheckout({
    memberId: member.memberId,
    sessionId: "",
  });

  assert.equal(completed.success, false);
  assert.equal((await runtime.members.findById(member.memberId))?.membershipStatus, "FREE");
});

test("Path 2 Supabase production auth env smoke remains explicit and fail-closed", async () => {
  const runtime = createLaunchRuntime({});
  const health = await runtime.supabase.healthCheck();

  assert.equal(health.healthy, false);
  assert.equal(health.details?.configured, false);
  assert.equal(health.details?.liveQueriesImplemented, false);
});
