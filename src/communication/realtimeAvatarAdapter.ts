import type { AvatarParticipant, AvatarPresenceAdapter, AvatarPresenceMetadata, AvatarPresenceState, CompanionParticipant, UnifiedCompanionRequest, UnifiedCompanionResponse } from "./types.js";
import {
  createPremiumAvatarPresenceState,
  runAvatarQualityCheck,
  type CompanionAvatar,
  type PremiumAvatarEmotionalTone,
  type PremiumPresenceMode,
} from "./premiumAvatarPresenceEngine.js";
import {
  buildMaxAvatarMotionPlan,
  HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS,
  runMaxAvatarLaunchGate,
  type AvatarMaxUpgradeInput,
  type AvatarRuntimeMode,
} from "./avatarPresenceMaxUpgrade.js";

const avatarQualities = {
  humanLikePresence: true,
  warmFacialExpression: true,
  naturalEyeContact: true,
  calmBodyLanguage: true,
  subtleMicroExpressions: true,
  voiceSyncedSpeakingLater: true,
  emotionallyAppropriateTone: true,
  aiTransparency: true,
};

function participantsFor(companion: CompanionParticipant): AvatarParticipant[] {
  if (companion === "Adam") return ["Adam"];
  if (companion === "Eve") return ["Eve"];
  return ["Adam", "Eve"];
}

function avatarCompanionFor(companion: CompanionParticipant): CompanionAvatar {
  if (companion === "Eve") return "Eve";
  if (companion === "Council" || companion === "AdamEve") return "Council";
  return "Adam";
}

function premiumModeFor(state: AvatarPresenceState): PremiumPresenceMode {
  if (state === "council_mode") return "council";
  if (state === "speaking") return "speaking";
  if (state === "listening") return "listening";
  if (state === "thinking") return "thinking";
  if (state === "reflecting") return "reflecting";
  return "idle";
}

function emotionalToneFor(companion: CompanionParticipant, state: AvatarPresenceState): PremiumAvatarEmotionalTone {
  if (state === "council_mode") return "reflective";
  if (companion === "Adam") return "protective";
  if (companion === "Eve") return "warm";
  return "calm";
}

function maxRuntimeModeFor(state: AvatarPresenceState): AvatarRuntimeMode {
  if (state === "council_mode") return "council";
  if (state === "speaking") return "speaking";
  if (state === "listening") return "listening";
  if (state === "thinking") return "thinking";
  if (state === "reflecting") return "reflecting";
  return "idle";
}

function maxEmotionalIntentFor(
  companion: CompanionParticipant,
  state: AvatarPresenceState,
): AvatarMaxUpgradeInput["emotionalIntent"] {
  const tone = emotionalToneFor(companion, state);
  if (tone === "encouraging") return "warm";
  return tone;
}

export function createAvatarPresenceMetadata(params: {
  companion: CompanionParticipant;
  state: AvatarPresenceState;
  providerConfigured?: boolean;
  placeholderOnly?: boolean;
}): AvatarPresenceMetadata {
  const providerConfigured = params.providerConfigured === true;
  const placeholderOnly = params.placeholderOnly ?? !providerConfigured;
  const councilMode = params.companion === "Council" || params.companion === "AdamEve" || params.state === "council_mode";
  const premiumPresence = createPremiumAvatarPresenceState({
    companion: avatarCompanionFor(params.companion),
    mode: premiumModeFor(params.state),
    emotionalTone: emotionalToneFor(params.companion, params.state),
    isSpeaking: params.state === "speaking",
    isListening: params.state === "listening",
  });
  const qualityReport = runAvatarQualityCheck(premiumPresence);
  const maxInput = {
    companion: avatarCompanionFor(params.companion),
    mode: maxRuntimeModeFor(params.state),
    emotionalIntent: maxEmotionalIntentFor(params.companion, params.state),
    deviceClass: "mobile" as const,
    realismTier: "highest_humanity_laws_standard" as const,
  };
  const maxGate = runMaxAvatarLaunchGate(maxInput, buildMaxAvatarMotionPlan(maxInput));
  return {
    state: params.state,
    providerConfigured,
    placeholderOnly,
    visibleParticipants: participantsFor(params.companion),
    qualities: avatarQualities,
    premiumPresence: {
      mode: premiumPresence.mode,
      emotionalTone: premiumPresence.emotionalTone,
      eyeContact: premiumPresence.eyeContact,
      facialExpression: premiumPresence.facialExpression,
      headMotion: premiumPresence.headMotion,
      handGesture: premiumPresence.handGesture,
      posture: premiumPresence.posture,
      blinkPattern: premiumPresence.blinkPattern,
      mouthSync: premiumPresence.mouthSync,
      voiceSync: premiumPresence.voiceSync,
      pauseBehavior: premiumPresence.pauseBehavior,
      motionIntensity: premiumPresence.motionIntensity,
      standard: "premium_avatar_presence",
    },
    qualityReport: {
      ...qualityReport,
      approvedForLaunch: false,
      notes: [
        ...qualityReport.notes,
        "Avatar provider activation and live verification are still required before launch.",
      ],
      providerActivationStillRequired: true,
    },
    maxAvatarGate: {
      realismScore: maxGate.realismScore,
      approved: false,
      minimumLaunchScore: HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS.minimumLaunchScore,
      providerCapabilitiesRequired: HUMANITY_LAWS_MAX_AVATAR_REQUIREMENTS.requiredProviderCapabilities,
      providerActivationStillRequired: true,
      notes: [
        ...maxGate.notes,
        "Max avatar launch gate remains locked until a verified avatar provider proves these capabilities in production.",
      ],
    },
    statusMessage: placeholderOnly
      ? "Avatar presence coming soon. Voice and avatar support will be connected after provider verification."
      : "Avatar provider is configured, but live presence still requires operational verification before launch.",
    transparencyLabel: placeholderOnly ? "AI_AVATAR_PLACEHOLDER" : "AI_AVATAR_PROVIDER_READY",
    councilMode,
  };
}

export class RealtimeAvatarAdapter implements AvatarPresenceAdapter {
  constructor(private readonly requiredSetting = "AVATAR_PROVIDER_API_KEY") {}

  vendorConfigured(): boolean {
    return Boolean(process.env[this.requiredSetting]);
  }

  async renderPresence(request: UnifiedCompanionRequest, _response: UnifiedCompanionResponse): Promise<AvatarPresenceMetadata> {
    const providerConfigured = this.vendorConfigured();
    return createAvatarPresenceMetadata({
      companion: request.companion,
      state: request.companion === "Council" || request.companion === "AdamEve" ? "council_mode" : "unavailable",
      providerConfigured,
      placeholderOnly: true,
    });
  }
}
