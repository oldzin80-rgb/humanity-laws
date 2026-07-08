import { createFoundersBlessingsReadinessModel, type FoundersBlessingsReadinessModel } from "./foundersBlessingsService.js";

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

export interface FoundersBlessingsDatabasePlaceholder {
  founders_blessings_profiles: readonly [
    "id",
    "member_id",
    "enrollment_status",
    "enrolled_at",
    "eligibility_status",
    "eligibility_reason",
    "current_level",
    "lifetime_blessings_received",
    "last_included_event_id",
    "last_selected_event_id",
    "active_member_required",
    "created_at",
    "updated_at",
  ];
  founders_blessings_events: readonly [
    "id",
    "event_month",
    "event_date",
    "status",
    "blessing_theme",
    "gift_type",
    "gift_description_private",
    "estimated_gift_value",
    "selected_member_id_nullable",
    "founder_approved_member_id_nullable",
    "founder_approval_status",
    "admin_review_status",
    "tax_accounting_review_status",
    "legal_review_status",
    "activation_status",
    "created_at",
    "updated_at",
  ];
  founders_blessings_candidates: readonly ["id", "event_id", "member_id", "profile_id", "eligibility_status", "exclusion_reason_nullable", "blessing_level_at_event", "created_at"];
  founders_blessings_random_audits: readonly ["id", "event_id", "algorithm_name", "algorithm_version", "candidate_pool_hash", "request_id", "audit_hash", "created_at"];
  founders_blessings_gifts: readonly ["id", "event_id", "recipient_member_id", "gift_type", "delivery_status", "payout_provider_nullable", "payout_status_nullable", "created_at"];
  founders_blessings_notifications: readonly ["id", "event_id", "recipient_member_id_nullable", "notification_type", "notification_status", "public_identity_exposed", "created_at"];
  founders_blessings_outcome_confirmations: readonly ["id", "event_id", "internal_gift_id", "public_confirmation_status", "public_month", "public_year", "public_category", "public_message", "exact_value_hidden", "recipient_identity_hidden", "communication_private", "approved_for_public_display", "approved_by_admin_id", "approved_at", "created_at", "updated_at"];
  founders_blessings_private_communications: readonly ["id", "event_id", "member_id", "communication_type", "communication_channel", "message_status", "delivered_at", "read_at", "founder_message_optional", "follow_up_required", "created_at"];
}

