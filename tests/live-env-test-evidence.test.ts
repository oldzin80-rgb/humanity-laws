import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const evidencePath = "docs/launch/LIVE_ENV_TEST_EVIDENCE.md";

function readEvidenceDocument(): string {
  return readFileSync(evidencePath, "utf8");
}

test("live environment evidence document exists and includes all launch-blocking categories", () => {
  const document = readEvidenceDocument();

  for (const heading of [
    "## 1. Environment variables",
    "## 2. Supabase live evidence",
    "## 3. Stripe live evidence",
    "## 4. Webhook evidence",
    "## 5. Access evidence",
    "## 6. Final launch gate",
  ]) {
    assert.ok(document.includes(heading), `Missing evidence category: ${heading}`);
  }
});

test("live environment evidence document starts with manual evidence marked NO", () => {
  const document = readEvidenceDocument();

  for (const requiredText of [
    "| `PUBLIC_APP_URL` | Vercel Project Settings",
    "| `SUPABASE_URL` | Vercel Project Settings",
    "| `STRIPE_WEBHOOK_SECRET` | Vercel Project Settings",
    "| `ADMIN_ALLOWLIST` | Vercel Project Settings",
    "| Signup works live | NO |",
    "| Login works live | NO |",
    "| Monthly checkout opens | NO |",
    "| Digital book checkout opens | NO |",
    "| `checkout.session.completed` received | NO |",
    "| Monthly membership activates membership row | NO |",
    "| Digital-book-only purchase grants book access | NO |",
    "| Unpaid user is blocked from member-only areas | NO |",
    "| Allowlisted admin is allowed into admin pages | NO |",
    "| Public launch approval granted | NO |",
  ]) {
    assert.ok(document.includes(requiredText), `Evidence item should begin unverified: ${requiredText}`);
  }
});

test("live environment evidence document keeps launchReady false until live evidence is complete", () => {
  const document = readEvidenceDocument();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.match(document, /launchReady.*false/i);
  assert.match(document, /Do not infer success from passing local tests alone\./);
  assert.equal(report.launchReady, false);
});
