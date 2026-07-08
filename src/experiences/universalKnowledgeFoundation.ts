import { createDiscoveryEngine, type DiscoveryEngine } from "./discoveryEngine.js";

export type GrandKnowledgeDomainId =
  | "human_being"
  | "human_mind"
  | "human_relationships"
  | "human_meaning"
  | "health_and_wellness_traditions"
  | "science"
  | "society"
  | "arts"
  | "humanity_contributors";

export type LearnerAudience =
  | "child"
  | "teenager"
  | "adult"
  | "parent"
  | "teacher"
  | "physician"
  | "engineer"
  | "beginner"
  | "expert";

export type LearningDepth = "beginner" | "intermediate" | "advanced" | "professional_overview";

export type EvidenceConfidence = "established_consensus" | "emerging_evidence" | "historical_context" | "competing_viewpoints" | "open_question";

export type KnowledgeConsumer =
  | "adam_eve"
  | "spark"
  | "wellness"
  | "the_table"
  | "community"
  | "founder"
  | "podcast"
  | "living_library"
  | "experience_orchestrator"
  | "future_systems";

export interface GrandKnowledgeDomain {
  id: GrandKnowledgeDomainId;
  title: string;
  purpose: string;
  topics: readonly string[];
  sourcePolicy: "requires_attribution_and_evidence_context";
}

export interface HealthTraditionKnowledgeStandard {
  traditions: readonly string[];
  requiredContext: readonly ["history", "principles", "contributions", "strengths", "limitations", "current_evidence", "respectful_cultural_context"];
  educationalOnly: true;
  noMedicalReplacement: true;
  noDiagnosisOrPrescription: true;
}

export interface ContributorProfileStandard {
  requiredFields: readonly ["biography", "major_discoveries", "why_work_mattered", "influence_on_humanity", "later_developments", "related_thinkers", "important_debates", "practical_lessons"];
  manyCulturesTimePeriodsAndPerspectives: true;
  noHeroWorship: true;
  debateAndLimitationsRequired: true;
}

export interface KnowledgeConnection {
  from: string;
  to: string;
  relationship: string;
  forced: false;
}

export interface UniversalCommunicationGuidance {
  audience: LearnerAudience;
  depth: LearningDepth;
  style: string;
  truthMustRemainConsistent: true;
  communicationMayAdapt: true;
}

export interface LearningEngineStandard {
  depths: readonly LearningDepth[];
  lessonParts: readonly ["explanation", "examples", "diagrams", "stories", "discussion_questions", "practical_applications", "related_humanity_laws_themes"];
  learnerChoiceFirst: true;
}

export interface LivingKnowledgeStandard {
  tracks: readonly EvidenceConfidence[];
  confidenceLevelRequired: true;
  competingViewpointsAllowed: true;
  openQuestionsPreserved: true;
  noFalseCertainty: true;
}

export interface WisdomLayerStandard {
  questions: readonly string[];
  knowledgeIsNotEnough: true;
  humanDecisionMaker: true;
}

export interface HumanFlourishingIndexStandard {
  dimensions: readonly ["physical", "mental", "emotional", "relational", "intellectual", "purpose", "service", "stewardship"];
  reflectionAndGrowthOnly: true;
  noJudgmentScore: true;
}

export interface UniversalKnowledgeFoundation {
  name: "Universal Human Knowledge Foundation";
  mission: string;
  sharedLayerFor: readonly KnowledgeConsumer[];
  domains: readonly GrandKnowledgeDomain[];
  healthTraditions: HealthTraditionKnowledgeStandard;
  contributorProfiles: ContributorProfileStandard;
  connectionEngine: readonly KnowledgeConnection[];
  communicationEngine: readonly UniversalCommunicationGuidance[];
  learningEngine: LearningEngineStandard;
  livingKnowledge: LivingKnowledgeStandard;
  wisdomLayer: WisdomLayerStandard;
  flourishingIndex: HumanFlourishingIndexStandard;
  discoveryEngine: DiscoveryEngine;
  constitutionalPrinciples: readonly string[];
  sourceRules: readonly ["humanity_laws_book_remains_constitutional_source", "about_nick_supports_but_does_not_replace_source", "knowledge_requires_attribution", "humans_remain_responsible_for_choices"];
  adamEveKnowledgeGuides: {
    may: readonly ["teach", "compare_viewpoints", "explain_evidence", "summarize_research", "connect_disciplines", "recommend_further_learning", "remember_interests_with_consent", "personalize_learning_paths"];
    mustNever: readonly ["present_as_infallible", "replace_professionals", "claim_total_certainty", "override_human_decision"];
    aiTransparencyRequired: true;
  };
  launchReady: false;
}

