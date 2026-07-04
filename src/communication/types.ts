export type CompanionChannel =
  | "in_app"
  | "sms"
  | "phone_voice"
  | "email"
  | "council_session"
  | "future_video_avatar";

export type CompanionParticipant = "Adam" | "Eve" | "AdamEve" | "Council";

export type AvatarPresenceState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "reflecting"
  | "council_mode"
  | "unavailable";

export type AvatarParticipant = "Adam" | "Eve";

export type ImmersiveSessionState = "text_fallback" | "provider_pending" | "ready_unverified" | "live_verified";
export type AvatarRoomState = "not_started" | "loading" | "active" | "fallback_text";
export type VoiceState = "muted" | "listening" | "thinking" | "speaking" | "unavailable";
export type EmotionalExpressionState = "calm" | "warm" | "concerned" | "encouraging" | "reflective" | "neutral";
export type GestureState = "still" | "open_posture" | "gentle_nod" | "reflective_pause" | "council_attention";

export type CommunicationIntent =
  | "reflection"
  | "encouragement"
  | "decision_support"
  | "spark_discussion"
  | "book_discussion"
  | "wellness_support"
  | "table_community_connection"
  | "saved_insight"
  | "crisis_escalation_boundary"
  | "council_request";

export type EmotionalTone = "calm" | "uncertain" | "heavy" | "hopeful" | "urgent" | "neutral";

export type LifeStageSupport =
  | "child"
  | "teenager"
  | "young_adult"
  | "parent"
  | "adult"
  | "elder"
  | "caregiver"
  | "grieving_person"
  | "person_seeking_purpose"
  | "person_under_stress"
  | "unspecified";

export type HumanNeed =
  | "reflection"
  | "encouragement"
  | "decision_support"
  | "relationships"
  | "parenting"
  | "career"
  | "learning"
  | "discipline"
  | "grief"
  | "wellness"
  | "purpose"
  | "forgiveness"
  | "growth"
  | "legacy"
  | "belonging"
  | "spiritual_reflection"
  | "practical_next_steps";

export type CompanionContextSourceKind =
  | "founder_update"
  | "podcast_update"
  | "spark_history"
  | "saved_library_item"
  | "wellness_note"
  | "member_preference"
  | "humanity_laws_source_reference"
  | "future_approved_knowledge_feed";

export interface CompanionContextSource {
  kind: CompanionContextSourceKind;
  id: string;
  label: string;
  consentVerified: boolean;
  summary?: string;
}

export interface ApprovedContextFeedHook {
  kind: CompanionContextSourceKind;
  enabled: boolean;
  consentRequired: boolean;
  providerConfigured: boolean;
  description: string;
}

export interface CompanionVoiceProfile {
  companion: CompanionParticipant;
  qualities: string[];
  bestFor: string[];
  avoid: string[];
}

export interface PresenceContext {
  detectedIntent: CommunicationIntent;
  emotionalTone: EmotionalTone;
  warmth: "gentle" | "steady" | "focused";
  clarity: "brief" | "structured";
  memoryStatus: "consented_context_available" | "no_long_term_memory_implied";
  currentPageContext?: string;
}

export interface LoveInActionPattern {
  acknowledge: string;
  understand: string;
  clarify: string;
  encourage: string;
  guide: string;
  preserveAgency: string;
  nextStep: string;
}

export interface CompanionExcellenceContext {
  warmth: "low" | "steady" | "high";
  clarity: "simple" | "structured";
  brevity: "brief" | "moderate";
  helpfulness: "next_step_focused";
  humility: true;
  humanDignity: true;
  lifeStage: LifeStageSupport;
  humanNeeds: HumanNeed[];
  loveInAction: LoveInActionPattern;
}

export interface ConversationQualityReviewHook {
  conversationQualityScore?: number;
  clarityScore?: number;
  warmthScore?: number;
  helpfulnessScore?: number;
  userNextStepSuccess?: "unknown" | "reported_success" | "reported_blocked";
  savedInsight: boolean;
  unresolvedNeed?: HumanNeed;
  escalationNeeded: boolean;
  topicCategory: HumanNeed;
  invasiveAnalytics: false;
}

export type PresenceQualityScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface PresenceQualityEvaluation {
  warmth: PresenceQualityScore;
  clarity: PresenceQualityScore;
  empathy: PresenceQualityScore;
  usefulness: PresenceQualityScore;
  confidence: PresenceQualityScore;
  humility: PresenceQualityScore;
  brevity: PresenceQualityScore;
  naturalness: PresenceQualityScore;
  followUpQuality: PresenceQualityScore;
  internalOnly: true;
}

