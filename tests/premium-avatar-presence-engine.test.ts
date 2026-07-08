import assert from "node:assert/strict";
import test from "node:test";
import {
  createAvatarPresenceMetadata,
  createPremiumAvatarPresenceState,
  HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD,
  runAvatarQualityCheck,
} from "../src/communication/index.js";

test("Premium avatar presence creates Adam state with grounded protective motion", () => {
  const state = createPremiumAvatarPresenceState({
    companion: "Adam",
    mode: "speaking",
    emotionalTone: "protective",
    isSpeaking: true,
    isListening: false,
  });

  assert.equal(state.companion, "Adam");
  assert.equal(state.eyeContact, "soft");
  assert.match(state.posture, /grounded/);
  assert.match(state.handGesture, /structure and emphasis/);
  assert.match(state.headMotion, /conversational rhythm/);
  assert.match(state.voiceSync, /must match/);
});

test("Premium avatar presence creates Eve state with warmth and accessibility-ready motion", () => {
  const state = createPremiumAvatarPresenceState({
    companion: "Eve",
    mode: "listening",
    emotionalTone: "compassionate",
    isSpeaking: false,
    isListening: true,
  });
  const quality = runAvatarQualityCheck(state);

  assert.equal(state.companion, "Eve");
  assert.match(state.facialExpression, /soft eyes/);
  assert.match(state.handGesture, /gentle open gestures/);
  assert.equal(quality.humanLikeMotion, true);
  assert.equal(quality.accessibilityFallbackReady, true);
  assert.equal(quality.mobileSafe, true);
});

test("Premium avatar presence creates Council state with shared eye contact and dual presence", () => {
  const state = createPremiumAvatarPresenceState({
    companion: "Council",
    mode: "council",
    emotionalTone: "reflective",
    isSpeaking: false,
    isListening: false,
  });

  assert.equal(state.companion, "Council");
  assert.equal(state.eyeContact, "shared");
  assert.match(state.posture, /Adam and Eve visually distinct/);
  assert.match(state.handGesture, /Adam uses structured gestures; Eve uses relational gestures/);
});

test("Avatar quality check requires natural motion lip sync and no robotic stillness", () => {
  const state = createPremiumAvatarPresenceState({
    companion: "Adam",
    mode: "thinking",
    emotionalTone: "serious",
    isSpeaking: false,
    isListening: false,
  });
  const quality = runAvatarQualityCheck(state);

  assert.equal(quality.humanLikeMotion, true);
  assert.equal(quality.lipSyncAligned, true);
  assert.equal(quality.emotionMatchesVoice, true);
  assert.equal(quality.noRoboticStillness, true);
  assert.equal(quality.noOveracting, true);
});

test("Existing avatar metadata carries premium presence but remains provider-gated", () => {
  const metadata = createAvatarPresenceMetadata({
    companion: "Council",
    state: "council_mode",
    providerConfigured: true,
    placeholderOnly: true,
  });

  assert.equal(metadata.placeholderOnly, true);
  assert.equal(metadata.providerConfigured, true);
  assert.equal(metadata.transparencyLabel, "AI_AVATAR_PLACEHOLDER");
  assert.deepEqual(metadata.visibleParticipants, ["Adam", "Eve"]);
  assert.equal(metadata.premiumPresence?.standard, "premium_avatar_presence");
  assert.equal(metadata.premiumPresence?.mode, "council");
  assert.equal(metadata.qualityReport?.providerActivationStillRequired, true);
  assert.equal(metadata.qualityReport?.approvedForLaunch, false);
  assert.match(metadata.statusMessage, /provider verification/i);
});

test("Humanity Laws avatar standard keeps premium presence honest and accessible", () => {
  assert.match(HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD, /Natural eye contact/);
  assert.match(HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD, /Accurate lip sync/);
  assert.match(HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD, /Mobile-safe fallback/);
  assert.match(HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD, /Text\/audio fallback for accessibility/);
  assert.match(HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD, /Adam must feel grounded/);
  assert.match(HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD, /Eve must feel warm/);
  assert.match(HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD, /Council Mode/);
});
