import { companionProviderConfigured } from "../experiences/companionGateway.js";

export interface CompanionActivationFlags {
  textCompanionEnabled: boolean;
  companionMemoryEnabled: boolean;
  voiceInAppEnabled: false;
  avatarEnabled: false;
  phoneEnabled: false;
  smsEnabled: false;
  emailCompanionEnabled: false;
  councilModeEnabled: true;
  fallbackResponseAuditEnabled: true;
}

export interface FutureCompanionProviderPlaceholder {
  kind: "avatar" | "voice" | "phone" | "sms" | "email";
  enabled: false;
  providerConfigured: boolean;
  requiredSetting: string;
  activationStatus: "placeholder_only";
  note: string;
}

export interface AvatarIdentityStorageLocation {
  label: string;
  file: string;
  purpose: string;
  status: "metadata_stub" | "ui_placeholder" | "voice_profile";
}

export interface AvatarIdentityAuditResult {
  adamAvatarIdentityStoredIn: AvatarIdentityStorageLocation[];
  eveAvatarIdentityStoredIn: AvatarIdentityStorageLocation[];
  selectedReferenceImages: {
    localImageAssetsExist: boolean;
    committedImageAssets: string[];
    pushedImageAssets: "none_found_to_push";
    note: string;
  };
  uiUsage: {
    usedByUi: boolean;
    files: string[];
    mode: "placeholder_metadata_only";
  };
  providerReadiness: {
    realAvatarProviderConnected: false;
    realVoiceProviderConnected: false;
    phoneProviderConnected: false;
    smsProviderConnected: false;
    emailCompanionProviderConnected: false;
  };
  preservationRule: string;
  neededLaterForRealProvider: string[];
}

export interface CompanionProviderPlaceholderInterfaces {
  avatarProvider: FutureCompanionProviderPlaceholder;
  voiceProvider: FutureCompanionProviderPlaceholder;
  phoneProvider: FutureCompanionProviderPlaceholder;
  smsProvider: FutureCompanionProviderPlaceholder;
  emailCompanionProvider: FutureCompanionProviderPlaceholder;
}

function configured(env: Record<string, string | undefined>, key: string): boolean {
  return Boolean(env[key]?.trim());
}

function placeholder(kind: FutureCompanionProviderPlaceholder["kind"], requiredSetting: string, env: Record<string, string | undefined>): FutureCompanionProviderPlaceholder {
  return {
    kind,
    enabled: false,
    providerConfigured: configured(env, requiredSetting),
    requiredSetting,
    activationStatus: "placeholder_only",
    note: `${kind} provider is prepared as a placeholder only. It must not be activated until vendor configuration, consent, safety, and launch proof are verified.`,
  };
}

export function createCompanionActivationFlags(env: Record<string, string | undefined> = process.env): CompanionActivationFlags {
  return {
    textCompanionEnabled: companionProviderConfigured(env),
    companionMemoryEnabled: configured(env, "SUPABASE_SERVICE_ROLE_KEY"),
    voiceInAppEnabled: false,
    avatarEnabled: false,
    phoneEnabled: false,
    smsEnabled: false,
    emailCompanionEnabled: false,
    councilModeEnabled: true,
    fallbackResponseAuditEnabled: true,
  };
}

export function createCompanionProviderPlaceholders(env: Record<string, string | undefined> = process.env): CompanionProviderPlaceholderInterfaces {
  return {
    avatarProvider: placeholder("avatar", "AVATAR_PROVIDER_API_KEY", env),
    voiceProvider: placeholder("voice", "VOICE_PROVIDER_API_KEY", env),
    phoneProvider: placeholder("phone", "VOICE_PROVIDER_API_KEY", env),
    smsProvider: placeholder("sms", "SMS_PROVIDER_API_KEY", env),
    emailCompanionProvider: placeholder("email", "EMAIL_API_KEY", env),
  };
}

export function auditAvatarIdentityPreservation(): AvatarIdentityAuditResult {
  const adamAndEveShared = [
    {
      label: "Avatar presence metadata",
      file: "src/communication/realtimeAvatarAdapter.ts",
      purpose: "Defines placeholder avatar state, visible participants, AI transparency label, and avatar qualities.",
      status: "metadata_stub" as const,
    },
    {
      label: "Immersive presence states",
      file: "src/communication/immersivePresence.ts",
      purpose: "Defines text fallback, voice unavailable state, emotional expression, gesture state, and provider readiness.",
      status: "metadata_stub" as const,
    },
    {
      label: "Avatar placeholder UI",
      file: "src/application/components.ts",
      purpose: "Renders honest 'Avatar presence coming soon' UI without claiming live video, real personhood, or active voice.",
      status: "ui_placeholder" as const,
    },
  ];

  return {
    adamAvatarIdentityStoredIn: [
      {
        label: "Adam voice and companion identity",
        file: "src/communication/presenceEngine.ts",
        purpose: "Stores Adam qualities: calm, steady, grounded, protective, practical, truth-oriented.",
        status: "voice_profile",
      },
      ...adamAndEveShared,
    ],
    eveAvatarIdentityStoredIn: [
      {
        label: "Eve voice and companion identity",
        file: "src/communication/presenceEngine.ts",
        purpose: "Stores Eve qualities: warm, perceptive, emotionally intelligent, encouraging, relational, reflective.",
        status: "voice_profile",
      },
      ...adamAndEveShared,
    ],
    selectedReferenceImages: {
      localImageAssetsExist: false,
      committedImageAssets: [],
      pushedImageAssets: "none_found_to_push",
      note: "No Adam/Eve avatar image assets, selected reference images, PNG/JPG/WebP/SVG identity assets, or committed visual likeness files were found in the repository audit. Existing selected looks are therefore preserved as metadata/stubs only.",
    },
    uiUsage: {
      usedByUi: true,
      files: ["src/application/components.ts"],
      mode: "placeholder_metadata_only",
    },
    providerReadiness: {
      realAvatarProviderConnected: false,
      realVoiceProviderConnected: false,
      phoneProviderConnected: false,
      smsProviderConnected: false,
      emailCompanionProviderConnected: false,
    },
    preservationRule: "Do not overwrite, regenerate, rename, or replace Adam/Eve selected looks; connect future provider assets only after explicit review.",
    neededLaterForRealProvider: [
      "Approved Adam reference image or provider avatar id.",
      "Approved Eve reference image or provider avatar id.",
      "Voice provider selection and verified consent/safety settings.",
      "Provider-specific avatar states for idle, listening, thinking, speaking, reflecting, and council mode.",
      "Operational proof that UI labels remain transparent: AI companion, not a real person.",
      "Fallback path to text when avatar, voice, phone, SMS, or email providers are unavailable.",
    ],
  };
}
