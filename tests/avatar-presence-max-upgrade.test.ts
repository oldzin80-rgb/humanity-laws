import assert from "node:assert/strict";
import test from "node:test";
import {
  buildMaxAvatarMotionPlan,
  buildMaxAvatarSystemPrompt,
  createAvatarPresenceMetadata,
  HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS,
  runMaxAvatarLaunchGate,
} from "../src/communication/index.js";

test("Max avatar motion plan gives Adam grounded cinematic movement", () => {
  const plan = buildMaxAvatarMotionPlan({
    companion: "Adam",
    mode: "speaking",
    spokenText: "Let us name the next step.",
    emotionalIntent: "protective",
    deviceClass: "desktop",
    realismTier: "highest_humanity_laws_standard",
  });

  assert.match(plan.eyeBehavior, /soft natural eye contact|direct but calm eye contact/);
  assert.match(plan.facialMicroExpressions, /subtle brow focus/);
  assert.match(plan.gesturePlan, /minimal open-hand gestures/);
  assert.match(plan.posture, /upright, grounded/);
  assert.match(plan.idleLife, /breathing/);
});

test("Max avatar motion plan gives Eve warm relational movement", () => {
  const plan = buildMaxAvatarMotionPlan({
    companion: "Eve",
    mode: "listening",
    emotionalIntent: "compassionate",
    deviceClass: "mobile",
    realismTier: "cinematic",
  });

  assert.match(plan.facialMicroExpressions, /soft eyes/);
  assert.match(plan.headMotion, /gentle nods/);
  assert.match(plan.gesturePlan, /gentle open-hand gestures/);
  assert.match(plan.posture, /open, graceful, warm/);
});

test("Max avatar launch gate scores complete plans at highest standard", () => {
  const input = {
    companion: "Council" as const,
    mode: "council" as const,
    emotionalIntent: "reflective" as const,
    deviceClass: "high_performance" as const,
    realismTier: "highest_humanity_laws_standard" as const,
  };
  const gate = runMaxAvatarLaunchGate(input, buildMaxAvatarMotionPlan(input));

  assert.equal(gate.approved, true);
  assert.equal(gate.realismScore, 100);
  assert.equal(gate.requiredPasses.lipSync, true);
  assert.equal(gate.requiredPasses.councilModeBalanced, true);
  assert.deepEqual(gate.notes, []);
});

test("Max avatar system prompt names forbidden low-quality avatar states", () => {
  const prompt = buildMaxAvatarSystemPrompt({
    companion: "Adam",
    mode: "thinking",
    emotionalIntent: "serious",
    deviceClass: "tablet",
    realismTier: "premium",
  });

  assert.match(prompt, /Highest Humanity Laws Avatar Standard/);
  assert.match(prompt, /Do not render Adam, Eve, or Council Mode/);
  assert.match(prompt, /frozen/);
  assert.match(prompt, /robotic/);
  assert.match(prompt, /poorly lip-synced/);
});

test("Max avatar requirements define provider capabilities before activation", () => {
  assert.equal(HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS.realismTier, "highest_humanity_laws_standard");
  assert.equal(HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS.minimumLaunchScore, 95);
  assert.ok(HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS.requiredProviderCapabilities.includes("real-time lip sync"));
  assert.ok(HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS.requiredProviderCapabilities.includes("text/audio accessibility fallback"));
  assert.match(HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS.councilStandard.motion, /two distinct presences/);
});

test("Existing avatar metadata carries max gate but remains locked until provider proof", () => {
  const metadata = createAvatarPresenceMetadata({
    companion: "Eve",
    state: "speaking",
    providerConfigured: true,
    placeholderOnly: true,
  });

  assert.equal(metadata.placeholderOnly, true);
  assert.equal(metadata.maxAvatarGate?.realismScore, 100);
  assert.equal(metadata.maxAvatarGate?.approved, false);
  assert.equal(metadata.maxAvatarGate?.minimumLaunchScore, 95);
  assert.equal(metadata.maxAvatarGate?.providerActivationStillRequired, true);
  assert.ok(metadata.maxAvatarGate?.providerCapabilitiesRequired.includes("low-latency streaming"));
  assert.match(metadata.maxAvatarGate?.notes.join(" ") ?? "", /verified avatar provider/);
});
