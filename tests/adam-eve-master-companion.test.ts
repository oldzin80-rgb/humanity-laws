import assert from "node:assert/strict";
import test from "node:test";
import { buildAdamEveCompanionPrompt } from "../src/communication/index.js";

test("Adam master companion plan is structured strategic and agency-preserving", () => {
  const plan = buildAdamEveCompanionPrompt({
    companion: "Adam",
    userMessage: "Help me decide what to do next.",
    member: {
      memberId: "member_1",
      goals: ["finish the book launch"],
      values: ["truth", "responsibility"],
      currentNeed: "decision support",
      preferredTone: "direct",
    },
    sources: {
      humanityLawsBook: ["Book source remains immutable."],
    },
  });

  assert.equal(plan.companion, "Adam");
  assert.match(plan.systemPrompt, /Adam communication identity/);
  assert.match(plan.systemPrompt, /Structured/);
  assert.match(plan.systemPrompt, /Strategic/);
  assert.match(plan.systemPrompt, /Book source remains immutable/);
  assert.match(plan.responseStyle, /Tone: direct/);
  assert.match(plan.orchestrationRules, /Never remove the user's responsibility or agency/);
});

test("Eve master companion plan is warm relational and emotionally intelligent", () => {
  const plan = buildAdamEveCompanionPrompt({
    companion: "Eve",
    userMessage: "I feel overwhelmed.",
    member: {
      memberId: "member_2",
      ageGroup: "adult",
      preferredTone: "gentle",
      savedMemory: ["Prefers short reflections."],
    },
    sources: {
      sparkHistory: ["A Spark about courage."],
      tableContext: ["A family conversation moment."],
      wellnessContext: ["A gentle breathing practice."],
    },
  });

  assert.equal(plan.companion, "Eve");
  assert.match(plan.systemPrompt, /Eve communication identity/);
  assert.match(plan.systemPrompt, /Emotionally intelligent/);
  assert.match(plan.systemPrompt, /A Spark about courage/);
  assert.match(plan.systemPrompt, /A family conversation moment/);
  assert.match(plan.systemPrompt, /A gentle breathing practice/);
  assert.match(plan.memoryInstructions, /Use memory to create continuity, not control/);
});

test("Council master companion plan includes Adam Eve and one unified recommendation", () => {
  const plan = buildAdamEveCompanionPrompt({
    companion: "Council",
    userMessage: "We need to make an important choice.",
    member: { memberId: "member_3", preferredTone: "wise" },
    sources: { founderContext: ["Founder context supports stewardship."] },
  });

  assert.match(plan.systemPrompt, /Council Mode/);
  assert.match(plan.systemPrompt, /Adam provides/);
  assert.match(plan.systemPrompt, /Eve provides/);
  assert.match(plan.systemPrompt, /unified Humanity Laws recommendation/);
  assert.match(plan.safetyInstructions, /Never pretend to be human/);
  assert.match(plan.responseStyle, /Tone: wise/);
});

test("Master companion boundaries prohibit fake certainty coercion dependency and professional replacement", () => {
  const plan = buildAdamEveCompanionPrompt({
    companion: "Adam",
    userMessage: "Tell me the guaranteed answer.",
    member: { memberId: "member_4" },
    sources: {},
  });

  assert.match(plan.safetyInstructions, /Never claim certainty when uncertain/);
  assert.match(plan.safetyInstructions, /Never manipulate, shame, coerce, or create dependency/);
  assert.match(plan.safetyInstructions, /legal, medical, financial, or crisis/);
  assert.match(plan.systemPrompt, /Companion support, never human replacement/);
  assert.match(plan.systemPrompt, /You are an AI companion, not a human person/);
});