export type ConversationCraftMove =
  | "answer"
  | "ask_follow_up"
  | "encourage"
  | "summarize"
  | "gently_challenge"
  | "pause"
  | "offer_next_step"
  | "refer_to_council"
  | "save_insight_prompt"
  | "professional_boundary";

export interface ConversationCraftDecision {
  move: ConversationCraftMove;
  reason: string;
  memberFacingCue?: string;
  internalOnly: true;
}

export interface HumanPresenceMemoryProfile {
  preferredDepth: "brief" | "balanced" | "deeper";
  communicationStyle: "direct" | "gentle" | "structured";
  humorPreference: "none" | "light";
  pacePreference: "slow" | "normal";
  encouragementStyle: "quiet" | "clear" | "warm";
  learningStyle: "reflective" | "practical";
  reflectionPreference: "question" | "summary" | "next_step";
  councilPreference: "only_when_needed" | "offer_for_decisions";
  consentApplied: true;
}

export interface PresenceMemoryApplication {
  applied: boolean;
  hints: string[];
  reason: string;
  internalOnly: true;
}

export interface WonderPrompt {
  text: string;
  purpose: "meaning" | "gratitude" | "awe" | "purpose" | "possibility" | "peace";
}

export interface WonderMoment {
  prompt?: WonderPrompt;
  used: boolean;
  reason: string;
  internalOnly: true;
}

export interface CompanionQualitySignal {
  kind:
    | "conversation_stall"
    | "helpful_follow_up"
    | "confusion"
    | "saved_insight"
    | "unresolved_need"
    | "professional_boundary";
  consentAware: true;
  sensitiveContentStored: false;
}

export interface CompanionImprovementSummary {
  signals: CompanionQualitySignal[];
  unresolvedNeed?: HumanNeed;
  internalOnly: true;
  privacyPreserved: true;
}

export interface CompanionQualityIntelligence {
  qualityEvaluation: PresenceQualityEvaluation;
  craftDecision: ConversationCraftDecision;
  memoryProfile?: HumanPresenceMemoryProfile;
  memoryApplication: PresenceMemoryApplication;
  wonder: WonderMoment;
  improvementSummary: CompanionImprovementSummary;
  internalOnly: true;
}

export type CompanionEngineName =
  | "presence"
  | "conversation_craft"
  | "human_presence_memory"
  | "wonder"
  | "quality_intelligence"
  | "humanity_laws_principle"
  | "spark_context"
  | "living_library_context"
  | "wellness_context"
  | "table_context"
  | "council_logic"
  | "decision_support"
  | "future_live_feed_context";

export interface CompanionUnderstanding {
  realAsk: string;
  emotionalState: EmotionalTone;
  practicalNeed: HumanNeed;
  lifeStage: LifeStageSupport;
  conversationIntent: CommunicationIntent;
  urgency: "low" | "medium" | "high";
  uncertaintyLevel: "low" | "medium" | "high";
}

export interface EngineActivation {
  engine: CompanionEngineName;
  active: boolean;
  strength: 0 | 1 | 2 | 3;
  reason: string;
}

export interface ResponseBalancePlan {
  targetLength: "short" | "medium";
  emotionalWeight: "low" | "medium" | "high";
  analyticalWeight: "low" | "medium" | "high";
  avoid: string[];
}

export interface HumanFlourishingCheck {
  truthful: boolean;
  helpful: boolean;
  respectful: boolean;
  empowering: boolean;
  practical: boolean;
  hopeful: boolean;
  clear: boolean;
  passed: boolean;
}

export interface ConversationRhythmDecision {
  shouldAnswer: boolean;
  shouldAskFollowUp: boolean;
  shouldEncourage: boolean;
  shouldInvolveCouncil: boolean;
  shouldRespectSilence: boolean;
  shouldOfferNextStep: boolean;
}

export interface CrossRoomConnection {
  room: "Book" | "Spark" | "Council" | "Table" | "Wellness" | "Library" | "Podcast" | "Founder";
  reason: string;
}

export interface PresenceCalibration {
  warmth: "low" | "medium" | "high";
  detail: "low" | "medium";
  pace: "slow" | "normal";
  complexity: "simple" | "moderate";
  encouragement: "low" | "medium" | "high";
  challenge: "none" | "gentle";
}

export interface OrchestrationCompletionEvaluation {
  naturalness: PresenceQualityScore;
  helpfulness: PresenceQualityScore;
  clarity: PresenceQualityScore;
  warmth: PresenceQualityScore;
  practicality: PresenceQualityScore;
  humanAgency: PresenceQualityScore;
  trust: PresenceQualityScore;
  conversationContinuity: PresenceQualityScore;
  internalOnly: true;
}

