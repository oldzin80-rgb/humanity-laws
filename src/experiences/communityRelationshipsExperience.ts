export type CommunityRelationshipsModuleId =
  | "community_hub"
  | "table_expansion"
  | "groups"
  | "events"
  | "meeting_and_dating"
  | "conversation_engine"
  | "shared_journey"
  | "volunteer_and_service"
  | "privacy_and_trust"
  | "adam_eve_community_support"
  | "founder_community"
  | "future_integrations";

export type RelationshipGroupType =
  | "families"
  | "friends"
  | "couples"
  | "study_groups"
  | "wellness_groups"
  | "volunteer_groups"
  | "book_clubs"
  | "faith_discussions"
  | "local_meetups";

export type CommunityEventType =
  | "in_person"
  | "virtual"
  | "hybrid"
  | "founder_event"
  | "community_gathering"
  | "wellness_session"
  | "book_discussion"
  | "spark_circle";

export type ConnectionMode =
  | "friendship"
  | "mentorship"
  | "professional_networking"
  | "dating"
  | "marriage_minded_connections";

export type ConversationPromptType =
  | "icebreaker"
  | "reflection_question"
  | "group_discussion_guide"
  | "family_conversation"
  | "couple_conversation"
  | "parenting_prompt"
  | "team_conversation";

export type PrivacyControl =
  | "visibility"
  | "discoverability"
  | "messaging"
  | "invitations"
  | "profile_sharing"
  | "activity_sharing";

export type CommunityIntegrationProvider =
  | "calendar_provider"
  | "video_meeting_platform"
  | "messaging_system"
  | "event_ticketing"
  | "identity_verification";

export interface CommunityRelationshipsModule {
  id: CommunityRelationshipsModuleId;
  title: string;
  purpose: string;
  status: "modeled_not_live" | "manual_ready" | "provider_required" | "moderation_required";
  privacyByDefault: true;
  humanModerationRequired: true;
}

export interface TableExpansionModel {
  supports: readonly ["invite_others", "dinner_planning", "conversation_guides", "shared_reflections", "hospitality_ideas", "celebration_planning"];
  primaryPath: readonly ["Gather", "Prompt", "Share", "Remember"];
  adamEveContextAllowed: true;
  liveInvitesEnabled: false;
}

export interface RelationshipSafetyModel {
  humanVerificationOptions: "provider_ready_not_live";
  consentControls: true;
  privacySettings: true;
  reporting: "modeled_not_live";
  blocking: "modeled_not_live";
  moderationTools: "human_review_required";
  datingSafety: "respect_user_choice_and_safety";
}

export interface SharedJourneyModel {
  shareGoals: true;
  celebrateMilestones: true;
  encourageEachOther: true;
  trackGroupProgress: "consent_required";
  rememberMeaningfulMoments: "member_owned";
  publicComparison: false;
}

export interface VolunteerServiceModel {
  localServiceOpportunities: "future_verified_sources_required";
  communityProjects: "modeled_not_live";
  givingTime: "manual_ready";
  actsOfKindness: "manual_ready";
  groupInitiatives: "moderation_required";
}

export interface AdamEveCommunitySupportModel {
  may: readonly ["suggest_discussion_topics", "recommend_resources", "facilitate_reflections"];
  mustNever: readonly ["pretend_to_be_human", "force_introductions", "manipulate_relationships", "override_user_preferences"];
  aiTransparencyRequired: true;
  humanChoiceRequired: true;
}

export interface CommunityIntegrationAdapter {
  provider: CommunityIntegrationProvider;
  state: "not_connected" | "connection_required" | "approval_required";
  liveEnabled: false;
  configurationNote: string;
}

export interface CommunityRelationshipsPlatform {
  name: "Community & Relationships Platform";
  purpose: string;
  corePhilosophy: "Technology should help people connect more meaningfully, never manipulate or replace real human relationships.";
  modules: readonly CommunityRelationshipsModule[];
  groupTypes: readonly RelationshipGroupType[];
  eventTypes: readonly CommunityEventType[];
  connectionModes: readonly ConnectionMode[];
  conversationPromptTypes: readonly ConversationPromptType[];
  privacyControls: readonly PrivacyControl[];
  tableExpansion: TableExpansionModel;
  safety: RelationshipSafetyModel;
  sharedJourney: SharedJourneyModel;
  volunteerService: VolunteerServiceModel;
  adamEveSupport: AdamEveCommunitySupportModel;
  founderCommunity: readonly ["founder_updates", "live_q_and_a", "community_questions", "major_announcements", "future_roadmap"];
  futureIntegrations: readonly CommunityIntegrationAdapter[];
  noFakeMembers: true;
  noFakeConversations: true;
  noFakeActivity: true;
  noFakeTestimonials: true;
  userConsentFirst: true;
  privacyByDefault: true;
  launchReady: false;
}

