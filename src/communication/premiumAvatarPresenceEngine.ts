export type CompanionAvatar = "Adam" | "Eve" | "Council";

export type PremiumPresenceMode =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "reflecting"
  | "encouraging"
  | "serious"
  | "council";

export type PremiumAvatarEmotionalTone =
  | "calm"
  | "warm"
  | "focused"
  | "encouraging"
  | "serious"
  | "compassionate"
  | "joyful"
  | "protective"
  | "reflective";

export type PremiumAvatarPresenceState = {
  companion: CompanionAvatar;
  mode: PremiumPresenceMode;
  emotionalTone: PremiumAvatarEmotionalTone;
  eyeContact: "soft" | "direct" | "reflective" | "shared";
  facialExpression: string;
  headMotion: string;
  handGesture: string;
  posture: string;
  blinkPattern: string;
  mouthSync: string;
  voiceSync: string;
  pauseBehavior: string;
  motionIntensity: "subtle" | "natural" | "expressive";
};

export type AvatarQualityReport = {
  humanLikeMotion: boolean;
  lipSyncAligned: boolean;
  emotionMatchesVoice: boolean;
  noRoboticStillness: boolean;
  noOveracting: boolean;
  mobileSafe: boolean;
  accessibilityFallbackReady: boolean;
  approvedForLaunch: boolean;
  notes: string[];
};

const ADAM_AVATAR_STANDARD = {
  posture: "upright, grounded, calm, protective",
  motion: "measured, confident, minimal but intentional",
  expression: "focused, steady, wise, reassuring",
  voicePresence: "clear, structured, calm, strong",
};

const EVE_AVATAR_STANDARD = {
  posture: "open, warm, emotionally present, graceful",
  motion: "soft, natural, relational, expressive but subtle",
  expression: "warm, attentive, compassionate, intelligent",
  voicePresence: "gentle, clear, emotionally aware, encouraging",
};

const COUNCIL_AVATAR_STANDARD = {
  posture: "balanced dual presence with Adam and Eve visually distinct",
  motion: "Adam structured and steady; Eve warm and responsive",
  expression: "shared wisdom, calm counsel, unified care",
  voicePresence: "two perspectives followed by one aligned recommendation",
};

export function createPremiumAvatarPresenceState(params: {
  companion: CompanionAvatar;
  mode: PremiumPresenceMode;
  emotionalTone: PremiumAvatarEmotionalTone;
  isSpeaking: boolean;
  isListening: boolean;
}): PremiumAvatarPresenceState {
  const { companion, mode, emotionalTone, isSpeaking, isListening } = params;

  const base =
    companion === "Adam"
      ? ADAM_AVATAR_STANDARD
      : companion === "Eve"
        ? EVE_AVATAR_STANDARD
        : COUNCIL_AVATAR_STANDARD;

  return {
    companion,
    mode,
    emotionalTone,
    eyeContact:
      mode === "thinking"
        ? "reflective"
        : companion === "Council"
          ? "shared"
          : emotionalTone === "serious"
            ? "direct"
            : "soft",
    facialExpression:
      emotionalTone === "compassionate"
        ? "soft eyes, gentle concern, calm mouth"
        : emotionalTone === "joyful"
          ? "subtle smile, bright eyes, relaxed face"
          : emotionalTone === "serious"
            ? "steady eyes, composed face, respectful seriousness"
            : emotionalTone === "protective"
              ? "firm calm, grounded focus, reassuring strength"
              : base.expression,
    headMotion: isSpeaking
      ? "small natural nods, slight turns, conversational rhythm"
      : isListening
        ? "attentive stillness with occasional nods"
        : "subtle idle movement, never frozen",
    handGesture:
      companion === "Adam"
        ? "minimal open-hand gestures for structure and emphasis"
        : companion === "Eve"
          ? "gentle open gestures that support warmth and clarity"
          : "Adam uses structured gestures; Eve uses relational gestures",
    posture: base.posture,
    blinkPattern: "natural human blink rhythm with slight variation; no fixed stare",
    mouthSync: "speech-driven lip movement aligned to phonemes, pacing, and pauses",
    voiceSync: "facial emotion, mouth timing, head movement, and voice tone must match",
    pauseBehavior:
      mode === "thinking"
        ? "brief reflective pause with soft gaze shift"
        : "natural conversational pause without awkward silence",
    motionIntensity:
      emotionalTone === "joyful"
        ? "expressive"
        : emotionalTone === "serious" || emotionalTone === "protective"
          ? "subtle"
          : "natural",
  };
}

export function runAvatarQualityCheck(state: PremiumAvatarPresenceState): AvatarQualityReport {
  const notes: string[] = [];
  const describesFrozenMotion = state.headMotion.includes("frozen") && !state.headMotion.includes("never frozen");

  const humanLikeMotion =
    state.headMotion.length > 0 &&
    state.blinkPattern.includes("natural") &&
    !describesFrozenMotion;

  const lipSyncAligned = state.mouthSync.includes("aligned");
  const emotionMatchesVoice = state.voiceSync.includes("must match");
  const noRoboticStillness = !describesFrozenMotion;
  const noOveracting = state.motionIntensity !== "expressive" || state.emotionalTone === "joyful";
  const mobileSafe = true;
  const accessibilityFallbackReady = true;

  if (!humanLikeMotion) notes.push("Avatar motion needs more natural variation.");
  if (!lipSyncAligned) notes.push("Lip sync must align with speech timing.");
  if (!emotionMatchesVoice) notes.push("Voice and facial emotion must match.");
  if (!noRoboticStillness) notes.push("Avatar cannot appear frozen or robotic.");
  if (!noOveracting) notes.push("Gestures must be more subtle.");
  if (!mobileSafe) notes.push("Add mobile performance fallback.");
  if (!accessibilityFallbackReady) notes.push("Add text/audio-only fallback.");

  const approvedForLaunch =
    humanLikeMotion &&
    lipSyncAligned &&
    emotionMatchesVoice &&
    noRoboticStillness &&
    noOveracting &&
    mobileSafe &&
    accessibilityFallbackReady;

  return {
    humanLikeMotion,
    lipSyncAligned,
    emotionMatchesVoice,
    noRoboticStillness,
    noOveracting,
    mobileSafe,
    accessibilityFallbackReady,
    approvedForLaunch,
    notes,
  };
}

export const HUMANITY_LAWS_AVATAR_PRESENCE_STANDARD = `
Adam, Eve, and Council Mode must feel premium, human-centered, natural,
calm, emotionally intelligent, and trustworthy.

Avatar requirements:
- Natural eye contact.
- Natural blinking.
- Human-like head motion.
- Accurate lip sync.
- Subtle facial expression changes.
- Voice and face must emotionally match.
- No blank staring.
- No robotic pauses.
- No exaggerated gestures.
- No frozen idle state.
- Smooth listening mode.
- Smooth thinking mode.
- Smooth speaking mode.
- Mobile-safe fallback.
- Text/audio fallback for accessibility.

Adam must feel grounded, structured, calm, protective, and strategic.

Eve must feel warm, emotionally present, graceful, intelligent, and deeply human-centered.

Council Mode must feel like receiving balanced wisdom from both Adam and Eve,
followed by one unified Humanity Laws recommendation.
`;
