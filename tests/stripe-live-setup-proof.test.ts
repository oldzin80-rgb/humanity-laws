import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const guidePath = "docs/launch/STRIPE_LIVE_SETUP_PROOF.md";

function readGuide(): string {
  return readFileSync(guidePath, "utf8");
}

test("Stripe live setup proof guide exists and covers all required proof areas", () => {
  const guide = readGuide();

  for (const heading of [
    "## 1. Where to find Stripe secret key",
    "## 2. Where to find monthly $7 price ID",
    "## 3. Where to find yearly $70 price ID",
    "## 4. Where to find digital book price ID",
    "## 5. Where to configure webhook endpoint",
    "## 6. Where to find webhook signing secret",
    "## 7. Monthly checkout proof steps",
    "## 8. Digital-book-only checkout proof steps",
    "## 9. Webhook delivery proof steps",
    "## 10. Membership row update proof",
    "## 11. Digital book unlock proof",
    "## 12. Failed/canceled payment proof",
    "## 13. Hardcover remains placeholder/no checkout",
    "## 14. Secret-safety warning",
    "## 15. LaunchReady rule",
  ]) {
    assert.ok(guide.includes(heading), `Missing Stripe proof section: ${heading}`);
  }
});

test("Stripe live setup proof guide covers required env vars, price IDs, and webhook endpoint", () => {
  const guide = readGuide();

  for (const expectedText of [
    "`STRIPE_SECRET_KEY`",
    "`STRIPE_MONTHLY_7_PRICE_ID`",
    "`STRIPE_YEARLY_70_PRICE_ID`",
    "`STRIPE_DIGITAL_BOOK_PRICE_ID`",
    "`STRIPE_WEBHOOK_SECRET`",
    "$7/month",
    "$70/year",
    "one-time payment",
    "https://YOUR_DEPLOYMENT_URL/api/stripe-webhook",
    "`checkout.session.completed`",
  ]) {
    assert.ok(guide.includes(expectedText), `Missing Stripe env/price/webhook text: ${expectedText}`);
  }
});

test("Stripe live setup proof guide covers membership unlock, digital book unlock, and failed payment lockout", () => {
  const guide = readGuide();

  for (const expectedText of [
    "`membership_status = ACTIVE`",
    "`membership_status = FREE`",
    "`digital_book_access = true`",
    "`stripe_customer_id`",
    "`stripe_subscription_id`",
    "Full membership does not unlock.",
    "Failed/canceled payment does not unlock membership.",
    "Failed/canceled payment does not unlock digital book access.",
  ]) {
    assert.ok(guide.includes(expectedText), `Missing Stripe access proof text: ${expectedText}`);
  }
});

test("Stripe live setup proof guide keeps hardcover placeholder, protects secrets, and launchReady false", () => {
  const guide = readGuide();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.match(guide, /No hardcover purchase is accepted until real POD\/fulfillment exists\./);
  assert.match(guide, /Never paste these values into screenshots, chats, public docs, or commits:/);
  assert.match(guide, /`launchReady` remains false until live proof passes\./);
  assert.equal(report.launchReady, false);
});
