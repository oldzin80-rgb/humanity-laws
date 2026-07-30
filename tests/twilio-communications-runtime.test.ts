import assert from "node:assert/strict";
import {createHmac} from "node:crypto";
import test from "node:test";
import {
  CommunicationCapabilities, CommunicationsRuntime, InitialTemplateIds,
  ReservedCommunicationCapabilities, canonicalizeEmail, destinationFingerprint,
  estimateSmsSegments, maskDestination, normalizePhone, parseComplianceCommand,
  renderApprovedTemplate, transitionMessage, verifyTwilioSignature,
  type CommunicationConsent, type MessageTemplate,
} from "../src/provider-command-center/index.js";

const template: MessageTemplate = {
  id: "welcome_activation_sms", channel: "SMS", purpose: "TRANSACTIONAL",
  locale: "en-US", semanticVersion: "1.0.0", body: "Welcome {{name}}.",
  variables: ["name"], maximumRenderedLength: 160, approvalState: "APPROVED",
  complianceReference: "compliance:1", brandReviewState: "APPROVED",
  activeFrom: "2026-07-29T00:00:00Z", immutable: true,
};
const consent: CommunicationConsent = {
  memberId: "member-1", channel: "SMS", purpose: "TRANSACTIONAL",
  optInSource: "member-settings", consentTextVersion: "1.0.0",
  capturedAt: "2026-07-29T00:00:00Z", jurisdiction: "US",
  verified: true, timezone: "America/Los_Angeles",
  quietHoursStart: 21, quietHoursEnd: 8, locale: "en-US",
  accessibilityPreferences: [],
};
const command = () => ({
  commandId: "command-1", idempotencyKey: "message-1", actorId: "founder",
  actorFounder: true, memberId: "member-1", environment: "STAGING" as const,
  capability: "TWILIO_SMS_TRANSACTIONAL" as const, channel: "SMS" as const,
  purpose: "TRANSACTIONAL" as const, destination: "+14155550100",
  destinationVerified: true, destinationAllowlisted: true, consent,
  suppressions: [], quietHoursActive: false, template, variables: {name: "Human"},
  rateLimitAvailable: true, budgetAvailable: true, globalPaused: false,
  providerPaused: false, capabilityPaused: false,
});

