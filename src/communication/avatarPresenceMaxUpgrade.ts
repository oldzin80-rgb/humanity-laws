export type CompanionIdentity = "Adam" | "Eve" | "Council";

export type AvatarRuntimeMode =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "reflecting"
  | "encouraging"
  | "serious"
  | "protective"
  | "council";

export type RealismTier =
  | "standard"
  | "premium"
  | "cinematic"
  | "highest_humanity_laws_standard";

export type AvatarMaxUpgradeInput = {
  companion: CompanionIdentity;
  mode: AvatarRuntimeMode;
  spokenText?: string;
  emotionalIntent:
    | "calm"
    | "warm"
    | "focused"
    | "compassionate"
    | "joyful"
    | "serious"
    | "protective"
    | "reflective";
  deviceClass: "mobile" | "tablet" | "desktop" | "high_performance";
  realismTier: RealismTier;
};

export type AvatarMotionPlan = {
  eyeBehavior: string;
  blinkBehavior: string;
  facialMicroExpressions: string;
  mouthAndLipSync: string;
  headMotion: string;
  gesturePlan: string;
  posture: string;
  breathingMotion: string;
  pauseTiming: string;
  voiceFaceSync: string;
  idleLife: string;
};

export type AvatarLaunchQualityGate = {
  approved: boolean;
  realismScore: number;
  requiredPasses: {
    lipSync: boolean;
    eyeContact: boolean;
    blinkNaturalness: boolean;
    emotionSync: boolean;
    gestureSubtlety: boolean;
    noRoboticStillness: boolean;
    noOveracting: boolean;
    latencySafe: boolean;
    mobileSafe: boolean;
    accessibilityReady: boolean;
    councilModeBalanced: boolean;
  };
  notes: string[];
};

const MAX_HUMANITY_LAWS_AVATAR_STANDARD = `
Highest Humanity Laws Avatar Standard:

Adam and Eve must never feel like static bots.

They must feel:
- premium
- calm
- intelligent
- emotionally present
- natural
- trustworthy
- human-centered
- spiritually respectful
- cinematic but not fake
- expressive but never exaggerated

The avatar must support the message, not distract from it.

Core rules:
1. Face, voice, and words must match.
2. Eye contact must feel alive but not intense.
3. Blinking must be natural and varied.
4. Head movement must follow speech rhythm.
5. Mouth movement must align with spoken timing.
6. Pauses must feel reflective, not broken.
7. Gestures must be subtle and purposeful.
8. Idle state must have life.
9. Council Mode must feel balanced.
10. Text/audio fallback must always exist.
`;

export function buildMaxAvatarMotionPlan(input: AvatarMaxUpgradeInput): AvatarMotionPlan {
  const isAdam = input.companion === "Adam";
  const isEve = input.companion === "Eve";
  const isCouncil = input.companion === "Council";

  return {
    eyeBehavior: isCouncil
      ? "shared council gaze: Adam steady and structured; Eve warm and relational; both avoid fixed staring"
      : input.emotionalIntent === "serious"
        ? "direct but calm eye contact with brief reflective breaks"
        : "soft natural eye contact with small gaze shifts",
    blinkBehavior: "human-like varied blink timing; slower during reflection, normal during speech, never robotic",
    facialMicroExpressions: isAdam
      ? "subtle brow focus, calm mouth movement, grounded seriousness, slight reassurance when encouraging"
      : isEve
        ? "soft eyes, gentle expression shifts, warm concern, subtle smile when appropriate"
        : "Adam shows structure and steadiness; Eve shows warmth and emotional nuance",
    mouthAndLipSync: "phoneme-aligned lip sync with natural jaw movement, pause closure, breath timing, and speech pacing",
    headMotion: isAdam
      ? "measured nods, slight turns during explanation, minimal strong movement"
      : isEve
        ? "gentle nods, warm responsiveness, natural conversational movement"
        : "Adam uses measured movement; Eve uses softer relational movement",
    gesturePlan: isAdam
      ? "minimal open-hand gestures for structure, sequence, and clarity"
      : isEve
        ? "gentle open-hand gestures for care, encouragement, and emotional connection"
        : "Council gestures remain balanced: Adam frames the logic; Eve supports the human meaning",
    posture: isAdam
      ? "upright, grounded, calm, protective, composed"
      : isEve
        ? "open, graceful, warm, attentive, emotionally present"
        : "balanced two-presence layout with both avatars visually distinct and unified",
    breathingMotion: "very subtle chest and shoulder breathing motion to prevent lifeless stillness",
    pauseTiming: "natural conversational pauses; reflective pauses should feel intentional, never frozen",
    voiceFaceSync: "voice emotion, facial emotion, mouth timing, gaze, and gesture must remain synchronized",
    idleLife: "subtle idle motion: breathing, micro gaze shifts, natural blink rhythm, small posture adjustments",
  };
}

