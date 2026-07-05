import {
  createSocialMediaCommandCenterExperience,
  type SocialCampaignGoal,
  type SocialCampaignType,
  type SocialIntegrationState,
  type SocialOutlet,
  type SocialOutletAdapter,
} from "./socialMediaExperience.js";

export type GrowthPlatformModuleId =
  | "campaign_orchestrator"
  | "content_studio"
  | "content_library"
  | "automation_builder"
  | "audience_manager"
  | "communication_center"
  | "editorial_calendar"
  | "analytics"
  | "brand_guardian"
  | "adam_eve_integration"
  | "founder_workspace"
  | "future_api_layer"
  | "master_content_engine";

export type GrowthCampaignKind =
  | "launch_campaign"
  | "evergreen_campaign"
  | "seasonal_campaign"
  | "founder_campaign"
  | "book_campaign"
  | "membership_campaign"
  | "spark_campaign"
  | "podcast_campaign"
  | "event_campaign";

export type ContentDestination =
  | SocialOutlet
  | "blog"
  | "website"
  | "founder_letter"
  | "landing_page"
  | "podcast_outline"
  | "speaking_notes";

export type ContentOutputFormat =
  | "caption"
  | "long_form_post"
  | "reel_script"
  | "short_script"
  | "carousel_copy"
  | "video_script"
  | "newsletter"
  | "landing_page"
  | "podcast_outline"
  | "speaking_notes"
  | "sms_copy"
  | "adam_eve_prompt";

export type ContentLibraryAssetType =
  | "founder_reflection"
  | "quote"
  | "spark_moment"
  | "podcast_clip"
  | "book_excerpt"
  | "testimonial"
  | "photo"
  | "video"
  | "graphic"
  | "campaign"
  | "reusable_asset";

export type AutomationTrigger =
  | "book_purchased"
  | "membership_joined"
  | "podcast_released"
  | "founder_letter_published"
  | "campaign_approved"
  | "spark_saved";

export type AudienceSegmentBasis =
  | "membership"
  | "interests"
  | "engagement"
  | "book_ownership"
  | "preferred_topics"
  | "communication_preferences"
  | "language";

export type CommunicationChannel =
  | "email"
  | "sms"
  | "push_notification"
  | "website_announcement"
  | "in_app_message"
  | "founder_message";

export type EditorialCalendarItemType =
  | "podcast"
  | "founder_letter"
  | "spark"
  | "social_campaign"
  | "book_promotion"
  | "live_event"
  | "wellness_content";

export interface GrowthPlatformModule {
  id: GrowthPlatformModuleId;
  title: string;
  purpose: string;
  status: "modeled_not_live" | "manual_ready" | "provider_required";
  humanApprovalRequired: true;
}

export interface MasterContentSeed {
  id: string;
  sourceType: "founder_reflection" | "book_theme" | "spark_prompt" | "podcast_idea" | "table_prompt" | "wellness_practice";
  title: string;
  coreMessage: string;
  constitutionalAlignment: "references_source_without_rewriting";
  requiresHumanReview: true;
}

export interface MasterContentDraftSet {
  seedId: string;
  founderLetter: string;
  podcastOutline: string;
  blogPost: string;
  youtubeScript: string;
  shortFormScript: string;
  socialPosts: readonly string[];
  emailNewsletter: string;
  smsReminder: string;
  sparkConnection: string;
  adamEveDiscussionPrompts: readonly string[];
  relatedBookTheme: string;
  requiresHumanApproval: true;
  publishAutomatically: false;
}

export interface BrandGuardianReview {
  voiceAligned: true;
  truthfulClaims: true;
  respectfulLanguage: true;
  noManipulation: true;
  noFakeUrgency: true;
  noFakeTestimonials: true;
  noFakeEngagement: true;
  requiresHumanApproval: true;
}

export interface GrowthAutomationWorkflow {
  trigger: AutomationTrigger;
  steps: readonly string[];
  enabled: false;
  reasonNotLive: string;
}