test("capabilities are independent and unsafe future channels remain reserved", () => {
  assert.equal(CommunicationCapabilities.length, 6);
  assert.deepEqual(ReservedCommunicationCapabilities,
    ["TWILIO_VOICE", "TWILIO_WHATSAPP", "SENDGRID_MARKETING_CAMPAIGNS"]);
});
test("all eleven initial governed templates are declared", () => {
  assert.equal(InitialTemplateIds.length, 11);
  assert.ok(InitialTemplateIds.includes("help_response"));
  assert.ok(InitialTemplateIds.includes("spark_daily_inspiration"));
});
test("STOP START and HELP families normalize case and whitespace", () => {
  for (const value of ["stop", " STOPALL ", "unsubscribe", "cancel", "end", "quit"])
    assert.equal(parseComplianceCommand(value).type, "STOP");
  for (const value of ["start", " UNSTOP ", "yes"])
    assert.equal(parseComplianceCommand(value).type, "START");
  for (const value of ["help", "INFO"]) assert.equal(parseComplianceCommand(value).type, "HELP");
  assert.equal(parseComplianceCommand("hello Adam").type, "OTHER");
});
test("destinations normalize, fingerprint and mask without disclosure", () => {
  assert.equal(normalizePhone("+1 (415) 555-0100"), "+14155550100");
  assert.equal(canonicalizeEmail(" Person@Example.COM "), "person@example.com");
  assert.equal(destinationFingerprint("+14155550100").length, 64);
  assert.equal(maskDestination("+14155550100"), "***0100");
  assert.equal(maskDestination("person@example.com"), "p***@example.com");
  assert.throws(() => normalizePhone("4155550100"), /E164/);
  assert.throws(() => canonicalizeEmail("bad"), /EMAIL/);
});
test("only immutable approved templates render with safe variables", () => {
  assert.deepEqual(renderApprovedTemplate(template, {name: "Human"}),
    {body: "Welcome Human.", smsSegments: 1});
  assert.throws(() => renderApprovedTemplate({...template, approvalState: "DRAFT"}, {name: "Human"}), /APPROVED/);
  assert.throws(() => renderApprovedTemplate(template, {name: "<script>"}), /UNSAFE/);
  assert.equal(estimateSmsSegments("a".repeat(160)), 1);
  assert.equal(estimateSmsSegments("a".repeat(161)), 2);
  assert.equal(estimateSmsSegments("😀".repeat(36)), 2);
});
test("message states allow explicit transitions and reject forbidden transitions", () => {
  assert.equal(transitionMessage("DRAFT", "APPROVED"), "APPROVED");
  assert.equal(transitionMessage("APPROVED", "QUEUED"), "QUEUED");
  assert.equal(transitionMessage("QUEUED", "DISPATCHING"), "DISPATCHING");
  assert.equal(transitionMessage("DISPATCHING", "PROVIDER_ACCEPTED"), "PROVIDER_ACCEPTED");
  assert.equal(transitionMessage("PROVIDER_ACCEPTED", "DELIVERED"), "DELIVERED");
  assert.throws(() => transitionMessage("DELIVERED", "SENT"), /FORBIDDEN/);
});
test("canonical runtime atomically creates an audited outbox intent with zero calls", () => {
  const runtime = new CommunicationsRuntime();
  const first = runtime.create(command());
  const duplicate = runtime.create(command());
  assert.deepEqual(first, duplicate);
  assert.equal(first.state, "QUEUED");
  assert.equal(first.externalCalls, 0);
  assert.equal(runtime.auditEvents().length, 1);
  assert.equal(runtime.outboxRecords().length, 1);
});
test("consent, suppression, pause, quiet hours, rate and budget fail closed", () => {
  const cases = [
    {consent: undefined}, {suppressions: [{id: "s", memberId: "member-1", scope: "CHANNEL" as const, value: "SMS", active: true, reason: "STOP", createdAt: "now"}]},
    {quietHoursActive: true}, {rateLimitAvailable: false}, {budgetAvailable: false},
    {globalPaused: true}, {providerPaused: true}, {capabilityPaused: true},
    {destinationAllowlisted: false}, {destinationVerified: false},
  ];
  for (const [index, patch] of cases.entries()) {
    const runtime = new CommunicationsRuntime();
    const result = runtime.create({...command(), ...patch, idempotencyKey: `blocked-${index}`});
    assert.equal(result.state, "POLICY_DENIED");
    assert.equal(runtime.outboxRecords().length, 0);
  }
});
test("production and non-Founder commands are denied", () => {
  const runtime = new CommunicationsRuntime();
  const result = runtime.create({...command(), environment: "PRODUCTION", actorFounder: false});
  assert.equal(result.state, "POLICY_DENIED");
  assert.ok(result.reasons.includes("PRODUCTION_PROHIBITED"));
  assert.ok(result.reasons.includes("FOUNDER_AUTHORIZATION_REQUIRED"));
});
test("Twilio webhook verification uses canonical HMAC-SHA1 construction", () => {
  const authToken = "test-token-not-a-live-secret";
  const url = "https://staging.example.test/webhooks/twilio";
  const parameters = {MessageSid: "SM123", MessageStatus: "delivered"};
  const data = url + "MessageSidSM123MessageStatusdelivered";
  const signature = createHmac("sha1", authToken).update(data).digest("base64");
  assert.equal(verifyTwilioSignature({authToken, signature, url, parameters}), true);
  assert.equal(verifyTwilioSignature({authToken, signature: "forged", url, parameters}), false);
});
