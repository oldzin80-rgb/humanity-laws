export type ContinuityRoom =
  | "dashboard"
  | "spark"
  | "adam_eve"
  | "wellness"
  | "podcast"
  | "the_table"
  | "community"
  | "founder_letters"
  | "library"
  | "social_command_center"
  | "growth_platform"
  | "universal_knowledge_foundation"
  | "discovery_engine";

export type NaturalNextStep =
  | "reflect"
  | "discuss_with_adam_eve"
  | "save"
  | "continue_learning"
  | "try_a_practice"
  | "share_at_the_table"
  | "join_a_community_discussion"
  | "read_related_book_theme";

export type PreservedContextKey =
  | "current_theme"
  | "pillar"
  | "reflection"
  | "wellness_topic"
  | "podcast_topic"
  | "saved_note"
  | "learning_path"
  | "member_preference"
  | "quiet_period";

export type FrictionRisk =
  | "too_many_ctas"
  | "abrupt_page_endings"
  | "repeated_explanations"
  | "disconnected_modules"
  | "overwhelming_suggestions"
  | "unclear_return_paths";

export interface ExperienceTransitionEngine {
  smoothHandoffs: true;
  explainsSuggestedNextStep: true;
  preservesMemberContext: true;
  avoidsDeadEnds: true;
  forcedContinuation: false;
}

export interface RoomContinuityConnection {
  from: ContinuityRoom;
  to: ContinuityRoom;
  reason: string;
  forced: false;
}

export interface NaturalNextStepRule {
  room: ContinuityRoom;
  steps: readonly NaturalNextStep[];
  maxVisible: 1 | 2 | 3;
  memberCanIgnore: true;
}

export interface GentleTransitionCopy {
  phrases: readonly ["You can continue here.", "You may want to reflect on this.", "This connects to…", "Save this for later.", "Discuss this with Adam & Eve.", "Return to your journey."];
  shortWarmAndOptional: true;
}

export interface ContextPreservationStandard {
  carriesForward: readonly PreservedContextKey[];
  consentAware: true;
  quietPeriodRespected: true;
  noFalseMemoryClaims: true;
}

export interface FrictionAuditStandard {
  prevents: readonly FrictionRisk[];
  maxPrimaryActionsPerRoom: 1;
  maxVisibleNextSteps: 3;
  deadEndsAllowed: false;
}

export interface MotionComfortStandard {
  smoothTransitions: true;
  subtleAnimationsOnly: true;
  noDistractingMovement: true;
  reducedMotionFallback: true;
  mobileFirstComfort: true;
}

export interface AdamEveHandoffPolicy {
  may: readonly ["summarize_what_happened", "suggest_next_step", "remember_context_with_consent", "ask_if_member_wants_to_continue"];
  mustNever: readonly ["pressure", "over_explain", "force_continuation", "create_dependency"];
  humanChoiceRequired: true;
}

export interface JourneyBreadcrumbStandard {
  markers: readonly ["where_you_are", "where_you_came_from", "where_you_can_go_next", "what_was_saved"];
  calmLanguage: true;
}

export interface NaturalContinuityFlowLayer {
  name: "Natural Continuity & Flow Layer";
  purpose: string;
  transitionEngine: ExperienceTransitionEngine;
  roomContinuityMap: readonly RoomContinuityConnection[];
  nextStepRules: readonly NaturalNextStepRule[];
  gentleCopy: GentleTransitionCopy;
  contextPreservation: ContextPreservationStandard;
  frictionAudit: FrictionAuditStandard;
  motionComfort: MotionComfortStandard;
  adamEveHandoff: AdamEveHandoffPolicy;
  journeyBreadcrumbs: JourneyBreadcrumbStandard;
  wholeHouseQuestions: readonly ["What is this?", "Why does it matter?", "What can I do next?", "How does it connect to the rest of Humanity Laws?"];
  launchReady: false;
}

