import assert from "node:assert/strict";
import test from "node:test";
import {
  CanonicalProviderRegistry,
  DisabledProviderAdapter,
  FounderProviderCommandCenter,
  GuardDenialReasons,
  ProviderControlStore,
  ProviderIds,
  TwilioRequiredSecretReferences,
  allowedTransitions,
  assertNoRawSecret,
  evaluateExternalEffect,
  redactSecrets,
  transitionProviderState,
  type ProviderConfiguration,
  type ProviderState,
  type SecretReference,
} from "../src/provider-command-center/index.js";

const validReferences: SecretReference[] = [{
  referenceName: "TWILIO_ACCOUNT_SID", providerId: "twilio_messaging",
  environment: "STAGING", configured: true, validationResult: "VALID",
  rotationStatus: "CURRENT", versionFingerprint: "sha256:fingerprint-only",
}];
const config = (overrides: Partial<ProviderConfiguration> = {}): ProviderConfiguration => ({
  providerId: "twilio_messaging", environment: "STAGING",
  state: "VALIDATED", readiness: "VALIDATED", version: 1,
  secretReferences: validReferences, budgetAuthorized: true, policyValidated: true,
  founderAuthorized: true, evidenceReferences: ["evidence:validation"],
  globalPaused: false, providerPaused: false, ...overrides,
});
const founder = {id: "founder-1", roles: ["FOUNDER"]};

test("canonical registry includes every required provider with stable metadata", () => {
  assert.deepEqual(CanonicalProviderRegistry.map(item => item.id), [...ProviderIds]);
  assert.equal(CanonicalProviderRegistry.length, 13);
  for (const provider of CanonicalProviderRegistry) {
    assert.ok(provider.configurationSchemaVersion > 0);
    assert.ok(provider.capabilities.length > 0);
    assert.ok(provider.credentialRequirements.length > 0);
    assert.equal(provider.defaultState, "NOT_CONFIGURED");
    assert.equal(provider.defaultReadiness, "NOT_VERIFIED");
  }
});

test("Twilio-first family declares references without values", () => {
  assert.equal(TwilioRequiredSecretReferences.length, 10);
  assert.ok(TwilioRequiredSecretReferences.includes("TWILIO_API_KEY_SECRET"));
  assert.ok(TwilioRequiredSecretReferences.includes("SENDGRID_API_KEY"));
});

test("every provider state has explicit transitions", () => {
  const states: ProviderState[] = [
    "NOT_CONFIGURED", "CREDENTIALS_MISSING", "CONFIGURED_DISABLED",
    "VALIDATION_PENDING", "VALIDATED", "DEGRADED", "PAUSED", "BLOCKED",
    "ACTIVE_STAGING", "ACTIVE_PRODUCTION", "ERROR",
  ];
  for (const state of states) assert.ok(Array.isArray(allowedTransitions(state)));
});

test("forbidden and stale transitions fail closed", () => {
  assert.throws(() => transitionProviderState(config(), "NOT_CONFIGURED", 1), /FORBIDDEN_TRANSITION/);
  assert.throws(() => transitionProviderState(config(), "PAUSED", 9), /STALE_EXPECTED_VERSION/);
});

test("production activation is unavailable from every state", () => {
  assert.throws(() => transitionProviderState(config(), "ACTIVE_PRODUCTION", 1),
    /FORBIDDEN_TRANSITION|PRODUCTION_ACTIVATION_PROHIBITED/);
});

test("staging activation requires every credential, policy, budget, Founder, evidence and pause gate", () => {
  assert.equal(transitionProviderState(config(), "ACTIVE_STAGING", 1).state, "ACTIVE_STAGING");
  for (const blocked of [
    config({budgetAuthorized: false}),
    config({policyValidated: false}),
    config({founderAuthorized: false}),
    config({evidenceReferences: []}),
    config({globalPaused: true}),
    config({providerPaused: true}),
    config({secretReferences: []}),
  ]) assert.throws(() => transitionProviderState(blocked, "ACTIVE_STAGING", 1), /GATES_INCOMPLETE/);
});

test("central guard emits typed reasons for every denied boundary", () => {
  const result = evaluateExternalEffect({
    actor: {id: "member", roles: ["MEMBER"]}, providerId: "twilio_messaging",
    environment: "PRODUCTION", capability: "UNKNOWN", consentVerified: false,
    suppressed: true, budgetAuthorized: false, rateLimitAvailable: false,
    dataClassificationAllowed: false, destinationAllowlisted: false,
    evidenceReferences: [],
  }, config({state: "PAUSED", environment: "STAGING", globalPaused: true, providerPaused: true}),
  ["SMS_TRANSACTIONAL"]);
  assert.equal(result.allowed, false);
  for (const reason of GuardDenialReasons) assert.ok(result.reasons.includes(reason), reason);
});

