import test from "node:test";
import assert from "node:assert/strict";
import { approvedContextFeedHooks, companionVoiceProfiles, UnifiedCompanionService } from "../src/communication/index.js";
import type { CompanionGateway } from "../src/experiences/index.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";

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

test("Adam voice profile is distinct, steady, practical, and truth-oriented", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "I need help making a responsible decision.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "decision_support",
  });

  assert.equal(response.voiceProfile.companion, "Adam");
  assert.ok(response.voiceProfile.qualities.includes("steady"));
  assert.ok(response.voiceProfile.qualities.includes("truth-oriented"));
  assert.match(response.message, /I hear you:/i);
  assert.match(response.message, /Next step:/);
  assert.match(response.message, /Not a real person/);
  assert.equal(response.memoryStatus, "no_long_term_memory_implied");
});

test("Eve voice profile is distinct, warm, relational, and reflective", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "in_app",
    message: "I feel overwhelmed and need encouragement.",
    consentToRemember: true,
    saveInsight: true,
    contextSources: [],
    intent: "encouragement",
  });

  assert.equal(response.voiceProfile.companion, "Eve");
  assert.ok(response.voiceProfile.qualities.includes("warm"));
  assert.ok(response.voiceProfile.qualities.includes("relational"));
  assert.match(response.message, /I’m with the feeling of this|I'm with the feeling of this/i);
  assert.doesNotMatch(response.message, /A gentle insight:/);
  assert.match(response.message, /With your consent/);
  assert.equal(response.memoryStatus, "consented_context_available");
});

test("Council response is concise and includes Adam, Eve, principle, human choice, and next step", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Council",
    channel: "council_session",
    message: "I need the Council for an important choice.",
    consentToRemember: false,
    saveInsight: true,
    contextSources: [],
    intent: "council_request",
  });

  assert.match(response.message, /Adam sees:/);
  assert.match(response.message, /Eve sees:/);
  assert.match(response.message, /Humanity Laws principle:/);
  assert.match(response.message, /Your choice:/);
  assert.match(response.message, /Next step:/);
  assert.match(response.message, /not real people/i);
  assert.equal(response.council?.savedOutcome, true);
  assert.ok(response.nextSteps.length <= 3);
});

test("next steps are relevant and limited to one to three choices", async () => {
  const service = new UnifiedCompanionService(gateway);
  for (const message of ["Discuss today's Spark.", "Help me with this chapter.", "I need a wellness practice.", "Help me with family dinner."]) {
    const response = await service.respond({
      memberId: "member_1",
      companion: "Adam",
      channel: "in_app",
      message,
      consentToRemember: false,
      saveInsight: false,
      contextSources: [],
      intent: "reflection",
    });

    assert.ok(response.nextSteps.length >= 1);
    assert.ok(response.nextSteps.length <= 3);
  }
});

test("AI transparency is present without fake human or fake live provider claims", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "future_video_avatar",
    message: "Can I have a live video call?",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "encouragement",
  });

  assert.equal(response.transparency, "AI_TRANSPARENT");
  assert.match(response.aiDisclosure, /AI companion/);
  assert.match(response.aiDisclosure, /not a real person/);
  assert.equal(response.avatarPresence?.placeholderOnly, true);
  assert.doesNotMatch(response.message, /live video call is active/i);
  assert.doesNotMatch(response.message, /real human/i);
});

test("approved live feed hooks are typed but not connected to uncontrolled live feeds", () => {
  assert.ok(approvedContextFeedHooks.length >= 7);
  for (const hook of approvedContextFeedHooks) {
    assert.equal(hook.enabled, false);
    assert.equal(hook.providerConfigured, false);
    assert.match(hook.description, /Future/i);
  }
});

test("Adam, Eve, and Council pages keep conversation first with honest provider readiness copy", () => {
  for (const path of ["/adam", "/eve", "/council"]) {
    const html = renderPageModelToHtml(routePage(path));
    assert.match(html, /Avatar presence coming soon/);
    assert.match(html, /Voice and avatar support will be connected after provider verification/);
    assert.match(html, /Not a live video call/);
    assert.doesNotMatch(html, /Live voice is active/i);
    assert.doesNotMatch(html, /SMS is live/i);
  }
});

test("voice profiles do not instruct dependency creation or fake certainty", () => {
  for (const profile of Object.values(companionVoiceProfiles)) {
    assert.ok(profile.avoid.includes("dependency") || profile.avoid.includes("replacing human judgment") || profile.avoid.includes("fake intimacy"));
    assert.doesNotMatch(profile.bestFor.join(" "), /therapy|doctor|lawyer/i);
  }
});
