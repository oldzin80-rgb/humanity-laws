import type { ChannelDeliveryResult, CompanionChannel, CompanionChannelAdapter, UnifiedCompanionRequest, UnifiedCompanionResponse } from "./types.js";

const placeholderChannels = ["sms", "phone_voice", "email", "future_video_avatar"] as const;

export class PlaceholderCompanionChannelAdapter implements CompanionChannelAdapter {
  constructor(public readonly channel: CompanionChannel, private readonly requiredSetting: string) {}

  vendorConfigured(): boolean {
    return Boolean(process.env[this.requiredSetting]);
  }

  async deliver(_request: UnifiedCompanionRequest, _response: UnifiedCompanionResponse): Promise<ChannelDeliveryResult> {
    return {
      channel: this.channel,
      delivered: false,
      placeholderOnly: true,
      vendorConfigured: this.vendorConfigured(),
      message: `${this.channel} is prepared as a safe placeholder. No vendor call is made until ${this.requiredSetting} is configured and verified.`,
    };
  }
}

export function createPlaceholderChannelAdapters(): Record<(typeof placeholderChannels)[number], CompanionChannelAdapter> {
  return {
    sms: new PlaceholderCompanionChannelAdapter("sms", "SMS_PROVIDER_API_KEY"),
    phone_voice: new PlaceholderCompanionChannelAdapter("phone_voice", "VOICE_PROVIDER_API_KEY"),
    email: new PlaceholderCompanionChannelAdapter("email", "EMAIL_API_KEY"),
    future_video_avatar: new PlaceholderCompanionChannelAdapter("future_video_avatar", "AVATAR_PROVIDER_API_KEY"),
  };
}

export function isPlaceholderOnlyChannel(channel: CompanionChannel): channel is (typeof placeholderChannels)[number] {
  return placeholderChannels.includes(channel as (typeof placeholderChannels)[number]);
}