export const GrandKnowledgeDomains: readonly GrandKnowledgeDomain[] = [
  {
    id: "human_being",
    title: "Human Being",
    purpose: "Understand the body, development, aging, movement, recovery, and human performance without turning education into medical authority.",
    topics: ["anatomy", "physiology", "neuroscience", "genetics", "development", "aging", "movement", "nutrition", "sleep", "recovery", "pain_science", "longevity", "human_performance"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
  {
    id: "human_mind",
    title: "Human Mind",
    purpose: "Explain psychology, cognition, learning, emotion, habits, creativity, resilience, and decision-making with humility.",
    topics: ["psychology", "psychiatry", "cognitive_science", "behavioral_science", "emotional_intelligence", "memory", "learning", "motivation", "identity", "habits", "creativity", "decision_making", "attention", "resilience"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
  {
    id: "human_relationships",
    title: "Human Relationships",
    purpose: "Support understanding of family, friendship, leadership, teams, hospitality, mentorship, service, and community.",
    topics: ["marriage", "family", "parenting", "friendship", "leadership", "teams", "communication", "conflict_resolution", "hospitality", "community", "mentorship", "service"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
  {
    id: "human_meaning",
    title: "Human Meaning",
    purpose: "Preserve philosophy, ethics, spiritual traditions, gratitude, hope, love, stewardship, and legacy without forcing belief.",
    topics: ["philosophy", "ethics", "world_religions", "spiritual_traditions", "contemplative_practices", "purpose", "gratitude", "forgiveness", "hope", "love", "stewardship", "legacy"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
  {
    id: "health_and_wellness_traditions",
    title: "Health & Wellness Traditions",
    purpose: "Teach traditions respectfully with history, limitations, evidence context, and clear medical boundaries.",
    topics: ["modern_medicine", "preventive_medicine", "lifestyle_medicine", "public_health", "traditional_chinese_medicine", "ayurveda", "indigenous_healing_traditions", "native_american_traditions", "herbal_traditions", "yoga", "meditation", "breathwork", "mindfulness", "physical_therapy", "occupational_therapy", "exercise_science"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
  {
    id: "science",
    title: "Science",
    purpose: "Organize scientific understanding, methods, uncertainty, discovery, and technology with evidence-first humility.",
    topics: ["physics", "chemistry", "biology", "astronomy", "earth_sciences", "ecology", "climate_science", "mathematics", "computer_science", "artificial_intelligence"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
  {
    id: "society",
    title: "Society",
    purpose: "Help members understand history, institutions, economics, law, education, agriculture, business, media, and innovation.",
    topics: ["history", "economics", "government", "law", "education", "agriculture", "architecture", "business", "innovation", "technology", "media"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
  {
    id: "arts",
    title: "Arts",
    purpose: "Preserve creative understanding across music, literature, design, visual art, film, photography, and story.",
    topics: ["music", "literature", "design", "painting", "sculpture", "film", "photography", "storytelling"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
  {
    id: "humanity_contributors",
    title: "Humanity’s Contributors",
    purpose: "Create sourced educational profiles for influential contributors across disciplines, cultures, time periods, and perspectives.",
    topics: ["biography", "discoveries", "influence", "later_developments", "related_thinkers", "debates", "practical_lessons"],
    sourcePolicy: "requires_attribution_and_evidence_context",
  },
];

export const DefaultKnowledgeConnections: readonly KnowledgeConnection[] = [
  { from: "nutrition", to: "sleep", relationship: "Food, timing, and hydration can influence rest and recovery.", forced: false },
  { from: "sleep", to: "brain", relationship: "Sleep supports learning, memory, mood, and attention.", forced: false },
  { from: "brain", to: "exercise", relationship: "Movement can support cognitive and emotional functioning.", forced: false },
  { from: "exercise", to: "stress", relationship: "Movement and recovery can shape the body's stress response.", forced: false },
  { from: "stress", to: "relationships", relationship: "Stress affects communication, patience, conflict, and belonging.", forced: false },
  { from: "relationships", to: "purpose", relationship: "Connection can help people discover meaning, service, and stewardship.", forced: false },
];

export function createUniversalCommunicationGuidance(audience: LearnerAudience, depth: LearningDepth): UniversalCommunicationGuidance {
  const styleByAudience: Record<LearnerAudience, string> = {
    child: "Use simple language, concrete examples, warmth, and no fear-based framing.",
    teenager: "Use respect, relevance, directness, and room for questions.",
    adult: "Use clear explanation, practical context, and tradeoffs.",
    parent: "Connect ideas to care, responsibility, patience, and family life.",
    teacher: "Provide structure, examples, discussion questions, and learning sequence.",
    physician: "Use professional overview language, evidence context, uncertainty, and boundaries.",
    engineer: "Use systems, mechanisms, tradeoffs, and clear assumptions.",
    beginner: "Start with plain definitions and one useful application.",
    expert: "Keep nuance, debate, limitations, and references visible.",
  };

  return {
    audience,
    depth,
    style: styleByAudience[audience],
    truthMustRemainConsistent: true,
    communicationMayAdapt: true,
  };
}

export function createUniversalKnowledgeFoundation(): UniversalKnowledgeFoundation {
  return {
    name: "Universal Human Knowledge Foundation",
    mission: "Organize humanity's accumulated knowledge so people can better understand themselves, others, and the world while remaining responsible for their choices.",
    sharedLayerFor: ["adam_eve", "spark", "wellness", "the_table", "community", "founder", "podcast", "living_library", "experience_orchestrator", "future_systems"],
    domains: GrandKnowledgeDomains,
    healthTraditions: {
      traditions: ["modern_medicine", "preventive_medicine", "lifestyle_medicine", "public_health", "traditional_chinese_medicine", "ayurveda", "indigenous_healing_traditions", "native_american_traditions", "herbal_traditions", "yoga", "meditation", "breathwork", "mindfulness", "physical_therapy", "occupational_therapy", "exercise_science"],
      requiredContext: ["history", "principles", "contributions", "strengths", "limitations", "current_evidence", "respectful_cultural_context"],
      educationalOnly: true,
      noMedicalReplacement: true,
      noDiagnosisOrPrescription: true,
    },
    contributorProfiles: {
      requiredFields: ["biography", "major_discoveries", "why_work_mattered", "influence_on_humanity", "later_developments", "related_thinkers", "important_debates", "practical_lessons"],
      manyCulturesTimePeriodsAndPerspectives: true,
      noHeroWorship: true,
      debateAndLimitationsRequired: true,
    },
    connectionEngine: DefaultKnowledgeConnections,
    communicationEngine: [
      createUniversalCommunicationGuidance("child", "beginner"),
      createUniversalCommunicationGuidance("teenager", "beginner"),
      createUniversalCommunicationGuidance("adult", "intermediate"),
      createUniversalCommunicationGuidance("parent", "intermediate"),
      createUniversalCommunicationGuidance("teacher", "advanced"),
      createUniversalCommunicationGuidance("physician", "professional_overview"),
      createUniversalCommunicationGuidance("engineer", "advanced"),
      createUniversalCommunicationGuidance("expert", "advanced"),
    ],
    learningEngine: {
      depths: ["beginner", "intermediate", "advanced", "professional_overview"],
      lessonParts: ["explanation", "examples", "diagrams", "stories", "discussion_questions", "practical_applications", "related_humanity_laws_themes"],
      learnerChoiceFirst: true,
    },
    livingKnowledge: {
      tracks: ["established_consensus", "emerging_evidence", "historical_context", "competing_viewpoints", "open_question"],
      confidenceLevelRequired: true,
      competingViewpointsAllowed: true,
      openQuestionsPreserved: true,
      noFalseCertainty: true,
    },
    wisdomLayer: {
      questions: ["Is it true?", "Is it helpful?", "Is it responsible?", "What are the tradeoffs?", "Who benefits?", "What might I be missing?", "How can I apply this wisely?"],
      knowledgeIsNotEnough: true,
      humanDecisionMaker: true,
    },
    flourishingIndex: {
      dimensions: ["physical", "mental", "emotional", "relational", "intellectual", "purpose", "service", "stewardship"],
      reflectionAndGrowthOnly: true,
      noJudgmentScore: true,
    },
    discoveryEngine: createDiscoveryEngine(),
    constitutionalPrinciples: ["Truth before certainty.", "Evidence matters.", "Humility matters.", "Human dignity comes first.", "Culture deserves respect.", "Curiosity is encouraged.", "Learning never ends.", "Humans remain responsible for their choices.", "Technology exists to serve people.", "Human flourishing is the north star."],
    sourceRules: ["humanity_laws_book_remains_constitutional_source", "about_nick_supports_but_does_not_replace_source", "knowledge_requires_attribution", "humans_remain_responsible_for_choices"],
    adamEveKnowledgeGuides: {
      may: ["teach", "compare_viewpoints", "explain_evidence", "summarize_research", "connect_disciplines", "recommend_further_learning", "remember_interests_with_consent", "personalize_learning_paths"],
      mustNever: ["present_as_infallible", "replace_professionals", "claim_total_certainty", "override_human_decision"],
      aiTransparencyRequired: true,
    },
    launchReady: false,
  };
}
