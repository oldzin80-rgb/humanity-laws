import assert from "node:assert/strict";
import test from "node:test";
import { AdvertisingChannels, PaidCampaignStates, PaidMediaRuntime, recommendOptimization, validateAudience, type PaidMediaCommand } from "../src/provider-command-center/index.js";

const now = "2026-07-30T12:00:00Z";
const audience = (patch = {}) => ({ id: "aud-1", version: 1, purpose: "Contextual book discovery", kind: "CONTEXTUAL" as const, advertisingConsentRequired: false, advertisingConsentProven: false, suppressionApplied: true, fields: ["page_topic"], includesMinors: false, retentionDays: 30, ...patch });
const command = (patch: Partial<PaidMediaCommand> = {}): PaidMediaCommand => ({
 id: "action-1", idempotencyKey: "paid-1", actorId: "founder", actorRoles: ["FOUNDER"], environment: "STAGING",
 campaign: { id: "campaign-1", version: 2, channel: "META_ADS", objective: "Book awareness", creativeVersionId: "creative-3", landingPageVersionId: "landing-2", audience: audience(), conversionEvent: "campaign_landing_viewed", attributionModel: "FIRST_PARTY_COMPARISON", immutable: true, currency: "USD" },
 approval: { id: "approval-1", campaignId: "campaign-1", campaignVersion: 2, creativeVersionId: "creative-3", landingPageVersionId: "landing-2", audienceVersion: 1, channel: "META_ADS", environment: "STAGING", founderId: "founder", active: true, expiresAt: "2026-08-01T00:00:00Z" },
 expectedVersion: 1, currentVersion: 1, requestedReservationMinor: 500,
 budgetCaps: { globalMonthly: 10000, providerMonthly: 5000, campaignLifetime: 3000, campaignDaily: 1000, experiment: 1000, staging: 500, perAction: 500, currency: "USD" },
 providerValidated: true, accountAllowlisted: true, conversionValidated: true, claimsAndRightsValid: true,
 globalPaused: false, providerPaused: false, campaignPaused: false, rateLimitAvailable: true, incidentOpen: false, spendObservationFresh: true, now, ...patch,
});

test("seven advertising channels are isolated", () => assert.equal(AdvertisingChannels.length, 7));
test("nineteen paid campaign states are explicit", () => assert.equal(PaidCampaignStates.length, 19));
test("sensitive targeting and minors are prohibited", () => {
 assert.ok(validateAudience(audience({ fields: ["health_condition"], includesMinors: true })).includes("SENSITIVE_TARGETING_PROHIBITED"));
 assert.ok(validateAudience(audience({ fields: ["health_condition"], includesMinors: true })).includes("MINORS_TARGETING_PROHIBITED"));
});
test("advertising consent and suppression fail closed", () => {
 const reasons = validateAudience(audience({ kind: "FIRST_PARTY_CONSENTED", advertisingConsentRequired: true, advertisingConsentProven: false, suppressionApplied: false }));
 assert.ok(reasons.includes("ADVERTISING_CONSENT_REQUIRED")); assert.ok(reasons.includes("SUPPRESSION_REQUIRED"));
});
test("valid staging action reserves budget but spends nothing", () => {
 const result = new PaidMediaRuntime().createProviderDraftIntent(command());
 assert.equal(result.state, "READY_FOR_STAGING"); assert.equal(result.reservedMinor, 500);
 assert.equal(result.externalSpendMinor, 0); assert.equal(result.externalCalls, 0);
});
test("production activation is unreachable", () => {
 const result = new PaidMediaRuntime().createProviderDraftIntent(command({ environment: "PRODUCTION", approval: { ...command().approval, environment: "PRODUCTION" } }));
 assert.ok(result.reasons.includes("PRODUCTION_ACTIVATION_PROHIBITED"));
});
test("approval binds exact campaign, creative, landing page, audience and channel", () => {
 const result = new PaidMediaRuntime().createProviderDraftIntent(command({ campaign: { ...command().campaign, creativeVersionId: "changed" } }));
 assert.ok(result.reasons.includes("APPROVAL_SCOPE_MISMATCH"));
});
test("stale expected version fails", () => assert.ok(new PaidMediaRuntime().createProviderDraftIntent(command({ expectedVersion: 1, currentVersion: 2 })).reasons.includes("STALE_EXPECTED_VERSION")));
test("hierarchical budget blocks oversubscription", () => {
 const runtime = new PaidMediaRuntime(); assert.equal(runtime.createProviderDraftIntent(command()).state, "READY_FOR_STAGING");
 assert.equal(runtime.createProviderDraftIntent(command({ id: "action-2", idempotencyKey: "paid-2" })).state, "BUDGET_BLOCKED");
});
test("idempotency creates one outbox intent", () => {
 const runtime = new PaidMediaRuntime(); runtime.createProviderDraftIntent(command()); runtime.createProviderDraftIntent(command());
 assert.equal(runtime.outbox.length, 1);
});
test("provider, account, conversion, claims and spend freshness fail closed", () => {
 const result = new PaidMediaRuntime().createProviderDraftIntent(command({ providerValidated: false, accountAllowlisted: false, conversionValidated: false, claimsAndRightsValid: false, spendObservationFresh: false }));
 for (const reason of ["PROVIDER_NOT_VALIDATED","ACCOUNT_NOT_ALLOWLISTED","CONVERSION_NOT_VALIDATED","CLAIMS_OR_RIGHTS_INVALID","STALE_SPEND_OBSERVATION"]) assert.ok(result.reasons.includes(reason));
});
test("every pause and incident blocks", () => {
 const result = new PaidMediaRuntime().createProviderDraftIntent(command({ globalPaused: true, providerPaused: true, campaignPaused: true, incidentOpen: true }));
 for (const reason of ["GLOBAL_PAUSE_ACTIVE","PROVIDER_PAUSED","CAMPAIGN_PAUSED","OPEN_INCIDENT"]) assert.ok(result.reasons.includes(reason));
});
test("optimization is recommendation-only", () => {
 const recommendation = recommendOptimization({ action: "PAUSE_CREATIVE", evidence: ["synthetic:ctr"], confidence: .7, projectedImpactRange: [0, 10], risk: "LOW", expiresAt: "2026-08-01T00:00:00Z" });
 assert.equal(recommendation.executesAutomatically, false); assert.equal(recommendation.requiresFounderApproval, true);
});
test("automated tests incur zero calls and spend", () => {
 const runtime = new PaidMediaRuntime(); const result = runtime.createProviderDraftIntent(command());
 assert.equal(runtime.externalCalls, 0); assert.equal(result.externalSpendMinor, 0); assert.equal(result.autonomousOptimization, false);
});