export const CommunityRelationshipsModules: readonly CommunityRelationshipsModule[] = [
  { id: "community_hub", title: "Community Hub", purpose: "Member home, interest communities, local communities, global communities, announcements, and featured discussions.", status: "moderation_required", privacyByDefault: true, humanModerationRequired: true },
  { id: "table_expansion", title: "The Table Expansion", purpose: "Invite others, plan dinners, use conversation guides, share reflections, practice hospitality, and plan celebrations.", status: "manual_ready", privacyByDefault: true, humanModerationRequired: true },
  { id: "groups", title: "Groups", purpose: "Support families, friends, couples, study groups, wellness groups, volunteers, book clubs, faith discussions, and local meetups.", status: "moderation_required", privacyByDefault: true, humanModerationRequired: true },
  { id: "events", title: "Events", purpose: "Prepare in-person, virtual, hybrid, Founder, community, wellness, book, and Spark circle events.", status: "provider_required", privacyByDefault: true, humanModerationRequired: true },
  { id: "meeting_and_dating", title: "Meeting & Dating", purpose: "Support friendship, mentorship, professional networking, dating, and marriage-minded connections with consent and safety controls.", status: "provider_required", privacyByDefault: true, humanModerationRequired: true },
  { id: "conversation_engine", title: "Conversation Engine", purpose: "Generate icebreakers, reflections, group guides, family, couple, parenting, and team conversations.", status: "manual_ready", privacyByDefault: true, humanModerationRequired: true },
  { id: "shared_journey", title: "Shared Journey", purpose: "Share goals, celebrate milestones, encourage each other, track consent-based group progress, and remember meaningful moments.", status: "modeled_not_live", privacyByDefault: true, humanModerationRequired: true },
  { id: "volunteer_and_service", title: "Volunteer & Service", purpose: "Support local service, community projects, giving time, acts of kindness, and group initiatives.", status: "moderation_required", privacyByDefault: true, humanModerationRequired: true },
  { id: "privacy_and_trust", title: "Privacy & Trust", purpose: "Give every member control over visibility, discoverability, messaging, invitations, profile sharing, and activity sharing.", status: "manual_ready", privacyByDefault: true, humanModerationRequired: true },
  { id: "adam_eve_community_support", title: "Adam & Eve Community Support", purpose: "Suggest topics, recommend resources, and facilitate reflections without pretending to be human or forcing introductions.", status: "manual_ready", privacyByDefault: true, humanModerationRequired: true },
  { id: "founder_community", title: "Founder Community", purpose: "Create a future dedicated area for Founder updates, Q&A, community questions, announcements, and roadmap clarity.", status: "modeled_not_live", privacyByDefault: true, humanModerationRequired: true },
  { id: "future_integrations", title: "Future Integrations", purpose: "Prepare safe adapters for calendar, video meetings, messaging, ticketing, and identity verification.", status: "provider_required", privacyByDefault: true, humanModerationRequired: true },
];

export function createCommunityRelationshipsPlatform(): CommunityRelationshipsPlatform {
  return {
    name: "Community & Relationships Platform",
    purpose: "Create a unified relationship ecosystem that helps people build meaningful connections while preserving privacy, safety, authenticity, and human dignity.",
    corePhilosophy: "Technology should help people connect more meaningfully, never manipulate or replace real human relationships.",
    modules: CommunityRelationshipsModules,
    groupTypes: ["families", "friends", "couples", "study_groups", "wellness_groups", "volunteer_groups", "book_clubs", "faith_discussions", "local_meetups"],
    eventTypes: ["in_person", "virtual", "hybrid", "founder_event", "community_gathering", "wellness_session", "book_discussion", "spark_circle"],
    connectionModes: ["friendship", "mentorship", "professional_networking", "dating", "marriage_minded_connections"],
    conversationPromptTypes: ["icebreaker", "reflection_question", "group_discussion_guide", "family_conversation", "couple_conversation", "parenting_prompt", "team_conversation"],
    privacyControls: ["visibility", "discoverability", "messaging", "invitations", "profile_sharing", "activity_sharing"],
    tableExpansion: {
      supports: ["invite_others", "dinner_planning", "conversation_guides", "shared_reflections", "hospitality_ideas", "celebration_planning"],
      primaryPath: ["Gather", "Prompt", "Share", "Remember"],
      adamEveContextAllowed: true,
      liveInvitesEnabled: false,
    },
    safety: {
      humanVerificationOptions: "provider_ready_not_live",
      consentControls: true,
      privacySettings: true,
      reporting: "modeled_not_live",
      blocking: "modeled_not_live",
      moderationTools: "human_review_required",
      datingSafety: "respect_user_choice_and_safety",
    },
    sharedJourney: {
      shareGoals: true,
      celebrateMilestones: true,
      encourageEachOther: true,
      trackGroupProgress: "consent_required",
      rememberMeaningfulMoments: "member_owned",
      publicComparison: false,
    },
    volunteerService: {
      localServiceOpportunities: "future_verified_sources_required",
      communityProjects: "modeled_not_live",
      givingTime: "manual_ready",
      actsOfKindness: "manual_ready",
      groupInitiatives: "moderation_required",
    },
    adamEveSupport: {
      may: ["suggest_discussion_topics", "recommend_resources", "facilitate_reflections"],
      mustNever: ["pretend_to_be_human", "force_introductions", "manipulate_relationships", "override_user_preferences"],
      aiTransparencyRequired: true,
      humanChoiceRequired: true,
    },
    founderCommunity: ["founder_updates", "live_q_and_a", "community_questions", "major_announcements", "future_roadmap"],
    futureIntegrations: [
      { provider: "calendar_provider", state: "connection_required", liveEnabled: false, configurationNote: "Calendar connection requires provider OAuth and user consent." },
      { provider: "video_meeting_platform", state: "connection_required", liveEnabled: false, configurationNote: "Video meetings require a verified provider and safety settings." },
      { provider: "messaging_system", state: "approval_required", liveEnabled: false, configurationNote: "Messaging requires privacy controls, reporting, blocking, and moderation readiness." },
      { provider: "event_ticketing", state: "not_connected", liveEnabled: false, configurationNote: "Ticketing requires provider setup and event terms." },
      { provider: "identity_verification", state: "not_connected", liveEnabled: false, configurationNote: "Identity verification requires a trusted vendor and explicit consent." },
    ],
    noFakeMembers: true,
    noFakeConversations: true,
    noFakeActivity: true,
    noFakeTestimonials: true,
    userConsentFirst: true,
    privacyByDefault: true,
    launchReady: false,
  };
}
