import assert from "node:assert/strict";
import test from "node:test";
import { buildHumanityLawsCompanionOS, UnifiedCompanionService } from "../src/communication/index.js";
import type { CompanionGateway, CompanionGatewayContext } from "../src/experiences/index.js";
import { councilSystemPromptScaffold } from "../src/experiences/companionGateway.js";

test("Companion Operating System activates all required layers", () => {
  const os = buildHumanityLawsCompanionOS({
    mode: "Adam",
    memberId: "member_1",
    userMessage: "Help me make a responsible decision.",
    humanityLawsBookContext: ["Book source remains the constitutional alignment source."],
  });

  assert.deepEqual(os.activeLayers, [
    "constitution",
    "knowledge",
    "reasoning",
    "memory",
    "communication",
    "presence",
    "experience",
    "quality",
  ]);
  assert.equal(os.launchStandard, "highest_humanity_laws_companion_standard");
  assert.ok(os.qualityGates.includes("human_agency"));
  assert.ok(os.qualityGates.includes("source_alignment"));
  assert.ok(os.qualityGates.includes("premium_presence"));
});

test("Companion Operating System preserves Adam Eve and Council identities", () => {
  const adam = buildHumanityLawsCompanionOS({ mode: "Adam", memberId: "member_1", userMessage: "Hello." }).systemPrompt;
  const eve = buildHumanityLawsCompanionOS({ mode: "Eve", memberId: "member_1", userMessage: "Hello." }).systemPrompt;
  const council = buildHumanityLawsCompanionOS({ mode: "Council", memberId: "member_1", userMessage: "Help us decide." }).systemPrompt;

  assert.match(adam, /You are Adam/);
  assert.match(adam, /structure, calm, strength, strategy/);
  assert.match(eve, /You are Eve/);
  assert.match(eve, /warmth, emotional intelligence/);
  assert.match(council, /Adam's structured perspective/);
  assert.match(council, /Eve's relational perspective/);
  assert.match(council, /One unified Humanity Laws recommendation/);
});

test("Companion Operating System keeps source hierarchy agency and no fake certainty", () => {
  const prompt = buildHumanityLawsCompanionOS({
    mode: "Eve",
    memberId: "member_1",
    userMessage: "What should I do next?",
    humanityLawsBookContext: ["Humanity Laws source context: source hash preserved."],
    founderContext: ["Founder context supports but does not replace the book."],
    memberContext: ["Conversation history:", "Member prefers brief answers."],
    sparkContext: ["Today's Spark asked about courage."],
    tableContext: ["The Table context: family dinner reflection."],
    wellnessContext: ["Wellness context: general supportive habit, not medical advice."],
    researchContext: ["Safety boundary: maintain professional boundaries."],
  }).systemPrompt;

  assert.match(prompt, /Humanity Laws book as permanent alignment source/);
  assert.match(prompt, /Founder context as Humanity Laws living vision/);
  assert.match(prompt, /Member-approved personal context/);
  assert.match(prompt, /Never invent source authority/);
  assert.match(prompt, /Never fake certainty/);
  assert.match(prompt, /The human remains sovereign/);
  assert.match(prompt, /Never remove the user's agency/);
  assert.match(prompt, /Conversation history/);
});

test("Council scaffold is generated from the same Companion Operating System", () => {
  const scaffold = councilSystemPromptScaffold();

  assert.match(scaffold, /HUMANITY LAWS COMPANION OPERATING SYSTEM/);
  assert.match(scaffold, /COUNCIL IDENTITY/);
  assert.match(scaffold, /Adam perspective/i);
  assert.match(scaffold, /Eve perspective/i);
  assert.match(scaffold, /Humanity Laws principle/i);
  assert.match(scaffold, /human final choice/i);
});

test("Unified Companion Service exposes the Companion OS as the governing runtime for Adam and Eve", async () => {
  const contexts: CompanionGatewayContext[] = [];
  const gateway: CompanionGateway = {
    async respond(companion, input, context) {
      if (context) contexts.push(context);
      return {
        companion,
        message: `${companion}: I am an AI companion. Direct answer for ${input}. Your human judgment remains final. Next step: choose one clear action.`,
        transparency: "AI_TRANSPARENT",
        humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
        sourceSummary: context?.sourceContext,
        responseOrigin: "provider",
        providerName: "test",
      };
    },
  };
  const service = new UnifiedCompanionService(gateway);

  const adam = await service.respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "Help me answer directly.",
    consentToRemember: true,
    saveInsight: false,
    contextSources: [],
    intent: "reflection",
  });
  const eve = await service.respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "in_app",
    message: "Help me answer warmly.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "encouragement",
  });

  assert.equal(adam.companionOS?.mode, "Adam");
  assert.equal(eve.companionOS?.mode, "Eve");
  assert.equal(adam.companionOS?.governingLayer, true);
  assert.equal(eve.companionOS?.promptIncludedInProviderPath, true);
  assert.ok(adam.companionOS?.activeLayers.includes("memory"));
  assert.ok(eve.companionOS?.preservedEngines.includes("avatar_presence"));
  assert.match(contexts[0]?.companionOperatingSystem?.systemPrompt ?? "", /HUMANITY LAWS COMPANION OPERATING SYSTEM/);
  assert.match(contexts[1]?.companionOperatingSystem?.systemPrompt ?? "", /EVE IDENTITY/);
});

test("Unified Companion Service governs Council Mode through the Companion OS while preserving existing engines", async () => {
  const contexts: CompanionGatewayContext[] = [];
  const gateway: CompanionGateway = {
    async respond(companion, input, context) {
      if (context) contexts.push(context);
      return {
        companion,
        message: `${companion}: I am an AI companion. Council perspective for ${input}. Your human judgment remains final. Next step: choose one clear action.`,
        transparency: "AI_TRANSPARENT",
        humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
        sourceSummary: context?.sourceContext,
        responseOrigin: "provider",
        providerName: "test",
      };
    },
  };

  const council = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Council",
    channel: "council_session",
    message: "Help me make a careful decision.",
    consentToRemember: true,
    saveInsight: true,
    contextSources: [],
    intent: "council_request",
  });

  assert.equal(council.companionOS?.mode, "Council");
  assert.equal(council.companionOS?.governingLayer, true);
  assert.ok(council.companionOS?.qualityGates.includes("human_agency"));
  assert.ok(council.orchestration?.selectedEngines.some((engine) => engine.engine === "council_logic" && engine.active));
  assert.ok(council.internalQuality?.internalOnly);
  assert.equal(council.avatarPresence?.councilMode, true);
  assert.match(council.council?.humanityLawsPrinciple ?? "", /Humanity Laws source remains preserved/);
  assert.equal(contexts.length, 2);
});