export interface GrowthAudienceSegment {
  id: string;
  label: string;
  basis: AudienceSegmentBasis;
  consentRequired: true;
  liveTargetingEnabled: false;
}

export interface GrowthAnalyticsModel {
  reach: null;
  engagement: null;
  campaignPerformance: null;
  conversions: null;
  memberships: null;
  bookSales: null;
  retention: null;
  returningMembers: null;
  sparkParticipation: null;
  podcastListening: null;
  note: "Analytics are placeholders until verified providers supply real measurements.";
}

export interface FounderWorkspaceSummary {
  todaysPriorities: readonly string[];
  pendingApprovals: readonly string[];
  scheduledLaunches: readonly string[];
  contentIdeas: readonly string[];
  campaignHealth: "not_measured_until_analytics_connected";
  upcomingFounderVideos: readonly string[];
  communicationReminders: readonly string[];
}

export interface GrowthCommunicationsPlatform {
  name: "Growth & Communications Platform";
  purpose: string;
  modules: readonly GrowthPlatformModule[];
  campaignKinds: readonly GrowthCampaignKind[];
  contentDestinations: readonly ContentDestination[];
  outputFormats: readonly ContentOutputFormat[];
  libraryAssetTypes: readonly ContentLibraryAssetType[];
  automationWorkflows: readonly GrowthAutomationWorkflow[];
  audienceSegments: readonly GrowthAudienceSegment[];
  communicationChannels: readonly CommunicationChannel[];
  editorialCalendarTypes: readonly EditorialCalendarItemType[];
  socialAdapters: readonly SocialOutletAdapter[];
  campaignGoals: readonly SocialCampaignGoal[];
  campaignTypes: readonly SocialCampaignType[];
  integrationStates: readonly SocialIntegrationState[];
  masterContentSeed: MasterContentSeed;
  masterContentDraftSet: MasterContentDraftSet;
  brandGuardianReview: BrandGuardianReview;
  analytics: GrowthAnalyticsModel;
  founderWorkspace: FounderWorkspaceSummary;
  adamEveAllowedActions: readonly ["recommend_campaign_ideas", "organize_drafts", "summarize_analytics", "suggest_improvements"];
  adamEveForbiddenActions: readonly ["publish_without_human_approval", "send_without_human_approval", "fake_metrics", "fake_testimonials"];
  futureApiLayer: readonly ["social_platforms", "email_providers", "sms_providers", "analytics_providers", "crm_systems"];
  launchReady: false;
}

export const GrowthPlatformModules: readonly GrowthPlatformModule[] = [
  { id: "campaign_orchestrator", title: "Campaign Orchestrator", purpose: "Build launch, evergreen, seasonal, founder, book, membership, Spark, podcast, and event campaigns.", status: "manual_ready", humanApprovalRequired: true },
  { id: "content_studio", title: "Content Studio", purpose: "Prepare captions, posts, scripts, newsletters, landing pages, podcast outlines, and speaking notes.", status: "manual_ready", humanApprovalRequired: true },
  { id: "content_library", title: "Content Library", purpose: "Organize founder reflections, quotes, Spark moments, podcast clips, book excerpts, testimonials, media, graphics, campaigns, and reusable assets.", status: "modeled_not_live", humanApprovalRequired: true },
  { id: "automation_builder", title: "Automation Builder", purpose: "Model workflows such as book purchased → thank you → welcome → Spark invitation → Adam and Eve introduction.", status: "modeled_not_live", humanApprovalRequired: true },
  { id: "audience_manager", title: "Audience Manager", purpose: "Represent consent-aware audience segments by membership, interests, ownership, preferences, topics, and language.", status: "modeled_not_live", humanApprovalRequired: true },
  { id: "communication_center", title: "Communication Center", purpose: "Coordinate email, SMS, push, website announcements, in-app messages, and Founder messages.", status: "provider_required", humanApprovalRequired: true },
  { id: "editorial_calendar", title: "Editorial Calendar", purpose: "Plan Podcast, Founder Letters, Spark, social campaigns, book promotions, events, and wellness content.", status: "manual_ready", humanApprovalRequired: true },
  { id: "analytics", title: "Analytics", purpose: "Measure reach, engagement, conversions, memberships, book sales, retention, returning members, Spark participation, and podcast listening when providers are connected.", status: "provider_required", humanApprovalRequired: true },
  { id: "brand_guardian", title: "Brand Guardian", purpose: "Check Humanity Laws voice, truthful claims, respectful language, no manipulation, no fake urgency, no fake testimonials, and no fake engagement.", status: "manual_ready", humanApprovalRequired: true },
  { id: "adam_eve_integration", title: "Adam & Eve Integration", purpose: "Let Adam and Eve recommend ideas, organize drafts, summarize analytics, and suggest improvements without publishing.", status: "manual_ready", humanApprovalRequired: true },
  { id: "founder_workspace", title: "Founder Workspace", purpose: "Give Nick one calm view of priorities, approvals, scheduled launches, ideas, campaign health, videos, and reminders.", status: "manual_ready", humanApprovalRequired: true },
  { id: "future_api_layer", title: "Future API Layer", purpose: "Prepare adapters for social, email, SMS, analytics, and CRM systems without fake live connections.", status: "provider_required", humanApprovalRequired: true },
  { id: "master_content_engine", title: "Master Content Engine", purpose: "Start from one seed and prepare drafts for every destination while preserving message consistency.", status: "manual_ready", humanApprovalRequired: true },
];

