export type DiscoveryQuestion =
  | "what_do_we_not_understand_well_enough"
  | "where_do_people_still_struggle"
  | "which_explanations_consistently_help"
  | "which_interventions_support_learning_or_healthier_habits"
  | "what_new_research_should_be_reviewed"
  | "where_are_the_knowledge_gaps";

export type DiscoverySignalSource =
  | "adam_eve_conversations"
  | "spark_reflections"
  | "wellness_check_ins"
  | "table_moments"
  | "podcast_reflections"
  | "community_questions"
  | "living_library_searches"
  | "founder_review"
  | "external_research_review";

export type DiscoveryReviewStatus =
  | "observed"
  | "needs_evidence"
  | "needs_human_review"
  | "ready_for_experiment"
  | "refined"
  | "archived";

export type DiscoveryEvidenceStandard =
  | "source_attribution_required"
  | "human_review_required"
  | "privacy_preserving"
  | "no_sensitive_inference"
  | "professional_boundary_required_when_relevant"
  | "no_false_certainty";

export interface DiscoveryLearningLoop {
  sequence: readonly ["vision", "belief", "experiment", "evidence", "refinement", "trust"];
  beliefStartsJourney: true;
  evidenceSustainsTrust: true;
  completionNeverAssumed: true;
}

export interface DiscoveryGap {
  id: string;
  question: DiscoveryQuestion;
  source: DiscoverySignalSource;
  description: string;
  relatedDomain: string;
  status: DiscoveryReviewStatus;
  requiredEvidence: readonly DiscoveryEvidenceStandard[];
  memberContentStored: false;
}

export interface ExplanationEffectivenessSignal {
  id: string;
  topic: string;
  explanationHelped: "unknown" | "likely" | "needs_review";
  learnerDepth: "beginner" | "intermediate" | "advanced" | "professional_overview";
  nextReviewStep: "compare_explanations" | "request_human_review" | "look_for_better_sources" | "preserve_current_explanation";
  exposesPrivateContent: false;
}

export interface ResearchReviewItem {
  id: string;
  topic: string;
  whyReview: string;
  status: "not_started" | "source_needed" | "under_review" | "accepted_with_context" | "rejected_or_deferred";
  mustPreserve: readonly ["source_attribution", "limitations", "confidence_level", "competing_viewpoints", "professional_boundaries"];
}

export interface DiscoveryEngine {
  name: "Discovery Engine";
  purpose: string;
  coreQuestions: readonly DiscoveryQuestion[];
  signalSources: readonly DiscoverySignalSource[];
  learningLoop: DiscoveryLearningLoop;
  evidenceStandards: readonly DiscoveryEvidenceStandard[];
  defaultGaps: readonly DiscoveryGap[];
  explanationSignals: readonly ExplanationEffectivenessSignal[];
  researchReviewQueue: readonly ResearchReviewItem[];
  adamEveDiscoveryPolicy: {
    may: readonly ["notice_confusion_patterns", "suggest_clearer_explanations", "recommend_learning_paths", "surface_open_questions", "invite_human_review"];
    mustNever: readonly ["claim_finished_knowledge", "invent_evidence", "store_sensitive_content_unnecessarily", "override_human_judgment", "replace_professional_review"];
    consentAware: true;
    aiTransparencyRequired: true;
  };
  launchReady: false;
}

export const DiscoveryCoreQuestions: readonly DiscoveryQuestion[] = [
  "what_do_we_not_understand_well_enough",
  "where_do_people_still_struggle",
  "which_explanations_consistently_help",
  "which_interventions_support_learning_or_healthier_habits",
  "what_new_research_should_be_reviewed",
  "where_are_the_knowledge_gaps",
];

export const DiscoverySignalSources: readonly DiscoverySignalSource[] = [
  "adam_eve_conversations",
  "spark_reflections",
  "wellness_check_ins",
  "table_moments",
  "podcast_reflections",
  "community_questions",
  "living_library_searches",
  "founder_review",
  "external_research_review",
];

