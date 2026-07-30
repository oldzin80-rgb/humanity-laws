import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {handleAdminProvidersRequest} from "../api/admin-providers.js";
import {createFounderCommandCenterPage} from "../src/application/pages/founderCommandCenterPage.js";
import {LaunchRoutes, routePage} from "../src/application/router.js";

const request = (method: string, token?: string, body?: Record<string, unknown>) => ({
  method,
  headers: token ? {authorization: `Bearer ${token}`} : {},
  body,
}) as never;

test("Founder provider API rejects unauthenticated and non-Founder requests", async () => {
  const original = process.env.FOUNDER_ADMIN_TOKEN;
  process.env.FOUNDER_ADMIN_TOKEN = "fixture-founder-token";
  try {
    assert.equal((await handleAdminProvidersRequest(request("GET"))).status, 403);
    assert.equal((await handleAdminProvidersRequest(request("GET", "wrong"))).status, 403);
  } finally {
    if (original === undefined) delete process.env.FOUNDER_ADMIN_TOKEN;
    else process.env.FOUNDER_ADMIN_TOKEN = original;
  }
});

test("Founder read API returns thirteen unknown, blocked providers without secrets", async () => {
  const original = process.env.FOUNDER_ADMIN_TOKEN;
  process.env.FOUNDER_ADMIN_TOKEN = "fixture-founder-token";
  try {
    const result = await handleAdminProvidersRequest(request("GET", "fixture-founder-token"));
    assert.equal(result.status, 200);
    const serialized = JSON.stringify(result.body);
    assert.match(serialized, /NOT_VERIFIED/);
    assert.match(serialized, /productionActivationAvailable/);
    assert.doesNotMatch(serialized, /secret-value|fixture-founder-token/);
  } finally {
    if (original === undefined) delete process.env.FOUNDER_ADMIN_TOKEN;
    else process.env.FOUNDER_ADMIN_TOKEN = original;
  }
});

test("Founder command API supports simulation with zero external calls", async () => {
  const original = process.env.FOUNDER_ADMIN_TOKEN;
  process.env.FOUNDER_ADMIN_TOKEN = "fixture-founder-token";
  try {
    const result = await handleAdminProvidersRequest(request("POST", "fixture-founder-token", {
      providerId: "twilio_messaging", environment: "STAGING",
      command: "SIMULATE", capability: "SMS_TRANSACTIONAL",
    }));
    assert.equal(result.status, 200);
    assert.match(JSON.stringify(result.body), /"externalCalls":0/);
  } finally {
    if (original === undefined) delete process.env.FOUNDER_ADMIN_TOKEN;
    else process.env.FOUNDER_ADMIN_TOKEN = original;
  }
});

test("Founder Command Center route is admin-only and truthfully fail-closed", () => {
  const route = LaunchRoutes.find(item => item.path === "/admin/providers");
  assert.equal(route?.requiresAuth, true);
  assert.equal(route?.requiresAdmin, true);
  const page = createFounderCommandCenterPage();
  assert.equal(page.sections.length, 15);
  assert.match(JSON.stringify(page), /GLOBAL PAUSE ACTIVE/);
  assert.match(JSON.stringify(page), /NOT VERIFIED/);
  assert.match(JSON.stringify(routePage("/admin/providers")), /Activation eligibility: BLOCKED/);
});

test("migration includes durable entities, RLS, audit immutability, idempotency and outbox", () => {
  const migration = readFileSync("supabase/migrations/004_provider_command_center.sql", "utf8");
  for (const table of [
    "provider_definitions", "provider_configurations", "provider_credential_references",
    "provider_capabilities", "provider_health_observations", "provider_validation_attempts",
    "provider_activation_requests", "provider_state_transitions", "provider_usage_observations",
    "provider_budget_controls", "provider_webhook_configurations", "provider_incidents",
    "provider_audit_events", "provider_idempotency_keys", "provider_outbox",
  ]) assert.match(migration, new RegExp(table));
  assert.match(migration, /enable row level security/);
  assert.match(migration, /Founder may read/);
  assert.match(migration, /prevent_provider_audit_mutation/);
  assert.match(migration, /environment <> 'PRODUCTION'/);
});