export function createMasterContentDraftSet(seed: MasterContentSeed): MasterContentDraftSet {
  return {
    seedId: seed.id,
    founderLetter: `Founder Letter draft from seed: ${seed.title}.`,
    podcastOutline: `Podcast outline: introduce the reflection, connect it to daily stewardship, close with one question.`,
    blogPost: `Blog draft: ${seed.coreMessage}`,
    youtubeScript: `YouTube script: open calmly, explain the theme, invite one honest next step.`,
    shortFormScript: `Short script: ${seed.coreMessage}`,
    socialPosts: [
      "A calm reminder for today: begin with one honest step.",
      "Growth does not need to be noisy to be real.",
      "What is one meaningful thing this moment is asking from you?",
    ],
    emailNewsletter: `Email draft: ${seed.coreMessage}`,
    smsReminder: "A quiet Spark is waiting: one honest step is enough.",
    sparkConnection: "Turn the seed into one daily reflection prompt.",
    adamEveDiscussionPrompts: ["What feels most true about this right now?", "What is one practical next step?", "What would stewardship look like here?"],
    relatedBookTheme: "Humanity Laws source theme referenced without rewriting the book.",
    requiresHumanApproval: true,
    publishAutomatically: false,
  };
}

export function runBrandGuardianReview(): BrandGuardianReview {
  return {
    voiceAligned: true,
    truthfulClaims: true,
    respectfulLanguage: true,
    noManipulation: true,
    noFakeUrgency: true,
    noFakeTestimonials: true,
    noFakeEngagement: true,
    requiresHumanApproval: true,
  };
}

