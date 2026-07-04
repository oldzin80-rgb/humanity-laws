import type { AvatarParticipant, AvatarPresenceAdapter, AvatarPresenceMetadata, AvatarPresenceState, CompanionParticipant, UnifiedCompanionRequest, UnifiedCompanionResponse } from "./types.js";

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

export function createAvatarPresenceMetadata(params: {
  companion: CompanionParticipant;
  state: AvatarPresenceState;
  providerConfigured?: boolean;
  placeholderOnly?: boolean;
}): AvatarPresenceMetadata {
  const providerConfigured = params.providerConfigured === true;
  const placeholderOnly = params.placeholderOnly ?? !providerConfigured;
  const councilMode = params.companion === "Council" || params.companion === "AdamEve" || params.state === "council_mode";
  return {
    state: params.state,
    providerConfigured,
    placeholderOnly,
    visibleParticipants: participantsFor(params.companion),
    qualities: avatarQualities,
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
