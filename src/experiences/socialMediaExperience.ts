export type SocialCampaignFlowStep =
  | "Idea"
  | "Campaign"
  | "Content Set"
  | "Channel Arrangement"
  | "Schedule"
  | "Approval"
  | "Publish/Export"
  | "Reflect/Analyze";

export type SocialCampaignType =
  | "founder_reflection"
  | "book_theme"
  | "spark_prompt"
  | "adam_eve_conversation_invitation"
  | "podcast_listening_room"
  | "founder_letter"
  | "the_table"
  | "membership_invitation"
  | "hardcover_digital_book_promotion"
  | "launch_announcement"
  | "seasonal_current_event_reflection"
  | "testimonial_review_highlight"
  | "educational_carousel"
  | "short_form_video_script";

export type SocialOutlet =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "youtube_shorts"
  | "x_twitter"
  | "linkedin"
  | "threads"
  | "pinterest"
  | "email_newsletter"
  | "sms_text_campaign"
  | "website_announcement"
  | "future_outlet";

export type SocialIntegrationState =
  | "not_connected"
  | "connection_required"
  | "connected"
  | "approval_required"
  | "ready_to_publish"
  | "publish_failed"
  | "exported_manually";

export type SocialCampaignGoal =
  | "awareness"
  | "book_sales"
  | "membership_conversion"
  | "podcast_listens"
  | "spark_engagement"
  | "founder_message"
  | "community_discussion"
  | "launch_announcement";

export type SocialCommandCenterEventType =
  | "social_command_center_entered"
  | "campaign_created"
  | "campaign_approved"
  | "campaign_exported"
  | "channel_connection_reviewed"
  | "campaign_results_reviewed";

export interface SocialOutletAdapter {
  outlet: SocialOutlet;
  label: string;
  state: SocialIntegrationState;
  requiresOfficialApiApproval: boolean;
  requiresOAuth: boolean;
  livePublishingEnabled: boolean;
  manualExportAvailable: true;
  configurationNote: string;
}

export interface SocialCampaignContent {
  outlet: SocialOutlet;
  caption: string;
  shortCaption: string;
  longCaption: string;
  hashtags: readonly string[];
  carouselText: readonly string[];
  videoScript: string;
  reelOrShortHook: string;
  cta: string;
  imageDirection: string;
  postingNotes: string;
}

export interface SocialAnalyticsPlaceholder {
  impressions: null;
  clicks: null;
  saves: null;
  comments: null;
  shares: null;
  conversionEvents: null;
  membershipSignups: null;
  bookPurchases: null;
  reflectionSaves: null;
  note: "Analytics remain placeholders until real platform connections are verified.";
}

export interface SocialCampaignCalendarItem {
  id: string;
  campaignId: string;
  outlet: SocialOutlet;
  scheduledFor: string;
  state: SocialIntegrationState;
  requiresHumanApproval: true;
}

export interface SocialCampaign {
  id: string;
  title: string;
  type: SocialCampaignType;
  goal: SocialCampaignGoal;
  voice: readonly ["calm", "truthful", "classy", "Apple-like", "spiritual but not forced"];
  prohibitedClaims: readonly ["fake scarcity", "fake audience behavior", "exaggerated claims", "hype manipulation"];
  contentSet: readonly SocialCampaignContent[];
  calendar: readonly SocialCampaignCalendarItem[];
  analytics: SocialAnalyticsPlaceholder;
  humanApprovalRequired: true;
  canPublishAutomatically: false;
}

export interface SocialMediaCommandCenterExperience {
  path: readonly SocialCampaignFlowStep[];
  campaignTypes: readonly SocialCampaignType[];
  goals: readonly SocialCampaignGoal[];
  outletAdapters: readonly SocialOutletAdapter[];
  featuredCampaign: SocialCampaign;
  integrationStates: readonly SocialIntegrationState[];
  adamEveEventBuffering: readonly SocialCommandCenterEventType[];
  noFakePosting: true;
  noFakeEngagement: true;
  launchSafe: true;
}

export interface SocialCommandCenterEvent {
  userId: string;
  type: SocialCommandCenterEventType;
  source: "social_media_command_center";
  campaignId: string;
  campaignTitle: string;
  outlet?: SocialOutlet;
  createdAt: string;
  companionVisible: true;
  userOwned: true;
  editableByUser: true;
  deletableByUser: true;
  purpose: "campaign_planning_approval_export_and_reflection";
}

export const SocialCampaignFlow: readonly SocialCampaignFlowStep[] = [
  "Idea",
  "Campaign",
  "Content Set",
  "Channel Arrangement",
  "Schedule",
  "Approval",
  "Publish/Export",
  "Reflect/Analyze",
];

export const SocialCampaignTypes: readonly SocialCampaignType[] = [
  "founder_reflection",
  "book_theme",
  "spark_prompt",
  "adam_eve_conversation_invitation",
  "podcast_listening_room",
  "founder_letter",
  "the_table",
  "membership_invitation",
  "hardcover_digital_book_promotion",
  "launch_announcement",
  "seasonal_current_event_reflection",
  "testimonial_review_highlight",
  "educational_carousel",
  "short_form_video_script",
];

export const SocialCampaignGoals: readonly SocialCampaignGoal[] = [
  "awareness",
  "book_sales",
  "membership_conversion",
  "podcast_listens",
  "spark_engagement",
  "founder_message",
  "community_discussion",
  "launch_announcement",
];