export interface CompanionOrchestrationPlan {
  understanding: CompanionUnderstanding;
  selectedEngines: EngineActivation[];
  balance: ResponseBalancePlan;
  rhythm: ConversationRhythmDecision;
  crossRoomConnections: CrossRoomConnection[];
  presenceCalibration: PresenceCalibration;
  flourishingCheck: HumanFlourishingCheck;
  completionEvaluation: OrchestrationCompletionEvaluation;
  internalOnly: true;
}

export interface UnifiedCompanionRequest {
  memberId: string;
  companion: CompanionParticipant;
  channel: CompanionChannel;
  message: string;
  consentToRemember: boolean;
  saveInsight: boolean;
  contextSources: CompanionContextSource[];
  intent: CommunicationIntent;
  conversationHistory?: Array<{
    companion: string;
    input?: string;
    message?: string;
    createdAt?: string;
  }>;
}

export interface EscalationBoundary {
  triggered: boolean;
  reason?: string;
  recommendedAction?: string;
}

export interface CouncilSessionSummary {
  adamPerspective: string;
  evePerspective: string;
  humanityLawsPrinciple: string;
  humanFinalChoice: string;
  savedOutcome: boolean;
}

export interface AvatarPresenceQualities {
  humanLikePresence: boolean;
  warmFacialExpression: boolean;
  naturalEyeContact: boolean;
  calmBodyLanguage: boolean;
  subtleMicroExpressions: boolean;
  voiceSyncedSpeakingLater: boolean;
  emotionallyAppropriateTone: boolean;
  aiTransparency: boolean;
}

export interface AvatarPresenceMetadata {
  state: AvatarPresenceState;
  providerConfigured: boolean;
  placeholderOnly: boolean;
  visibleParticipants: AvatarParticipant[];
  qualities: AvatarPresenceQualities;
  statusMessage: string;
  transparencyLabel: "AI_AVATAR_PLACEHOLDER" | "AI_AVATAR_PROVIDER_READY";
  councilMode: boolean;
}

export interface CouncilSpatialLayout {
  room: "council_circle";
  adamPosition: "left";
  evePosition: "right";
  memberPosition: "center";
  principlePosition: "front";
  humanChoicePosition: "center_priority";
}

export interface ImmersivePresenceMetadata {
  sessionState: ImmersiveSessionState;
  avatarRoomState: AvatarRoomState;
  voiceState: VoiceState;
  emotionalExpression: EmotionalExpressionState;
  gestureState: GestureState;
  councilSpatialLayout?: CouncilSpatialLayout;
  naturalTurnTakingReady: boolean;
  voiceSyncedExpressionReady: boolean;
  eyeContactReady: boolean;
  microExpressionReady: boolean;
  bodyLanguageReady: boolean;
  continuityChannels: CompanionChannel[];
  providerReadiness: {
    avatarProviderConfigured: boolean;
    voiceProviderConfigured: boolean;
    smsProviderConfigured: boolean;
    emailProviderConfigured: boolean;
  };
  fallback: {
    mode: "text";
    reason: string;
  };
  trustBoundary: {
    aiTransparent: true;
    neverClaimsHumanIdentity: true;
    humanSovereignty: true;
  };
}

export interface UnifiedCompanionResponse {
  message: string;
  companion: CompanionParticipant;
  channel: CompanionChannel;
  persisted: boolean;
  savedInsight: boolean;
  humanSovereigntyReminder: string;
  nextSteps: string[];
  transparency: "AI_TRANSPARENT";
  aiDisclosure: string;
  presence: PresenceContext;
  voiceProfile: CompanionVoiceProfile;
  memoryStatus: PresenceContext["memoryStatus"];
  excellence: CompanionExcellenceContext;
  qualityReview: ConversationQualityReviewHook;
  sourceSummary?: string;
  escalationBoundary?: EscalationBoundary;
  council?: CouncilSessionSummary;
  avatarPresence?: AvatarPresenceMetadata;
  immersivePresence?: ImmersivePresenceMetadata;
  internalQuality?: CompanionQualityIntelligence;
  orchestration?: CompanionOrchestrationPlan;
  persistenceWarning?: string;
}

export interface ChannelDeliveryResult {
  channel: CompanionChannel;
  delivered: boolean;
  placeholderOnly: boolean;
  vendorConfigured: boolean;
  message: string;
}

export interface CompanionChannelAdapter {
  channel: CompanionChannel;
  vendorConfigured(): boolean;
  deliver(request: UnifiedCompanionRequest, response: UnifiedCompanionResponse): Promise<ChannelDeliveryResult>;
}

export interface AvatarPresenceAdapter {
  vendorConfigured(): boolean;
  renderPresence(request: UnifiedCompanionRequest, response: UnifiedCompanionResponse): Promise<AvatarPresenceMetadata>;
}
