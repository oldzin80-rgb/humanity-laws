import { createUniversalKnowledgeFoundation, type UniversalKnowledgeFoundation } from "./universalKnowledgeFoundation.js";
import { createDiscoveryEngine, type DiscoveryEngine } from "./discoveryEngine.js";
import { createNaturalContinuityFlowLayer, type NaturalContinuityFlowLayer } from "./naturalContinuityFlow.js";
import { createPerformanceSpeedGuardian, type PerformanceSpeedGuardian } from "./performanceSpeedGuardian.js";
import { createFinalExperienceLayer, type FinalExperienceLayer } from "./finalExperienceLayer.js";

export type MemberJourneyStage =
  | "new_member"
  | "returning_member"
  | "active_member"
  | "quiet_member"
  | "founder_engaged_member"
  | "community_ready_member";

export type EcosystemExperience =
  | "spark"
  | "adam_eve"
  | "council"
  | "book"
  | "podcast"
  | "founder_letter"
  | "wellness"
  | "the_table"
  | "community"
  | "living_library";

export type OrchestrationSignal =
  | "new_vs_returning"
  | "membership_status"
  | "book_ownership"
  | "spark_history"
  | "podcast_activity"
  | "wellness_engagement"
  | "community_participation"
  | "founder_content_viewed"
  | "quiet_period";

export type JourneyTimelineEventType =
  | "reflection_saved"
  | "spark_saved"
  | "wellness_milestone"
  | "community_participation"
  | "founder_message_viewed"
  | "personal_note"
  | "book_theme_viewed";

export interface MemberExperienceContext {
  memberId: string;
  journeyStage: MemberJourneyStage;
  isReturningMember: boolean;
  membershipStatus: "FREE" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  ownsBook: boolean;
  sparkHistoryCount: number;
  podcastActivityCount: number;
  wellnessEngagementCount: number;
  communityParticipationCount: number;
  founderContentViewedCount: number;
  quietMode: boolean;
  preferredPace: "light" | "balanced" | "deep";
}

export interface ExperienceRecommendation {
  id: string;
  experience: EcosystemExperience;
  title: string;
  reason: string;
  href: string;
  priority: "low" | "medium" | "high";
  optional: true;
  userCanDismiss: true;
  transparentReason: string;
}

export interface JourneyTimelineEvent {
  id: string;
  type: JourneyTimelineEventType;
  title: string;
  sourceExperience: EcosystemExperience;
  createdAt: string;
  memberOwned: true;
  exportable: true;
  deletable: true;
}

export interface NotificationIntelligenceSettings {
  cadence: "quiet" | "normal" | "paused";
  maxRecommendationsPerDay: 1 | 2 | 3;
  quietPeriodsRespected: true;
  easyToCustomize: true;
  excessiveReminderProtection: true;
}

export interface CrossSystemConnection {
  from: EcosystemExperience;
  to: EcosystemExperience;
  example: string;
  forced: false;
}

export interface AdamEveOrchestrationPolicy {
  may: readonly ["explain_recommendations", "connect_experiences", "summarize_progress"];
  mustNever: readonly ["override_user_choices", "automatically_complete_actions", "pressure_engagement"];
  aiTransparencyRequired: true;
  humanControlRequired: true;
}

export interface FounderStewardshipDashboardModel {
  aggregatedOnly: true;
  privacyPreserving: true;
  visibleSignals: readonly ["journey_patterns", "feature_engagement", "content_performance", "ecosystem_health", "areas_needing_improvement"];
  noIndividualSurveillance: true;
}

export interface ExperienceOrchestratorResult {
  context: MemberExperienceContext;
  signalsConsidered: readonly OrchestrationSignal[];
  recommendations: readonly ExperienceRecommendation[];
  timeline: readonly JourneyTimelineEvent[];
  notificationSettings: NotificationIntelligenceSettings;
  crossSystemConnections: readonly CrossSystemConnection[];
  adamEvePolicy: AdamEveOrchestrationPolicy;
  founderStewardshipDashboard: FounderStewardshipDashboardModel;
  universalKnowledgeFoundation: UniversalKnowledgeFoundation;
  discoveryEngine: DiscoveryEngine;
  naturalContinuityFlow: NaturalContinuityFlowLayer;
  performanceSpeedGuardian: PerformanceSpeedGuardian;
  finalExperienceLayer: FinalExperienceLayer;
  attentionManagement: readonly ["avoid_overwhelm", "space_recommendations", "respect_quiet_periods", "limit_visible_next_steps"];
  coreRules: readonly ["recommendations_are_optional", "user_autonomy_first", "no_manipulative_engagement", "no_dark_patterns", "privacy_by_design", "transparent_reasoning"];
  launchReady: false;
}

