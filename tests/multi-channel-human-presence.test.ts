import test from "node:test";
import assert from "node:assert/strict";
import { createPlaceholderChannelAdapters, RealtimeAvatarAdapter, UnifiedCompanionService } from "../src/communication/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import type { CompanionGateway } from "../src/experiences/index.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";

const gateway: CompanionGateway = {
  async respond(companion, input) {
    return {
      companion,
      message: `${companion}: I am an AI companion. Response for ${input}`,
      transparency: "AI_TRANSPARENT",
      humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
      sourceSummary: "Source ledger: verified test source.",
    };
  },
};

test("Adam and Eve support the in-app channel through the unified presence model", async () => {
  const service = new UnifiedCompanionService(gateway);

  for (const companion of ["Adam", "Eve"] as const) {
    const response = await service.respond({
      memberId: "member_1",
      companion,
      channel: "in_app",
      message: "Help me reflect.",
      consentToRemember: true,
      saveInsight: true,
      contextSources: [],
      intent: "reflection",
    });

    assert.equal(response.companion, companion);
    assert.equal(response.channel, "in_app");
    assert.equal(response.transparency, "AI_TRANSPARENT");
    assert.equal(response.persisted, false);
    assert.equal(response.savedInsight, false);
    assert.match(response.message, new RegExp(`${companion}: I am an AI companion\\.`));
    assert.match(response.humanSovereigntyReminder, /human judgment remains final/i);
    assert.ok(response.nextSteps.length > 0);
    assert.equal(response.avatarPresence?.placeholderOnly, true);
    assert.equal(response.avatarPresence?.transparencyLabel, "AI_AVATAR_PLACEHOLDER");
    assert.deepEqual(response.avatarPresence?.visibleParticipants, [companion]);
  }
});

test("Council supports Adam and Eve together while preserving human final choice", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Council",
    channel: "council_session",
    message: "Help me make a thoughtful decision.",
    consentToRemember: false,
    saveInsight: true,
    contextSources: [],
    intent: "council_request",
  });

  assert.equal(response.companion, "Council");
  assert.equal(response.channel, "council_session");
  assert.equal(response.transparency, "AI_TRANSPARENT");
  assert.match(response.message, /Adam and Eve are AI companions/i);
  assert.match(response.humanSovereigntyReminder, /human judgment remains final/i);
  assert.match(response.council?.adamPerspective ?? "", /Adam: I am an AI companion/);
  assert.match(response.council?.evePerspective ?? "", /Eve: I am an AI companion/);
  assert.match(response.council?.humanFinalChoice ?? "", /final decision-maker/i);
  assert.equal(response.council?.savedOutcome, true);
  assert.equal(response.avatarPresence?.state, "council_mode");
  assert.deepEqual(response.avatarPresence?.visibleParticipants, ["Adam", "Eve"]);
  assert.equal(response.avatarPresence?.councilMode, true);
});

test("SMS, phone, email, and avatar adapters are safe placeholders with no vendor delivery", async () => {
  const service = new UnifiedCompanionService(gateway);
  const adapters = createPlaceholderChannelAdapters();

  for (const channel of ["sms", "phone_voice", "email", "future_video_avatar"] as const) {
    const response = await service.respond({
      memberId: "member_1",
      companion: "Adam",
      channel,
      message: "Can you text me later?",
      consentToRemember: false,
      saveInsight: false,
      contextSources: [],
      intent: "encouragement",
    });
    const delivery = await adapters[channel].deliver({
      memberId: "member_1",
      companion: "Adam",
      channel,
      message: "Can you text me later?",
      consentToRemember: false,
      saveInsight: false,
      contextSources: [],
      intent: "encouragement",
    }, response);

    assert.equal(response.channel, channel);
    assert.equal(response.persisted, false);
    assert.equal(response.savedInsight, false);
    assert.equal(delivery.delivered, false);
    assert.equal(delivery.placeholderOnly, true);
    assert.match(delivery.message, /No vendor call is made/);
  }
});

test("realtime avatar adapter is placeholder only unless provider verification is completed", async () => {
  const oldEnv = { ...process.env };
  delete process.env.AVATAR_PROVIDER_API_KEY;
  const adapter = new RealtimeAvatarAdapter();
  const request = {
    memberId: "member_1",
    companion: "Adam" as const,
    channel: "future_video_avatar" as const,
    message: "Can Adam appear as an avatar?",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "reflection" as const,
  };
  const response = await new UnifiedCompanionService(gateway).respond(request);

  try {
    const presence = await adapter.renderPresence(request, response);

    assert.equal(adapter.vendorConfigured(), false);
    assert.equal(presence.placeholderOnly, true);
    assert.equal(presence.providerConfigured, false);
    assert.equal(presence.state, "unavailable");
    assert.match(presence.statusMessage, /Avatar presence coming soon/i);
  } finally {
    process.env = oldEnv;
  }
});

test("Adam, Eve, and Council pages show honest avatar placeholder language without fake live claims", () => {
  for (const path of ["/adam", "/eve", "/council"]) {
    const html = renderPageModelToHtml(routePage(path));

    assert.match(html, /Avatar presence coming soon/);
    assert.match(html, /Voice and avatar support will be connected after provider verification/);
    assert.match(html, /Not a live video call/);
    assert.match(html, /Not a real person/);
    assert.doesNotMatch(html, /Live video call is active/i);
    assert.doesNotMatch(html, /real human/i);
  }
});

test("professional and crisis boundaries remain visible in the unified response", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "in_app",
    message: "I need medical diagnosis and treatment advice.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "wellness_support",
  });

  assert.equal(response.escalationBoundary?.triggered, true);
  assert.match(response.escalationBoundary?.recommendedAction ?? "", /qualified human help/i);
});

test("multi-channel presence layer does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
