import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const guidePath = "docs/launch/VERCEL_ENV_SETUP_AND_DEPLOYMENT_PROOF.md";

function readGuide(): string {
  return readFileSync(guidePath, "utf8");
}

test("Vercel env setup guide exists and covers required setup/proof areas", () => {
  const guide = readGuide();

  for (const heading of [
    "## 1. Where to enter env vars in Vercel",
    "## 2. Required env vars checklist",
    "## 3. Values from Supabase",
    "## 4. Values from Stripe",
    "## 5. ADMIN_ALLOWLIST value Nick sets manually",
    "## 6. App and deployment URL values",
    "## 7. Optional monitoring/email vars",
    "## 8. How to redeploy after env vars are saved",
    "## 9. How to confirm deployment built successfully",
    "## 10. How to record proof in LIVE_ENV_TEST_EVIDENCE.md",
    "## 11. Secret safety warning",
    "## 12. LaunchReady rule",
  ]) {
    assert.ok(guide.includes(heading), `Missing guide section: ${heading}`);
  }
});

test("Vercel env setup guide includes all required env variables", () => {
  const guide = readGuide();

  for (const variable of [
    "PUBLIC_APP_URL",
    "DEPLOYMENT_URL",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_MONTHLY_7_PRICE_ID",
    "STRIPE_YEARLY_70_PRICE_ID",
    "STRIPE_DIGITAL_BOOK_PRICE_ID",
    "ADMIN_ALLOWLIST",
    "EMAIL_PROVIDER",
    "ERROR_LOGGING_DSN",
    "MONITORING_ENDPOINT",
  ]) {
    assert.ok(guide.includes(`\`${variable}\``), `Missing variable from guide: ${variable}`);
  }
});

test("Vercel env setup guide preserves pricing, checkout separation, proof capture, and secret safety", () => {
  const guide = readGuide();

  for (const expectedText of [
    "$7/month",
    "$70/year",
    "one-time digital book price",
    "Expected webhook endpoint:",
    "Redeploy",
    "Vercel deployment status: Ready.",
    "Do not paste secret keys.",
    "Never paste these into screenshots, chats, or public docs:",
    "Hardcover remains an honest placeholder.",
  ]) {
    assert.ok(guide.includes(expectedText), `Missing required proof/safety text: ${expectedText}`);
  }
});

test("Vercel env setup guide keeps launchReady false until live evidence passes", () => {
  const guide = readGuide();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.match(guide, /LaunchReady: FALSE/);
  assert.match(guide, /`launchReady` must stay false until live evidence passes\./);
  assert.equal(report.launchReady, false);
});
