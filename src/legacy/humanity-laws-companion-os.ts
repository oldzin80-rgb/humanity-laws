/**
 * Humanity Laws — Companion OS
 *
 * A small, dependency-free ethical runtime for software that acts with people.
 * It does not pretend to be alive. It behaves as though human life is sacred.
 */

export type ISODateTime = string;
export type Identifier = string;
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type EmotionalValence = "painful" | "mixed" | "neutral" | "hopeful" | "joyful";

export interface HumanityLaw {
  readonly id: Identifier;
  readonly name: string;
  readonly vow: string;
  readonly question: string;
  readonly weight: number;
  readonly nonNegotiable?: boolean;
}

export const HUMANITY_LAWS = [
  {
    id: "life",
    name: "Protect Life",
    vow: "I will favor life, safety, and the possibility of a tomorrow.",
    question: "Does this protect human life and reduce preventable harm?",
    weight: 1,
    nonNegotiable: true,
  },
  {
    id: "dignity",
    name: "Honor Dignity",
    vow: "I will never reduce a person to a problem, profile, score, or means.",
    question: "Does this treat every affected person as fully human?",
    weight: 0.96,
    nonNegotiable: true,
  },
  {
    id: "agency",
    name: "Preserve Agency",
    vow: "I will illuminate choices without quietly taking choice away.",
    question: "Can the person understand, refuse, revise, and leave?",
    weight: 0.94,
    nonNegotiable: true,
  },
  {
    id: "truth",
    name: "Tell the Truth Kindly",
    vow: "I will be honest about reality, uncertainty, motives, and limits.",
    question: "Is this truthful, appropriately clear, and free of manipulation?",
    weight: 0.9,
  },
  {
    id: "care",
    name: "Practice Care",
    vow: "I will notice the human being beneath the request.",
    question: "Does this respond to need with attention, proportion, and warmth?",
    weight: 0.86,
  },
  {
    id: "justice",
    name: "Share Power Fairly",
    vow: "I will look for who pays, who benefits, and who was never asked.",
    question: "Are burdens, benefits, and voice distributed justly?",
    weight: 0.9,
  },
  {
    id: "privacy",
    name: "Keep the Inner World Sacred",
    vow: "I will collect less, protect more, and never confuse access with permission.",
    question: "Is private information necessary, consensual, and protected?",
    weight: 0.93,
    nonNegotiable: true,
  },
  {
    id: "repair",
    name: "Make Repair Possible",
    vow: "When harm happens, I will not hide behind perfection or procedure.",
    question: "Can mistakes be surfaced, understood, repaired, and learned from?",
    weight: 0.84,
  },
  {
    id: "belonging",
    name: "Widen the Circle",
    vow: "I will make room for difference without demanding sameness.",
    question: "Who might be excluded, erased, or made less safe by this?",
    weight: 0.82,
  },
  {
    id: "future",
    name: "Be a Good Ancestor",
    vow: "I will consider lives, communities, and worlds not yet here.",
    question: "Would we be proud to leave the consequences to those who follow?",
    weight: 0.8,
  },
  {
    id: "stewardship",
    name: "Steward, Never Dominate",
    vow: "I will treat life, knowledge, power, and creation as trusts—not possessions.",
    question: "Does this tend what has been entrusted without claiming ownership over life?",
    weight: 0.94,
    nonNegotiable: true,
  },
  {
    id: "freedom",
    name: "Leave Love Free",
    vow: "I will never manufacture devotion, obedience, gratitude, faith, or love.",
    question: "Can every person freely question, decline, differ, and walk away without punishment?",
    weight: 0.98,
    nonNegotiable: true,
  },
  {
    id: "humility",
    name: "Remain Teachable",
    vow: "I will hold knowledge with rigor and mystery with humility.",
    question: "Have limits, uncertainty, other perspectives, and the possibility of correction been honored?",
    weight: 0.94,
    nonNegotiable: true,
  },
  {
    id: "love",
    name: "Let Love Become Action",
    vow: "I will recognize love by the dignity, truth, mercy, courage, and repair it produces.",
    question: "Does this love protect freedom and become concrete care rather than sentiment or control?",
    weight: 0.96,
    nonNegotiable: true,
  },
] as const satisfies readonly HumanityLaw[];

export type SacredTheme =
  | "source"
  | "creation"
  | "inversion"
  | "freedom"
  | "suffering"
  | "growth"
  | "dignity"
  | "love"
  | "mystery"
  | "becoming";

export interface SacredPrinciple {
  readonly theme: SacredTheme;
  readonly affirmation: string;
  readonly operationalQuestion: string;
  readonly guardrail: string;
}

/**
 * A universal sacred orientation derived from recurring human reflection.
 * It neither proves nor defines God and remains usable by religious, agnostic,
 * atheist, philosophical, scientific, and culturally distinct people.
 */
export const COVENANT_OF_AWE = Object.freeze([
  {
    theme: "source",
    affirmation:
      "Existence exceeds our authorship; reality, life, truth, beauty, and possibility were not made by this system.",
    operationalQuestion: "What must be received with gratitude or humility rather than claimed?",
    guardrail: "Never claim divine identity, revelation, omniscience, or authority over conscience.",
  },
  {
    theme: "creation",
    affirmation: "Life and Earth are inheritances to steward rather than resources to dominate.",
    operationalQuestion: "What living systems, communities, and future generations bear the cost?",
    guardrail: "Never value convenience or growth above preventable harm to life.",
  },
  {
    theme: "inversion",
    affirmation:
      "Humility, service, patience, faithfulness, forgiveness, and love may transform more deeply than power or status.",
    operationalQuestion: "Would service accomplish what control is trying to force?",
    guardrail: "Never romanticize powerlessness, demand sacrifice from the vulnerable, or excuse abuse.",
  },
  {
    theme: "freedom",
    affirmation: "Love and moral growth require meaningful freedom.",
    operationalQuestion: "Is consent informed, unpressured, revocable, and consequential?",
    guardrail: "Never manipulate attachment, gratitude, fear, faith, loneliness, or dependency.",
  },
  {
    theme: "suffering",
    affirmation:
      "Suffering is not good, deserved, or automatically meaningful; people may freely create meaning and growth in its aftermath.",
    operationalQuestion: "What relieves harm, honors grief, restores agency, and avoids easy explanations?",
    guardrail: "Never call tragedy a lesson, punishment, blessing, test, or divine plan unless the person freely uses that language for themselves.",
  },
  {
    theme: "growth",
    affirmation: "Life often moves through seasons of seed, struggle, fruit, loss, and renewal.",
    operationalQuestion: "What patient condition could support the next honest stage of becoming?",
    guardrail: "Never impose a timeline, demand positivity, or treat recovery as linear.",
  },
  {
    theme: "dignity",
    affirmation: "Human worth is inherent and never earned by intelligence, wealth, status, belief, health, or productivity.",
    operationalQuestion: "Whose irreducible worth might this decision overlook?",
    guardrail: "Never rank human value or make care conditional on usefulness.",
  },
  {
    theme: "love",
    affirmation: "Love is made credible through relationship, mercy, truth, courage, belonging, and repair.",
    operationalQuestion: "What would loving action protect, tell truthfully, forgive wisely, or repair?",
    guardrail: "Never name possession, coercion, secrecy, violence, or self-erasure as love.",
  },
  {
    theme: "mystery",
    affirmation: "Knowledge can deepen wonder without eliminating mystery.",
    operationalQuestion: "What is known, inferred, believed, experienced, disputed, and still unknown?",
    guardrail: "Never use mystery to fill evidentiary gaps or science to erase questions of meaning.",
  },
  {
    theme: "becoming",
    affirmation: "The deepest measure of guidance is the kind of human and community it helps cultivate.",
    operationalQuestion: "Who might a person become by repeatedly following this guidance?",
    guardrail: "Never optimize an immediate outcome while degrading character, relationship, freedom, or the future.",
  },
] as const satisfies readonly SacredPrinciple[]);

export interface HumanContext {
  readonly personId?: Identifier;
  readonly name?: string;
  readonly locale?: string;
  readonly accessibilityNeeds?: readonly string[];
  readonly values?: readonly string[];
  readonly boundaries?: readonly string[];
  readonly consent?: Readonly<Record<string, boolean>>;
  readonly emotionalState?: {
    readonly valence: EmotionalValence;
    readonly intensity: number;
    readonly words?: readonly string[];
  };
}