export const DefaultRoomContinuityMap: readonly RoomContinuityConnection[] = [
  { from: "dashboard", to: "spark", reason: "The Dashboard should surface one clear daily practice.", forced: false },
  { from: "spark", to: "adam_eve", reason: "A Spark can become a conversation when the member wants reflection.", forced: false },
  { from: "adam_eve", to: "library", reason: "A useful insight can be saved for later.", forced: false },
  { from: "wellness", to: "the_table", reason: "Wellness becomes more human when it connects to meals, gratitude, and relationship.", forced: false },
  { from: "podcast", to: "founder_letters", reason: "A listening reflection can lead to the Founder’s written context.", forced: false },
  { from: "founder_letters", to: "community", reason: "Founder stewardship can invite thoughtful discussion after review.", forced: false },
  { from: "community", to: "the_table", reason: "Community should lead toward hospitality and real connection.", forced: false },
  { from: "library", to: "universal_knowledge_foundation", reason: "Saved learning should trace back into the shared knowledge foundation.", forced: false },
  { from: "universal_knowledge_foundation", to: "discovery_engine", reason: "Open questions and gaps should flow into discovery instead of false certainty.", forced: false },
  { from: "social_command_center", to: "growth_platform", reason: "Campaign work belongs inside human-approved growth and communications.", forced: false },
];

export function createNaturalContinuityFlowLayer(): NaturalContinuityFlowLayer {
  return {
    name: "Natural Continuity & Flow Layer",
    purpose: "Make Humanity Laws feel smooth, connected, natural, and emotionally coherent across every room without forcing the member.",
    transitionEngine: {
      smoothHandoffs: true,
      explainsSuggestedNextStep: true,
      preservesMemberContext: true,
      avoidsDeadEnds: true,
      forcedContinuation: false,
    },
    roomContinuityMap: DefaultRoomContinuityMap,
    nextStepRules: [
      { room: "dashboard", steps: ["reflect", "continue_learning", "discuss_with_adam_eve"], maxVisible: 3, memberCanIgnore: true },
      { room: "spark", steps: ["reflect", "discuss_with_adam_eve", "save"], maxVisible: 3, memberCanIgnore: true },
      { room: "wellness", steps: ["try_a_practice", "reflect", "share_at_the_table"], maxVisible: 3, memberCanIgnore: true },
      { room: "podcast", steps: ["reflect", "discuss_with_adam_eve", "save"], maxVisible: 3, memberCanIgnore: true },
      { room: "the_table", steps: ["share_at_the_table", "save", "discuss_with_adam_eve"], maxVisible: 3, memberCanIgnore: true },
      { room: "community", steps: ["join_a_community_discussion", "share_at_the_table", "continue_learning"], maxVisible: 3, memberCanIgnore: true },
      { room: "library", steps: ["continue_learning", "read_related_book_theme", "discuss_with_adam_eve"], maxVisible: 3, memberCanIgnore: true },
    ],
    gentleCopy: {
      phrases: ["You can continue here.", "You may want to reflect on this.", "This connects to…", "Save this for later.", "Discuss this with Adam & Eve.", "Return to your journey."],
      shortWarmAndOptional: true,
    },
    contextPreservation: {
      carriesForward: ["current_theme", "pillar", "reflection", "wellness_topic", "podcast_topic", "saved_note", "learning_path", "member_preference", "quiet_period"],
      consentAware: true,
      quietPeriodRespected: true,
      noFalseMemoryClaims: true,
    },
    frictionAudit: {
      prevents: ["too_many_ctas", "abrupt_page_endings", "repeated_explanations", "disconnected_modules", "overwhelming_suggestions", "unclear_return_paths"],
      maxPrimaryActionsPerRoom: 1,
      maxVisibleNextSteps: 3,
      deadEndsAllowed: false,
    },
    motionComfort: {
      smoothTransitions: true,
      subtleAnimationsOnly: true,
      noDistractingMovement: true,
      reducedMotionFallback: true,
      mobileFirstComfort: true,
    },
    adamEveHandoff: {
      may: ["summarize_what_happened", "suggest_next_step", "remember_context_with_consent", "ask_if_member_wants_to_continue"],
      mustNever: ["pressure", "over_explain", "force_continuation", "create_dependency"],
      humanChoiceRequired: true,
    },
    journeyBreadcrumbs: {
      markers: ["where_you_are", "where_you_came_from", "where_you_can_go_next", "what_was_saved"],
      calmLanguage: true,
    },
    wholeHouseQuestions: ["What is this?", "Why does it matter?", "What can I do next?", "How does it connect to the rest of Humanity Laws?"],
    launchReady: false,
  };
}