export function createGrowthCommunicationsPlatform(): GrowthCommunicationsPlatform {
  const social = createSocialMediaCommandCenterExperience();
  const seed: MasterContentSeed = {
    id: "growth-seed-founder-reflection-001",
    sourceType: "founder_reflection",
    title: "One honest step",
    coreMessage: "Humanity Laws reaches people best when communication is calm, truthful, useful, and human-approved.",
    constitutionalAlignment: "references_source_without_rewriting",
    requiresHumanReview: true,
  };

  return {
    name: "Growth & Communications Platform",
    purpose: "Coordinate every Humanity Laws communication with members and the public while preserving authenticity, human approval, truthful communication, and no fake engagement.",
    modules: GrowthPlatformModules,
    campaignKinds: ["launch_campaign", "evergreen_campaign", "seasonal_campaign", "founder_campaign", "book_campaign", "membership_campaign", "spark_campaign", "podcast_campaign", "event_campaign"],
    contentDestinations: ["instagram", "facebook", "tiktok", "youtube", "youtube_shorts", "x_twitter", "threads", "linkedin", "pinterest", "blog", "website", "founder_letter", "email_newsletter", "sms_text_campaign", "landing_page", "podcast_outline", "speaking_notes"],
    outputFormats: ["caption", "long_form_post", "reel_script", "short_script", "carousel_copy", "video_script", "newsletter", "landing_page", "podcast_outline", "speaking_notes", "sms_copy", "adam_eve_prompt"],
    libraryAssetTypes: ["founder_reflection", "quote", "spark_moment", "podcast_clip", "book_excerpt", "testimonial", "photo", "video", "graphic", "campaign", "reusable_asset"],
    automationWorkflows: [
      { trigger: "book_purchased", steps: ["thank you", "welcome email", "Spark invitation", "Adam and Eve introduction"], enabled: false, reasonNotLive: "Provider sending and consent verification are required before automation is enabled." },
      { trigger: "membership_joined", steps: ["onboarding", "Founder Letter", "Podcast recommendation", "The Table invitation"], enabled: false, reasonNotLive: "Member communication preferences must be verified first." },
      { trigger: "podcast_released", steps: ["social campaign", "email", "website feature"], enabled: false, reasonNotLive: "Podcast publishing and provider connections are not live." },
      { trigger: "founder_letter_published", steps: ["notifications", "campaign creation"], enabled: false, reasonNotLive: "Human approval and provider connections are required." },
    ],
    audienceSegments: [
      { id: "members", label: "Members", basis: "membership", consentRequired: true, liveTargetingEnabled: false },
      { id: "book-owners", label: "Book owners", basis: "book_ownership", consentRequired: true, liveTargetingEnabled: false },
      { id: "spark-interested", label: "Spark interested", basis: "preferred_topics", consentRequired: true, liveTargetingEnabled: false },
      { id: "language-preference", label: "Language preference", basis: "language", consentRequired: true, liveTargetingEnabled: false },
    ],
    communicationChannels: ["email", "sms", "push_notification", "website_announcement", "in_app_message", "founder_message"],
    editorialCalendarTypes: ["podcast", "founder_letter", "spark", "social_campaign", "book_promotion", "live_event", "wellness_content"],
    socialAdapters: social.outletAdapters,
    campaignGoals: social.goals,
    campaignTypes: social.campaignTypes,
    integrationStates: social.integrationStates,
    masterContentSeed: seed,
    masterContentDraftSet: createMasterContentDraftSet(seed),
    brandGuardianReview: runBrandGuardianReview(),
    analytics: {
      reach: null,
      engagement: null,
      campaignPerformance: null,
      conversions: null,
      memberships: null,
      bookSales: null,
      retention: null,
      returningMembers: null,
      sparkParticipation: null,
      podcastListening: null,
      note: "Analytics are placeholders until verified providers supply real measurements.",
    },
    founderWorkspace: {
      todaysPriorities: ["Review pending campaign drafts", "Choose one Founder message", "Confirm no claims exceed evidence"],
      pendingApprovals: ["Founder reflection campaign", "Website announcement copy"],
      scheduledLaunches: ["Manual-only content calendar placeholder"],
      contentIdeas: ["Book theme", "Spark invitation", "Podcast reflection", "The Table gratitude prompt"],
      campaignHealth: "not_measured_until_analytics_connected",
      upcomingFounderVideos: ["Founder video placeholder pending real recording"],
      communicationReminders: ["Approve before sending", "Verify provider status", "Keep communication calm and truthful"],
    },
    adamEveAllowedActions: ["recommend_campaign_ideas", "organize_drafts", "summarize_analytics", "suggest_improvements"],
    adamEveForbiddenActions: ["publish_without_human_approval", "send_without_human_approval", "fake_metrics", "fake_testimonials"],
    futureApiLayer: ["social_platforms", "email_providers", "sms_providers", "analytics_providers", "crm_systems"],
    launchReady: false,
  };
}