export const OrchestrationSignals: readonly OrchestrationSignal[] = [
  "new_vs_returning",
  "membership_status",
  "book_ownership",
  "spark_history",
  "podcast_activity",
  "wellness_engagement",
  "community_participation",
  "founder_content_viewed",
  "quiet_period",
];

export const DefaultCrossSystemConnections: readonly CrossSystemConnection[] = [
  { from: "spark", to: "podcast", example: "A Spark can lead to a related Podcast reflection.", forced: false },
  { from: "podcast", to: "founder_letter", example: "A Podcast can lead to a Founder Letter for deeper context.", forced: false },
  { from: "wellness", to: "the_table", example: "A wellness goal can connect to a shared meal or gratitude prompt.", forced: false },
  { from: "founder_letter", to: "community", example: "A Founder Letter can suggest a thoughtful community discussion.", forced: false },
  { from: "book", to: "adam_eve", example: "A book theme can become an Adam and Eve reflection.", forced: false },
  { from: "council", to: "living_library", example: "A Council outcome can be saved for later review.", forced: false },
];

export function createMemberExperienceContext(overrides: Partial<MemberExperienceContext> = {}): MemberExperienceContext {
  return {
    memberId: overrides.memberId ?? "member",
    journeyStage: overrides.journeyStage ?? (overrides.isReturningMember ? "returning_member" : "new_member"),
    isReturningMember: overrides.isReturningMember ?? false,
    membershipStatus: overrides.membershipStatus ?? "ACTIVE",
    ownsBook: overrides.ownsBook ?? true,
    sparkHistoryCount: overrides.sparkHistoryCount ?? 0,
    podcastActivityCount: overrides.podcastActivityCount ?? 0,
    wellnessEngagementCount: overrides.wellnessEngagementCount ?? 0,
    communityParticipationCount: overrides.communityParticipationCount ?? 0,
    founderContentViewedCount: overrides.founderContentViewedCount ?? 0,
    quietMode: overrides.quietMode ?? false,
    preferredPace: overrides.preferredPace ?? "light",
  };
}

export function createJourneyTimeline(context: MemberExperienceContext): readonly JourneyTimelineEvent[] {
  const createdAt = "future_member_owned_timestamp";
  const timeline: JourneyTimelineEvent[] = [];

  if (context.sparkHistoryCount > 0) {
    timeline.push({ id: "timeline-spark", type: "spark_saved", title: "Saved Spark", sourceExperience: "spark", createdAt, memberOwned: true, exportable: true, deletable: true });
  }
  if (context.wellnessEngagementCount > 0) {
    timeline.push({ id: "timeline-wellness", type: "wellness_milestone", title: "Wellness milestone", sourceExperience: "wellness", createdAt, memberOwned: true, exportable: true, deletable: true });
  }
  if (context.communityParticipationCount > 0) {
    timeline.push({ id: "timeline-community", type: "community_participation", title: "Community moment", sourceExperience: "community", createdAt, memberOwned: true, exportable: true, deletable: true });
  }
  if (context.founderContentViewedCount > 0) {
    timeline.push({ id: "timeline-founder", type: "founder_message_viewed", title: "Founder message viewed", sourceExperience: "founder_letter", createdAt, memberOwned: true, exportable: true, deletable: true });
  }

  return timeline.length
    ? timeline
    : [{ id: "timeline-start", type: "personal_note", title: "Journey begins", sourceExperience: "living_library", createdAt, memberOwned: true, exportable: true, deletable: true }];
}