export interface FoundersBlessingsFeatureModel {
  name: "Founder’s Blessings";
  subtitle: "An occasional expression of appreciation from the Founder to the Humanity Laws community.";
  purpose: "Offer occasional private member recognition at Founder discretion with privacy, auditability, and clear activation gates.";
  coreLanguage: string;
  extraPurchaseRequired: false;
  recipientIdentityPrivateByDefault: true;
  publicAnnouncementEnabled: false;
  automaticGiftEnabled: false;
  automaticGiftDeliveryEnabled: false;
  realMoneyMovementEnabled: false;
  randomSelectionAssist: "Secure cryptographic standard";
  founderFinalApprovalRequired: true;
  adminReleaseRequired: true;
  launchBlocking: false;
  activationBlocking: true;
  adminReviewRequired: true;
  taxAccountingReviewRequired: true;
  legalReviewRecommended: true;
  backendIntegrationRequired: true;
  readiness: FoundersBlessingsReadinessModel;
  levels: readonly string[];
  suggestedEventDateLabel: string;
  statusLabel: "In preparation";
  auditPlaceholder: string;
  candidatePoolPlaceholder: string;
  privateRecipientMessage: string;
  quietImpactCard: {
    title: "Quiet Impact";
    body: string;
    metrics: readonly string[];
  };
  privateRelationshipPrinciple: string;
  memberAutonomyPrinciple: string;
  anonymizedCommunityHistory: {
    totalBlessingsPreparedLabel: string;
    totalPrivateRecipientsLabel: string;
    archive: readonly string[];
  };
  rulesAndPrivacy: readonly string[];
  legalAdminTodos: readonly string[];
  databasePlaceholders: FoundersBlessingsDatabasePlaceholder;
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
  foundersBlessings: FoundersBlessingsFeatureModel;
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

export function createFoundersBlessingsFeatureModel(): FoundersBlessingsFeatureModel {
  const readiness = createFoundersBlessingsReadinessModel();

  return {
    name: "Founder’s Blessings",
    subtitle: "An occasional expression of appreciation from the Founder to the Humanity Laws community.",
    purpose: "Offer occasional private member recognition at Founder discretion with privacy, auditability, and clear activation gates.",
    coreLanguage:
      readiness.memberFacingCopy,
    extraPurchaseRequired: false,
    recipientIdentityPrivateByDefault: true,
    publicAnnouncementEnabled: false,
    automaticGiftEnabled: false,
    automaticGiftDeliveryEnabled: false,
    realMoneyMovementEnabled: false,
    randomSelectionAssist: "Secure cryptographic standard",
    founderFinalApprovalRequired: true,
    adminReleaseRequired: true,
    launchBlocking: false,
    activationBlocking: true,
    adminReviewRequired: true,
    taxAccountingReviewRequired: true,
    legalReviewRecommended: true,
    backendIntegrationRequired: true,
    readiness,
    levels: [
      "level_1 Active Member is active by default.",
      "level_2 Long-Term Member is future-ready and inactive.",
      "level_3 Founding Supporter is future-ready and inactive.",
      "level_4 Community Contributor is future-ready and inactive.",
      "level_5 Legacy Member is future-ready and inactive.",
      "level_6 Founder’s Circle is future-ready and inactive.",
    ],
    suggestedEventDateLabel: "Occasional Founder-selected timing; no fixed public schedule.",
    statusLabel: "In preparation",
    auditPlaceholder: "Audit ID, request ID, candidate pool hash, timestamp, and algorithm version are recorded when selection assist is used.",
    candidatePoolPlaceholder: "Eligible active paid members in good standing; exclusions are applied before any suggestion is generated.",
    privateRecipientMessage: "Congratulations. The Founder has chosen to recognize you with a Founder’s Blessing as an expression of appreciation for being part of the Humanity Laws community. Further details will be shared privately.",
    quietImpactCard: {
      title: "Quiet Impact",
      body: readiness.outcomeVerificationCopy,
      metrics: [
        "Blessings completed privately",
        "This year",
        "Last completed month",
        "Recipient privacy: Protected",
        "Communication: One-to-One",
      ],
    },
    privateRelationshipPrinciple:
      "Founder’s Blessings are a private expression of appreciation between Humanity Laws and an individual member. Official communication is one-to-one by default.",
    memberAutonomyPrinciple: readiness.memberAutonomyCopy,
    anonymizedCommunityHistory: {
      totalBlessingsPreparedLabel: "0 shown until Founder/admin/legal review is complete.",
      totalPrivateRecipientsLabel: "0 private recipients recorded.",
      archive: ["No Founder’s Blessings have been activated yet. Any future community history remains anonymized unless a recipient explicitly opts in."],
    },
    rulesAndPrivacy: [
      "Humanity Laws membership stands on its own value.",
      "Founder’s Blessings are occasional, discretionary, not guaranteed, and may vary.",
      "No extra purchase required.",
      "Recipient identity remains private unless the recipient explicitly opts in.",
      "Gift details require Founder approval, admin review, and tax/accounting review before activation.",
      "Every active paid member in good standing is included through a Founder’s Blessings profile.",
      "Eligibility pauses for canceled, refunded, banned, fraud-flagged, unpaid, duplicate, test, admin-excluded, or future jurisdiction-excluded accounts.",
      "No money movement is enabled in this package.",
      "Official platform communication remains private by default.",
      "Member sharing is voluntary and member-controlled.",
      "Humanity Laws reposting, quoting, or featuring a member story requires explicit permission.",
      "No automatic social media posting, required testimony, leaderboard, ranking, or member comparison is created.",
    ],
    legalAdminTodos: [
      "TODO: Supabase integration for founders_blessings_profiles, events, candidates, random audits, gifts, and notifications.",
      "TODO: Founder/admin review workflow before any suggested recipient becomes final.",
      "TODO: Tax/accounting review before any gift is released.",
      "TODO: Payout or gift provider integration only after separate approval.",
      "TODO: Public outcome confirmation requires admin approval and must remain anonymized by default.",
      "TODO: Private communication logs must remain role-based and audited.",
      "TODO: Legal review recommended before activation; do not activate gifts until approved.",
    ],
    databasePlaceholders: {
      founders_blessings_profiles: ["id", "member_id", "enrollment_status", "enrolled_at", "eligibility_status", "eligibility_reason", "current_level", "lifetime_blessings_received", "last_included_event_id", "last_selected_event_id", "active_member_required", "created_at", "updated_at"],
      founders_blessings_events: ["id", "event_month", "event_date", "status", "blessing_theme", "gift_type", "gift_description_private", "estimated_gift_value", "selected_member_id_nullable", "founder_approved_member_id_nullable", "founder_approval_status", "admin_review_status", "tax_accounting_review_status", "legal_review_status", "activation_status", "created_at", "updated_at"],
      founders_blessings_candidates: ["id", "event_id", "member_id", "profile_id", "eligibility_status", "exclusion_reason_nullable", "blessing_level_at_event", "created_at"],
      founders_blessings_random_audits: ["id", "event_id", "algorithm_name", "algorithm_version", "candidate_pool_hash", "request_id", "audit_hash", "created_at"],
      founders_blessings_gifts: ["id", "event_id", "recipient_member_id", "gift_type", "delivery_status", "payout_provider_nullable", "payout_status_nullable", "created_at"],
      founders_blessings_notifications: ["id", "event_id", "recipient_member_id_nullable", "notification_type", "notification_status", "public_identity_exposed", "created_at"],
      founders_blessings_outcome_confirmations: ["id", "event_id", "internal_gift_id", "public_confirmation_status", "public_month", "public_year", "public_category", "public_message", "exact_value_hidden", "recipient_identity_hidden", "communication_private", "approved_for_public_display", "approved_by_admin_id", "approved_at", "created_at", "updated_at"],
      founders_blessings_private_communications: ["id", "event_id", "member_id", "communication_type", "communication_channel", "message_status", "delivered_at", "read_at", "founder_message_optional", "follow_up_required", "created_at"],
    },
  };
}

export function createCommunityRelationshipsPlatform(): CommunityRelationshipsPlatform {
  const foundersBlessings = createFoundersBlessingsFeatureModel();

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
    foundersBlessings,
    launchReady: false,
  };
}
