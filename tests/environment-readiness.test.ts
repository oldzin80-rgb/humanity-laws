import assert from "node:assert/strict";
import { test } from "node:test";
import { assessEnvironmentReadiness } from "../src/bootstrap/environmentReadiness.js";

test("environment readiness fails closed when staging configuration is missing", () => {
  const report = assessEnvironmentReadiness({}, "staging");

  assert.equal(report.ready, false);
  assert.equal(report.status, "BLOCKED");
  assert.ok(report.blockers.some((blocker) => blocker.includes("DEPLOYMENT_URL")));
  assert.ok(report.blockers.some((blocker) => blocker.includes("SUPABASE_URL")));
  assert.ok(report.blockers.some((blocker) => blocker.includes("NEXT_PUBLIC_SUPABASE_URL")));
  assert.ok(report.blockers.some((blocker) => blocker.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY")));
  assert.ok(report.blockers.some((blocker) => blocker.includes("STRIPE_SECRET_KEY")));
  assert.ok(report.blockers.some((blocker) => blocker.includes("ADMIN_ALLOWLIST")));
});

test("environment readiness does not expose configured secret values", () => {
  const report = assessEnvironmentReadiness(
    {
      PUBLIC_APP_URL: "https://staging.humanity-laws.test",
      DEPLOYMENT_URL: "https://staging.humanity-laws.test",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "anon-secret",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-secret",
      SUPABASE_SERVICE_ROLE_KEY: "service-secret",
      STRIPE_SECRET_KEY: "stripe-secret",
      STRIPE_WEBHOOK_SECRET: "webhook-secret",
      STRIPE_MONTHLY_7_PRICE_ID: "price_monthly",
      STRIPE_YEARLY_70_PRICE_ID: "price_yearly",
      STRIPE_DIGITAL_BOOK_PRICE_ID: "price_book",
      ADMIN_ALLOWLIST: "admin@example.com",
      EMAIL_PROVIDER: "resend",
      ERROR_LOGGING_DSN: "https://error.example/123",
      MONITORING_ENDPOINT: "https://monitoring.example/health",
    },
    "staging",
  );

  assert.equal(report.ready, true);
  assert.equal(report.status, "READY");
  assert.equal(report.blockers.length, 0);
  assert.equal(JSON.stringify(report).includes("service-secret"), false);
  assert.equal(JSON.stringify(report).includes("stripe-secret"), false);
});

test("environment readiness blocks invalid URLs before staging verification", () => {
  const report = assessEnvironmentReadiness(
    {
      PUBLIC_APP_URL: "not-a-url",
      DEPLOYMENT_URL: "ftp://example.com",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "anon-secret",
      NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-secret",
      SUPABASE_SERVICE_ROLE_KEY: "service-secret",
      STRIPE_SECRET_KEY: "stripe-secret",
      STRIPE_WEBHOOK_SECRET: "webhook-secret",
      STRIPE_MONTHLY_7_PRICE_ID: "price_monthly",
      STRIPE_YEARLY_70_PRICE_ID: "price_yearly",
      STRIPE_DIGITAL_BOOK_PRICE_ID: "price_book",
      ADMIN_ALLOWLIST: "admin@example.com",
      EMAIL_PROVIDER: "resend",
      ERROR_LOGGING_DSN: "https://error.example/123",
      MONITORING_ENDPOINT: "https://monitoring.example/health",
    },
    "staging",
  );

  assert.equal(report.ready, false);
  assert.ok(report.blockers.some((blocker) => blocker.includes("PUBLIC_APP_URL")));
  assert.ok(report.blockers.some((blocker) => blocker.includes("DEPLOYMENT_URL")));
  assert.ok(report.blockers.some((blocker) => blocker.includes("NEXT_PUBLIC_SUPABASE_URL")));
});