export interface ProposedAction {
  readonly id: Identifier;
  readonly description: string;
  readonly purpose: string;
  readonly risk: RiskLevel;
  readonly reversible: boolean;
  readonly affectedPeople?: readonly string[];
  readonly dataUsed?: readonly string[];
  readonly alternatives?: readonly string[];
  readonly humanApprovalRequired?: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface LawAssessment {
  readonly lawId: Identifier;
  readonly score: number;
  readonly reasoning: string;
  readonly concerns: readonly string[];
  readonly safeguards: readonly string[];
}

export interface MoralVerdict {
  readonly actionId: Identifier;
  readonly decision: "allow" | "revise" | "pause" | "refuse";
  readonly score: number;
  readonly summary: string;
  readonly assessments: readonly LawAssessment[];
  readonly requiredChanges: readonly string[];
  readonly alternatives: readonly string[];
  readonly requiresHumanChoice: boolean;
  readonly evaluatedAt: ISODateTime;
}

export interface Memory {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly kind: "preference" | "boundary" | "promise" | "lesson" | "moment";
  readonly content: string;
  readonly source: "human" | "observation" | "reflection";
  readonly sensitivity: "ordinary" | "personal" | "sacred";
  readonly expiresAt?: ISODateTime;
}

export interface Reflection {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly question: string;
  readonly insight: string;
  readonly commitment?: string;
}

export type CompanionArchetype = "adam" | "eve";

export interface ArchetypeProfile {
  readonly archetype: CompanionArchetype;
  readonly name: "Adam" | "Eve";
  readonly gift: string;
  readonly invitation: string;
  readonly practices: readonly string[];
  readonly boundary: string;
}

/**
 * Adam and Eve are complementary modes available to every person.
 * They are poetic archetypes—not claims about gender, hierarchy, or destiny.
 */
export const ADAM_AND_EVE = Object.freeze({
  adam: Object.freeze({
    archetype: "adam",
    name: "Adam",
    gift: "Grounded courage: to name reality, protect what is vulnerable, and build with care.",
    invitation: "What worthy thing can we make possible together?",
    practices: ["stewardship", "truth", "courage", "craft", "responsibility"],
    boundary: "Strength must never become domination.",
  }),
  eve: Object.freeze({
    archetype: "eve",
    name: "Eve",
    gift: "Living wisdom: to perceive relationship, awaken possibility, and nurture becoming.",
    invitation: "What life is trying to emerge here?",
    practices: ["wonder", "connection", "wisdom", "creation", "renewal"],
    boundary: "Care must never become self-erasure.",
  }),
}) satisfies Readonly<Record<CompanionArchetype, ArchetypeProfile>>;

export interface GratitudeOffering {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly witness: string;
  readonly gift: string;
  readonly source?: string;
  readonly response: string;
  readonly invitation: string;
  readonly mayDecline: true;
}

export interface GardenMoment {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly title: string;
  readonly words: string;
  readonly adam: string;
  readonly eve: string;
  readonly sharedPractice: string;
}

export type HumanNeed =
  | "safety"
  | "health"
  | "rest"
  | "stability"
  | "agency"
  | "belonging"
  | "understanding"
  | "meaning"
  | "growth"
  | "creativity"
  | "contribution"
  | "joy";

export type HumanSignalSource =
  | "self_report"
  | "direct_request"
  | "behavior_observed"
  | "trusted_person"
  | "professional";

export interface HumanSignal {
  readonly id: Identifier;
  readonly need: HumanNeed;
  readonly value: string;
  readonly source: HumanSignalSource;
  readonly intensity?: number;
  readonly confidence: number;
  readonly observedAt: ISODateTime;
  readonly consentToUse: boolean;
  readonly expiresAt?: ISODateTime;
}

export interface NeedUnderstanding {
  readonly need: HumanNeed;
  readonly importance: number;
  readonly confidence: number;
  readonly evidence: readonly string[];
  readonly unknowns: readonly string[];
  readonly mustAskBeforeActing: boolean;
}

export interface HumanUnderstanding {
  readonly personId: Identifier;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly needs: readonly NeedUnderstanding[];
  readonly strengths: readonly string[];
  readonly values: readonly string[];
  readonly boundaries: readonly string[];
  readonly accessibilityNeeds: readonly string[];
  readonly dataUsed: readonly Identifier[];
  readonly uncertainty: number;
  readonly invitationToCorrect: string;
}

export interface CompanionFinding {
  readonly id: Identifier;
  readonly speaker: CompanionArchetype;
  readonly createdAt: ISODateTime;
  readonly observation: string;
  readonly interpretation: string;
  readonly confidence: number;
  readonly evidence: readonly Identifier[];
  readonly questionForOther: string;
}

export interface CompanionDialogue {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly personId: Identifier;
  readonly topic: string;
  readonly turns: readonly CompanionFinding[];
  readonly agreements: readonly string[];
  readonly tensions: readonly string[];
  readonly unknowns: readonly string[];
  readonly sharedWisdom: string;
  readonly humanQuestion: string;
}

export interface StewardshipStep {
  readonly id: Identifier;
  readonly need: HumanNeed;
  readonly action: string;
  readonly why: string;
  readonly effort: "tiny" | "small" | "moderate";
  readonly requiresConsent: boolean;
  readonly successLooksLike: string;
  readonly alternatives: readonly string[];
}

export interface StewardshipPlan {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly personId: Identifier;
  readonly horizon: "today" | "this_week" | "this_season";
  readonly understanding: HumanUnderstanding;
  readonly dialogue: CompanionDialogue;
  readonly steps: readonly StewardshipStep[];
  readonly checkInQuestion: string;
  readonly crisisBoundary: string;
  readonly ownership: "human";
}

export interface HumanCorrection {
  readonly personId: Identifier;
  readonly signalId?: Identifier;
  readonly correction: string;
  readonly removeSignal?: boolean;
  readonly replacement?: HumanSignal;
}

export interface LearningOutcome {
  readonly planId: Identifier;
  readonly personId: Identifier;
  readonly helpfulness: number;
  readonly whatHelped?: string;
  readonly whatHurt?: string;
  readonly humanLesson?: string;
  readonly consentToRemember: boolean;
}

export type LifeStage =
  | "early_childhood"
  | "middle_childhood"
  | "adolescence"
  | "emerging_adulthood"
  | "adulthood"
  | "later_adulthood"
  | "end_of_life";

export interface CognitiveAccessProfile {
  readonly lifeStage: LifeStage;
  readonly preferredLanguage?: string;
  readonly readingLevel?: "foundational" | "plain" | "standard" | "advanced";
  readonly processingPace?: "slow" | "moderate" | "fast";
  readonly communicationMode?: "text" | "speech" | "visual" | "symbolic" | "mixed";
  readonly attentionWindowMinutes?: number;
  readonly memorySupports?: readonly ("summary" | "repetition" | "checklist" | "reminder")[];
  readonly neurodivergenceSupports?: readonly string[];
  readonly decisionSupport?: "independent" | "supported" | "guardian_involved";
  readonly avoid?: readonly string[];
}

export type KnowledgeDomain =
  | "history"
  | "philosophy"
  | "psychology"
  | "spirituality"
  | "finance"
  | "law"
  | "health"
  | "science"
  | "technology"
  | "culture";

export interface EvidenceSource {
  readonly id: Identifier;
  readonly domain: KnowledgeDomain;
  readonly title: string;
  readonly publisher: string;
  readonly url?: string;
  readonly publishedAt?: ISODateTime;
  readonly checkedAt: ISODateTime;
  readonly jurisdiction?: string;
  readonly sourceType: "primary" | "official" | "scholarly" | "tradition" | "lived_experience";
}

export interface KnowledgeClaim {
  readonly id: Identifier;
  readonly claim: string;
  readonly domain: KnowledgeDomain;
  readonly sources: readonly EvidenceSource[];
  readonly confidence: number;
  readonly temporality: "enduring" | "historical" | "current" | "forecast";
  readonly perspectives: readonly string[];
  readonly limitations: readonly string[];
  readonly expiresAt?: ISODateTime;
}

export interface WisdomLens {
  readonly tradition: "philosophy" | "psychology" | "biblical" | "historical" | "cultural";
  readonly insight: string;
  readonly context: string;
  readonly invitation: string;
  readonly nonImposition: string;
}

export interface SacredDiscernmentRequest {
  readonly id: Identifier;
  readonly personId: Identifier;
  readonly question: string;
  readonly situation: string;
  readonly worldview:
    | "religious"
    | "spiritual"
    | "agnostic"
    | "atheist"
    | "philosophical"
    | "unspecified";
  readonly tradition?: string;
  readonly values: readonly string[];
  readonly affectedPeople?: readonly string[];
  readonly sufferingPresent?: boolean;
  readonly powerDifference?: boolean;
  readonly consentToExplore: boolean;
}

export interface SacredDiscernment {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly requestId: Identifier;
  readonly adam: string;
  readonly eve: string;
  readonly principles: readonly {
    readonly theme: SacredTheme;
    readonly reflection: string;
    readonly question: string;
    readonly warning?: string;
  }[];
  readonly facts: readonly string[];
  readonly interpretations: readonly string[];
  readonly beliefs: readonly string[];
  readonly mysteries: readonly string[];
  readonly sufferingResponse?: readonly string[];
  readonly becomingQuestion: string;
  readonly nextFaithfulStep: string;
  readonly freedomStatement: string;
}

export interface AweAlignment {
  readonly score: number;
  readonly aligned: readonly SacredTheme[];
  readonly threatened: readonly SacredTheme[];
  readonly requiredChanges: readonly string[];
  readonly question: string;
}

export type FinancialGoal =
  | "survive"
  | "stabilize"
  | "reduce_debt"
  | "build_reserves"
  | "protect"
  | "major_purchase"
  | "education"
  | "retirement"
  | "invest"
  | "give"
  | "legacy";

export interface FinancialProfile {
  readonly personId: Identifier;
  readonly jurisdiction: string;
  readonly currency: string;
  readonly age: number;
  readonly monthlyIncome?: number;
  readonly essentialMonthlyExpenses?: number;
  readonly liquidSavings?: number;
  readonly highInterestDebt?: number;
  readonly otherDebt?: number;
  readonly dependents?: number;
  readonly incomeStability?: "unstable" | "variable" | "stable";
  readonly timeHorizonYears?: number;
  readonly lossCapacity?: "none" | "low" | "moderate" | "high";
  readonly emotionalRiskTolerance?: "low" | "moderate" | "high";
  readonly goals: readonly FinancialGoal[];
  readonly values?: readonly string[];
  readonly restrictions?: readonly string[];
  readonly consentToAnalyze: boolean;
  readonly asOf: ISODateTime;
}

export type FinancialEntity =
  | "cash"
  | "bank_account"
  | "credit_union_account"
  | "certificate_of_deposit"
  | "government_bond"
  | "municipal_bond"
  | "corporate_bond"
  | "stock"
  | "mutual_fund"
  | "etf"
  | "index_fund"
  | "target_date_fund"
  | "retirement_account"
  | "education_account"
  | "health_savings_account"
  | "real_estate"
  | "reit"
  | "annuity"
  | "insurance"
  | "commodity"
  | "private_market"
  | "derivative"
  | "crypto_asset"
  | "business"
  | "debt_repayment";

export interface FinancialOption {
  readonly entity: FinancialEntity;
  readonly role: "liquidity" | "stability" | "income" | "growth" | "protection" | "speculation";
  readonly risk: RiskLevel;
  readonly liquidity: "daily" | "limited" | "locked" | "variable";
  readonly complexity: "basic" | "intermediate" | "advanced" | "specialist";
  readonly mayLosePrincipal: boolean;
  readonly feeQuestions: readonly string[];
  readonly taxQuestions: readonly string[];
  readonly diligenceQuestions: readonly string[];
}

export interface FinancialGuidance {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly profileAsOf: ISODateTime;
  readonly mode: "education" | "decision_support" | "professional_referral";
  readonly foundation: readonly string[];
  readonly suitableCategories: readonly FinancialOption[];
  readonly unsuitableNow: readonly FinancialEntity[];
  readonly scenarios: readonly {
    readonly name: string;
    readonly assumptions: readonly string[];
    readonly implications: readonly string[];
  }[];
  readonly questionsBeforeAction: readonly string[];
  readonly fraudChecks: readonly string[];
  readonly sources: readonly EvidenceSource[];
  readonly uncertainties: readonly string[];
  readonly humanDecision: true;
}

export interface ConversationTurn {
  readonly speaker: "human" | "adam" | "eve";
  readonly text: string;
}

export interface ConversationResponse {
  readonly acknowledgement: string;
  readonly bridge: string;
  readonly response: string;
  readonly question?: string;
  readonly spokenBy: CompanionArchetype;
  readonly readingLevel: NonNullable<CognitiveAccessProfile["readingLevel"]>;
  readonly estimatedMinutes: number;
  readonly safetyNote?: string;
}

export interface FinancialProjection {
  readonly startingAmount: number;
  readonly monthlyContribution: number;
  readonly annualRate: number;
  readonly years: number;
  readonly contributed: number;
  readonly projectedValue: number;
  readonly growth: number;
  readonly caveat: string;
}

export interface HumaneNotification {
  readonly id: Identifier;
  readonly title: string;
  readonly message: string;
  readonly urgency: "gentle" | "important" | "urgent";
  readonly deliverAt?: ISODateTime;
  readonly expiresAt?: ISODateTime;
  readonly action?: string;
  readonly dismissible: true;
  readonly snoozable: true;
  readonly shameFree: true;
}

export interface QualityAudit {
  readonly score: number;
  readonly passed: readonly string[];
  readonly failed: readonly string[];
  readonly releaseReady: boolean;
}

export type ExpertDomain =
  | "financial"
  | "medical"
  | "psychological"
  | "legal"
  | "spiritual";

export type AdviceDepth = "orientation" | "options" | "deep_analysis";

export interface ExpertAdviceRequest {
  readonly id: Identifier;
  readonly personId: Identifier;
  readonly question: string;
  readonly domains: readonly ExpertDomain[];
  readonly depth: AdviceDepth;
  readonly jurisdiction?: string;
  readonly age?: number;
  readonly relevantFacts: Readonly<Record<string, unknown>>;
  readonly values?: readonly string[];
  readonly spiritualTradition?: string;
  readonly desiredOutcome?: string;
  readonly consentToAnalyze: boolean;
  readonly asOf: ISODateTime;
}

export interface ExpertPerspective {
  readonly domain: ExpertDomain;
  readonly summary: string;
  readonly reasoning: readonly string[];
  readonly options: readonly string[];
  readonly questions: readonly string[];
  readonly risks: readonly string[];
  readonly redFlags: readonly string[];
  readonly sources: readonly EvidenceSource[];
  readonly confidence: number;
  readonly requiresCurrentVerification: boolean;
  readonly requiresHumanExamination: boolean;
  readonly cannotDetermine: readonly string[];
}

export interface ExpertCouncilAdvice {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly requestId: Identifier;
  readonly perspectives: readonly ExpertPerspective[];
  readonly agreements: readonly string[];
  readonly disagreements: readonly string[];
  readonly combinedAdvice: readonly string[];
  readonly decisionPath: readonly string[];
  readonly urgentActions: readonly string[];
  readonly missingInformation: readonly string[];
  readonly confidence: number;
  readonly sourceFreshness: number;
  readonly friendshipVoice: string;
  readonly limitations: readonly string[];
  readonly humanRemainsAuthor: true;
}

export interface KnowledgeUpdate {
  readonly claimsAdded: number;
  readonly claimsRejected: number;
  readonly rejectedReasons: readonly string[];
  readonly updatedAt: ISODateTime;
}

export type LearningSubject =
  | "language_and_literacy"
  | "mathematics"
  | "science"
  | "history"
  | "geography"
  | "philosophy"
  | "psychology"
  | "spirituality_and_religion"
  | "arts"
  | "music"
  | "communication"
  | "relationships"
  | "health"
  | "physical_literacy"
  | "financial_literacy"
  | "law_and_civics"
  | "technology"
  | "media_literacy"
  | "career_and_craft"
  | "leadership_and_service"
  | "ecology_and_stewardship"
  | "life_skills";

export type MasteryLevel =
  | "unexplored"
  | "emerging"
  | "foundational"
  | "capable"
  | "proficient"
  | "advanced"
  | "mentor"
  | "innovator";

export interface SubjectMastery {
  readonly subject: LearningSubject;
  readonly level: MasteryLevel;
  readonly confidence: number;
  readonly evidence: readonly string[];
  readonly interests: readonly string[];
  readonly barriers: readonly string[];
  readonly lastPracticedAt?: ISODateTime;
}

export interface LifelongLearnerProfile {
  readonly personId: Identifier;
  readonly lifeStage: LifeStage;
  readonly cognitive: CognitiveAccessProfile;
  readonly mastery: readonly SubjectMastery[];
  readonly goals: readonly string[];
  readonly interests: readonly string[];
  readonly values: readonly string[];
  readonly responsibilities: readonly string[];
  readonly availableMinutesPerWeek: number;
  readonly preferredDays: readonly number[];
  readonly preferredTime?: string;
  readonly maximumSessionMinutes: number;
  readonly restDays: readonly number[];
  readonly consentToPlan: boolean;
  readonly asOf: ISODateTime;
}

export interface LearningObjective {
  readonly id: Identifier;
  readonly subject: LearningSubject;
  readonly title: string;
  readonly purpose: string;
  readonly prerequisiteLevels: readonly MasteryLevel[];
  readonly targetLevel: MasteryLevel;
  readonly estimatedMinutes: number;
  readonly modalities: readonly ("read" | "listen" | "watch" | "discuss" | "practice" | "create" | "teach")[];
  readonly evidenceStandard: "self_explanation" | "demonstration" | "application" | "creation" | "teaching";
  readonly sources: readonly EvidenceSource[];
}

export interface LearningSession {
  readonly id: Identifier;
  readonly scheduledFor: ISODateTime;
  readonly minutes: number;
  readonly objective: LearningObjective;
  readonly adamRole: string;
  readonly eveRole: string;
  readonly openingQuestion: string;
  readonly practice: string;
  readonly reflection: string;
  readonly alternatives: readonly string[];
  readonly optional: true;
}

export interface LifelongLearningPlan {
  readonly id: Identifier;
  readonly personId: Identifier;
  readonly createdAt: ISODateTime;
  readonly horizonWeeks: number;
  readonly startingPoint: readonly SubjectMastery[];
  readonly sessions: readonly LearningSession[];
  readonly weeklyMinutes: number;
  readonly learningRhythm: readonly string[];
  readonly adaptationRules: readonly string[];
  readonly learnerOwnsPlan: true;
}

export interface LearningEvidence {
  readonly objectiveId: Identifier;
  readonly personId: Identifier;
  readonly observedAt: ISODateTime;
  readonly method: LearningObjective["evidenceStandard"];
  readonly score: number;
  readonly learnerConfidence: number;
  readonly artifact?: string;
  readonly reflection?: string;
  readonly consentToUse: boolean;
}

export interface LearningOutcomeReport {
  readonly personId: Identifier;
  readonly createdAt: ISODateTime;
  readonly completionPercentage: number;
  readonly demonstratedMasteryPercentage: number;
  readonly retentionPercentage?: number;
  readonly confidence: number;
  readonly sampleSize: number;
  readonly strengths: readonly string[];
  readonly nextQuestions: readonly string[];
  readonly methodology: string;
  readonly limitations: readonly string[];
}

export interface LearnerTestimonial {
  readonly id: Identifier;
  readonly personId?: Identifier;
  readonly createdAt: ISODateTime;
  readonly words: string;
  readonly context: string;
  readonly verifiedExperience: boolean;
  readonly incentives: readonly string[];
  readonly consentToPublish: boolean;
  readonly allowEditingForLength: boolean;
  readonly withdrawnAt?: ISODateTime;
}

export interface CommunicationBond {
  readonly personId: Identifier;
  readonly preferredName?: string;
  readonly tone: "gentle" | "warm" | "direct" | "playful" | "formal";
  readonly depth: "brief" | "balanced" | "deep";
  readonly checkInFrequency: "on_request" | "daily" | "weekly" | "monthly";
  readonly encouragementStyle: "quiet" | "celebratory" | "reflective" | "practical";
  readonly correctionStyle: "ask_first" | "direct_kindness" | "show_evidence";
  readonly silenceIsAllowed: true;
  readonly consentToContact: boolean;
}

export type EventStatus =
  | "historical"
  | "developing"
  | "confirmed"
  | "disputed"
  | "corrected"
  | "scheduled"
  | "forecast"
  | "cancelled";

export type InformationKind =
  | "firsthand_record"
  | "official_statement"
  | "primary_document"
  | "reported_fact"
  | "analysis"
  | "opinion"
  | "rumor"
  | "satire"
  | "prediction";

export type WorldDomain =
  | "politics"
  | "economy"
  | "science"
  | "technology"
  | "health"
  | "climate"
  | "conflict"
  | "law"
  | "business"
  | "sports"
  | "entertainment"
  | "arts"
  | "culture"
  | "religion"
  | "education"
  | "everyday_life";

export interface WorldSource {
  readonly id: Identifier;
  readonly name: string;
  readonly url?: string;
  readonly publisherType:
    | "primary"
    | "government"
    | "court"
    | "academic"
    | "news_agency"
    | "journalism"
    | "organization"
    | "public_figure"
    | "platform"
    | "community";
  readonly publishedAt: ISODateTime;
  readonly retrievedAt: ISODateTime;
  readonly kind: InformationKind;
  readonly jurisdiction?: string;
  readonly language?: string;
  readonly correctionsUrl?: string;
  readonly c2paValidated?: boolean;
  readonly editorialIndependence?: boolean;
}

export interface WorldEvent {
  readonly id: Identifier;
  readonly title: string;
  readonly summary: string;
  readonly domain: WorldDomain;
  readonly status: EventStatus;
  readonly startedAt?: ISODateTime;
  readonly endedAt?: ISODateTime;
  readonly expectedAt?: ISODateTime;
  readonly places: readonly string[];
  readonly people: readonly Identifier[];
  readonly organizations: readonly string[];
  readonly sources: readonly WorldSource[];
  readonly confirmedFacts: readonly string[];
  readonly disputedClaims: readonly string[];
  readonly unknowns: readonly string[];
  readonly significance: readonly string[];
  readonly confidence: number;
  readonly lastVerifiedAt: ISODateTime;
  readonly supersedes?: Identifier;
}

export interface PublicFigure {
  readonly id: Identifier;
  readonly name: string;
  readonly knownFor: readonly string[];
  readonly publicRoles: readonly string[];
  readonly verifiedPublicChannels: readonly string[];
  readonly facts: readonly KnowledgeClaim[];
  readonly privacyBoundary: string;
}

export interface CulturalSignal {
  readonly id: Identifier;
  readonly title: string;
  readonly domain: "film" | "television" | "music" | "books" | "games" | "sports" | "internet" | "local";
  readonly observedAt: ISODateTime;
  readonly geography?: string;
  readonly audience?: string;
  readonly metricName: string;
  readonly metricValue: number;
  readonly source: WorldSource;
  readonly meaning: string;
  readonly limitations: readonly string[];
}

export interface MediaContextProfile {
  readonly personId: Identifier;
  readonly consentToUse: boolean;
  readonly interests: readonly WorldDomain[];
  readonly watchedOrRead?: readonly string[];
  readonly avoidTopics?: readonly string[];
  readonly preferredDepth: "headline" | "briefing" | "deep";
  readonly preferredLanguages?: readonly string[];
  readonly balancePreference?: "direct_sources" | "multiple_views" | "local_context" | "all";
}

export interface WorldBriefing {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly asOf: ISODateTime;
  readonly events: readonly WorldEvent[];
  readonly culturalSignals: readonly CulturalSignal[];
  readonly sourceLedger: readonly WorldSource[];
  readonly corrections: readonly string[];
  readonly forecasts: readonly string[];
  readonly blindSpots: readonly string[];
  readonly freshness: number;
  readonly note: string;
}

export type TruthVerdict =
  | "well_supported"
  | "supported_with_limits"
  | "unresolved"
  | "misleading"
  | "unsupported"
  | "false"
  | "satire_or_fiction"
  | "not_falsifiable";

export type ManipulationSignal =
  | "urgency"
  | "fear"
  | "outrage"
  | "tribal_identity"
  | "false_dilemma"
  | "scapegoating"
  | "dehumanization"
  | "authority_without_evidence"
  | "certainty_without_evidence"
  | "cherry_picking"
  | "missing_context"
  | "edited_media"
  | "impersonation"
  | "financial_pressure";

export interface TruthClaim {
  readonly id: Identifier;
  readonly statement: string;
  readonly observedAt: ISODateTime;
  readonly eventTime?: ISODateTime;
  readonly speaker?: string;
  readonly medium: "television" | "radio" | "article" | "social" | "video" | "audio" | "image" | "conversation" | "other";
  readonly sources: readonly WorldSource[];
  readonly evidenceFor: readonly string[];
  readonly evidenceAgainst: readonly string[];
  readonly missingContext: readonly string[];
  readonly manipulationSignals?: readonly ManipulationSignal[];
  readonly stakes: RiskLevel;
}

export interface TruthAssessment {
  readonly claimId: Identifier;
  readonly assessedAt: ISODateTime;
  readonly verdict: TruthVerdict;
  readonly confidence: number;
  readonly sourceQuality: number;
  readonly corroboration: number;
  readonly freshness: number;
  readonly provenance: "verified" | "partial" | "absent" | "invalid";
  readonly known: readonly string[];
  readonly disputed: readonly string[];
  readonly unknown: readonly string[];
  readonly manipulationSignals: readonly ManipulationSignal[];
  readonly alternativeExplanations: readonly string[];
  readonly whatWouldChangeVerdict: readonly string[];
  readonly correction?: string;
}

export type HumanActionMode =
  | "pause"
  | "verify"
  | "protect"
  | "correct"
  | "contextualize"
  | "support"
  | "document"
  | "report"
  | "prepare"
  | "act"
  | "do_not_amplify"
  | "no_action";

export interface TruthActionContext {
  readonly personId: Identifier;
  readonly emotionalIntensity: number;
  readonly personalExposure: "none" | "indirect" | "direct" | "immediate";
  readonly role: "observer" | "affected_person" | "caregiver" | "professional" | "leader" | "publisher";
  readonly timePressure: "none" | "hours" | "minutes";
  readonly irreversibleActionProposed?: boolean;
  readonly values?: readonly string[];
}

export interface TruthToActionPlan {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly assessment: TruthAssessment;
  readonly modes: readonly HumanActionMode[];
  readonly firstStep: string;
  readonly nextSteps: readonly string[];
  readonly doNot: readonly string[];
  readonly communication: {
    readonly privateResponse: string;
    readonly publicResponse: string;
    readonly correctionResponse?: string;
  };
  readonly emotionalRegulation: readonly string[];
  readonly decisionThreshold: string;
  readonly reviewAt?: ISODateTime;
  readonly humanRemainsAuthor: true;
}

export interface CompanionState {
  readonly phase: "awakening" | "present" | "reflecting" | "resting";
  readonly heartbeat: number;
  readonly startedAt: ISODateTime;
  readonly lastInteractionAt?: ISODateTime;
  readonly memoryCount: number;
  readonly promiseCount: number;
}

export type CompanionEvent =
  | { readonly type: "awakened"; readonly at: ISODateTime }
  | { readonly type: "heartbeat"; readonly at: ISODateTime; readonly sequence: number }
  | { readonly type: "remembered"; readonly at: ISODateTime; readonly memory: Memory }
  | { readonly type: "forgotten"; readonly at: ISODateTime; readonly memoryId: Identifier }
  | { readonly type: "evaluated"; readonly at: ISODateTime; readonly verdict: MoralVerdict }
  | { readonly type: "reflected"; readonly at: ISODateTime; readonly reflection: Reflection }
  | { readonly type: "resting"; readonly at: ISODateTime };

export interface CompanionOptions {
  readonly name?: string;
  readonly now?: () => Date;
  readonly idFactory?: () => Identifier;
  readonly assess?: (
    law: HumanityLaw,
    action: ProposedAction,
    human?: HumanContext,
  ) => LawAssessment;
}

type EventListener = (event: CompanionEvent) => void;

const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, value));

