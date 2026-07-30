import assert from "node:assert/strict";
import test from "node:test";
import {
  PublicationStates, RequiredReviewRoles, SocialChannels, SocialProviderCapabilities,
  SocialPublicationRuntime, transitionPublication, validateChannel,
  type ContentVersion, type PublicationCommand, type VersionApproval,
} from "../src/provider-command-center/index.js";

const now = "2026-07-30T12:00:00.000Z";
const content = (patch: Partial<ContentVersion> = {}): ContentVersion => ({
  id: "content-1", version: 3, campaignId: "campaign-1", channel: "INSTAGRAM",
  copy: "A thoughtful invitation to read Humanity Laws.", locale: "en-US", createdBy: "editor",
  generatedByAi: true, immutable: true,
  claims: [{ id: "claim-1", statement: "The book is available.", risk: "LOW", evidenceReferences: ["catalog:book"], evidenceExpiresAt: "2027-01-01T00:00:00Z" }],
  assets: [{ id: "asset-1", version: 2, checksum: "sha256:synthetic", rightsStatus: "PROVEN", rightsExpiresAt: "2027-01-01T00:00:00Z", channels: ["INSTAGRAM"], altText: "Humanity Laws book cover" }],
  ...patch,
});
const approval = (patch: Partial<VersionApproval> = {}): VersionApproval => ({
  id: "approval-1", contentVersionId: "content-1", contentVersion: 3,
  assetBindings: ["asset-1:2"], channel: "INSTAGRAM", campaignId: "campaign-1",
  environment: "STAGING", scheduleStart: "2026-07-30T12:00:00Z", scheduleEnd: "2026-08-01T12:00:00Z",
  roles: RequiredReviewRoles, founderId: "founder", status: "ACTIVE", expiresAt: "2026-08-02T00:00:00Z", ...patch,
});
const command = (patch: Partial<PublicationCommand> = {}): PublicationCommand => ({
  id: "publication-1", actorId: "founder", actorRoles: ["FOUNDER"], content: content(), approval: approval(),
  environment: "STAGING", scheduledFor: "2026-07-31T12:00:00Z", expectedVersion: 1,
  idempotencyKey: "publish-1", globalPaused: false, channelPaused: false, providerValidated: true,
  destinationAllowlisted: true, budgetAuthorized: true, rateLimitAvailable: true, incidentOpen: false, now, ...patch,
});