export function createDiscoveryGap(overrides: Partial<DiscoveryGap> = {}): DiscoveryGap {
  return {
    id: overrides.id ?? "gap-clearer-explanation",
    question: overrides.question ?? "which_explanations_consistently_help",
    source: overrides.source ?? "adam_eve_conversations",
    description: overrides.description ?? "A repeated member question may need a clearer, simpler explanation.",
    relatedDomain: overrides.relatedDomain ?? "human_mind",
    status: overrides.status ?? "needs_evidence",
    requiredEvidence: overrides.requiredEvidence ?? ["source_attribution_required", "human_review_required", "privacy_preserving", "no_sensitive_inference", "no_false_certainty"],
    memberContentStored: false,
  };
}

export function createResearchReviewItem(overrides: Partial<ResearchReviewItem> = {}): ResearchReviewItem {
  return {
    id: overrides.id ?? "research-review-open-question",
    topic: overrides.topic ?? "open learning question",
    whyReview: overrides.whyReview ?? "The system should review credible sources before updating educational guidance.",
    status: overrides.status ?? "source_needed",
    mustPreserve: overrides.mustPreserve ?? ["source_attribution", "limitations", "confidence_level", "competing_viewpoints", "professional_boundaries"],
  };
}

export function createDiscoveryEngine(): DiscoveryEngine {
  return {
    name: "Discovery Engine",
    purpose: "Turn vision and belief into experiments, evidence, refinement, and earned trust by identifying what Humanity Laws still needs to understand better.",
    coreQuestions: DiscoveryCoreQuestions,
    signalSources: DiscoverySignalSources,
    learningLoop: {
      sequence: ["vision", "belief", "experiment", "evidence", "refinement", "trust"],
      beliefStartsJourney: true,
      evidenceSustainsTrust: true,
      completionNeverAssumed: true,
    },
    evidenceStandards: ["source_attribution_required", "human_review_required", "privacy_preserving", "no_sensitive_inference", "professional_boundary_required_when_relevant", "no_false_certainty"],
    defaultGaps: [
      createDiscoveryGap({
        id: "gap-people-still-struggle",
        question: "where_do_people_still_struggle",
        source: "spark_reflections",
        description: "A repeated struggle may need a better pathway from reflection to support.",
        relatedDomain: "human_mind",
        status: "needs_human_review",
      }),
      createDiscoveryGap({
        id: "gap-healthier-habits",
        question: "which_interventions_support_learning_or_healthier_habits",
        source: "wellness_check_ins",
        description: "A wellness pattern should be reviewed as educational support, not medical intervention.",
        relatedDomain: "human_being",
        status: "needs_evidence",
        requiredEvidence: ["source_attribution_required", "human_review_required", "privacy_preserving", "professional_boundary_required_when_relevant", "no_false_certainty"],
      }),
    ],
    explanationSignals: [
      {
        id: "signal-explanation-helpfulness",
        topic: "clearer learning path",
        explanationHelped: "unknown",
        learnerDepth: "beginner",
        nextReviewStep: "compare_explanations",
        exposesPrivateContent: false,
      },
    ],
    researchReviewQueue: [
      createResearchReviewItem({
        id: "research-emerging-evidence",
        topic: "emerging evidence review",
        whyReview: "New research should be incorporated only after source review, limitations, and confidence are recorded.",
        status: "source_needed",
      }),
    ],
    adamEveDiscoveryPolicy: {
      may: ["notice_confusion_patterns", "suggest_clearer_explanations", "recommend_learning_paths", "surface_open_questions", "invite_human_review"],
      mustNever: ["claim_finished_knowledge", "invent_evidence", "store_sensitive_content_unnecessarily", "override_human_judgment", "replace_professional_review"],
      consentAware: true,
      aiTransparencyRequired: true,
    },
    launchReady: false,
  };
}