test("central guard can approve only a fully gated staging request", () => {
  const result = evaluateExternalEffect({
    actor: founder, providerId: "twilio_messaging", environment: "STAGING",
    capability: "SMS_TRANSACTIONAL", consentVerified: true, suppressed: false,
    approvalScopeReference: "approval:exact-version", budgetAuthorized: true,
    rateLimitAvailable: true, dataClassificationAllowed: true,
    destinationAllowlisted: true, idempotencyKey: "idempotency-1",
    evidenceReferences: ["evidence:1"],
  }, config({state: "ACTIVE_STAGING"}), ["SMS_TRANSACTIONAL"]);
  assert.equal(result.allowed, true);
});

test("central redaction removes keyed and patterned secrets", () => {
  const syntheticStripeShape = ["sk", "live", "abcdefghijklmnop"].join("_");
  const redacted = redactSecrets({
    apiKey: "not-for-output",
    nested: {authorization: "Bearer sensitive"},
    message: `credential ${syntheticStripeShape}`,
  }) as Record<string, unknown>;
  assert.equal(redacted.apiKey, "[REDACTED]");
  assert.doesNotMatch(JSON.stringify(redacted), /sk_live_|not-for-output|Bearer sensitive/);
  assert.doesNotThrow(() => assertNoRawSecret(redacted));
});

test("disabled adapters validate references but make zero live calls", async () => {
  const adapter = new DisabledProviderAdapter("twilio_messaging");
  const presence = adapter.checkCredentialPresence(validReferences);
  assert.equal(presence.present, false);
  assert.ok(presence.missing.includes("TWILIO_API_KEY_SECRET"));
  assert.equal((await adapter.verifyCredentials()).externalCalls, 0);
  assert.equal((await adapter.healthCheck()).externalCalls, 0);
  assert.equal((await adapter.retrieveUsage()).externalCalls, 0);
  assert.equal((await adapter.retrieveCost()).externalCalls, 0);
  assert.equal((await adapter.simulate("SMS_TRANSACTIONAL")).externalCalls, 0);
  assert.equal(adapter.requestActivation().activated, false);
});

test("webhooks fail closed without provider-specific verification", () => {
  const adapter = new DisabledProviderAdapter("twilio_messaging");
  assert.equal(adapter.verifyWebhook({rawBody: "{}"}).valid, false);
  assert.equal(adapter.verifyWebhook({rawBody: "{}", signature: "fixture"}).valid, false);
});

test("runtime enforces optimistic concurrency and durable idempotency", () => {
  const store = new ProviderControlStore();
  store.seedConfiguration(config());
  const first = store.transition({
    providerId: "twilio_messaging", environment: "STAGING", to: "PAUSED",
    expectedVersion: 1, actorId: "founder-1", correlationId: "corr-1",
    idempotencyKey: "transition-1",
  });
  const duplicate = store.transition({
    providerId: "twilio_messaging", environment: "STAGING", to: "PAUSED",
    expectedVersion: 1, actorId: "founder-1", correlationId: "corr-1",
    idempotencyKey: "transition-1",
  });
  assert.deepEqual(duplicate, first);
  assert.equal(store.auditEvents().length, 1);
  assert.equal(store.outboxRecords().length, 1);
  assert.throws(() => store.saveConfiguration({...first, version: 99}), /CONCURRENCY/);
});

test("audit is immutable and denial payloads are redacted", () => {
  const store = new ProviderControlStore();
  store.recordDenial({
    providerId: "sendgrid", environment: "STAGING", actorId: "member",
    action: "SENDGRID_API_KEY=secret-value", reasonCodes: ["ACTOR_UNAUTHORIZED"],
    correlationId: "corr-2",
  });
  assert.equal(store.auditEvents()[0]?.immutable, true);
  assert.doesNotMatch(JSON.stringify(store.auditEvents()), /secret-value/);
  assert.throws(() => store.updateAudit(), /AUDIT_IMMUTABLE/);
  assert.throws(() => store.deleteAudit(), /AUDIT_IMMUTABLE/);
});

test("Founder Command Center rejects non-Founder and exposes evidence-derived UNKNOWN states", () => {
  const center = new FounderProviderCommandCenter(new ProviderControlStore());
  assert.throws(() => center.registry({id: "member", roles: ["MEMBER"]}), /FOUNDER/);
  const readiness = center.readiness(founder, "STAGING");
  assert.equal(readiness.providers.length, 13);
  assert.equal(readiness.evidenceDerivedScore, 0);
  assert.equal(readiness.overallState, "NOT_VERIFIED");
  assert.equal(readiness.productionActivationAvailable, false);
  assert.equal(readiness.globalPause, true);
});

test("Founder safe commands remain non-destructive and disabled", async () => {
  const center = new FounderProviderCommandCenter(new ProviderControlStore());
  const simulation = await center.command(founder, {
    providerId: "twilio_verify", environment: "STAGING",
    command: "SIMULATE", capability: "VERIFY_SMS",
  });
  assert.ok("evidenceReference" in simulation);
  assert.deepEqual(simulation, {
    simulated: true, externalCalls: 0,
    evidenceReference: simulation.evidenceReference,
  });
  const activation = await center.command(founder, {
    providerId: "twilio_verify", environment: "STAGING",
    command: "REQUEST_ACTIVATION",
  });
  assert.deepEqual(activation, {requested: true, activated: false});
});