export function recommendNextExperiences(context: MemberExperienceContext): readonly ExperienceRecommendation[] {
  if (context.quietMode) {
    return [
      {
        id: "quiet-continue-reading",
        experience: "book",
        title: "Continue Reading",
        reason: "Quiet mode is on, so one calm reading step is enough.",
        href: "/book",
        priority: "low",
        optional: true,
        userCanDismiss: true,
        transparentReason: "You asked for a quieter pace.",
      },
    ];
  }

  const recommendations: ExperienceRecommendation[] = [];

  if (context.sparkHistoryCount === 0) {
    recommendations.push({
      id: "start-spark",
      experience: "spark",
      title: "Start today's Spark",
      reason: "A first Spark gives the member one clear daily reflection.",
      href: "/spark",
      priority: "high",
      optional: true,
      userCanDismiss: true,
      transparentReason: "No saved Spark is visible yet.",
    });
  }

  if (context.ownsBook && context.sparkHistoryCount > 0) {
    recommendations.push({
      id: "discuss-with-adam-eve",
      experience: "adam_eve",
      title: "Discuss with Adam & Eve",
      reason: "A saved Spark can become a grounded conversation.",
      href: "/council",
      priority: "medium",
      optional: true,
      userCanDismiss: true,
      transparentReason: "Your Spark history suggests a conversation may help.",
    });
  }

  if (context.wellnessEngagementCount > 0) {
    recommendations.push({
      id: "wellness-to-table",
      experience: "the_table",
      title: "Bring it to The Table",
      reason: "Wellness becomes more human when it connects to gratitude and shared life.",
      href: "/table",
      priority: "medium",
      optional: true,
      userCanDismiss: true,
      transparentReason: "Wellness activity is present, so a connection prompt may fit.",
    });
  }

  if (context.founderContentViewedCount > 0 && context.communityParticipationCount === 0) {
    recommendations.push({
      id: "founder-to-community",
      experience: "community",
      title: "Consider a community reflection",
      reason: "Founder content can become a thoughtful discussion when community tools are verified.",
      href: "/community",
      priority: "low",
      optional: true,
      userCanDismiss: true,
      transparentReason: "Founder content was viewed recently.",
    });
  }

  return recommendations.slice(0, context.preferredPace === "deep" ? 3 : context.preferredPace === "balanced" ? 2 : 1);
}

export function createExperienceOrchestrator(context: MemberExperienceContext = createMemberExperienceContext()): ExperienceOrchestratorResult {
  return {
    context,
    signalsConsidered: OrchestrationSignals,
    recommendations: recommendNextExperiences(context),
    timeline: createJourneyTimeline(context),
    notificationSettings: {
      cadence: context.quietMode ? "quiet" : "normal",
      maxRecommendationsPerDay: context.preferredPace === "deep" ? 3 : context.preferredPace === "balanced" ? 2 : 1,
      quietPeriodsRespected: true,
      easyToCustomize: true,
      excessiveReminderProtection: true,
    },
    crossSystemConnections: DefaultCrossSystemConnections,
    adamEvePolicy: {
      may: ["explain_recommendations", "connect_experiences", "summarize_progress"],
      mustNever: ["override_user_choices", "automatically_complete_actions", "pressure_engagement"],
      aiTransparencyRequired: true,
      humanControlRequired: true,
    },
    founderStewardshipDashboard: {
      aggregatedOnly: true,
      privacyPreserving: true,
      visibleSignals: ["journey_patterns", "feature_engagement", "content_performance", "ecosystem_health", "areas_needing_improvement"],
      noIndividualSurveillance: true,
    },
    universalKnowledgeFoundation: createUniversalKnowledgeFoundation(),
    discoveryEngine: createDiscoveryEngine(),
    naturalContinuityFlow: createNaturalContinuityFlowLayer(),
    performanceSpeedGuardian: createPerformanceSpeedGuardian(),
    finalExperienceLayer: createFinalExperienceLayer(),
    attentionManagement: ["avoid_overwhelm", "space_recommendations", "respect_quiet_periods", "limit_visible_next_steps"],
    coreRules: ["recommendations_are_optional", "user_autonomy_first", "no_manipulative_engagement", "no_dark_patterns", "privacy_by_design", "transparent_reasoning"],
    launchReady: false,
  };
}
