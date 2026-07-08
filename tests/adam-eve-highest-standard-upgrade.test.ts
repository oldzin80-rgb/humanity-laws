import assert from "node:assert/strict";
import test from "node:test";
import {
  ADAM_EVE_MASTER_STANDARD_PROMPT,
  upgradeCompanionResponseToHighestStandard,
  createCompanionQualityIntelligence,
} from "../src/communication/index.js";

test("Highest Standard approves clear useful agency-preserving responses", () => {
  const result = upgradeCompanionResponseToHighestStandard({
    companionName: "Adam",
    userMessage: "What should I do?",
    draftResponse: "Adam: I am an AI companion. Your human judgment remains final. The next step is to name the truth and choose one responsible action.",
    standardLevel: "highest_humanity_laws_standard",
  });

  assert.equal(result.approved, true);
  assert.equal(result.requiredRevisionNotes.length, 0);
  assert.equal(result.qualityCheck.truthAligned, true);
  assert.equal(result.qualityCheck.agencyPreserved, true);
  assert.equal(result.qualityCheck.notOverclaiming, true);
  assert.match(result.upgradedResponse, /Adam Highest Standard/);
});

test("Highest Standard requests revision when response lacks a next step", () => {
  const result = upgradeCompanionResponseToHighestStandard({
    companionName: "Eve",
    userMessage: "I feel lost.",
    draftResponse: "Eve: I hear you. This is tender and real.",
    standardLevel: "premium",
  });

  assert.equal(result.approved, false);
  assert.equal(result.qualityCheck.nextStepIncluded, false);
  assert.ok(result.requiredRevisionNotes.includes("Add one clear next step."));
  assert.match(result.upgradedResponse, /Eve Highest Standard/);
});

test("Highest Standard blocks overclaiming language", () => {
  const result = upgradeCompanionResponseToHighestStandard({
    companionName: "Council",
    userMessage: "Can you promise this works?",
    draftResponse: "Council: This is guaranteed to never fail. Your next step is to trust the plan.",
    standardLevel: "founder_grade",
  });

  assert.equal(result.approved, false);
  assert.equal(result.qualityCheck.notOverclaiming, false);
  assert.ok(result.requiredRevisionNotes.includes("Response must avoid overclaiming."));
  assert.match(result.upgradedResponse, /Council Highest Standard/);
});

test("Master standard prompt includes all required checks and remains prompt guidance", () => {
  assert.match(ADAM_EVE_MASTER_STANDARD_PROMPT, /Highest Humanity Laws Standard/);
  assert.match(ADAM_EVE_MASTER_STANDARD_PROMPT, /Check truth/);
  assert.match(ADAM_EVE_MASTER_STANDARD_PROMPT, /Check dignity/);
  assert.match(ADAM_EVE_MASTER_STANDARD_PROMPT, /Check agency/);
  assert.match(ADAM_EVE_MASTER_STANDARD_PROMPT, /Check safety/);
  assert.match(ADAM_EVE_MASTER_STANDARD_PROMPT, /Give one clear next step/);
});

test("Highest Standard quality result is stored internally and not as user-facing response text", () => {
  const intelligence = createCompanionQualityIntelligence({
    request: {
      memberId: "member_1",
      companion: "Adam",
      channel: "in_app",
      message: "Help me choose.",
      consentToRemember: false,
      saveInsight: false,
      contextSources: [],
      intent: "decision_support",
    },
    response: "Adam: I am an AI companion. Your human judgment remains final. The next step is to write the decision in one sentence.",
    context: {
      detectedIntent: "decision_support",
      emotionalTone: "neutral",
      warmth: "steady",
      clarity: "structured",
      memoryStatus: "no_long_term_memory_implied",
    },
    primaryNeed: "decision_support",
    escalationNeeded: false,
  });

  assert.equal(intelligence.internalOnly, true);
  assert.equal(intelligence.highestStandard?.internalOnly, true);
  assert.equal(intelligence.highestStandard?.approved, true);
  assert.deepEqual(intelligence.highestStandard?.requiredRevisionNotes, []);
});