export const SocialIntegrationStates: readonly SocialIntegrationState[] = [
  "not_connected",
  "connection_required",
  "connected",
  "approval_required",
  "ready_to_publish",
  "publish_failed",
  "exported_manually",
];

export const SocialOutletAdapters: readonly SocialOutletAdapter[] = [
  { outlet: "instagram", label: "Instagram", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Meta publishing requires a professional account, approved permissions, and OAuth." },
  { outlet: "facebook", label: "Facebook", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Facebook publishing requires Meta app review, page access, and OAuth." },
  { outlet: "tiktok", label: "TikTok", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "TikTok posting requires approved Content Posting API access." },
  { outlet: "youtube", label: "YouTube", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "YouTube upload requires YouTube Data API credentials and OAuth consent." },
  { outlet: "youtube_shorts", label: "YouTube Shorts", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Shorts publishing uses verified YouTube upload permissions." },
  { outlet: "x_twitter", label: "X / Twitter", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Posting requires approved API access and account authorization." },
  { outlet: "linkedin", label: "LinkedIn", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "LinkedIn publishing requires approved app permissions and organization access where applicable." },
  { outlet: "threads", label: "Threads", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Threads publishing requires official platform API permissions." },
  { outlet: "pinterest", label: "Pinterest", state: "connection_required", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Pinterest publishing requires app credentials and OAuth." },
  { outlet: "email_newsletter", label: "Email Newsletter", state: "not_connected", requiresOfficialApiApproval: false, requiresOAuth: false, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Email export is available; provider sending requires verified sender and API keys." },
  { outlet: "sms_text_campaign", label: "SMS / Text Campaign", state: "not_connected", requiresOfficialApiApproval: true, requiresOAuth: false, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "SMS requires opt-in compliance, provider setup, and verified sending rules." },
  { outlet: "website_announcement", label: "Website Announcement", state: "approval_required", requiresOfficialApiApproval: false, requiresOAuth: false, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Website announcements require founder approval before being made live." },
  { outlet: "future_outlet", label: "Future Outlet", state: "not_connected", requiresOfficialApiApproval: true, requiresOAuth: true, livePublishingEnabled: false, manualExportAvailable: true, configurationNote: "Future channels must be reviewed before connection." },
];

const FeaturedCampaign: SocialCampaign = {
  id: "hl-social-campaign-founder-reflection-001",
  title: "A calm invitation to begin",
  type: "founder_reflection",
  goal: "awareness",
  voice: ["calm", "truthful", "classy", "Apple-like", "spiritual but not forced"],
  prohibitedClaims: ["fake scarcity", "fake audience behavior", "exaggerated claims", "hype manipulation"],
  contentSet: [
    {
      outlet: "instagram",
      caption: "A quieter kind of growth begins with one honest step.",
      shortCaption: "One honest step.",
      longCaption: "Humanity Laws is being built as a calm home for reflection, stewardship, conversation, and daily return. Begin with one honest step.",
      hashtags: ["#HumanityLaws", "#DailyReflection", "#Stewardship"],
      carouselText: ["One honest step.", "One calm question.", "One better conversation."],
      videoScript: "Open on a quiet table, a book, and a simple question: What would become clearer if you slowed down for one minute?",
      reelOrShortHook: "What if growth felt calmer?",
      cta: "Start with Spark.",
      imageDirection: "Warm natural light, simple book/table composition, no hype.",
      postingNotes: "Export manually until Instagram is officially connected.",
    },
  ],
  calendar: [
    {
      id: "calendar-founder-reflection-001-instagram",
      campaignId: "hl-social-campaign-founder-reflection-001",
      outlet: "instagram",
      scheduledFor: "future_manual_schedule",
      state: "approval_required",
      requiresHumanApproval: true,
    },
  ],
  analytics: {
    impressions: null,
    clicks: null,
    saves: null,
    comments: null,
    shares: null,
    conversionEvents: null,
    membershipSignups: null,
    bookPurchases: null,
    reflectionSaves: null,
    note: "Analytics remain placeholders until real platform connections are verified.",
  },
  humanApprovalRequired: true,
  canPublishAutomatically: false,
};

export function createSocialMediaCommandCenterExperience(): SocialMediaCommandCenterExperience {
  return {
    path: SocialCampaignFlow,
    campaignTypes: SocialCampaignTypes,
    goals: SocialCampaignGoals,
    outletAdapters: SocialOutletAdapters,
    featuredCampaign: FeaturedCampaign,
    integrationStates: SocialIntegrationStates,
    adamEveEventBuffering: [
      "social_command_center_entered",
      "campaign_created",
      "campaign_approved",
      "campaign_exported",
      "channel_connection_reviewed",
      "campaign_results_reviewed",
    ],
    noFakePosting: true,
    noFakeEngagement: true,
    launchSafe: true,
  };
}

export function createSocialCommandCenterEvent(params: {
  userId: string;
  type: SocialCommandCenterEventType;
  campaignId?: string;
  campaignTitle?: string;
  outlet?: SocialOutlet;
  createdAt?: string;
}): SocialCommandCenterEvent {
  const campaign = FeaturedCampaign;
  return {
    userId: params.userId,
    type: params.type,
    source: "social_media_command_center",
    campaignId: params.campaignId ?? campaign.id,
    campaignTitle: params.campaignTitle ?? campaign.title,
    outlet: params.outlet,
    createdAt: params.createdAt ?? new Date().toISOString(),
    companionVisible: true,
    userOwned: true,
    editableByUser: true,
    deletableByUser: true,
    purpose: "campaign_planning_approval_export_and_reflection",
  };
}
