import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const runbookPath = "docs/launch/LIVE_TEST_RUNBOOK.md";

function readRunbook(): string {
  return readFileSync(runbookPath, "utf8");
}

test("live test runbook exists and covers every required live testing area", () => {
  const runbook = readRunbook();

  for (const heading of [
    "## 1. Pre-test setup",
    "## 2. Vercel environment variable checklist",
    "## 3. Supabase user/auth test steps",
    "## 4. Stripe monthly checkout test steps",
    "## 5. Stripe digital book checkout test steps",
    "## 6. Stripe webhook delivery verification",
    "## 7. Database membership row verification",
    "## 8. Digital book unlock verification",
    "## 9. Admin allowlist verification",
    "## 10. Failed/canceled payment verification",
    "## 11. Hardcover placeholder verification",
    "## 12. Evidence capture instructions",
    "## 13. Final PASS/FAIL launch gate",
  ]) {
    assert.ok(runbook.includes(heading), `Missing runbook section: ${heading}`);
  }
});

test("live test runbook includes launch-critical expected outcomes", () => {
  const runbook = readRunbook();

  for (const expectedText of [
    "$7/month",
    "one-time payment, not a subscription",
    "`membership_status = ACTIVE`",
    "`digital_book_access = true`",
    "`membership_status = FREE`",
    "full member rooms remain locked",
    "Record FAIL if a non-admin can access admin rooms.",
    "canceled/failed payment does not unlock membership or book access",
    "no fake buy button",
    "Never paste secret values into the evidence log.",
  ]) {
    assert.ok(runbook.includes(expectedText), `Missing launch-critical outcome: ${expectedText}`);
  }
});

test("live test runbook keeps launchReady false until all live evidence and founder approval exist", () => {
  const runbook = readRunbook();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.match(runbook, /LaunchReady: FALSE/);
  assert.match(runbook, /`launchReady` must remain false until that evidence exists\./);
  assert.match(runbook, /Founder review complete/);
  assert.equal(report.launchReady, false);
});
