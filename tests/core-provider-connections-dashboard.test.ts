import assert from "node:assert/strict";
import test from "node:test";
import {
  CoreProviderCapabilities, CoreProviderIds, CoreProviderSecretReferences,
  ProhibitedCoreProviderActions, ReadOnlyCoreProviderAdapter,
  authorizeFounderProviderCommand, createUnifiedOperationalDashboard, detectDrift,
  evaluateCoreProviderIncident,
  type DriftClassification, type ExpectedProviderResource, type ObservedProviderResource,
} from "../src/provider-command-center/index.js";

const now = "2026-07-30T00:00:00.000Z";
const expected: ExpectedProviderResource = {
  providerId: "vercel", environment: "STAGING", resourceType: "DEPLOYMENT",
  resourceKey: "deployment_sha", expectedValueFingerprint: "sha256:approved",
  required: true, approvedAt: now, evidenceReference: "release:approved",
};
const observed = (patch: Partial<ObservedProviderResource> = {}): ObservedProviderResource => ({
  providerId: "vercel", environment: "STAGING", resourceType: "DEPLOYMENT",
  resourceKey: "deployment_sha", observedValueFingerprint: "sha256:approved",
  observedAt: now, authorized: true, configured: true,
  evidenceReference: "vercel:observation", ...patch,
});

test("six core providers have independent read-only/simulation capabilities", () => {
  assert.deepEqual(CoreProviderIds, ["github", "vercel", "supabase", "stripe", "openai", "lulu"]);
  for (const provider of CoreProviderIds) {
    assert.ok(CoreProviderCapabilities[provider].length >= 5);
    assert.ok(CoreProviderSecretReferences[provider].length >= 3);
  }
});
test("destructive actions are explicitly prohibited", () => {
  for (const action of ["GITHUB_MERGE", "VERCEL_PRODUCTION_PROMOTION", "SUPABASE_DATA_MUTATION",
    "STRIPE_CHARGE", "OPENAI_UNRESTRICTED_INFERENCE", "LULU_ORDER"])
    assert.ok(ProhibitedCoreProviderActions.includes(action as never));
});
test("every drift classification is deterministic", () => {
  const cases: [DriftClassification, ObservedProviderResource | undefined][] = [
    ["MISSING", undefined], ["NOT_CONFIGURED", observed({configured: false})],
    ["NOT_AUTHORIZED", observed({authorized: false})],
    ["CONFLICTING", observed({conflictReferences: ["a", "b"]})],
    ["STALE", observed({observedAt: "2026-07-01T00:00:00Z"})],
    ["UNKNOWN", observed({observedValueFingerprint: undefined})],
    ["DRIFTED", observed({observedValueFingerprint: "sha256:different"})],
    ["MATCHED", observed()],
  ];
  for (const [classification, value] of cases)
    assert.equal(detectDrift(expected, value, now).classification, classification);
});
test("drift detects Vercel SHA mismatch without changing deployment", () => {
  const finding = detectDrift(expected, observed({observedValueFingerprint: "sha256:other"}), now);
  assert.equal(finding.classification, "DRIFTED");
  assert.equal(finding.actionable, true);
});
test("adapters fail closed and make zero automated external calls", async () => {
  for (const providerId of CoreProviderIds) {
    const adapter = new ReadOnlyCoreProviderAdapter(providerId);
    assert.equal(adapter.inspectConfiguration().externalCalls, 0);
    assert.equal((await adapter.verifyCredentialsReadOnly()).externalCalls, 0);
    assert.equal((await adapter.health()).externalCalls, 0);
    assert.equal((await adapter.usage()).externalCalls, 0);
    assert.equal((await adapter.cost()).externalCalls, 0);
    assert.equal(adapter.simulate(adapter.capabilities()[0]!).externalCalls, 0);
    assert.equal(adapter.requestControlledStagingAction().executed, false);
  }
});
test("credential presence checks expose names, never values", () => {
  const adapter = new ReadOnlyCoreProviderAdapter("stripe");
  const result = adapter.validateCredentialPresence([]);
  assert.equal(result.valid, false);
  assert.deepEqual(result.missing, ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PUBLISHABLE_KEY"]);
});
test("Founder commands require every governance field", () => {
  const result = authorizeFounderProviderCommand({
    actorId: "", actorFounder: false, providerId: "github",
    environment: "PRODUCTION", capability: "GITHUB_MERGE", expectedVersion: 0,
    idempotencyKey: "", reason: "", budgetAuthorized: false,
    policyValidated: false, productionMutationRequested: true,
  });
  assert.equal(result.authorizedForReadOnlyOrSimulation, false);
  assert.equal(result.externalMutationAuthorized, false);
  assert.equal(result.blockers.length, 8);
});
test("fully governed staging read is authorized but never mutating", () => {
  const result = authorizeFounderProviderCommand({
    actorId: "founder", actorFounder: true, providerId: "github",
    environment: "STAGING", capability: "REPOSITORY_METADATA_READ", expectedVersion: 1,
    idempotencyKey: "read-1", reason: "Refresh approved evidence",
    budgetAuthorized: true, policyValidated: true, productionMutationRequested: false,
  });
  assert.equal(result.authorizedForReadOnlyOrSimulation, true);
  assert.equal(result.externalMutationAuthorized, false);
});
test("unified dashboard derives readiness from evidence and preserves UNKNOWN", () => {
  const providers = CoreProviderIds.map(providerId => ({
    providerId, accountIdentity: "UNKNOWN", environment: "STAGING" as const,
    credentialPresence: "UNKNOWN" as const, permissions: "NOT VERIFIED",
    health: "UNKNOWN" as const, configuration: "UNKNOWN" as const,
    usage: "UNKNOWN", cost: "UNKNOWN", budgetRemaining: "$0.00",
    webhook: "NOT VERIFIED", incidentCount: 0, evidenceAge: "UNKNOWN",
    blockers: ["PROTECTED_STAGING_CONFIGURATION_MISSING"],
  }));
  const dashboard = createUnifiedOperationalDashboard({generatedAt: now, globalPause: true, providers});
  assert.equal(dashboard.evidenceDerivedReadiness, 0);
  assert.equal(dashboard.launchBlockerCount, 6);
  assert.equal(dashboard.overallState, "NOT_VERIFIED");
  assert.equal(dashboard.productionMutationAvailable, false);
});
test("drift and repeated denials create containment recommendations, never actions", () => {
  const finding = detectDrift(expected, observed({authorized: false}), now);
  const incident = evaluateCoreProviderIncident(finding, 3);
  assert.equal(incident.incidentRequired, true);
  assert.equal(incident.severity, "HIGH");
  assert.equal(incident.automaticExternalAction, false);
});
