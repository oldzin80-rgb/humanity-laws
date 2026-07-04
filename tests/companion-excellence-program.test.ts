import test from "node:test";
import assert from "node:assert/strict";
import {
  categorizeHumanNeeds,
  createCompanionExcellenceContext,
  createPresenceContext,
  inferLifeStageSupport,
  UnifiedCompanionService,
} from "../src/communication/index.js";
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

test("life-stage support exists without requiring age collection", () => {
  assert.equal(inferLifeStageSupport("I am caring for my father and feel exhausted."), "caregiver");
  assert.equal(inferLifeStageSupport("As a parent I am worried about my teenager."), "teenager");
  assert.equal(inferLifeStageSupport("I am grieving after a loss."), "grieving_person");
  assert.equal(inferLifeStageSupport("I am looking for purpose and direction."), "person_seeking_purpose");
  assert.equal(inferLifeStageSupport("I need help today."), "unspecified");
});

test("human need map categorizes common needs and keeps practical next steps", () => {
  assert.deepEqual(categorizeHumanNeeds("I need discipline, career clarity, and a next step.").slice(0, 3), ["career", "discipline", "practical_next_steps"]);
  assert.ok(categorizeHumanNeeds("I am grieving and need spiritual reflection.").includes("grief"));
  assert.ok(categorizeHumanNeeds("How do I repair this relationship and forgive?").includes("relationships"));
  assert.ok(categorizeHumanNeeds("How do I repair this relationship and forgive?").includes("forgiveness"));
});

test("Companion Excellence Engine creates love-in-action response metadata", () => {
  const request = {
    memberId: "member_1",
    companion: "Eve" as const,
    channel: "in_app" as const,
    message: "I feel overwhelmed and need belonging.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "encouragement" as const,
  };
  const presence = createPresenceContext(request);
  const excellence = createCompanionExcellenceContext(request, presence);

  assert.equal(excellence.warmth, "high");
  assert.equal(excellence.humility, true);
  assert.equal(excellence.humanDignity, true);
  assert.ok(excellence.humanNeeds.includes("belonging"));
  assert.match(excellence.loveInAction.acknowledge, /attention, not judgment/i);
  assert.match(excellence.loveInAction.preserveAgency, /do not choose for you/i);
});

test("Adam and Eve responses stay warm, direct, transparent, and bounded", async () => {
  const service = new UnifiedCompanionService(gateway);
  for (const companion of ["Adam", "Eve"] as const) {
    const response = await service.respond({
      memberId: "member_1",
      companion,
      channel: "in_app",
      message: "I need help with stress and one practical next step.",
      consentToRemember: true,
      saveInsight: true,
      contextSources: [],
      intent: "wellness_support",
    });

    assert.equal(response.transparency, "AI_TRANSPARENT");
    assert.match(response.aiDisclosure, /AI companion/);
    assert.match(response.aiDisclosure, /not a real person/);
    assert.match(response.humanSovereigntyReminder, /human judgment remains final/i);
    assert.ok(response.excellence.humanNeeds.includes("wellness"));
    assert.equal(response.excellence.helpfulness, "next_step_focused");
    assert.equal(response.qualityReview.invasiveAnalytics, false);
    assert.equal(response.qualityReview.savedInsight, true);
    assert.doesNotMatch(response.message, /therapist|doctor|lawyer/i);
  }
});

test("Council excellence preserves Adam, Eve, principle, practical next step, and human final choice", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Council",
    channel: "council_session",
    message: "I need help with a relationship decision.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "council_request",
  });

  assert.match(response.message, /Adam sees:/);
  assert.match(response.message, /Eve sees:/);
  assert.match(response.message, /Humanity Laws principle:/);
  assert.match(response.message, /Your choice:/);
  assert.match(response.message, /Next step:/);
  assert.equal(response.voiceProfile.companion, "Council");
  assert.ok(response.excellence.humanNeeds.includes("relationships"));
  assert.equal(response.immersivePresence?.trustBoundary.humanSovereignty, true);
});

test("professional and crisis boundaries remain present in excellence responses", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "This is an emergency and I might hurt myself.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "reflection",
  });

  assert.equal(response.escalationBoundary?.triggered, true);
  assert.match(response.escalationBoundary?.recommendedAction ?? "", /emergency services|qualified crisis professional/i);
  assert.equal(response.qualityReview.escalationNeeded, true);
});

test("Companion Excellence Program does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