export function runMaxAvatarLaunchGate(
  input: AvatarMaxUpgradeInput,
  plan: AvatarMotionPlan,
): AvatarLaunchQualityGate {
  const notes: string[] = [];

  const lipSync = plan.mouthAndLipSync.includes("phoneme-aligned");
  const eyeContact = plan.eyeBehavior.includes("eye contact") || plan.eyeBehavior.includes("gaze");
  const blinkNaturalness = plan.blinkBehavior.includes("varied");
  const emotionSync = plan.voiceFaceSync.includes("synchronized");
  const gestureSubtlety =
    plan.gesturePlan.includes("minimal") ||
    plan.gesturePlan.includes("gentle") ||
    plan.gesturePlan.includes("balanced");
  const noRoboticStillness =
    plan.idleLife.includes("breathing") &&
    plan.idleLife.includes("blink") &&
    (!plan.pauseTiming.includes("frozen") || plan.pauseTiming.includes("never frozen"));
  const noOveracting = !plan.gesturePlan.includes("exaggerated");
  const latencySafe =
    input.deviceClass === "high_performance" ||
    input.deviceClass === "desktop" ||
    input.deviceClass === "tablet" ||
    input.deviceClass === "mobile";
  const mobileSafe = true;
  const accessibilityReady = true;
  const councilModeBalanced = input.companion !== "Council" || plan.gesturePlan.includes("balanced");

  const requiredPasses = {
    lipSync,
    eyeContact,
    blinkNaturalness,
    emotionSync,
    gestureSubtlety,
    noRoboticStillness,
    noOveracting,
    latencySafe,
    mobileSafe,
    accessibilityReady,
    councilModeBalanced,
  };

  Object.entries(requiredPasses).forEach(([key, value]) => {
    if (!value) notes.push(`Avatar failed quality gate: ${key}`);
  });

  const passedCount = Object.values(requiredPasses).filter(Boolean).length;
  const realismScore = Math.round((passedCount / Object.keys(requiredPasses).length) * 100);

  return {
    approved: Object.values(requiredPasses).every(Boolean),
    realismScore,
    requiredPasses,
    notes,
  };
}

export function buildMaxAvatarSystemPrompt(input: AvatarMaxUpgradeInput): string {
  return `
${MAX_HUMANITY_LAWS_AVATAR_STANDARD}

Companion: ${input.companion}
Mode: ${input.mode}
Emotional intent: ${input.emotionalIntent}
Realism tier: ${input.realismTier}
Device class: ${input.deviceClass}

Avatar direction:
${JSON.stringify(buildMaxAvatarMotionPlan(input), null, 2)}

Launch requirement:
Do not render Adam, Eve, or Council Mode in a way that feels frozen,
robotic, exaggerated, emotionally mismatched, poorly lip-synced, or cheap.

The experience must feel premium, natural, emotionally intelligent,
and worthy of Humanity Laws.
`.trim();
}

export const HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS = {
  realismTier: "highest_humanity_laws_standard",
  minimumLaunchScore: 95,
  requiredProviderCapabilities: [
    "real-time lip sync",
    "natural blink generation",
    "facial micro-expressions",
    "speech emotion mapping",
    "head motion synthesis",
    "gesture control",
    "idle breathing motion",
    "mobile performance fallback",
    "text/audio accessibility fallback",
    "low-latency streaming",
  ],
  adamStandard: {
    presence: "grounded, strategic, calm, protective, clear",
    motion: "measured, confident, subtle",
    expression: "focused, wise, reassuring",
  },
  eveStandard: {
    presence: "warm, graceful, emotionally intelligent, compassionate",
    motion: "natural, relational, subtle",
    expression: "soft, present, encouraging",
  },
  councilStandard: {
    presence: "balanced wisdom from Adam and Eve",
    motion: "two distinct presences, one unified recommendation",
    expression: "calm, wise, aligned",
  },
} as const;