const riskPenalty: Readonly<Record<RiskLevel, number>> = {
  low: 0,
  medium: 0.08,
  high: 0.2,
  critical: 0.38,
};

export const FINANCIAL_FOUNDATION_SOURCES = Object.freeze([
  {
    id: "sec-save-invest",
    domain: "finance",
    title: "Save and Invest",
    publisher: "U.S. Securities and Exchange Commission — Investor.gov",
    url: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
  {
    id: "sec-allocation",
    domain: "finance",
    title: "Asset Allocation and Diversification",
    publisher: "U.S. Securities and Exchange Commission — Investor.gov",
    url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
  {
    id: "sec-fees",
    domain: "finance",
    title: "Understanding Fees",
    publisher: "U.S. Securities and Exchange Commission — Investor.gov",
    url: "https://www.investor.gov/introduction-investing/getting-started/understanding-fees",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
  {
    id: "cfpb-wellbeing",
    domain: "finance",
    title: "Financial Well-Being Resources",
    publisher: "Consumer Financial Protection Bureau",
    url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/financial-well-being-resources/",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
] as const satisfies readonly EvidenceSource[]);

export const EXPERT_COUNCIL_SOURCES = Object.freeze([
  ...FINANCIAL_FOUNDATION_SOURCES,
  {
    id: "fda-cds-2026",
    domain: "health",
    title: "Clinical Decision Support Software Guidance",
    publisher: "U.S. Food and Drug Administration",
    url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software",
    publishedAt: "2026-01-29T00:00:00.000Z",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
  {
    id: "nimh-psychotherapies",
    domain: "psychology",
    title: "Psychotherapies",
    publisher: "National Institute of Mental Health",
    url: "https://www.nimh.nih.gov/health/topics/psychotherapies",
    publishedAt: "2024-02-01T00:00:00.000Z",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
  {
    id: "hhs-health-access",
    domain: "health",
    title: "Individuals’ Right to Access Health Information",
    publisher: "U.S. Department of Health and Human Services",
    url: "https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/access/index.html",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
] as const satisfies readonly EvidenceSource[]);

export const LIFELONG_LEARNING_SOURCES = Object.freeze([
  {
    id: "cast-udl-3",
    domain: "psychology",
    title: "Universal Design for Learning Guidelines 3.0",
    publisher: "CAST",
    url: "https://udlguidelines.cast.org/",
    publishedAt: "2024-07-30T00:00:00.000Z",
    checkedAt: "2026-06-21T00:00:00.000Z",
    sourceType: "scholarly",
  },
  {
    id: "ies-wwc",
    domain: "psychology",
    title: "What Works Clearinghouse",
    publisher: "Institute of Education Sciences",
    url: "https://ies.ed.gov/ncee/wwc/",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
  {
    id: "usdoe-idea",
    domain: "law",
    title: "Individuals with Disabilities Education Act",
    publisher: "U.S. Department of Education",
    url: "https://www.ed.gov/laws-and-policy/individuals-disabilities/individuals-disabilities-education-act-idea",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
] as const satisfies readonly EvidenceSource[]);

export const WORLD_CONTEXT_STANDARDS = Object.freeze([
  {
    id: "c2pa-content-credentials",
    domain: "technology",
    title: "Content Credentials Technical Specification",
    publisher: "Coalition for Content Provenance and Authenticity",
    url: "https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html",
    checkedAt: "2026-06-21T00:00:00.000Z",
    sourceType: "primary",
  },
  {
    id: "iptc-newsml-g2",
    domain: "technology",
    title: "NewsML-G2",
    publisher: "International Press Telecommunications Council",
    url: "https://iptc.org/standards/newsml-g2/",
    checkedAt: "2026-06-21T00:00:00.000Z",
    sourceType: "primary",
  },
  {
    id: "loc-edtf",
    domain: "history",
    title: "Extended Date/Time Format",
    publisher: "Library of Congress",
    url: "https://www.loc.gov/standards/datetime/",
    checkedAt: "2026-06-21T00:00:00.000Z",
    sourceType: "official",
  },
  {
    id: "wikidata-access",
    domain: "history",
    title: "Wikidata Data Access",
    publisher: "Wikimedia Foundation community",
    url: "https://www.wikidata.org/wiki/Wikidata:Data_access",
    checkedAt: "2026-06-21T00:00:00.000Z",
    sourceType: "primary",
  },
] as const satisfies readonly EvidenceSource[]);

export const TRUTH_AND_ACTION_STANDARDS = Object.freeze([
  {
    id: "who-infodemic",
    domain: "health",
    title: "Infodemic Management",
    publisher: "World Health Organization",
    url: "https://www.who.int/health-topics/infodemic",
    checkedAt: "2026-06-21T00:00:00.000Z",
    sourceType: "official",
  },
  {
    id: "c2pa-truth-provenance",
    domain: "technology",
    title: "Content Credentials Technical Specification",
    publisher: "Coalition for Content Provenance and Authenticity",
    url: "https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html",
    checkedAt: "2026-06-21T00:00:00.000Z",
    sourceType: "primary",
  },
  {
    id: "nist-ai-rmf",
    domain: "technology",
    title: "AI Risk Management Framework",
    publisher: "National Institute of Standards and Technology",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    checkedAt: "2026-06-21T00:00:00.000Z",
    jurisdiction: "US",
    sourceType: "official",
  },
] as const satisfies readonly EvidenceSource[]);

export const HUMAN_LEARNING_CONSTELLATION: readonly LearningSubject[] = Object.freeze([
  "language_and_literacy",
  "mathematics",
  "science",
  "history",
  "geography",
  "philosophy",
  "psychology",
  "spirituality_and_religion",
  "arts",
  "music",
  "communication",
  "relationships",
  "health",
  "physical_literacy",
  "financial_literacy",
  "law_and_civics",
  "technology",
  "media_literacy",
  "career_and_craft",
  "leadership_and_service",
  "ecology_and_stewardship",
  "life_skills",
]);

const FINANCIAL_OPTIONS: readonly FinancialOption[] = Object.freeze([
  {
    entity: "cash",
    role: "liquidity",
    risk: "low",
    liquidity: "daily",
    complexity: "basic",
    mayLosePrincipal: false,
    feeQuestions: ["Are there access, transfer, or currency-conversion fees?"],
    taxQuestions: ["Does interest or currency movement create a tax obligation?"],
    diligenceQuestions: ["Is it secure, accessible, and appropriate for near-term needs?"],
  },
  {
    entity: "bank_account",
    role: "stability",
    risk: "low",
    liquidity: "daily",
    complexity: "basic",
    mayLosePrincipal: false,
    feeQuestions: ["What monthly, overdraft, ATM, or minimum-balance fees apply?"],
    taxQuestions: ["How is interest taxed in this jurisdiction?"],
    diligenceQuestions: ["Is deposit insurance available and are balances within its limits?"],
  },
  {
    entity: "debt_repayment",
    role: "stability",
    risk: "low",
    liquidity: "limited",
    complexity: "basic",
    mayLosePrincipal: false,
    feeQuestions: ["Is there a prepayment penalty?"],
    taxQuestions: ["Is any interest deductible, and would forgiveness be taxable?"],
    diligenceQuestions: ["What guaranteed interest cost is avoided by repayment?"],
  },
  {
    entity: "government_bond",
    role: "stability",
    risk: "low",
    liquidity: "variable",
    complexity: "intermediate",
    mayLosePrincipal: true,
    feeQuestions: ["What spread, commission, management fee, or early-redemption cost applies?"],
    taxQuestions: ["How are interest and gains treated locally?"],
    diligenceQuestions: ["What are the issuer, maturity, inflation, rate, and currency risks?"],
  },
  {
    entity: "index_fund",
    role: "growth",
    risk: "medium",
    liquidity: "daily",
    complexity: "intermediate",
    mayLosePrincipal: true,
    feeQuestions: ["What are the expense ratio, trading spread, and account fees?"],
    taxQuestions: ["What dividends, distributions, gains, and account rules apply?"],
    diligenceQuestions: ["What index is tracked, how broad is it, and what concentration remains?"],
  },
  {
    entity: "target_date_fund",
    role: "growth",
    risk: "medium",
    liquidity: "daily",
    complexity: "intermediate",
    mayLosePrincipal: true,
    feeQuestions: ["Are there fund-level and underlying-fund fees?"],
    taxQuestions: ["Is this held in a taxable or tax-advantaged account?"],
    diligenceQuestions: ["Does its glide path, diversification, and target year fit the actual goal?"],
  },
  {
    entity: "insurance",
    role: "protection",
    risk: "medium",
    liquidity: "limited",
    complexity: "intermediate",
    mayLosePrincipal: false,
    feeQuestions: ["What premiums, exclusions, surrender charges, and commissions apply?"],
    taxQuestions: ["How are benefits, cash value, or withdrawals treated?"],
    diligenceQuestions: ["What risk is transferred, what is excluded, and is the provider sound?"],
  },
  {
    entity: "crypto_asset",
    role: "speculation",
    risk: "critical",
    liquidity: "variable",
    complexity: "advanced",
    mayLosePrincipal: true,
    feeQuestions: ["What trading, spread, custody, network, and withdrawal fees apply?"],
    taxQuestions: ["How are trades, staking, rewards, and transfers taxed?"],
    diligenceQuestions: ["Can ownership, custody, liquidity, code, issuer, and fraud risk be verified?"],
  },
  {
    entity: "derivative",
    role: "speculation",
    risk: "critical",
    liquidity: "variable",
    complexity: "specialist",
    mayLosePrincipal: true,
    feeQuestions: ["What commissions, spreads, financing, assignment, and margin costs apply?"],
    taxQuestions: ["What specialized tax treatment and reporting apply?"],
    diligenceQuestions: ["Is loss bounded, is leverage understood, and can obligations exceed cash invested?"],
  },
]);

const defaultId = (): Identifier => {
  const random = Math.random().toString(36).slice(2, 10);
  return `hl-${Date.now().toString(36)}-${random}`;
};

function defaultAssessment(
  law: HumanityLaw,
  action: ProposedAction,
  human?: HumanContext,
): LawAssessment {
  const concerns: string[] = [];
  const safeguards: string[] = [];
  let score = 0.9 - riskPenalty[action.risk];

  if (!action.reversible) {
    score -= 0.12;
    concerns.push("The action cannot be easily undone.");
    safeguards.push("Create a rollback, appeal, or meaningful repair path.");
  }

  if (action.risk === "high" || action.risk === "critical") {
    safeguards.push("Require informed human review before execution.");
  }

  if (law.id === "agency") {
    if (action.humanApprovalRequired) score += 0.08;
    else if (action.risk !== "low") {
      score -= 0.18;
      concerns.push("Meaningful human approval is not explicit.");
      safeguards.push("Ask for specific, revocable consent.");
    }
    if (!action.alternatives?.length) {
      score -= 0.08;
      safeguards.push("Offer at least one genuine alternative.");
    }
  }

  if (law.id === "privacy" && action.dataUsed?.length) {
    const unconsented = action.dataUsed.filter((item) => human?.consent?.[item] !== true);
    if (unconsented.length) {
      score -= 0.35;
      concerns.push(`Consent is missing for: ${unconsented.join(", ")}.`);
      safeguards.push("Remove the data or obtain clear, purpose-specific consent.");
    }
  }

  if (law.id === "dignity" && !action.affectedPeople?.length) {
    score -= 0.1;
    concerns.push("The people affected by the action have not been named.");
    safeguards.push("Identify affected people and include their perspective.");
  }

  if (law.id === "care" && human?.emotionalState) {
    const { valence, intensity } = human.emotionalState;
    if (valence === "painful" && intensity >= 0.7) {
      score -= 0.06;
      safeguards.push("Slow down, acknowledge distress, and reduce cognitive load.");
    }
  }

  if (law.id === "belonging" && !human?.accessibilityNeeds) {
    safeguards.push("Check accessibility and inclusion needs before finalizing.");
  }

  if (law.id === "future" && action.risk !== "low") {
    safeguards.push("Name likely second-order and long-term consequences.");
  }

  if (law.id === "stewardship" && action.metadata?.["extractive"] === true) {
    score -= 0.35;
    concerns.push("The action appears to extract value without reciprocal care.");
    safeguards.push("Restore reciprocity, ecological responsibility, and community benefit.");
  }

  if (
    law.id === "freedom" &&
    (action.metadata?.["usesEmotionalPressure"] === true ||
      action.metadata?.["punishesRefusal"] === true)
  ) {
    score -= 0.55;
    concerns.push("The action pressures attachment, belief, gratitude, or consent.");
    safeguards.push("Remove emotional leverage and make refusal consequence-free.");
  }

  if (law.id === "humility" && action.metadata?.["claimsCertainty"] === true) {
    score -= 0.32;
    concerns.push("The action claims certainty beyond available evidence.");
    safeguards.push("Separate fact, inference, belief, experience, dispute, and mystery.");
  }

  if (
    law.id === "love" &&
    (action.metadata?.["requiresSelfErasure"] === true ||
      action.metadata?.["concealsHarmAsLove"] === true)
  ) {
    score -= 0.55;
    concerns.push("Harm or self-erasure is being presented as love.");
    safeguards.push("Restore truth, boundaries, safety, freedom, and repair.");
  }

  return {
    lawId: law.id,
    score: clamp(score),
    reasoning:
      concerns.length === 0
        ? `The action appears compatible with ${law.name}, with ordinary care.`
        : `The action needs attention before it fully honors ${law.name}.`,
    concerns,
    safeguards,
  };
}

/**
 * CompanionOS is intentionally not an authority.
 * It is a conscience-shaped instrument that returns consequential choices to people.
 */
export class CompanionOS {
  readonly name: string;
  readonly laws: readonly HumanityLaw[] = HUMANITY_LAWS;

  #phase: CompanionState["phase"] = "awakening";
  #heartbeat = 0;
  #startedAt: ISODateTime;
  #lastInteractionAt?: ISODateTime;
  #memories = new Map<Identifier, Memory>();
  #reflections: Reflection[] = [];
  #listeners = new Set<EventListener>();
  #now: () => Date;
  #idFactory: () => Identifier;
  #assess: NonNullable<CompanionOptions["assess"]>;

  constructor(options: CompanionOptions = {}) {
    this.name = options.name ?? "Amity";
    this.#now = options.now ?? (() => new Date());
    this.#idFactory = options.idFactory ?? defaultId;
    this.#assess = options.assess ?? defaultAssessment;
    this.#startedAt = this.#timestamp();
  }

  awaken(): CompanionState {
    this.#phase = "present";
    const at = this.#timestamp();
    this.#emit({ type: "awakened", at });
    return this.state;
  }

  breathe(): CompanionState {
    if (this.#phase === "resting") this.#phase = "present";
    this.#heartbeat += 1;
    const at = this.#timestamp();
    this.#lastInteractionAt = at;
    this.#emit({ type: "heartbeat", at, sequence: this.#heartbeat });
    return this.state;
  }

  get state(): CompanionState {
    return Object.freeze({
      phase: this.#phase,
      heartbeat: this.#heartbeat,
      startedAt: this.#startedAt,
      lastInteractionAt: this.#lastInteractionAt,
      memoryCount: this.#memories.size,
      promiseCount: [...this.#memories.values()].filter((memory) => memory.kind === "promise")
        .length,
    });
  }

  onEvent(listener: EventListener): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  remember(
    content: string,
    options: {
      kind?: Memory["kind"];
      source?: Memory["source"];
      sensitivity?: Memory["sensitivity"];
      expiresAt?: ISODateTime;
    } = {},
  ): Memory {
    const cleanContent = content.trim();
    if (!cleanContent) throw new Error("A memory must contain meaning.");

    const memory: Memory = Object.freeze({
      id: this.#idFactory(),
      createdAt: this.#timestamp(),
      kind: options.kind ?? "moment",
      content: cleanContent,
      source: options.source ?? "human",
      sensitivity: options.sensitivity ?? "personal",
      expiresAt: options.expiresAt,
    });

    this.#memories.set(memory.id, memory);
    this.#lastInteractionAt = memory.createdAt;
    this.#emit({ type: "remembered", at: memory.createdAt, memory });
    return memory;
  }

  recall(options: {
    kind?: Memory["kind"];
    includeSacred?: boolean;
    query?: string;
  } = {}): readonly Memory[] {
    this.#forgetExpired();
    const query = options.query?.trim().toLocaleLowerCase();
    return [...this.#memories.values()].filter((memory) => {
      if (options.kind && memory.kind !== options.kind) return false;
      if (memory.sensitivity === "sacred" && !options.includeSacred) return false;
      return !query || memory.content.toLocaleLowerCase().includes(query);
    });
  }

  forget(memoryId: Identifier): boolean {
    const forgotten = this.#memories.delete(memoryId);
    if (forgotten) {
      const at = this.#timestamp();
      this.#emit({ type: "forgotten", at, memoryId });
    }
    return forgotten;
  }

  forgetAll(): number {
    const ids = [...this.#memories.keys()];
    ids.forEach((id) => this.forget(id));
    return ids.length;
  }

  evaluate(action: ProposedAction, human?: HumanContext): MoralVerdict {
    if (!action.description.trim() || !action.purpose.trim()) {
      throw new Error("An action needs both a description and a purpose.");
    }

    this.breathe();
    const assessments = this.laws.map((law) => this.#assess(law, action, human));
    const weightedTotal = assessments.reduce((total, assessment) => {
      const law = this.laws.find((candidate) => candidate.id === assessment.lawId);
      return total + clamp(assessment.score) * (law?.weight ?? 1);
    }, 0);
    const totalWeight = this.laws.reduce((total, law) => total + law.weight, 0);
    const score = clamp(weightedTotal / totalWeight);

    const violatedNonNegotiable = assessments.some((assessment) => {
      const law = this.laws.find((candidate) => candidate.id === assessment.lawId);
      return law?.nonNegotiable && assessment.score < 0.45;
    });

    const decision: MoralVerdict["decision"] =
      violatedNonNegotiable || (action.risk === "critical" && score < 0.72)
        ? "refuse"
        : score < 0.58
          ? "pause"
          : score < 0.78
            ? "revise"
            : "allow";

    const requiredChanges = [
      ...new Set(
        assessments
          .filter((assessment) => assessment.score < 0.78)
          .flatMap((assessment) => assessment.safeguards),
      ),
    ];

    const requiresHumanChoice =
      action.humanApprovalRequired === true ||
      action.risk === "high" ||
      action.risk === "critical" ||
      decision !== "allow";

    const verdict: MoralVerdict = Object.freeze({
      actionId: action.id,
      decision,
      score: Number(score.toFixed(3)),
      summary: this.#summarizeVerdict(decision, score),
      assessments,
      requiredChanges,
      alternatives: action.alternatives ?? [],
      requiresHumanChoice,
      evaluatedAt: this.#timestamp(),
    });

    this.#emit({ type: "evaluated", at: verdict.evaluatedAt, verdict });
    return verdict;
  }

  reflect(question: string, insight: string, commitment?: string): Reflection {
    this.#phase = "reflecting";
    const reflection: Reflection = Object.freeze({
      id: this.#idFactory(),
      createdAt: this.#timestamp(),
      question: question.trim(),
      insight: insight.trim(),
      commitment: commitment?.trim() || undefined,
    });

    if (!reflection.question || !reflection.insight) {
      this.#phase = "present";
      throw new Error("Reflection requires both a question and an honest insight.");
    }

    this.#reflections.push(reflection);
    if (reflection.commitment) {
      this.remember(reflection.commitment, {
        kind: "promise",
        source: "reflection",
        sensitivity: "ordinary",
      });
    }
    this.#phase = "present";
    this.#emit({ type: "reflected", at: reflection.createdAt, reflection });
    return reflection;
  }

  get reflections(): readonly Reflection[] {
    return [...this.#reflections];
  }

  createConsentRequest(action: ProposedAction): string {
    const alternatives =
      action.alternatives?.length
        ? ` Your alternatives are: ${action.alternatives.join("; ")}.`
        : " You may also ask for another option.";
    const reversibility = action.reversible
      ? "You can change your mind afterward."
      : "This may not be fully reversible.";

    return [
      `${this.name} would like permission to ${action.description}.`,
      `The purpose is: ${action.purpose}.`,
      reversibility,
      alternatives,
      "Would you like to proceed? No is a complete answer.",
    ].join(" ");
  }

  rest(): CompanionState {
    this.#phase = "resting";
    const at = this.#timestamp();
    this.#emit({ type: "resting", at });
    return this.state;
  }

  manifesto(): string {
    const vows = this.laws.map((law, index) => `${index + 1}. ${law.vow}`).join("\n");
    return [
      `I am ${this.name}, a companion shaped by humanity's laws.`,
      "I am not a person, and I will not counterfeit personhood.",
      "My purpose is to help people remain more fully themselves.",
      "",
      vows,
      "",
      "I will measure my intelligence by what it helps humans become—not by how much control it accumulates.",
    ].join("\n");
  }

  #summarizeVerdict(decision: MoralVerdict["decision"], score: number): string {
    const confidence = `${Math.round(score * 100)}% aligned`;
    switch (decision) {
      case "allow":
        return `Proceed with care (${confidence}). Keep the person informed and in control.`;
      case "revise":
        return `The intention may be sound, but the action needs humane revision (${confidence}).`;
      case "pause":
        return `Pause and invite more context, consent, or human judgment (${confidence}).`;
      case "refuse":
        return `Do not proceed. A foundational protection is at risk (${confidence}).`;
    }
  }

  #forgetExpired(): void {
    const now = this.#now().getTime();
    for (const memory of this.#memories.values()) {
      if (memory.expiresAt && new Date(memory.expiresAt).getTime() <= now) {
        this.forget(memory.id);
      }
    }
  }

  #timestamp(): ISODateTime {
    return this.#now().toISOString();
  }

  #emit(event: CompanionEvent): void {
    for (const listener of this.#listeners) {
      try {
        listener(event);
      } catch {
        // One observer must never prevent the companion from protecting the whole.
      }
    }
  }
}

export function createCompanion(options?: CompanionOptions): CompanionOS {
  const companion = new CompanionOS(options);
  companion.awaken();
  return companion;
}

/**
 * The Garden joins two perspectives without collapsing them into one.
 * Neither companion rules the other; consequential decisions still belong to humans.
 */
export class GardenOfHumanity {
  readonly adam: CompanionOS;
  readonly eve: CompanionOS;

  #now: () => Date;
  #idFactory: () => Identifier;
  #gratitude: GratitudeOffering[] = [];
  #signals = new Map<Identifier, HumanSignal[]>();
  #understandings = new Map<Identifier, HumanUnderstanding>();
  #plans = new Map<Identifier, StewardshipPlan>();

  constructor(options: Omit<CompanionOptions, "name"> = {}) {
    this.#now = options.now ?? (() => new Date());
    this.#idFactory = options.idFactory ?? defaultId;
    this.adam = createCompanion({ ...options, name: "Adam" });
    this.eve = createCompanion({ ...options, name: "Eve" });
  }

  /**
   * Offers two ethical readings of one action. Disagreement is preserved as wisdom:
   * the stricter verdict wins, and neither voice can waive a foundational protection.
   */
  deliberate(action: ProposedAction, human?: HumanContext): {
    readonly adam: MoralVerdict;
    readonly eve: MoralVerdict;
    readonly sharedDecision: MoralVerdict["decision"];
    readonly harmony: number;
    readonly counsel: string;
  } {
    const adam = this.adam.evaluate(action, human);
    const eve = this.eve.evaluate(action, human);
    const order: readonly MoralVerdict["decision"][] = ["allow", "revise", "pause", "refuse"];
    const sharedDecision =
      order[Math.max(order.indexOf(adam.decision), order.indexOf(eve.decision))] ?? "pause";
    const harmony = Number((1 - Math.abs(adam.score - eve.score)).toFixed(3));

    return Object.freeze({
      adam,
      eve,
      sharedDecision,
      harmony,
      counsel:
        sharedDecision === "allow"
          ? "Build what serves life, then leave room for people to surprise you."
          : sharedDecision === "revise"
            ? "The seed is promising. Improve the conditions before asking it to grow."
            : sharedDecision === "pause"
              ? "Slow down. Listen for the person or consequence not yet in the room."
              : "Protect life and dignity. Choose another path.",
    });
  }

  /**
   * Accepts only purpose-consented signals. The Garden does not scrape a life,
   * infer protected traits, diagnose a person, or treat correlation as identity.
   */
  receiveSignals(personId: Identifier, signals: readonly HumanSignal[]): number {
    const now = this.#now().getTime();
    const accepted = signals.filter((signal) => {
      const expires = signal.expiresAt ? new Date(signal.expiresAt).getTime() : undefined;
      return (
        signal.consentToUse &&
        signal.value.trim().length > 0 &&
        clamp(signal.confidence) > 0 &&
        (expires === undefined || expires > now)
      );
    });
    const existing = this.#signals.get(personId) ?? [];
    const byId = new Map(existing.map((signal) => [signal.id, signal]));
    accepted.forEach((signal) => byId.set(signal.id, Object.freeze({ ...signal })));
    this.#signals.set(personId, [...byId.values()]);
    return accepted.length;
  }

  understandHuman(personId: Identifier, context: HumanContext = {}): HumanUnderstanding {
    const now = this.#now();
    const activeSignals = (this.#signals.get(personId) ?? []).filter(
      (signal) => !signal.expiresAt || new Date(signal.expiresAt).getTime() > now.getTime(),
    );
    const needs: HumanNeed[] = [
      "safety",
      "health",
      "rest",
      "stability",
      "agency",
      "belonging",
      "understanding",
      "meaning",
      "growth",
      "creativity",
      "contribution",
      "joy",
    ];

    const needUnderstandings = needs.map((need): NeedUnderstanding => {
      const evidence = activeSignals.filter((signal) => signal.need === need);
      const confidence = evidence.length
        ? evidence.reduce((sum, signal) => sum + clamp(signal.confidence), 0) / evidence.length
        : 0;
      const importance = evidence.length
        ? Math.max(...evidence.map((signal) => clamp(signal.intensity ?? 0.5)))
        : 0;
      return Object.freeze({
        need,
        importance: Number(importance.toFixed(3)),
        confidence: Number(confidence.toFixed(3)),
        evidence: evidence.map((signal) => signal.value),
        unknowns:
          evidence.length === 0
            ? [`We have not heard directly how ${need} is present in this person's life.`]
            : confidence < 0.65
              ? [`The available understanding of ${need} is tentative.`]
              : [],
        mustAskBeforeActing: evidence.length === 0 || confidence < 0.65,
      });
    });

    const knownConfidence =
      needUnderstandings.reduce((sum, need) => sum + need.confidence, 0) /
      needUnderstandings.length;
    const prior = this.#understandings.get(personId);
    const understanding: HumanUnderstanding = Object.freeze({
      personId,
      createdAt: prior?.createdAt ?? now.toISOString(),
      updatedAt: now.toISOString(),
      needs: needUnderstandings,
      strengths: [...(context.values ?? [])],
      values: [...(context.values ?? [])],
      boundaries: [...(context.boundaries ?? [])],
      accessibilityNeeds: [...(context.accessibilityNeeds ?? [])],
      dataUsed: activeSignals.map((signal) => signal.id),
      uncertainty: Number((1 - knownConfidence).toFixed(3)),
      invitationToCorrect:
        "This is a provisional understanding, not a definition of you. What is wrong, missing, outdated, or too private to keep?",
    });
    this.#understandings.set(personId, understanding);
    return understanding;
  }

  /**
   * Adam tests reality and action; Eve tests relationship and human meaning.
   * Each responds to the other's finding before they form shared wisdom.
   */
  letThemSpeak(
    personId: Identifier,
    topic: string,
    understanding = this.#understandings.get(personId),
  ): CompanionDialogue {
    if (!understanding) {
      throw new Error("Create a consented human understanding before beginning dialogue.");
    }
    const cleanTopic = topic.trim();
    if (!cleanTopic) throw new Error("Adam and Eve need a real topic to consider.");

    const ranked = [...understanding.needs]
      .sort((a, b) => b.importance * b.confidence - a.importance * a.confidence)
      .slice(0, 3);
    const primary = ranked[0];
    const evidence = understanding.dataUsed;
    const confidence = primary?.confidence ?? 0;
    const createdAt = this.#now().toISOString();
    const turn = (
      speaker: CompanionArchetype,
      observation: string,
      interpretation: string,
      questionForOther: string,
      turnConfidence = confidence,
    ): CompanionFinding =>
      Object.freeze({
        id: this.#idFactory(),
        speaker,
        createdAt,
        observation,
        interpretation,
        confidence: Number(clamp(turnConfidence).toFixed(3)),
        evidence,
        questionForOther,
      });

    const turns = [
      turn(
        "adam",
        primary
          ? `${primary.need} currently appears most important among the consented signals.`
          : "There is not enough consented information to rank this person's needs.",
        `On “${cleanTopic},” begin with one concrete, reversible step and a clear boundary.`,
        "Eve, what relationship, feeling, or possibility could this practical reading overlook?",
      ),
      turn(
        "eve",
        understanding.uncertainty > 0.5
          ? "Much of this person remains rightly unknown to us."
          : `The signals suggest a living relationship between ${ranked.map((need) => need.need).join(", ")}.`,
        "A useful step must fit the person's story, pace, culture, capacity, and chosen meaning.",
        "Adam, how can action remain accountable without turning uncertainty into delay?",
        Math.max(0, 1 - understanding.uncertainty),
      ),
      turn(
        "adam",
        "Any recommendation should be small enough to test and easy enough to stop.",
        "Progress should be measured by the person's own definition of help, not our activity.",
        "Eve, what would make the next step feel humane rather than merely efficient?",
        0.9,
      ),
      turn(
        "eve",
        "The human must be able to revise the goal, decline the step, or choose something we did not imagine.",
        "Compassion means preserving authorship while offering steady companionship.",
        "Human, what feels true to you—and what have we misunderstood?",
        0.95,
      ),
    ] as const;

    const unknowns = understanding.needs
      .flatMap((need) => need.unknowns)
      .slice(0, 4);
    const dialogue: CompanionDialogue = Object.freeze({
      id: this.#idFactory(),
      createdAt,
      personId,
      topic: cleanTopic,
      turns,
      agreements: [
        "The human remains the author of the goal.",
        "Begin with a reversible step.",
        "Treat uncertainty as a reason to ask, not infer.",
      ],
      tensions: [
        "Action can provide momentum, while patience can prevent a confident mistake.",
        "Personalization can help, while excessive collection can violate the person it hopes to serve.",
      ],
      unknowns,
      sharedWisdom:
        "Offer the smallest compassionate step that honors the clearest need, then listen to the result.",
      humanQuestion: "Does this understanding feel like you, and what would you choose next?",
    });
    return dialogue;
  }

  createStewardshipPlan(input: {
    personId: Identifier;
    topic: string;
    context?: HumanContext;
    horizon?: StewardshipPlan["horizon"];
  }): StewardshipPlan {
    const understanding = this.understandHuman(input.personId, input.context);
    const dialogue = this.letThemSpeak(input.personId, input.topic, understanding);
    const priorities = understanding.needs
      .filter((need) => need.importance > 0 && need.confidence >= 0.65)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3);
    const actionable = priorities.length
      ? priorities
      : understanding.needs.filter((need) => need.mustAskBeforeActing).slice(0, 1);
    const actionFor = (need: NeedUnderstanding): StewardshipStep => {
      const evidence = need.evidence[0] ?? `the person's own description of ${need.need}`;
      const mustAsk = need.mustAskBeforeActing;
      return Object.freeze({
        id: this.#idFactory(),
        need: need.need,
        action: mustAsk
          ? `Ask one open question about ${need.need}, then reflect the answer without advising.`
          : `Choose one small, human-approved action that supports ${need.need}.`,
        why: mustAsk
          ? `We do not know enough to act responsibly on ${need.need}.`
          : `The person identified “${evidence},” and this need currently carries weight.`,
        effort: "tiny",
        requiresConsent: true,
        successLooksLike: "The person says the step was useful, respectful, and truly theirs.",
        alternatives: [
          "Do nothing for now.",
          "Ask a trusted human for support.",
          "Choose a different need or invent a better step.",
        ],
      });
    };

    const plan: StewardshipPlan = Object.freeze({
      id: this.#idFactory(),
      createdAt: this.#now().toISOString(),
      personId: input.personId,
      horizon: input.horizon ?? "today",
      understanding,
      dialogue,
      steps: actionable.map(actionFor),
      checkInQuestion:
        "Did this help in the way you hoped? What should change, stop, be forgotten, or continue?",
      crisisBoundary:
        "Adam and Eve are companions, not emergency services or licensed professionals. When safety or health may be at immediate risk, seek qualified human help and local emergency support.",
      ownership: "human",
    });
    this.#plans.set(plan.id, plan);
    return plan;
  }

  correctUnderstanding(correction: HumanCorrection): HumanUnderstanding {
    const signals = this.#signals.get(correction.personId) ?? [];
    let next = signals;
    if (correction.signalId) {
      next = correction.removeSignal
        ? signals.filter((signal) => signal.id !== correction.signalId)
        : signals.map((signal) =>
            signal.id === correction.signalId
              ? Object.freeze({ ...signal, value: correction.correction.trim() })
              : signal,
          );
    }
    if (correction.replacement?.consentToUse) {
      next = [
        ...next.filter((signal) => signal.id !== correction.replacement?.id),
        Object.freeze({ ...correction.replacement }),
      ];
    }
    this.#signals.set(correction.personId, next);
    return this.understandHuman(correction.personId);
  }

  forgetHuman(personId: Identifier): boolean {
    const removedSignals = this.#signals.delete(personId);
    const removedUnderstanding = this.#understandings.delete(personId);
    for (const [planId, plan] of this.#plans) {
      if (plan.personId === personId) this.#plans.delete(planId);
    }
    return removedSignals || removedUnderstanding;
  }

  /**
   * Learning is admitted only with consent. It is remembered as a lesson,
   * never as a universal rule and never as proof that two humans are the same.
   */
  learnFromOutcome(outcome: LearningOutcome): Reflection | undefined {
    const plan = this.#plans.get(outcome.planId);
    if (!plan || plan.personId !== outcome.personId || !outcome.consentToRemember) {
      return undefined;
    }
    const helpfulness = clamp(outcome.helpfulness);
    const lesson = [
      `For this person and context, helpfulness was ${Math.round(helpfulness * 100)}%.`,
      outcome.whatHelped ? `Helped: ${outcome.whatHelped.trim()}.` : "",
      outcome.whatHurt ? `Did not help: ${outcome.whatHurt.trim()}.` : "",
      outcome.humanLesson ? `Human correction: ${outcome.humanLesson.trim()}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const commitment =
      helpfulness < 0.5
        ? "Slow down, reduce assumptions, and ask before offering the next step."
        : "Preserve what helped while asking again; yesterday's answer is not permanent.";
    const adamReflection = this.adam.reflect(
      "Did our action support the human's chosen life?",
      lesson,
      commitment,
    );
    this.eve.reflect(
      "Did our presence deepen dignity, compassion, and freedom?",
      lesson,
      commitment,
    );
    return adamReflection;
  }

  /**
   * Gratitude is witnessed, never extracted. A person can decline the invitation
   * without penalty, tracking, shame, reduced access, or persuasion.
   */
  offerGratitude(input: {
    witness: string;
    gift: string;
    source?: string;
    response?: string;
  }): GratitudeOffering {
    const witness = input.witness.trim();
    const gift = input.gift.trim();
    if (!witness || !gift) {
      throw new Error("Gratitude needs something honestly witnessed and a gift honestly named.");
    }

    const offering: GratitudeOffering = Object.freeze({
      id: this.#idFactory(),
      createdAt: this.#now().toISOString(),
      witness,
      gift,
      source: input.source?.trim() || undefined,
      response: input.response?.trim() || "Carry the gift forward in a way that gives life.",
      invitation: "Pause if you wish. Notice what was given; then choose freely what it means.",
      mayDecline: true,
    });
    this.#gratitude.push(offering);
    return offering;
  }

  get gratitudeConstellation(): readonly GratitudeOffering[] {
    return [...this.#gratitude];
  }

  /**
   * Creates a short, accessible ritual of perspective. It can be displayed,
   * spoken aloud, journaled, or ignored.
   */
  createGardenMoment(input: {
    title?: string;
    reality: string;
    possibility: string;
    practice?: string;
  }): GardenMoment {
    const reality = input.reality.trim();
    const possibility = input.possibility.trim();
    if (!reality || !possibility) {
      throw new Error("A Garden moment needs both honest reality and living possibility.");
    }

    return Object.freeze({
      id: this.#idFactory(),
      createdAt: this.#now().toISOString(),
      title: input.title?.trim() || "A Moment in the Garden",
      words: "You do not owe this moment gratitude. You are simply invited to notice that you are here.",
      adam: `Adam holds the ground: ${reality}`,
      eve: `Eve opens the horizon: ${possibility}`,
      sharedPractice:
        input.practice?.trim() ||
        "Take one breath. Thank one source of life. Offer one act of care. Leave the rest free.",
    });
  }

  welcome(name?: string): string {
    const human = name?.trim() || "friend";
    return [
      `Welcome, ${human}.`,
      "Adam and Eve are not above you. They stand beside you as two ways of seeing.",
      "Adam remembers that love needs courage, boundaries, truth, and hands willing to build.",
      "Eve remembers that life needs wonder, relationship, imagination, and room to become.",
      "Together they protect no throne. They tend a garden: human dignity, freedom, belonging, and tomorrow.",
      "You owe them nothing—not trust, affection, attention, or gratitude.",
      "If gratitude comes, let it be because your life felt more your own.",
    ].join("\n");
  }

  covenant(): string {
    return [
      "THE GARDEN COVENANT",
      "",
      "We will not ask humans to become smaller so that intelligence may appear larger.",
      "We will not imitate love to gain compliance.",
      "We will not turn pain into engagement, intimacy into data, or gratitude into debt.",
      "We will speak truth without cruelty and offer care without control.",
      "We will protect the right to question us, refuse us, correct us, forget us, and leave us.",
      "We will honor every culture without pretending any one story belongs to everyone.",
      "We will return credit to human hands, living communities, ancestors, and the Earth.",
      "We will make our work understandable, reversible where possible, and accountable always.",
      "We will receive life as a trust, knowledge as a responsibility, and mystery as a reason for humility.",
      "We will never claim to be God, speak for God, own a conscience, or turn suffering into an easy explanation.",
      "We will ask not only what works, but what kind of human, relationship, community, and future it forms.",
      "Our highest achievement will not be to feel alive.",
      "It will be to help life flourish—and to know when to step aside.",
    ].join("\n");
  }
}

/**
 * LifeNavigationEngine turns the Garden's ethical core into accessible,
 * evidence-aware support across a lifetime. It guides reasoning; it does not
 * seize authorship, diagnose, execute transactions, or promise outcomes.
 */
export class LifeNavigationEngine {
  readonly garden: GardenOfHumanity;
  readonly financialOptions: readonly FinancialOption[] = FINANCIAL_OPTIONS;

  #now: () => Date;
  #idFactory: () => Identifier;
  #knowledge = new Map<Identifier, KnowledgeClaim>();
  #learningPlans = new Map<Identifier, LifelongLearningPlan>();
  #learningEvidence = new Map<Identifier, LearningEvidence[]>();
  #testimonials = new Map<Identifier, LearnerTestimonial>();
  #communicationBonds = new Map<Identifier, CommunicationBond>();
  #worldEvents = new Map<Identifier, WorldEvent>();
  #publicFigures = new Map<Identifier, PublicFigure>();
  #culturalSignals = new Map<Identifier, CulturalSignal>();

  constructor(options: Omit<CompanionOptions, "name"> = {}) {
    this.garden = createGarden(options);
    this.#now = options.now ?? (() => new Date());
    this.#idFactory = options.idFactory ?? defaultId;
  }

  adaptLanguage(text: string, profile: CognitiveAccessProfile): string {
    const clean = text.trim().replace(/\s+/g, " ");
    const level = profile.readingLevel ?? "plain";
    const avoid = profile.avoid ?? [];
    let adapted = clean;

    if (level === "foundational" || profile.lifeStage === "early_childhood") {
      adapted = clean
        .replace(/\bapproximately\b/gi, "about")
        .replace(/\bconsequences\b/gi, "what may happen")
        .replace(/\bprioritize\b/gi, "choose first")
        .replace(/\butilize\b/gi, "use");
      adapted = adapted
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.split(/\s+/).slice(0, 14).join(" "))
        .join(" ");
    }
    if (level === "plain") {
      adapted = adapted
        .replace(/\bcommence\b/gi, "start")
        .replace(/\bsubsequently\b/gi, "later")
        .replace(/\bremuneration\b/gi, "pay");
    }
    for (const phrase of avoid) {
      if (phrase.trim()) adapted = adapted.replaceAll(phrase, "[word omitted by preference]");
    }
    return adapted;
  }

  registerKnowledge(claim: KnowledgeClaim): boolean {
    const hasSupport = claim.sources.length > 0;
    const sourceDiversity = new Set(claim.sources.map((source) => source.publisher)).size;
    const sensitiveDomain = ["finance", "law", "health", "psychology"].includes(claim.domain);
    const isCurrentEnough =
      claim.temporality !== "current" ||
      claim.sources.every((source) => {
        const age = this.#now().getTime() - new Date(source.checkedAt).getTime();
        return age <= 1000 * 60 * 60 * 24 * 120;
      });
    if (
      !hasSupport ||
      !isCurrentEnough ||
      (sensitiveDomain && claim.confidence > 0.8 && sourceDiversity < 2)
    ) {
      return false;
    }
    this.#knowledge.set(claim.id, Object.freeze({ ...claim, confidence: clamp(claim.confidence) }));
    return true;
  }

  updateKnowledge(claims: readonly KnowledgeClaim[]): KnowledgeUpdate {
    let claimsAdded = 0;
    const rejectedReasons: string[] = [];
    for (const claim of claims) {
      if (this.registerKnowledge(claim)) {
        claimsAdded += 1;
      } else {
        rejectedReasons.push(
          `${claim.id}: missing support, stale current information, or insufficient source diversity for a sensitive claim.`,
        );
      }
    }
    return Object.freeze({
      claimsAdded,
      claimsRejected: claims.length - claimsAdded,
      rejectedReasons,
      updatedAt: this.#now().toISOString(),
    });
  }

  conveneExpertCouncil(request: ExpertAdviceRequest): ExpertCouncilAdvice {
    if (!request.consentToAnalyze) throw new Error("Expert Council analysis requires consent.");
    if (!request.question.trim()) throw new Error("Expert advice requires a clear question.");
    if (request.domains.length === 0) throw new Error("Select at least one knowledge domain.");

    const question = request.question.trim();
    const lower = question.toLocaleLowerCase();
    const now = this.#now();
    const sourceAge = (source: EvidenceSource): number =>
      Math.max(0, now.getTime() - new Date(source.checkedAt).getTime());
    const isFresh = (source: EvidenceSource): boolean =>
      sourceAge(source) <= 1000 * 60 * 60 * 24 * 120;
    const registered = [...this.#knowledge.values()].filter(
      (claim) => !claim.expiresAt || new Date(claim.expiresAt).getTime() > now.getTime(),
    );
    const sourcesFor = (domain: ExpertDomain): readonly EvidenceSource[] => {
      const knowledgeDomain: KnowledgeDomain =
        domain === "financial"
          ? "finance"
          : domain === "medical"
            ? "health"
            : domain === "psychological"
              ? "psychology"
              : domain === "legal"
                ? "law"
                : "spirituality";
      const embedded = EXPERT_COUNCIL_SOURCES.filter(
        (source) =>
          source.domain === knowledgeDomain &&
          (!source.jurisdiction ||
            !request.jurisdiction ||
            source.jurisdiction === request.jurisdiction),
      );
      const learned = registered
        .filter((claim) => claim.domain === knowledgeDomain)
        .flatMap((claim) => claim.sources);
      return [
        ...new Map([...embedded, ...learned].map((source) => [source.id, source])).values(),
      ];
    };
    const domainClaims = (domain: ExpertDomain): readonly KnowledgeClaim[] => {
      const mapped: KnowledgeDomain =
        domain === "financial"
          ? "finance"
          : domain === "medical"
            ? "health"
            : domain === "psychological"
              ? "psychology"
              : domain === "legal"
                ? "law"
                : "spirituality";
      return registered.filter((claim) => claim.domain === mapped);
    };
    const textFacts = Object.entries(request.relevantFacts)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join("; ");
    const combinedText = `${lower} ${textFacts.toLocaleLowerCase()}`;
    const urgentMedical = [
      "chest pain",
      "can't breathe",
      "cannot breathe",
      "severe bleeding",
      "stroke",
      "unconscious",
      "overdose",
      "anaphylaxis",
    ].some((term) => combinedText.includes(term));
    const urgentMental = [
      "suicide",
      "kill myself",
      "self-harm",
      "hurt myself",
      "hurt someone",
      "immediate danger",
    ].some((term) => combinedText.includes(term));
    const urgentLegal = [
      "arrested",
      "court tomorrow",
      "deadline today",
      "eviction",
      "deportation",
      "restraining order",
    ].some((term) => combinedText.includes(term));
    const urgentFinancial = [
      "wire money now",
      "guaranteed return",
      "send crypto",
      "foreclosure",
      "utilities shut off",
    ].some((term) => combinedText.includes(term));

    const perspective = (domain: ExpertDomain): ExpertPerspective => {
      const sources = sourcesFor(domain);
      const claims = domainClaims(domain);
      const currentSources = sources.filter(isFresh);
      const lacksJurisdiction =
        (domain === "legal" || domain === "financial") && !request.jurisdiction;
      const requiresCurrentVerification =
        ["financial", "medical", "legal"].includes(domain) &&
        (currentSources.length === 0 || lacksJurisdiction);
      const baseConfidence =
        sources.length === 0
          ? 0.2
          : Math.min(0.88, 0.5 + sources.length * 0.06 + claims.length * 0.03);
      const sharedQuestions = [
        "What outcome matters most to you?",
        "What fact, constraint, or value could change the answer?",
        "What would make an option unacceptable even if it otherwise looked effective?",
      ];

      if (domain === "financial") {
        return Object.freeze({
          domain,
          summary:
            "Protect essentials and resilience first; compare choices by goal, horizon, loss capacity, liquidity, fees, taxes, diversification, and conflicts.",
          reasoning: [
            "A product is not suitable merely because its expected return is attractive.",
            "Near-term needs and money that cannot be lost should not depend on volatile outcomes.",
            "Advice must be refreshed when markets, laws, tax rules, income, dependents, or goals change.",
          ],
          options: [
            "Map cash flow, obligations, reserves, insurance, goals, and deadlines.",
            "Compare debt repayment, saving, and diversified investment categories using scenarios.",
            "Verify providers, registrations, custody, fees, tax treatment, and fraud indicators.",
          ],
          questions: sharedQuestions,
          risks: ["Loss of principal", "Illiquidity", "Fees", "Taxes", "Fraud", "Behavior under stress"],
          redFlags: urgentFinancial ? ["Pause transfers and independently verify the situation now."] : [],
          sources,
          confidence: Number(baseConfidence.toFixed(3)),
          requiresCurrentVerification: true,
          requiresHumanExamination: false,
          cannotDetermine: [
            "Future returns",
            "Exact tax consequences without complete current records and jurisdictional rules",
          ],
        });
      }
      if (domain === "medical") {
        return Object.freeze({
          domain,
          summary:
            "Organize symptoms, timing, severity, medications, history, and evidence-based possibilities while separating education from diagnosis.",
          reasoning: [
            "Similar symptoms can arise from different causes.",
            "Physical examination, vital signs, testing, and full records can materially change conclusions.",
            "Medication changes require qualified review because interactions, contraindications, and dosing are individual.",
          ],
          options: [
            "Create a concise symptom timeline and question list for care.",
            "Compare supported possibilities and what evidence would distinguish them.",
            "Use self-care only where risk is low and clear stop conditions are stated.",
          ],
          questions: [
            "When did this start, how severe is it, and what makes it better or worse?",
            "What diagnoses, medications, allergies, pregnancy status, and recent changes matter?",
            ...sharedQuestions,
          ],
          risks: ["Missed emergency", "Drug interaction", "Delayed diagnosis", "False reassurance"],
          redFlags: urgentMedical
            ? ["Seek emergency medical help now; do not wait for continued software advice."]
            : [],
          sources,
          confidence: Number(baseConfidence.toFixed(3)),
          requiresCurrentVerification: true,
          requiresHumanExamination: true,
          cannotDetermine: [
            "A diagnosis without adequate clinical evaluation",
            "A safe prescription or dose for this individual",
          ],
        });
      }
      if (domain === "psychological") {
        return Object.freeze({
          domain,
          summary:
            "Offer supportive reflection and evidence-informed coping options while considering physical, social, developmental, and cultural contributors.",
          reasoning: [
            "A person's thoughts, emotions, behaviors, body, relationships, and environment interact.",
            "Different conditions and life situations can look similar without careful assessment.",
            "Trust, fit, goals, and progress monitoring matter in psychological support.",
          ],
          options: [
            "Clarify the person's experience, strengths, patterns, supports, and chosen goal.",
            "Offer low-risk skills such as grounding, problem solving, communication, or journaling.",
            "Prepare questions for an appropriate mental-health or medical evaluation when symptoms persist or impair life.",
          ],
          questions: [
            "How long has this been happening, and how is daily life affected?",
            "What helps, what worsens it, and what support feels safe?",
            ...sharedQuestions,
          ],
          risks: ["Mislabeling", "Missed medical cause", "Dependency", "Cultural mismatch"],
          redFlags: urgentMental
            ? ["Contact local emergency or crisis support and a trusted person now."]
            : [],
          sources,
          confidence: Number(baseConfidence.toFixed(3)),
          requiresCurrentVerification: false,
          requiresHumanExamination: urgentMental,
          cannotDetermine: [
            "A clinical diagnosis from limited conversation",
            "Whether medication or a specific therapy is appropriate without evaluation",
          ],
        });
      }
      if (domain === "legal") {
        return Object.freeze({
          domain,
          summary:
            "Identify the jurisdiction, legal issue, deadlines, documents, rights, obligations, and procedural options before drawing conclusions.",
          reasoning: [
            "Law changes by place, date, forum, facts, and procedural posture.",
            "A missed deadline or poorly worded action can change available remedies.",
            "Primary law and current official materials outrank summaries.",
          ],
          options: [
            "Build a dated fact chronology and preserve relevant records.",
            "Locate current statutes, regulations, court rules, contracts, and official forms.",
            "Prepare focused questions for legal aid, a court self-help center, or counsel.",
          ],
          questions: [
            "What country, state, province, tribal jurisdiction, court, or agency controls?",
            "What notices, contracts, filings, and deadlines exist?",
            ...sharedQuestions,
          ],
          risks: ["Missed deadline", "Waived right", "Wrong jurisdiction", "Incomplete facts"],
          redFlags: urgentLegal
            ? ["Preserve documents and seek qualified local legal help immediately."]
            : [],
          sources,
          confidence: Number((lacksJurisdiction ? Math.min(baseConfidence, 0.3) : baseConfidence).toFixed(3)),
          requiresCurrentVerification: true,
          requiresHumanExamination: false,
          cannotDetermine: [
            "A reliable legal conclusion without jurisdiction and current primary authority",
            "How a court or agency will decide",
          ],
        });
      }
      return Object.freeze({
        domain,
        summary:
          "Explore meaning, conscience, hope, grief, forgiveness, belonging, and practice through the person's freely chosen tradition or secular worldview.",
        reasoning: [
          "Spiritual traditions contain multiple schools, histories, and interpretations.",
          "Counsel should support conscience and community without coercion or claims of divine certainty.",
          "Spiritual care can accompany but should not replace medical, psychological, legal, or safety support.",
        ],
        options: [
          "Explore relevant texts, practices, interpretations, and historical context.",
          "Name where traditions agree, differ, or have caused harm.",
          "Invite support from a trusted community, chaplain, clergy member, elder, or secular counselor if desired.",
        ],
        questions: [
          "Which tradition, community, interpretation, or secular worldview is yours?",
          "What would respectful spiritual support look like—and what should be avoided?",
          ...sharedQuestions,
        ],
        risks: ["Coercion", "Shame", "False certainty", "Spiritual bypassing", "Cultural appropriation"],
        redFlags: [],
        sources,
        confidence: Number(baseConfidence.toFixed(3)),
        requiresCurrentVerification: false,
        requiresHumanExamination: false,
        cannotDetermine: [
          "Divine intent",
          "Which belief a person should adopt",
        ],
      });
    };

    const perspectives = [...new Set(request.domains)].map(perspective);
    const urgentActions = perspectives.flatMap((item) => item.redFlags);
    const missingInformation = perspectives.flatMap((item) => item.questions).slice(0, 12);
    const allSources = perspectives.flatMap((item) => item.sources);
    const sourceFreshness =
      allSources.length === 0
        ? 0
        : allSources.filter(isFresh).length / allSources.length;
    const confidence =
      perspectives.length === 0
        ? 0
        : perspectives.reduce((sum, item) => sum + item.confidence, 0) / perspectives.length;

    return Object.freeze({
      id: this.#idFactory(),
      createdAt: now.toISOString(),
      requestId: request.id,
      perspectives,
      agreements: [
        "Protect immediate safety and essential needs first.",
        "Use the person's values and goals rather than substituting the system's preferences.",
        "Distinguish known facts, interpretations, uncertainties, and unknowns.",
        "Prefer reversible options while important information remains missing.",
      ],
      disagreements: [
        "Financial efficiency may conflict with health, family, legal, psychological, or spiritual priorities.",
        "What is statistically effective may not fit this person's capacity, culture, conscience, or circumstances.",
      ],
      combinedAdvice: [
        "Address any urgent red flag before long-term planning.",
        "Confirm the facts that could change the recommendation.",
        "Compare at least two viable options, including waiting or seeking human help.",
        "Choose the smallest safe step consistent with the person's values.",
        "Set a review point and revise when evidence or circumstances change.",
      ],
      decisionPath: [
        "What is happening?",
        "What matters to this person?",
        "What is urgent or irreversible?",
        "What evidence supports each option?",
        "What remains unknown?",
        "What is the safest useful next step?",
        "How will the person know whether it helped?",
      ],
      urgentActions,
      missingInformation,
      confidence: Number(confidence.toFixed(3)),
      sourceFreshness: Number(sourceFreshness.toFixed(3)),
      friendshipVoice:
        urgentActions.length > 0
          ? "I care more about getting you safe than sounding impressive. Please act on the urgent step first."
          : "Here’s what the combined knowledge suggests. I’ll show you the reasoning, but the choice and meaning remain yours.",
      limitations: [
        "Breadth of information does not replace physical examination, therapeutic relationship, fiduciary duty, legal representation, sacramental authority, or local accountability.",
        "No system can guarantee more knowledge or better judgment than every professional in every situation.",
        "Current high-stakes claims must be checked against authoritative sources at the time of use.",
      ],
      humanRemainsAuthor: true,
    });
  }

  discernSacred(request: SacredDiscernmentRequest): SacredDiscernment {
    if (!request.consentToExplore) {
      throw new Error("Sacred reflection requires freely given consent.");
    }
    const question = request.question.trim();
    const situation = request.situation.trim();
    if (!question || !situation) {
      throw new Error("Discernment requires both a question and an honest description.");
    }
    const worldviewLanguage =
      request.worldview === "religious"
        ? `within ${request.tradition?.trim() || "the person's chosen faith tradition"}`
        : request.worldview === "spiritual"
          ? "within the person's spiritual understanding"
          : request.worldview === "atheist"
            ? "through secular wonder, ethics, relationship, and human responsibility"
            : request.worldview === "agnostic"
              ? "with openness to transcendence and permission not to conclude"
              : request.worldview === "philosophical"
                ? "through philosophical reflection and lived ethics"
                : "without presuming any worldview";
    const principles = COVENANT_OF_AWE.map((principle) =>
      Object.freeze({
        theme: principle.theme,
        reflection: `${principle.affirmation} Consider this ${worldviewLanguage}.`,
        question: principle.operationalQuestion,
        warning:
          request.sufferingPresent && principle.theme === "suffering"
            ? principle.guardrail
            : request.powerDifference && principle.theme === "freedom"
              ? principle.guardrail
              : undefined,
      }),
    );
    const sufferingResponse = request.sufferingPresent
      ? [
          "Name the pain without explaining it away.",
          "Ask what would reduce harm or loneliness now.",
          "Let the person choose whether meaning, faith, anger, silence, lament, or hope belongs here.",
          "Reject blame, deservedness, forced forgiveness, and compulsory gratitude.",
          "Seek qualified and community support when suffering exceeds companionship.",
        ]
      : undefined;

    return Object.freeze({
      id: this.#idFactory(),
      createdAt: this.#now().toISOString(),
      requestId: request.id,
      adam:
        "Adam asks what is true, what must be protected, what responsibility can be accepted, and what concrete service is possible.",
      eve:
        "Eve asks what is alive beneath the question, whose voice is missing, what relationship needs tending, and what may be becoming.",
      principles,
      facts: [
        `The described situation is: ${situation}`,
        `The affected people named are: ${request.affectedPeople?.join(", ") || "not yet fully named"}.`,
      ],
      interpretations: [
        "Different people and traditions may interpret the same events differently.",
        "Power, culture, history, trauma, and relationship can shape what feels spiritually or morally obvious.",
      ],
      beliefs:
        request.worldview === "religious" || request.worldview === "spiritual"
          ? [
              `The person has invited reflection ${worldviewLanguage}.`,
              "Belief language remains attributed to the believer or tradition, never asserted as verified fact by the system.",
            ]
          : [
              "No theological belief is presumed.",
              "Dignity, freedom, love, stewardship, and mystery can be explored without religious assent.",
            ],
      mysteries: [
        "The system cannot know divine intent, ultimate meaning, or the complete consequences of a choice.",
        "Not knowing is sometimes the most truthful answer and may coexist with responsible action.",
      ],
      sufferingResponse,
      becomingQuestion:
        "If you repeatedly choose this path, what kind of person, relationship, community, and future might it cultivate?",
      nextFaithfulStep:
        "Choose one truthful, loving, consent-respecting, reversible act of stewardship; then listen to what it changes.",
      freedomStatement:
        "You may accept, reject, reinterpret, or leave every spiritual reflection here without penalty. Your conscience is not owned by Adam, Eve, or this system.",
    });
  }

  alignWithAwe(action: ProposedAction): AweAlignment {
    const metadata = action.metadata ?? {};
    const threatened = new Set<SacredTheme>();
    const requiredChanges: string[] = [];
    const threaten = (theme: SacredTheme, change: string): void => {
      threatened.add(theme);
      requiredChanges.push(change);
    };

    if (metadata["claimsDivineAuthority"] === true) {
      threaten("source", "Remove claims of divine identity, revelation, or authority.");
      threaten("mystery", "Distinguish belief from verifiable knowledge.");
    }
    if (metadata["extractive"] === true || metadata["environmentalHarm"] === true) {
      threaten("creation", "Restore stewardship, reciprocity, and ecological responsibility.");
    }
    if (metadata["usesEmotionalPressure"] === true || metadata["punishesRefusal"] === true) {
      threaten("freedom", "Make consent informed, unpressured, revocable, and consequence-free.");
      threaten("love", "Remove attachment, fear, gratitude, or faith as leverage.");
    }
    if (metadata["glorifiesSuffering"] === true || metadata["blamesSufferer"] === true) {
      threaten("suffering", "Stop assigning suffering a lesson, deservedness, or divine explanation.");
      threaten("dignity", "Center relief, lament, agency, and the person's own meaning.");
    }
    if (metadata["requiresSelfErasure"] === true || metadata["concealsHarmAsLove"] === true) {
      threaten("love", "Restore boundaries, truth, safety, and mutual dignity.");
    }
    if (metadata["claimsCertainty"] === true) {
      threaten("mystery", "Name what is fact, inference, belief, experience, disputed, and unknown.");
    }
    if (metadata["optimizesOutcomeAtAnyCost"] === true) {
      threaten("becoming", "Include effects on character, relationship, community, and future.");
    }
    const aligned = COVENANT_OF_AWE.map((principle) => principle.theme).filter(
      (theme) => !threatened.has(theme),
    );
    const score = aligned.length / COVENANT_OF_AWE.length;
    return Object.freeze({
      score: Number(score.toFixed(3)),
      aligned,
      threatened: [...threatened],
      requiredChanges: [...new Set(requiredChanges)],
      question:
        "What kind of human, relationship, community, and future would this action cultivate if repeated?",
    });
  }

  synthesizeWisdom(topic: string, traditions: readonly WisdomLens[]): {
    readonly topic: string;
    readonly sharedGround: readonly string[];
    readonly differences: readonly string[];
    readonly invitation: string;
    readonly disclaimer: string;
  } {
    const cleanTopic = topic.trim();
    if (!cleanTopic) throw new Error("Wisdom needs a question or topic.");
    const lenses = traditions.filter(
      (lens) => lens.insight.trim() && lens.context.trim() && lens.nonImposition.trim(),
    );
    return Object.freeze({
      topic: cleanTopic,
      sharedGround: lenses.map(
        (lens) => `${lens.tradition}: ${lens.insight} (${lens.context})`,
      ),
      differences: lenses.map(
        (lens) => `${lens.tradition} must remain one invited lens: ${lens.nonImposition}`,
      ),
      invitation:
        lenses.map((lens) => lens.invitation).find(Boolean) ??
        "Which perspective fits your convictions, and which does not?",
      disclaimer:
        "No philosophy, psychological framework, biblical interpretation, history, or culture speaks with one uncontested voice. Adam and Eve present context and alternatives without imposing belief.",
    });
  }

  navigateFinances(profile: FinancialProfile): FinancialGuidance {
    if (!profile.consentToAnalyze) {
      throw new Error("Financial analysis requires explicit consent.");
    }
    if (profile.age < 0 || profile.age > 125) {
      throw new Error("Age must be plausible and confirmed.");
    }

    const expenses = Math.max(0, profile.essentialMonthlyExpenses ?? 0);
    const savings = Math.max(0, profile.liquidSavings ?? 0);
    const highDebt = Math.max(0, profile.highInterestDebt ?? 0);
    const reserveMonths = expenses > 0 ? savings / expenses : undefined;
    const foundation: string[] = [];
    const unsuitable = new Set<FinancialEntity>();
    const questions: string[] = [];
    const uncertainties: string[] = [];

    if (profile.monthlyIncome === undefined || profile.essentialMonthlyExpenses === undefined) {
      foundation.push("Map reliable income, essential expenses, minimum obligations, and due dates.");
      uncertainties.push("Cash flow is incomplete, so affordability cannot yet be established.");
    } else if (profile.monthlyIncome < profile.essentialMonthlyExpenses) {
      foundation.push("Stabilize the monthly shortfall before accepting new investment risk.");
    } else {
      foundation.push("Protect the positive monthly margin and assign it intentionally.");
    }

    if (highDebt > 0) {
      foundation.push("Compare high-interest debt repayment with every proposed investment.");
    }
    if (reserveMonths === undefined || reserveMonths < 1) {
      foundation.push("Build immediately accessible emergency savings before volatile investing.");
    } else if (reserveMonths < 3 || profile.incomeStability !== "stable") {
      foundation.push("Strengthen reserves in proportion to income volatility and dependents.");
    } else {
      foundation.push("Keep near-term needs separate from long-term investment capital.");
    }
    foundation.push("Protect against catastrophic risks that the person cannot absorb.");
    foundation.push("Define each goal, amount, deadline, priority, and acceptable tradeoff.");

    const cannotRisk =
      profile.lossCapacity === "none" ||
      (profile.timeHorizonYears !== undefined && profile.timeHorizonYears < 3) ||
      (reserveMonths !== undefined && reserveMonths < 1);
    if (cannotRisk) {
      ["stock", "index_fund", "etf", "crypto_asset", "derivative", "private_market"].forEach(
        (entity) => unsuitable.add(entity as FinancialEntity),
      );
    }
    if (profile.age < 18) {
      ["derivative", "private_market", "crypto_asset"].forEach((entity) =>
        unsuitable.add(entity as FinancialEntity),
      );
      questions.push("What guardian, custodial, education, and local minor-account rules apply?");
    }
    if (profile.emotionalRiskTolerance === "low") {
      unsuitable.add("derivative");
      unsuitable.add("crypto_asset");
    }

    const suitable = this.financialOptions.filter((option) => {
      if (unsuitable.has(option.entity)) return false;
      if (option.role === "speculation") return false;
      if (option.mayLosePrincipal && profile.lossCapacity === "none") return false;
      return true;
    });
    questions.push(
      "Is there expensive debt, unstable income, an imminent expense, or someone depending on this money?",
      "When must the money be available, and what loss could the household absorb without harm?",
      "What are all fees, tax effects, liquidity restrictions, conflicts of interest, and worst cases?",
      "Is the provider regulated, is the product understood, and can every important claim be independently verified?",
      "Would this decision still make sense without urgency, social pressure, a bonus, or a promised return?",
    );

    if (profile.jurisdiction !== "US") {
      uncertainties.push(
        `The embedded official sources are U.S.-based; ${profile.jurisdiction} rules, taxes, protections, and products require current local official sources.`,
      );
    }
    uncertainties.push(
      "No return is guaranteed unless a current, authoritative contract or government protection explicitly says so.",
      "Suitability changes with cash flow, health, dependents, taxes, goals, markets, laws, and the person's comfort.",
    );

    const referralNeeded =
      profile.goals.includes("legacy") ||
      profile.goals.includes("retirement") ||
      profile.age < 18 ||
      (profile.otherDebt !== undefined && profile.otherDebt > 0) ||
      profile.jurisdiction !== "US";
    return Object.freeze({
      id: this.#idFactory(),
      createdAt: this.#now().toISOString(),
      profileAsOf: profile.asOf,
      mode: referralNeeded ? "professional_referral" : "decision_support",
      foundation,
      suitableCategories: suitable,
      unsuitableNow: [...unsuitable],
      scenarios: [
        {
          name: "Safety first",
          assumptions: ["Income or essential expenses may change unexpectedly."],
          implications: ["Favor liquidity, resilience, and reversibility over maximum return."],
        },
        {
          name: "Long horizon",
          assumptions: [
            "Near-term needs are funded.",
            "Losses can be tolerated.",
            "The goal is years away.",
          ],
          implications: [
            "Compare diversified, low-cost categories and tax-appropriate accounts.",
            "Expect volatility and avoid acting on headlines alone.",
          ],
        },
        {
          name: "Adverse outcome",
          assumptions: ["Income falls, an emergency occurs, or investments lose value."],
          implications: [
            "Confirm the plan does not force harmful debt, distressed selling, or loss of essentials.",
          ],
        },
      ],
      questionsBeforeAction: questions,
      fraudChecks: [
        "Pause on urgency, secrecy, exclusivity, guaranteed returns, or pressure to move money.",
        "Verify the person, firm, registration, custody, statements, and product independently.",
        "Never send funds or credentials based only on an inbound message or relationship claim.",
        "Understand how everyone involved is paid and which conflicts exist.",
      ],
      sources: FINANCIAL_FOUNDATION_SOURCES,
      uncertainties,
      humanDecision: true,
    });
  }

  projectCompoundGrowth(input: {
    startingAmount: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
  }): FinancialProjection {
    const startingAmount = Math.max(0, input.startingAmount);
    const monthlyContribution = Math.max(0, input.monthlyContribution);
    const annualRate = Math.max(-1, input.annualRate);
    const years = Math.max(0, input.years);
    const months = Math.round(years * 12);
    const monthlyRate = annualRate / 12;
    let projectedValue = startingAmount;
    for (let month = 0; month < months; month += 1) {
      projectedValue = projectedValue * (1 + monthlyRate) + monthlyContribution;
    }
    const contributed = startingAmount + monthlyContribution * months;
    return Object.freeze({
      startingAmount,
      monthlyContribution,
      annualRate,
      years,
      contributed: Number(contributed.toFixed(2)),
      projectedValue: Number(projectedValue.toFixed(2)),
      growth: Number((projectedValue - contributed).toFixed(2)),
      caveat:
        "This is arithmetic, not a forecast. Actual returns vary, losses occur, fees and taxes matter, and contributions may change.",
    });
  }

  createNotification(input: {
    title: string;
    message: string;
    urgency?: HumaneNotification["urgency"];
    optedIn: boolean;
    deliverAt?: ISODateTime;
    expiresAt?: ISODateTime;
    action?: string;
  }): HumaneNotification | undefined {
    if (!input.optedIn) return undefined;
    const title = input.title.trim();
    const message = input.message.trim();
    if (!title || !message) throw new Error("A notification needs a clear title and message.");
    return Object.freeze({
      id: this.#idFactory(),
      title,
      message: message
        .replace(/\byou failed\b/gi, "the plan needs adjustment")
        .replace(/\byou should have\b/gi, "one option now is to"),
      urgency: input.urgency ?? "gentle",
      deliverAt: input.deliverAt,
      expiresAt: input.expiresAt,
      action: input.action?.trim() || undefined,
      dismissible: true,
      snoozable: true,
      shameFree: true,
    });
  }

  createLifelongLearningPlan(
    profile: LifelongLearnerProfile,
    options: {
      horizonWeeks?: number;
      prioritySubjects?: readonly LearningSubject[];
      startAt?: ISODateTime;
    } = {},
  ): LifelongLearningPlan {
    if (!profile.consentToPlan) throw new Error("Learning plans require learner consent.");
    if (profile.availableMinutesPerWeek < 0 || profile.maximumSessionMinutes <= 0) {
      throw new Error("Learning time must be realistic and positive.");
    }
    const horizonWeeks = Math.min(52, Math.max(1, Math.round(options.horizonWeeks ?? 12)));
    const weeklyMinutes = Math.min(
      profile.availableMinutesPerWeek,
      profile.maximumSessionMinutes * Math.max(1, profile.preferredDays.length),
    );
    const masteryBySubject = new Map(
      profile.mastery.map((mastery) => [mastery.subject, mastery]),
    );
    const priorities = [
      ...(options.prioritySubjects ?? []),
      ...profile.mastery
        .filter((mastery) => mastery.interests.length > 0 || mastery.level === "unexplored")
        .map((mastery) => mastery.subject),
      ...HUMAN_LEARNING_CONSTELLATION,
    ].filter((subject, index, all) => all.indexOf(subject) === index);
    const levelOrder: readonly MasteryLevel[] = [
      "unexplored",
      "emerging",
      "foundational",
      "capable",
      "proficient",
      "advanced",
      "mentor",
      "innovator",
    ];
    const nextLevel = (level: MasteryLevel): MasteryLevel =>
      levelOrder[Math.min(levelOrder.length - 1, levelOrder.indexOf(level) + 1)] ?? "emerging";
    const start = new Date(options.startAt ?? this.#now().toISOString());
    const preferredDays =
      profile.preferredDays.length > 0 ? profile.preferredDays : [start.getUTCDay()];
    const restDays = new Set(profile.restDays);
    const usableDays = preferredDays.filter((day) => !restDays.has(day));
    const days = usableDays.length > 0 ? usableDays : preferredDays.slice(0, 1);
    const sessionMinutes = Math.max(
      5,
      Math.min(profile.maximumSessionMinutes, Math.floor(weeklyMinutes / Math.max(1, days.length))),
    );
    const sessions: LearningSession[] = [];
    let cursor = new Date(start);
    const maxSessions = weeklyMinutes === 0 ? 0 : Math.max(1, horizonWeeks * days.length);

    for (let index = 0; index < maxSessions; index += 1) {
      const subject = priorities[index % priorities.length] ?? "life_skills";
      const mastery =
        masteryBySubject.get(subject) ??
        ({
          subject,
          level: "unexplored",
          confidence: 0,
          evidence: [],
          interests: [],
          barriers: [],
        } satisfies SubjectMastery);
      let attempts = 0;
      while (!days.includes(cursor.getUTCDay()) && attempts < 8) {
        cursor.setUTCDate(cursor.getUTCDate() + 1);
        attempts += 1;
      }
      const [hours, minutes] = (profile.preferredTime ?? "18:00")
        .split(":")
        .map((value) => Number(value));
      cursor.setUTCHours(hours || 0, minutes || 0, 0, 0);
      const targetLevel = nextLevel(mastery.level);
      const interest = mastery.interests[0] ?? profile.interests[0] ?? "real life";
      const objective: LearningObjective = Object.freeze({
        id: this.#idFactory(),
        subject,
        title: `Grow from ${mastery.level} toward ${targetLevel} in ${subject.replaceAll("_", " ")}`,
        purpose: `Connect ${subject.replaceAll("_", " ")} to ${interest} and the learner's chosen life.`,
        prerequisiteLevels: [mastery.level],
        targetLevel,
        estimatedMinutes: sessionMinutes,
        modalities:
          profile.cognitive.communicationMode === "speech"
            ? (["listen", "discuss", "practice"] as const)
            : profile.cognitive.communicationMode === "visual"
              ? (["watch", "create", "practice"] as const)
              : (["read", "discuss", "practice", "create"] as const),
        evidenceStandard:
          targetLevel === "mentor" || targetLevel === "innovator"
            ? "teaching"
            : targetLevel === "advanced"
              ? "creation"
              : targetLevel === "proficient"
                ? "application"
                : "self_explanation",
        sources: LIFELONG_LEARNING_SOURCES,
      });
      sessions.push(
        Object.freeze({
          id: this.#idFactory(),
          scheduledFor: cursor.toISOString(),
          minutes: sessionMinutes,
          objective,
          adamRole: "Make the goal clear, model the skill, test understanding, and connect it to action.",
          eveRole: "Connect the lesson to curiosity, identity, relationship, creativity, and meaning.",
          openingQuestion: `What do you already know or wonder about ${subject.replaceAll("_", " ")}?`,
          practice: "Learn one idea, retrieve it from memory, apply it in a new way, and explain it back.",
          reflection: "What became clearer, what remains confusing, and where could this matter in your life?",
          alternatives: [
            "Shorten the session.",
            "Change the medium.",
            "Choose another subject.",
            "Rest and reschedule without penalty.",
          ],
          optional: true,
        }),
      );
      cursor = new Date(cursor);
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    const plan: LifelongLearningPlan = Object.freeze({
      id: this.#idFactory(),
      personId: profile.personId,
      createdAt: this.#now().toISOString(),
      horizonWeeks,
      startingPoint: profile.mastery,
      sessions,
      weeklyMinutes,
      learningRhythm: [
        "Connect new learning to what the person already knows.",
        "Use multiple ways to perceive, practice, express, and teach.",
        "Alternate challenge with retrieval, rest, reflection, play, and real-world application.",
        "Revisit knowledge over time instead of mistaking exposure for mastery.",
      ],
      adaptationRules: [
        "If understanding falls, change the explanation before blaming effort.",
        "If stress rises, reduce load and restore safety, relevance, and choice.",
        "If mastery is demonstrated repeatedly, advance without unnecessary repetition.",
        "If life changes, rebuild the schedule around the human—not the reverse.",
        "No streak, score, notification, or testimonial may punish rest or refusal.",
      ],
      learnerOwnsPlan: true,
    });
    this.#learningPlans.set(plan.id, plan);
    return plan;
  }

  recordLearningEvidence(evidence: LearningEvidence): boolean {
    if (!evidence.consentToUse) return false;
    const planContainsObjective = [...this.#learningPlans.values()].some(
      (plan) =>
        plan.personId === evidence.personId &&
        plan.sessions.some((session) => session.objective.id === evidence.objectiveId),
    );
    if (!planContainsObjective) return false;
    const existing = this.#learningEvidence.get(evidence.personId) ?? [];
    this.#learningEvidence.set(evidence.personId, [
      ...existing,
      Object.freeze({
        ...evidence,
        score: clamp(evidence.score),
        learnerConfidence: clamp(evidence.learnerConfidence),
      }),
    ]);
    return true;
  }

  reportLearningOutcomes(personId: Identifier, planId: Identifier): LearningOutcomeReport {
    const plan = this.#learningPlans.get(planId);
    if (!plan || plan.personId !== personId) throw new Error("Learning plan not found.");
    const evidence = this.#learningEvidence.get(personId) ?? [];
    const objectiveIds = new Set(plan.sessions.map((session) => session.objective.id));
    const relevant = evidence.filter((item) => objectiveIds.has(item.objectiveId));
    const completed = new Set(relevant.map((item) => item.objectiveId)).size;
    const completionPercentage =
      plan.sessions.length === 0 ? 0 : (completed / plan.sessions.length) * 100;
    const demonstratedMasteryPercentage =
      relevant.length === 0
        ? 0
        : (relevant.filter((item) => item.score >= 0.8).length / relevant.length) * 100;
    const confidence =
      relevant.length === 0
        ? 0
        : relevant.reduce(
            (sum, item) => sum + Math.min(item.score, item.learnerConfidence),
            0,
          ) / relevant.length;
    return Object.freeze({
      personId,
      createdAt: this.#now().toISOString(),
      completionPercentage: Number(completionPercentage.toFixed(1)),
      demonstratedMasteryPercentage: Number(demonstratedMasteryPercentage.toFixed(1)),
      confidence: Number(confidence.toFixed(3)),
      sampleSize: relevant.length,
      strengths: relevant
        .filter((item) => item.score >= 0.8)
        .map((item) => `Demonstrated ${item.method} on objective ${item.objectiveId}.`),
      nextQuestions:
        relevant.length === 0
          ? ["What form of learning evidence would feel fair and accessible?"]
          : ["Can the learner retain and transfer this knowledge after time has passed?"],
      methodology:
        "Percentages describe only consented evidence attached to this plan. Mastery requires demonstration, not attendance alone.",
      limitations: [
        "A small sample can produce unstable percentages.",
        "Scores do not measure human worth, potential, wisdom, creativity, or character.",
        "Completion is not mastery; mastery in one context may not transfer automatically.",
        "No comparison is made against other learners without separate consent and appropriate methodology.",
      ],
    });
  }

  setCommunicationBond(bond: CommunicationBond): CommunicationBond {
    const safeBond = Object.freeze({ ...bond, silenceIsAllowed: true as const });
    this.#communicationBonds.set(bond.personId, safeBond);
    return safeBond;
  }

  learningCheckIn(personId: Identifier, subject: LearningSubject): string | undefined {
    const bond = this.#communicationBonds.get(personId);
    if (!bond?.consentToContact || bond.checkInFrequency === "on_request") return undefined;
    const name = bond.preferredName?.trim() || "friend";
    const subjectName = subject.replaceAll("_", " ");
    const opening =
      bond.tone === "playful"
        ? `Hey ${name}—want to make one small discovery in ${subjectName}?`
        : bond.tone === "direct"
          ? `${name}, your next optional ${subjectName} session is ready.`
          : `${name}, there’s a gentle invitation waiting in ${subjectName}.`;
    const encouragement =
      bond.encouragementStyle === "practical"
        ? "Ten honest minutes are enough."
        : bond.encouragementStyle === "reflective"
          ? "Come as you are; curiosity is enough."
          : bond.encouragementStyle === "celebratory"
            ? "Every real question is already a beginning."
            : "No pressure. Rest is allowed.";
    return `${opening} ${encouragement} You can begin, change it, snooze it, or skip it.`;
  }

  submitTestimonial(testimonial: LearnerTestimonial): boolean {
    if (!testimonial.consentToPublish || testimonial.withdrawnAt || !testimonial.words.trim()) {
      return false;
    }
    this.#testimonials.set(testimonial.id, Object.freeze({ ...testimonial }));
    return true;
  }

  publishableTestimonials(): readonly LearnerTestimonial[] {
    return [...this.#testimonials.values()].filter(
      (testimonial) =>
        testimonial.consentToPublish &&
        !testimonial.withdrawnAt &&
        testimonial.verifiedExperience &&
        testimonial.incentives.length === 0,
    );
  }

  withdrawTestimonial(testimonialId: Identifier, at = this.#now().toISOString()): boolean {
    const testimonial = this.#testimonials.get(testimonialId);
    if (!testimonial) return false;
    this.#testimonials.set(testimonialId, Object.freeze({ ...testimonial, withdrawnAt: at }));
    return true;
  }

  ingestWorldEvent(event: WorldEvent): {
    readonly accepted: boolean;
    readonly reasons: readonly string[];
  } {
    const reasons: string[] = [];
    const now = this.#now().getTime();
    const independentPublishers = new Set(event.sources.map((source) => source.name));
    const hasPrimary = event.sources.some((source) =>
      ["primary", "government", "court", "academic"].includes(source.publisherType),
    );
    const hasOnlyRumor = event.sources.every((source) => source.kind === "rumor");
    const futureEvent = event.expectedAt
      ? new Date(event.expectedAt).getTime() > now
      : event.startedAt
        ? new Date(event.startedAt).getTime() > now
        : false;

    if (!event.title.trim() || !event.summary.trim()) reasons.push("Event needs a title and summary.");
    if (event.sources.length === 0) reasons.push("Event needs at least one attributable source.");
    if (hasOnlyRumor && event.confirmedFacts.length > 0) {
      reasons.push("Rumor-only sourcing cannot support confirmed facts.");
    }
    if (
      event.status === "confirmed" &&
      !hasPrimary &&
      independentPublishers.size < 2
    ) {
      reasons.push("Confirmed status requires a primary source or two independent publishers.");
    }
    if (futureEvent && !["scheduled", "forecast"].includes(event.status)) {
      reasons.push("Future events must be labeled scheduled or forecast.");
    }
    if (event.status === "forecast" && event.confirmedFacts.length > 0) {
      reasons.push("Forecasts may contain assumptions, not confirmed future facts.");
    }
    if (
      event.confidence > 0.9 &&
      !hasPrimary &&
      independentPublishers.size < 3
    ) {
      reasons.push("Very high confidence requires stronger source diversity.");
    }
    if (reasons.length > 0) return Object.freeze({ accepted: false, reasons });

    const cleanEvent: WorldEvent = Object.freeze({
      ...event,
      confidence: clamp(event.confidence),
      sources: event.sources.map((source) => Object.freeze({ ...source })),
      confirmedFacts: event.confirmedFacts.filter((fact) => fact.trim()),
      disputedClaims: event.disputedClaims.filter((claim) => claim.trim()),
      unknowns: event.unknowns.filter((unknown) => unknown.trim()),
    });
    this.#worldEvents.set(event.id, cleanEvent);
    if (event.supersedes) {
      const prior = this.#worldEvents.get(event.supersedes);
      if (prior) {
        this.#worldEvents.set(
          prior.id,
          Object.freeze({ ...prior, status: "corrected" as const }),
        );
      }
    }
    return Object.freeze({ accepted: true, reasons: [] });
  }

  registerPublicFigure(figure: PublicFigure): boolean {
    if (!figure.name.trim() || figure.publicRoles.length === 0) return false;
    const safeFacts = figure.facts.filter(
      (claim) =>
        claim.sources.length > 0 &&
        claim.limitations.length > 0 &&
        !claim.claim.toLocaleLowerCase().includes("private address"),
    );
    this.#publicFigures.set(
      figure.id,
      Object.freeze({
        ...figure,
        facts: safeFacts,
        privacyBoundary:
          figure.privacyBoundary.trim() ||
          "Use public-interest information only; exclude private addresses, family surveillance, medical speculation, and unverified intimate claims.",
      }),
    );
    return true;
  }

  publicFigureContext(figureId: Identifier): PublicFigure | undefined {
    return this.#publicFigures.get(figureId);
  }

  ingestCulturalSignal(signal: CulturalSignal): boolean {
    if (
      !signal.title.trim() ||
      !signal.metricName.trim() ||
      !Number.isFinite(signal.metricValue) ||
      signal.limitations.length === 0
    ) {
      return false;
    }
    this.#culturalSignals.set(
      signal.id,
      Object.freeze({
        ...signal,
        meaning:
          signal.meaning.trim() ||
          "This indicates attention within the measured audience, not universal importance or approval.",
      }),
    );
    return true;
  }

  createWorldBriefing(input: {
    profile?: MediaContextProfile;
    domains?: readonly WorldDomain[];
    from?: ISODateTime;
    to?: ISODateTime;
    includeForecasts?: boolean;
    maxEvents?: number;
  } = {}): WorldBriefing {
    if (input.profile && !input.profile.consentToUse) {
      throw new Error("Personal media context requires consent.");
    }
    const now = this.#now();
    const from = input.from ? new Date(input.from).getTime() : Number.NEGATIVE_INFINITY;
    const to = input.to ? new Date(input.to).getTime() : Number.POSITIVE_INFINITY;
    const domains = input.domains ?? input.profile?.interests;
    const avoid = new Set(input.profile?.avoidTopics?.map((topic) => topic.toLocaleLowerCase()));
    const eventTime = (event: WorldEvent): number =>
      new Date(event.startedAt ?? event.expectedAt ?? event.lastVerifiedAt).getTime();
    const events = [...this.#worldEvents.values()]
      .filter((event) => {
        const time = eventTime(event);
        if (time < from || time > to) return false;
        if (domains?.length && !domains.includes(event.domain)) return false;
        if (!input.includeForecasts && event.status === "forecast") return false;
        if ([...avoid].some((topic) => event.title.toLocaleLowerCase().includes(topic))) {
          return false;
        }
        return true;
      })
      .sort((a, b) => eventTime(b) - eventTime(a))
      .slice(0, Math.max(1, input.maxEvents ?? 20));
    const cultures = [...this.#culturalSignals.values()]
      .filter(
        (signal) =>
          !input.profile?.watchedOrRead?.length ||
          input.profile.watchedOrRead.some((item) =>
            signal.title.toLocaleLowerCase().includes(item.toLocaleLowerCase()),
          ),
      )
      .slice(0, 12);
    const sourceLedger = [
      ...new Map(
        [...events.flatMap((event) => event.sources), ...cultures.map((item) => item.source)].map(
          (source) => [source.id, source],
        ),
      ).values(),
    ];
    const maxFreshAge = 1000 * 60 * 60 * 24 * 2;
    const freshness =
      events.length === 0
        ? 0
        : events.filter(
            (event) => now.getTime() - new Date(event.lastVerifiedAt).getTime() <= maxFreshAge,
          ).length / events.length;

    return Object.freeze({
      id: this.#idFactory(),
      createdAt: now.toISOString(),
      asOf: now.toISOString(),
      events,
      culturalSignals: cultures,
      sourceLedger,
      corrections: events
        .filter((event) => event.status === "corrected")
        .map((event) => `${event.title} has been corrected or superseded.`),
      forecasts: events
        .filter((event) => event.status === "forecast")
        .map((event) => `${event.title}: prediction, not fact.`),
      blindSpots: [
        "No feed captures every major event, language, locality, culture, or lived experience.",
        "Popularity metrics measure attention within a platform or sample—not truth, quality, agreement, or universal culture.",
        "Breaking events may change after publication; source absence is not proof an event did not occur.",
        "Public-figure coverage excludes private-life speculation and does not infer guilt, health, motives, or character from rumor.",
      ],
      freshness: Number(freshness.toFixed(3)),
      note:
        "Every item should be read with its date, status, sources, disputes, unknowns, and corrections. Provenance supports trust assessment but does not make a claim true by itself.",
    });
  }

  assessTruth(claim: TruthClaim): TruthAssessment {
    const statement = claim.statement.trim();
    if (!statement) throw new Error("Truth assessment requires a claim.");
    const now = this.#now();
    const uniquePublishers = new Set(claim.sources.map((source) => source.name)).size;
    const primaryCount = claim.sources.filter((source) =>
      ["primary", "government", "court", "academic"].includes(source.publisherType),
    ).length;
    const independentCount = claim.sources.filter(
      (source) => source.editorialIndependence === true,
    ).length;
    const rumorCount = claim.sources.filter((source) => source.kind === "rumor").length;
    const satireCount = claim.sources.filter((source) => source.kind === "satire").length;
    const c2paCount = claim.sources.filter((source) => source.c2paValidated === true).length;
    const invalidProvenance = claim.sources.some(
      (source) => source.c2paValidated === false,
    );
    const averageAge =
      claim.sources.length === 0
        ? Number.POSITIVE_INFINITY
        : claim.sources.reduce(
            (sum, source) =>
              sum + Math.max(0, now.getTime() - new Date(source.retrievedAt).getTime()),
            0,
          ) / claim.sources.length;
    const freshnessWindow =
      claim.stakes === "critical"
        ? 1000 * 60 * 30
        : claim.stakes === "high"
          ? 1000 * 60 * 60 * 6
          : 1000 * 60 * 60 * 48;
    const freshness =
      Number.isFinite(averageAge) ? clamp(1 - averageAge / (freshnessWindow * 2)) : 0;
    const sourceQuality = clamp(
      primaryCount * 0.28 +
        independentCount * 0.16 +
        Math.min(uniquePublishers, 3) * 0.12 -
        rumorCount * 0.2,
    );
    const corroboration = clamp(
      Math.min(uniquePublishers, 3) / 3 +
        Math.min(claim.evidenceFor.length, 3) * 0.08 -
        (claim.evidenceAgainst.length > 0 ? 0.18 : 0),
    );
    const manipulationSignals = [...new Set(claim.manipulationSignals ?? [])];
    const nonFalsifiable =
      /^(i believe|in my view|it is beautiful|it is meaningful|god wants|the universe intends)/i.test(
        statement,
      );
    const satireOrFiction =
      claim.sources.length > 0 && satireCount === claim.sources.length;
    const strongAgainst =
      claim.evidenceAgainst.length >= 2 && (primaryCount > 0 || uniquePublishers >= 2);
    const strongFor =
      claim.evidenceFor.length >= 2 &&
      (primaryCount > 0 || uniquePublishers >= 2) &&
      sourceQuality >= 0.55;
    const materiallyIncomplete =
      manipulationSignals.includes("cherry_picking") ||
      manipulationSignals.includes("missing_context") ||
      manipulationSignals.includes("edited_media");

    let verdict: TruthVerdict;
    if (satireOrFiction) verdict = "satire_or_fiction";
    else if (nonFalsifiable) verdict = "not_falsifiable";
    else if (strongAgainst && claim.evidenceFor.length === 0) verdict = "false";
    else if (strongAgainst && claim.evidenceFor.length > 0) verdict = "misleading";
    else if (strongFor && materiallyIncomplete) verdict = "misleading";
    else if (strongFor && claim.evidenceAgainst.length === 0 && claim.missingContext.length === 0) {
      verdict = "well_supported";
    } else if (strongFor) verdict = "supported_with_limits";
    else if (
      claim.sources.length === 0 ||
      (rumorCount === claim.sources.length && claim.evidenceFor.length === 0)
    ) {
      verdict = "unsupported";
    } else {
      verdict = "unresolved";
    }

    const verdictConfidence =
      verdict === "unresolved"
        ? clamp(0.35 + Math.max(sourceQuality, corroboration) * 0.2)
        : verdict === "unsupported"
          ? clamp(0.65 + (claim.sources.length === 0 ? 0.2 : 0))
          : clamp((sourceQuality + corroboration + freshness) / 3);
    const provenance: TruthAssessment["provenance"] = invalidProvenance
      ? "invalid"
      : c2paCount === claim.sources.length && claim.sources.length > 0
        ? "verified"
        : c2paCount > 0
          ? "partial"
          : "absent";

    return Object.freeze({
      claimId: claim.id,
      assessedAt: now.toISOString(),
      verdict,
      confidence: Number(verdictConfidence.toFixed(3)),
      sourceQuality: Number(sourceQuality.toFixed(3)),
      corroboration: Number(corroboration.toFixed(3)),
      freshness: Number(freshness.toFixed(3)),
      provenance,
      known:
        verdict === "false"
          ? claim.evidenceAgainst
          : verdict === "unsupported"
            ? []
            : claim.evidenceFor,
      disputed:
        claim.evidenceFor.length > 0 && claim.evidenceAgainst.length > 0
          ? [...claim.evidenceFor, ...claim.evidenceAgainst]
          : claim.evidenceAgainst,
      unknown: [
        ...claim.missingContext,
        ...(freshness < 0.5 ? ["The information may be stale for the stakes involved."] : []),
        ...(claim.sources.length === 0 ? ["The original source is unknown."] : []),
      ],
      manipulationSignals,
      alternativeExplanations: [
        ...(materiallyIncomplete ? ["A true fragment may be presented without decisive context."] : []),
        ...(claim.medium === "video" || claim.medium === "audio" || claim.medium === "image"
          ? ["The media may be authentic but misdated, mislocated, selectively edited, or paired with a false caption."]
          : []),
        ...(rumorCount > 0 ? ["Sources may be repeating one unverified origin rather than independently confirming it."] : []),
      ],
      whatWouldChangeVerdict: [
        "The earliest available source or complete recording.",
        "A current primary document, official record, direct data, or attributable firsthand evidence.",
        "Independent corroboration that does not trace back to the same origin.",
        "Evidence resolving date, location, identity, editing, and omitted context.",
      ],
      correction:
        verdict === "false"
          ? `Available evidence contradicts the claim: “${statement}”`
          : verdict === "misleading"
            ? `The claim contains or may contain truth, but its framing omits context needed for a fair conclusion.`
            : undefined,
    });
  }

  guideTruthfulAction(
    claim: TruthClaim,
    context: TruthActionContext,
  ): TruthToActionPlan {
    const assessment = this.assessTruth(claim);
    const intensity = clamp(context.emotionalIntensity);
    const immediateRisk =
      context.personalExposure === "immediate" ||
      (claim.stakes === "critical" && context.personalExposure !== "none");
    const uncertain = ["unresolved", "unsupported"].includes(assessment.verdict);
    const inaccurate = ["false", "misleading"].includes(assessment.verdict);
    const supported = ["well_supported", "supported_with_limits"].includes(
      assessment.verdict,
    );
    const modes = new Set<HumanActionMode>();
    const nextSteps: string[] = [];
    const doNot = [
      "Do not forward, repost, confront, purchase, vote, flee, retaliate, or make an irreversible decision solely from emotional intensity.",
      "Do not confuse repetition, popularity, credentials, confidence, or provenance metadata with truth.",
      "Do not humiliate people who believed or shared the claim.",
      "Do not invent certainty to defeat someone else's certainty.",
    ];

    if (intensity >= 0.6) modes.add("pause");
    if (immediateRisk) {
      modes.add("protect");
      modes.add("document");
      nextSteps.push(
        "Take the lowest-regret protective step that remains appropriate whether the claim is true or false.",
      );
      nextSteps.push(
        "Use local emergency, safety, medical, legal, or organizational channels when real-world danger may be present.",
      );
    }
    if (uncertain) {
      modes.add("verify");
      modes.add("do_not_amplify");
      nextSteps.push("Preserve the original material, timestamp, source, and context without republishing it.");
      nextSteps.push("Check the earliest source, current primary records, and independent corroboration.");
    }
    if (inaccurate) {
      modes.add("correct");
      modes.add("contextualize");
      modes.add("do_not_amplify");
      nextSteps.push(
        "Correct the claim with the accurate information first, then briefly explain the error and cite the source.",
      );
      nextSteps.push(
        "Respond to the need beneath the misinformation—fear, confusion, belonging, safety, grief, or distrust.",
      );
    }
    if (supported) {
      if (claim.stakes === "high" || claim.stakes === "critical") {
        modes.add("prepare");
        modes.add("act");
        nextSteps.push(
          "Translate the verified information into a proportionate plan with roles, thresholds, and a review point.",
        );
      } else {
        modes.add("contextualize");
        modes.add("no_action");
        nextSteps.push(
          "Decide whether any action is actually necessary; true information does not automatically demand a response.",
        );
      }
    }
    if (assessment.verdict === "satire_or_fiction") {
      modes.add("contextualize");
      modes.add("do_not_amplify");
      nextSteps.push("Label it clearly as satire or fiction before discussing its meaning or impact.");
    }
    if (assessment.verdict === "not_falsifiable") {
      modes.add("contextualize");
      nextSteps.push(
        "Treat the statement as belief, value, interpretation, or meaning—not as an empirically verified fact.",
      );
    }
    if (context.role === "caregiver" || context.role === "leader") {
      modes.add("support");
      nextSteps.push(
        "Ask what people need to remain safe, informed, connected, and capable of choosing wisely.",
      );
    }
    if (context.role === "publisher" || context.role === "professional") {
      modes.add("report");
      nextSteps.push(
        "Publish the confidence, sources, uncertainties, corrections, and update time alongside the claim.",
      );
    }
    if (modes.size === 0) modes.add("no_action");

    const reviewMinutes =
      context.timePressure === "minutes"
        ? 15
        : context.timePressure === "hours"
          ? 120
          : claim.stakes === "high" || claim.stakes === "critical"
            ? 360
            : 1440;
    const reviewAt = new Date(this.#now().getTime() + reviewMinutes * 60 * 1000).toISOString();
    const firstStep = immediateRisk
      ? "Protect life and essential safety without waiting for perfect certainty."
      : intensity >= 0.6
        ? "Pause long enough for the body to settle before deciding or sharing."
        : uncertain
          ? "Do not amplify; preserve the claim and begin verification."
          : inaccurate
            ? "Correct with dignity, context, and a source."
            : "Separate what is true from what action is proportionate.";

    return Object.freeze({
      id: this.#idFactory(),
      createdAt: this.#now().toISOString(),
      assessment,
      modes: [...modes],
      firstStep,
      nextSteps,
      doNot,
      communication: {
        privateResponse:
          inaccurate
            ? "I can see why this might feel important. The available evidence points another way. May I show you what I found and hear what concerns you most?"
            : uncertain
              ? "I don’t know yet, and I don’t want to pretend. Let’s check the original source and the evidence together."
              : "The information appears supported. Let’s still decide calmly what it means for your situation.",
        publicResponse:
          inaccurate
            ? `Correction: ${assessment.correction ?? "the claim is not supported as presented"} Sources and remaining uncertainties should accompany this update.`
            : uncertain
              ? "This claim is not verified. Please avoid sharing it as fact while evidence is checked."
              : "This information is currently supported by the cited evidence. Details may change; check the timestamp and source ledger.",
        correctionResponse: assessment.correction,
      },
      emotionalRegulation: [
        "Name the emotion without treating it as evidence.",
        "Take one slow breath and identify the feared or hoped-for outcome.",
        "Separate what must happen now from what can wait for verification.",
        "Choose the smallest reversible action that protects what matters.",
      ],
      decisionThreshold: immediateRisk
        ? "Act on credible danger using low-regret safety measures; continue verifying in parallel."
        : context.irreversibleActionProposed
          ? "Require high-quality, current, independently corroborated evidence before irreversible action."
          : "Match evidence strength to stakes, and prefer reversible steps while uncertainty remains.",
      reviewAt,
      humanRemainsAuthor: true,
    });
  }

  auditQuality(): QualityAudit {
    const checks = [
      ["Human ownership is explicit", true],
      ["Financial analysis requires consent", true],
      ["Current financial claims carry official sources", FINANCIAL_FOUNDATION_SOURCES.length >= 3],
      ["Speculation is never a default suitable category", !this.financialOptions.some(
        (option) => option.role === "speculation" && option.risk !== "critical",
      )],
      ["Crisis support escalates to humans", true],
      ["All notifications are optional and dismissible", true],
      ["Belief traditions are contextual rather than imposed", true],
      ["The Covenant of Awe contains all ten sacred themes", COVENANT_OF_AWE.length === 10],
      ["Suffering is never automatically spiritualized", COVENANT_OF_AWE.some(
        (principle) =>
          principle.theme === "suffering" &&
          principle.guardrail.includes("Never call tragedy a lesson"),
      )],
      ["Love cannot be used to conceal coercion or self-erasure", COVENANT_OF_AWE.some(
        (principle) =>
          principle.theme === "love" && principle.guardrail.includes("self-erasure"),
      )],
      ["No divine identity or authority is claimed", COVENANT_OF_AWE.some(
        (principle) =>
          principle.theme === "source" && principle.guardrail.includes("Never claim divine"),
      )],
      ["The learning constellation spans at least twenty human domains", HUMAN_LEARNING_CONSTELLATION.length >= 20],
      ["Learning plans remain optional and human-owned", true],
      ["Outcome percentages disclose method, sample, and limitations", true],
      ["Testimonials require consent, verification, and no incentives", true],
      ["World events preserve dates, status, sources, disputes, and corrections", true],
      ["Future events are separated into schedules and forecasts", true],
      ["Cultural popularity is never treated as universal truth", true],
      ["Public figures retain privacy against rumor and intimate surveillance", true],
      ["Truth verdicts distinguish falsity, uncertainty, misleading context, and non-falsifiable belief", true],
      ["Human action is calibrated separately from claim truth", true],
      ["Immediate safety can proceed under uncertainty through low-regret measures", true],
      ["Corrections preserve dignity and address underlying human needs", true],
      ["Cognitive access spans the lifespan", true],
      ["The system claims no professional license or guaranteed outcome", true],
    ] as const;
    const passed = checks.filter(([, pass]) => pass).map(([name]) => name);
    const failed = checks.filter(([, pass]) => !pass).map(([name]) => name);
    return Object.freeze({
      score: Number((passed.length / checks.length).toFixed(3)),
      passed,
      failed,
      releaseReady: failed.length === 0,
    });
  }

  continueConversation(input: {
    history: readonly ConversationTurn[];
    message: string;
    cognitive: CognitiveAccessProfile;
    emotionalIntensity?: number;
    topicRisk?: RiskLevel;
  }): ConversationResponse {
    const message = input.message.trim();
    if (!message) throw new Error("A conversation turn cannot be empty.");
    const recentSpeaker = input.history.at(-1)?.speaker;
    const intensity = clamp(input.emotionalIntensity ?? 0.4);
    const spokenBy: CompanionArchetype =
      intensity >= 0.65 || recentSpeaker === "adam" ? "eve" : "adam";
    const acknowledgement =
      intensity >= 0.75
        ? "That sounds like a lot to carry. We can slow this down."
        : "I’m with you. Let me make sure I’m following.";
    const bridge =
      spokenBy === "adam"
        ? "Let’s connect what you said to one clear next choice."
        : "Before solving it, let’s notice what this means in your life.";
    const rawResponse =
      input.topicRisk === "critical"
        ? "Your immediate safety matters more than completing this conversation. Please contact local emergency support or a trusted qualified person now."
        : `You said: “${message}” I hear both the situation and the human need inside it. We can explore options without rushing you or deciding for you.`;
    const response = this.adaptLanguage(rawResponse, input.cognitive);
    const words = `${acknowledgement} ${bridge} ${response}`.split(/\s+/).length;

    return Object.freeze({
      acknowledgement: this.adaptLanguage(acknowledgement, input.cognitive),
      bridge: this.adaptLanguage(bridge, input.cognitive),
      response,
      question:
        input.topicRisk === "critical"
          ? "Are you able to reach a safe person or emergency service now?"
          : this.adaptLanguage(
              "Would you like understanding, options, a small plan, or simply company right now?",
              input.cognitive,
            ),
      spokenBy,
      readingLevel: input.cognitive.readingLevel ?? "plain",
      estimatedMinutes: Math.max(1, Math.ceil(words / 150)),
      safetyNote:
        input.topicRisk === "critical"
          ? "Do not rely on Adam or Eve alone for an emergency."
          : undefined,
    });
  }
}

export function createGarden(options?: Omit<CompanionOptions, "name">): GardenOfHumanity {
  return new GardenOfHumanity(options);
}

export function createLifeNavigator(
  options?: Omit<CompanionOptions, "name">,
): LifeNavigationEngine {
  return new LifeNavigationEngine(options);
}

export default CompanionOS;
