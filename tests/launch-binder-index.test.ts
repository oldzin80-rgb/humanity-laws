import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const binderPath = "docs/launch/LAUNCH_BINDER_INDEX.md";

function readBinder(): string {
  return readFileSync(binderPath, "utf8");
}

test("launch binder index exists and references all live proof documents in order", () => {
  const binder = readBinder();
  const documents = [
    "LIVE_ENV_TEST_EVIDENCE.md",
    "LIVE_TEST_RUNBOOK.md",
    "VERCEL_ENV_SETUP_AND_DEPLOYMENT_PROOF.md",
    "SUPABASE_LIVE_SETUP_PROOF.md",
    "STRIPE_LIVE_SETUP_PROOF.md",
  ];

  let previousIndex = -1;
  for (const document of documents) {
    const index = binder.indexOf(document);
    assert.ok(index > previousIndex, `${document} should appear in binder order`);
    previousIndex = index;
  }
});

test("launch binder index explains purpose and founder testing order", () => {
  const binder = readBinder();

  for (const expectedText of [
    "Purpose: the official evidence log.",
    "Purpose: the step-by-step founder testing path.",
    "Purpose: Vercel environment variable setup and deployment proof.",
    "Purpose: Supabase auth, membership row, digital book access, and admin identity proof.",
    "Purpose: Stripe checkout, price ID, webhook, payment outcome, and access unlock proof.",
    "Recommended founder testing order",
  ]) {
    assert.ok(binder.includes(expectedText), `Missing binder purpose/order text: ${expectedText}`);
  }
});

test("launch binder index preserves final launch gate and launchReady false", () => {
  const binder = readBinder();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  for (const expectedText of [
    "Vercel environment variables.",
    "Supabase signup, login, logout, and session persistence.",
    "Stripe monthly checkout.",
    "Stripe webhook signature and delivery.",
    "Admin allowlist access control.",
    "Digital book access control.",
    "Hardcover placeholder/no checkout.",
    "Do not infer live readiness from local tests alone.",
  ]) {
    assert.ok(binder.includes(expectedText), `Missing launch gate text: ${expectedText}`);
  }

  assert.match(binder, /LaunchReady: FALSE/);
  assert.match(binder, /`launchReady` remains false until all live evidence passes\./);
  assert.equal(report.launchReady, false);
});
