import test from "node:test";
import assert from "node:assert/strict";
import { createImmersivePresenceMetadata, UnifiedCompanionService } from "../src/communication/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import type { CompanionGateway } from "../src/experiences/index.js";

const gateway: CompanionGateway = {
  async respond(companion, input) {
    return {
      companion,
      message: `${companion}: I am an AI companion. Base response for ${input}`,
      transparency: "AI_TRANSPARENT",
      humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
      sourceSummary: "Source ledger: verified test source.",
    };
  },
};

test("lifelike immersive presence metadata exists without claiming live provider status", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "Talk with me naturally.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "reflection",
  });

  assert.equal(response.immersivePresence?.sessionState, "text_fallback");
  assert.equal(response.immersivePresence?.avatarRoomState, "fallback_text");
  assert.equal(response.immersivePresence?.voiceState, "unavailable");
  assert.equal(response.immersivePresence?.eyeContactReady, false);
  assert.equal(response.immersivePresence?.microExpressionReady, false);
  assert.equal(response.immersivePresence?.bodyLanguageReady, false);
  assert.equal(response.immersivePresence?.trustBoundary.aiTransparent, true);
  assert.equal(response.immersivePresence?.trustBoundary.neverClaimsHumanIdentity, true);
});

test("AI transparency remains present and no real-human claim is generated", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "future_video_avatar",
    message: "Can you appear like a person?",
    consentToRemember: true,
    saveInsight: false,
    contextSources: [],
    intent: "encouragement",
  });

  assert.equal(response.transparency, "AI_TRANSPARENT");
  assert.match(response.aiDisclosure, /AI companion/);
  assert.match(response.aiDisclosure, /not a real person/);
  assert.doesNotMatch(response.message, /I am a real human/i);
  assert.doesNotMatch(response.message, /live human/i);
  assert.match(response.immersivePresence?.fallback.reason ?? "", /not live until providers are connected and verified/i);
});

test("Council supports Adam and Eve immersive room presence with human choice centered", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Council",
    channel: "council_session",
    message: "Open the Council room.",
    consentToRemember: false,
    saveInsight: true,
    contextSources: [],
    intent: "council_request",
  });

  assert.equal(response.avatarPresence?.councilMode, true);
  assert.deepEqual(response.avatarPresence?.visibleParticipants, ["Adam", "Eve"]);
  assert.equal(response.immersivePresence?.councilSpatialLayout?.room, "council_circle");
  assert.equal(response.immersivePresence?.councilSpatialLayout?.adamPosition, "left");
  assert.equal(response.immersivePresence?.councilSpatialLayout?.evePosition, "right");
  assert.equal(response.immersivePresence?.councilSpatialLayout?.humanChoicePosition, "center_priority");
  assert.equal(response.immersivePresence?.trustBoundary.humanSovereignty, true);
});

test("provider unavailable falls back safely to text continuity", () => {
  const oldEnv = { ...process.env };
  delete process.env.AVATAR_PROVIDER_API_KEY;
  delete process.env.VOICE_PROVIDER_API_KEY;
  delete process.env.SMS_PROVIDER_API_KEY;
  delete process.env.EMAIL_API_KEY;
  try {
    const metadata = createImmersivePresenceMetadata({
      memberId: "member_1",
      companion: "Adam",
      channel: "future_video_avatar",
      message: "Start avatar mode.",
      consentToRemember: false,
      saveInsight: false,
      contextSources: [],
      intent: "reflection",
    });

    assert.equal(metadata.sessionState, "text_fallback");
    assert.equal(metadata.fallback.mode, "text");
    assert.deepEqual(metadata.providerReadiness, {
      avatarProviderConfigured: false,
      voiceProviderConfigured: false,
      smsProviderConfigured: false,
      emailProviderConfigured: false,
    });
    assert.ok(metadata.continuityChannels.includes("in_app"));
  } finally {
    process.env = oldEnv;
  }
});

test("metaverse-grade presence does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
