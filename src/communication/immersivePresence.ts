import type {
  CompanionParticipant,
  EmotionalExpressionState,
  GestureState,
  ImmersivePresenceMetadata,
  UnifiedCompanionRequest,
} from "./types.js";

function providerFlag(name: string): boolean {
  return Boolean(process.env[name]);
}

function emotionalExpressionFor(companion: CompanionParticipant): EmotionalExpressionState {
  if (companion === "Eve") return "warm";
  if (companion === "Adam") return "calm";
  if (companion === "Council" || companion === "AdamEve") return "reflective";
  return "neutral";
}

function gestureFor(companion: CompanionParticipant): GestureState {
  if (companion === "Council" || companion === "AdamEve") return "council_attention";
  if (companion === "Eve") return "open_posture";
  if (companion === "Adam") return "gentle_nod";
  return "still";
}

export function createImmersivePresenceMetadata(request: UnifiedCompanionRequest): ImmersivePresenceMetadata {
  const avatarProviderConfigured = providerFlag("AVATAR_PROVIDER_API_KEY");
  const voiceProviderConfigured = providerFlag("VOICE_PROVIDER_API_KEY");
  const smsProviderConfigured = providerFlag("SMS_PROVIDER_API_KEY");
  const emailProviderConfigured = providerFlag("EMAIL_API_KEY");
  const providerReadyButUnverified = avatarProviderConfigured || voiceProviderConfigured;
  const isCouncil = request.companion === "Council" || request.companion === "AdamEve" || request.channel === "council_session";

  return {
    sessionState: providerReadyButUnverified ? "ready_unverified" : "text_fallback",
    avatarRoomState: providerReadyButUnverified ? "fallback_text" : "fallback_text",
    voiceState: voiceProviderConfigured ? "unavailable" : "unavailable",
    emotionalExpression: emotionalExpressionFor(request.companion),
    gestureState: gestureFor(request.companion),
    councilSpatialLayout: isCouncil
      ? {
        room: "council_circle",
        adamPosition: "left",
        evePosition: "right",
        memberPosition: "center",
        principlePosition: "front",
        humanChoicePosition: "center_priority",
      }
      : undefined,
    naturalTurnTakingReady: false,
    voiceSyncedExpressionReady: false,
    eyeContactReady: false,
    microExpressionReady: false,
    bodyLanguageReady: false,
    continuityChannels: ["in_app", "sms", "phone_voice", "email", "future_video_avatar"],
    providerReadiness: {
      avatarProviderConfigured,
      voiceProviderConfigured,
      smsProviderConfigured,
      emailProviderConfigured,
    },
    fallback: {
      mode: "text",
      reason: "Immersive voice/avatar presence is architected but not live until providers are connected and verified.",
    },
    trustBoundary: {
      aiTransparent: true,
      neverClaimsHumanIdentity: true,
      humanSovereignty: true,
    },
  };
}
