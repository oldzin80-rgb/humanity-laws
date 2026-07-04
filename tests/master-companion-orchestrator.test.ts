import test from "node:test";
import assert from "node:assert/strict";
import { MasterCompanionOrchestrator, UnifiedCompanionService } from "../src/communication/index.js";
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

test("orchestrator activates the correct engines for a wellness request", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "in_app",
    message: "I feel stressed and need a wellness next step.",
    consentToRemember: true,
    saveInsight: false,
    contextSources: [],
    intent: "wellness_support",
  });
  const active = response.orchestration?.selectedEngines.filter((engine) => engine.active).map((engine) => engine.engine) ?? [];

  assert.ok(active.includes("presence"));
  assert.ok(active.includes("conversation_craft"));
  assert.ok(active.includes("quality_intelligence"));
  assert.ok(active.includes("human_presence_memory"));
  assert.ok(active.includes("wellness_context"));
  assert.equal(active.includes("future_live_feed_context"), false);
});

test("orchestrator coordinates engines without duplicated or conflicting guidance", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "I need a major decision and one practical next step.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "decision_support",
  });
  const activeNames = response.orchestration?.selectedEngines.filter((engine) => engine.active).map((engine) => engine.engine) ?? [];

  assert.equal(new Set(activeNames).size, activeNames.length);
  assert.ok(response.orchestration?.balance.avoid.includes("overwhelming"));
  assert.equal(response.orchestration?.rhythm.shouldInvolveCouncil, true);
  assert.equal(response.orchestration?.rhythm.shouldOfferNextStep, true);
});

test("orchestrator preserves AI transparency and human sovereignty", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Council",
    channel: "council_session",
    message: "Help me make an important relationship decision.",
    consentToRemember: false,
    saveInsight: true,
    contextSources: [],
    intent: "council_request",
  });

  assert.match(response.message, /AI companions, not real people/i);
  assert.match(response.humanSovereigntyReminder, /human judgment remains final/i);
  assert.equal(response.orchestration?.flourishingCheck.truthful, true);
  assert.equal(response.orchestration?.completionEvaluation.humanAgency, 10);
  assert.equal(response.orchestration?.completionEvaluation.trust, 10);
});

test("orchestrator only connects rooms when valuable", async () => {
  const book = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "Help me understand this book chapter and save it.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "book_discussion",
  });
  const table = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "in_app",
    message: "I feel lonely and want connection with family.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "reflection",
  });

  assert.ok(book.orchestration?.crossRoomConnections.some((connection) => connection.room === "Book"));
  assert.ok(book.orchestration?.crossRoomConnections.some((connection) => connection.room === "Library"));
  assert.ok(table.orchestration?.crossRoomConnections.some((connection) => connection.room === "Table"));
  assert.ok((table.orchestration?.crossRoomConnections.length ?? 0) <= 3);
});

test("orchestrator keeps provider placeholders safe", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "phone_voice",
    message: "Call me by phone.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "encouragement",
  });

  assert.equal(response.persisted, false);
  assert.match(response.sourceSummary ?? "", /No vendor call is made/);
  assert.equal(response.orchestration?.selectedEngines.some((engine) => engine.engine === "future_live_feed_context" && engine.active), false);
});

test("master orchestrator can evaluate a composed response directly", () => {
  const request = {
    memberId: "member_1",
    companion: "Eve" as const,
    channel: "in_app" as const,
    message: "I am unsure and need encouragement.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "encouragement" as const,
  };
  const plan = new MasterCompanionOrchestrator().orchestrate({
    request,
    response: "Eve: I am an AI companion. I am not a real person. Your human judgment remains final. Next step: choose one small action.",
  });

  assert.equal(plan.internalOnly, true);
  assert.equal(plan.understanding.uncertaintyLevel, "high");
  assert.equal(plan.flourishingCheck.passed, true);
});

test("Companion Orchestration Engine does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