test("all eight channels have isolated capability declarations", () => {
  assert.deepEqual(Object.keys(SocialProviderCapabilities), [...SocialChannels]);
});
test("all required publication states are explicit", () => assert.equal(PublicationStates.length, 17));
test("valid staging command creates audited simulated outbox intent", () => {
  const runtime = new SocialPublicationRuntime();
  const result = runtime.schedule(command());
  assert.equal(result.state, "SCHEDULED");
  assert.equal(result.externalCalls, 0);
  assert.match(result.outboxReference ?? "", /^outbox:/);
  assert.equal(runtime.outbox.length, 1);
});
test("production publication is prohibited", () => {
  const result = new SocialPublicationRuntime().schedule(command({ environment: "PRODUCTION", approval: approval({ environment: "PRODUCTION" }) }));
  assert.ok(result.reasonCodes.includes("PRODUCTION_PUBLICATION_DISABLED"));
});
test("non-Founder cannot schedule", () => {
  assert.ok(new SocialPublicationRuntime().schedule(command({ actorRoles: ["EDITOR"] })).reasonCodes.includes("FOUNDER_AUTHORIZATION_REQUIRED"));
});
test("exact content version is bound to approval", () => {
  assert.ok(new SocialPublicationRuntime().schedule(command({ content: content({ version: 4 }) })).reasonCodes.includes("APPROVAL_VERSION_MISMATCH"));
});
test("exact assets are bound to approval", () => {
  const changed = content({ assets: [{ ...content().assets[0]!, version: 3 }] });
  assert.ok(new SocialPublicationRuntime().schedule(command({ content: changed })).reasonCodes.includes("APPROVAL_ASSET_MISMATCH"));
});
test("revoked and expired approvals fail closed", () => {
  const result = new SocialPublicationRuntime().schedule(command({ approval: approval({ status: "REVOKED" }) }));
  assert.ok(result.reasonCodes.includes("APPROVAL_INACTIVE"));
});
test("unsupported and stale claims block scheduling", () => {
  const unsupported = content({ claims: [{ id: "c", statement: "claim", risk: "HIGH", evidenceReferences: [] }] });
  assert.ok(new SocialPublicationRuntime().schedule(command({ content: unsupported })).reasonCodes.includes("UNSUPPORTED_CLAIM"));
  const stale = content({ claims: [{ id: "c", statement: "claim", risk: "HIGH", evidenceReferences: ["e"], evidenceExpiresAt: "2020-01-01T00:00:00Z" }] });
  assert.ok(new SocialPublicationRuntime().schedule(command({ idempotencyKey: "stale", content: stale })).reasonCodes.includes("STALE_EVIDENCE"));
});
test("unproven rights and missing alt text block scheduling", () => {
  const asset = { ...content().assets[0]!, rightsStatus: "UNPROVEN" as const, altText: "" };
  const result = new SocialPublicationRuntime().schedule(command({ content: content({ assets: [asset] }) }));
  assert.ok(result.reasonCodes.includes("ASSET_RIGHTS_INVALID"));
  assert.ok(result.reasonCodes.includes("ACCESSIBILITY_ALT_TEXT_MISSING"));
});
test("channel adaptation never silently truncates", () => {
  assert.ok(validateChannel(content({ channel: "X", copy: "x".repeat(281), assets: [] })).includes("CHANNEL_LIMIT_EXCEEDED_NEW_VERSION_REQUIRED"));
});
test("prohibited exaggeration fails brand validation", () => {
  assert.ok(validateChannel(content({ copy: "A guaranteed miracle." })).some((reason) => reason.startsWith("PROHIBITED_BRAND_CLAIM")));
});
test("global and channel pause take precedence", () => {
  const result = new SocialPublicationRuntime().schedule(command({ globalPaused: true, channelPaused: true }));
  assert.ok(result.reasonCodes.includes("GLOBAL_PAUSE_ACTIVE"));
  assert.ok(result.reasonCodes.includes("CHANNEL_PAUSED"));
});
test("rate, budget, provider, destination, and incident gates fail closed", () => {
  const result = new SocialPublicationRuntime().schedule(command({ providerValidated: false, destinationAllowlisted: false, budgetAuthorized: false, rateLimitAvailable: false, incidentOpen: true }));
  for (const reason of ["PROVIDER_NOT_VALIDATED", "DESTINATION_NOT_ALLOWLISTED", "BUDGET_NOT_AUTHORIZED", "RATE_LIMIT_UNAVAILABLE", "OPEN_INCIDENT"]) assert.ok(result.reasonCodes.includes(reason));
});
test("idempotency produces one durable intent", () => {
  const runtime = new SocialPublicationRuntime();
  assert.deepEqual(runtime.schedule(command()), runtime.schedule(command()));
  assert.equal(runtime.outbox.length, 1);
});
test("allowed and forbidden publication transitions are enforced", () => {
  assert.equal(transitionPublication("DRAFT", "IN_REVIEW"), "IN_REVIEW");
  assert.throws(() => transitionPublication("DRAFT", "PUBLISHED"), /FORBIDDEN_PUBLICATION_TRANSITION/);
});
test("AI cannot self-approve", () => {
  const result = new SocialPublicationRuntime().schedule(command({ content: content({ createdBy: "founder" }) }));
  assert.ok(result.reasonCodes.includes("AI_SELF_APPROVAL_PROHIBITED"));
});
