import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { assessEnvironmentReadiness } from "../src/bootstrap/environmentReadiness.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";

const requiredEnvVars = [
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
] as const;

function read(path: string): string {
  return readFileSync(path, "utf8");
}

test("live env configuration audit keeps required env names consistent across template, readiness, and launch docs", () => {
  const envExample = read(".env.example");
  const evidence = read("docs/launch/LIVE_ENV_TEST_EVIDENCE.md");
  const runbook = read("docs/launch/LIVE_TEST_RUNBOOK.md");
  const readiness = assessEnvironmentReadiness({}, "staging");

  for (const variable of requiredEnvVars) {
    assert.match(envExample, new RegExp(`^${variable}=`, "m"), `${variable} missing from .env.example`);
    assert.ok(readiness.blockers.some((blocker) => blocker.startsWith(`${variable}:`)), `${variable} missing from readiness blockers`);
    assert.ok(evidence.includes(`\`${variable}\``), `${variable} missing from live evidence document`);
    assert.ok(runbook.includes(`\`${variable}\``), `${variable} missing from live test runbook`);
  }
});

test("live env configuration audit keeps Stripe price ids separated by product path", () => {
  const checkoutApi = read("api/checkout.ts");
  const stripeRest = read("src/server/stripeRest.ts");

  assert.match(checkoutApi, /MONTHLY_7:\s*"STRIPE_MONTHLY_7_PRICE_ID"/);
  assert.match(checkoutApi, /YEARLY_70:\s*"STRIPE_YEARLY_70_PRICE_ID"/);
  assert.match(checkoutApi, /DIGITAL_BOOK:\s*"STRIPE_DIGITAL_BOOK_PRICE_ID"/);
  assert.match(stripeRest, /params\.planId === "DIGITAL_BOOK" \? "payment" : "subscription"/);
  assert.match(stripeRest, /metadata\[plan_id\]/);
});

test("live env configuration audit keeps hardcover separate from active checkout", () => {
  const router = read("src/application/router.ts");
  const hardcover = renderPageModelToHtml(routePage("/book/hardcover"));

  assert.ok(router.includes('"/book/hardcover"'));
  assert.doesNotMatch(router, /checkout\/hardcover/i);
  assert.doesNotMatch(router, /createCheckoutPage\("hardcover"\)/i);
  assert.match(hardcover, /No fake fulfillment/);
  assert.match(hardcover, /print-on-demand provider/);
  assert.doesNotMatch(hardcover, /Buy hardcover now|shipping now|fulfilled today/i);
});

test("live env configuration audit requires admin allowlist and keeps launchReady false", () => {
  const adminHtml = renderPageModelToHtml(routePage("/admin"));
  const evidence = read("docs/launch/LIVE_ENV_TEST_EVIDENCE.md");
  const runbook = read("docs/launch/LIVE_TEST_RUNBOOK.md");

  assert.match(adminHtml, /adminAllowlist/);
  assert.match(adminHtml, /admin=required/);
  assert.match(evidence, /LaunchReady: FALSE/);
  assert.match(runbook, /LaunchReady: FALSE/);
});
