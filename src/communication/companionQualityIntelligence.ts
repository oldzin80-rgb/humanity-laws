import type {
  CompanionImprovementSummary,
  CompanionQualityIntelligence,
  CompanionQualitySignal,
  ConversationCraftDecision,
  HumanNeed,
  HumanPresenceMemoryProfile,
  PresenceContext,
  PresenceMemoryApplication,
  PresenceQualityEvaluation,
  PresenceQualityScore,
  UnifiedCompanionRequest,
  WonderMoment,
  WonderPrompt,
} from "./types.js";

function score(value: number): PresenceQualityScore {
  return Math.max(1, Math.min(10, Math.round(value))) as PresenceQualityScore;
}

export function evaluatePresenceQuality(response: string, context: PresenceContext): PresenceQualityEvaluation {
  const words = response.trim().split(/\s+/).filter(Boolean).length;
  const hasAgency = /human judgment|final decision|choose|agency|do not choose/i.test(response);
  const hasAiHonesty = /AI companion|not a real person/i.test(response);
  const hasNextStep = /next step|one meaningful next step|choose one/i.test(response);
  return {
    warmth: score(context.warmth === "gentle" ? 9 : 8),
    clarity: score(context.clarity === "structured" ? 9 : 8),
    empathy: score(context.emotionalTone === "heavy" ? 9 : 8),
    usefulness: score(hasNextStep ? 9 : 7),
    confidence: score(hasAgency ? 8 : 6),
    humility: score(hasAiHonesty ? 10 : 6),
    brevity: score(words <= 120 ? 9 : words <= 180 ? 7 : 5),
    naturalness: score(/I hear you|I am with|The center seems simple/i.test(response) ? 8 : 7),
    followUpQuality: score(hasNextStep ? 8 : 6),
    internalOnly: true,
  };
}

export function decideConversationCraftMove(request: UnifiedCompanionRequest, context: PresenceContext): ConversationCraftDecision {
  const lower = request.message.toLowerCase();
  if (context.detectedIntent === "crisis_escalation_boundary") {
    return { move: "professional_boundary", reason: "Potential crisis or high-risk issue requires qualified human support.", internalOnly: true };
  }
  if (/(doctor|medical|lawyer|legal|invest|diagnos|prescription|abuse|minor|elder)/.test(lower)) {
    return { move: "professional_boundary", reason: "Professional boundary terms are present.", internalOnly: true };
  }
  if (request.companion !== "Council" && /(major|important|life changing|marriage|divorce|quit|move|decision)/.test(lower)) {
    return { move: "refer_to_council", reason: "Important decision may benefit from Adam and Eve together.", memberFacingCue: "Open Council", internalOnly: true };
  }
  if (context.emotionalTone === "heavy" || /(discouraged|hopeless|tired)/.test(lower)) {
    return { move: "encourage", reason: "Member appears emotionally burdened.", internalOnly: true };
  }
  if (request.message.length > 700 || (request.conversationHistory?.length ?? 0) > 4) {
    return { move: "summarize", reason: "Conversation is becoming complex.", internalOnly: true };
  }
  if (/(always|never|everyone|no one|i can't do anything)/.test(lower)) {
    return { move: "gently_challenge", reason: "All-or-nothing pattern may need gentle challenge.", internalOnly: true };
  }
  if (request.saveInsight) return { move: "save_insight_prompt", reason: "Member asked to save an insight.", internalOnly: true };
  if (/(why|how|what do you mean|not sure)/.test(lower)) return { move: "ask_follow_up", reason: "More context may improve usefulness.", internalOnly: true };
  return { move: "offer_next_step", reason: "One clear next step is the most useful move.", internalOnly: true };
}

export function derivePresenceMemoryHints(
  history: UnifiedCompanionRequest["conversationHistory"] = [],
  consent: boolean,
): HumanPresenceMemoryProfile | undefined {
  if (!consent) return undefined;
  const joined = history.map((item) => `${item.input ?? ""} ${item.message ?? ""}`).join(" ").toLowerCase();
  return {
    preferredDepth: joined.includes("deeper") ? "deeper" : "balanced",
    communicationStyle: joined.includes("direct") ? "direct" : joined.includes("gentle") ? "gentle" : "structured",
    humorPreference: joined.includes("humor") || joined.includes("joke") ? "light" : "none",
    pacePreference: joined.includes("slow") ? "slow" : "normal",
    encouragementStyle: joined.includes("warm") ? "warm" : joined.includes("clear") ? "clear" : "quiet",
    learningStyle: joined.includes("practice") || joined.includes("action") ? "practical" : "reflective",
    reflectionPreference: joined.includes("question") ? "question" : joined.includes("summary") ? "summary" : "next_step",
    councilPreference: joined.includes("council") ? "offer_for_decisions" : "only_when_needed",
    consentApplied: true,
  };
}

export function applyPresenceMemoryToResponse(request: UnifiedCompanionRequest, profile?: HumanPresenceMemoryProfile): PresenceMemoryApplication {
  if (!request.consentToRemember || !profile) {
    return {
      applied: false,
      hints: [],
      reason: "No consent-based memory profile applied.",
      internalOnly: true,
    };
  }
  return {
    applied: true,
    hints: [
      `depth:${profile.preferredDepth}`,
      `style:${profile.communicationStyle}`,
      `pace:${profile.pacePreference}`,
      `encouragement:${profile.encouragementStyle}`,
    ],
    reason: "Consent-based tone preferences may shape style, not control the member.",
    internalOnly: true,
  };
}

function wonderPromptFor(need?: HumanNeed): WonderPrompt {
  if (need === "purpose") return { text: "What is one small thing this moment is asking from you?", purpose: "purpose" };
  if (need === "belonging") return { text: "Where would one honest connection bring a little more peace?", purpose: "peace" };
  if (need === "spiritual_reflection") return { text: "What feels most true about this right now?", purpose: "meaning" };
  return { text: "What would peace look like in the next step?", purpose: "peace" };
}

export function generateWonderPrompt(context: {
  need?: HumanNeed;
  emotionalTone: PresenceContext["emotionalTone"];
  escalationNeeded: boolean;
  practicalUrgency?: boolean;
}): WonderMoment {
  if (context.escalationNeeded) return { used: false, reason: "Skipped for crisis or professional boundary.", internalOnly: true };
  if (context.practicalUrgency || context.emotionalTone === "urgent") return { used: false, reason: "Skipped because practical urgency matters more.", internalOnly: true };
  return {
    used: true,
    prompt: wonderPromptFor(context.need),
    reason: "A simple reflection may help the member notice meaning without distraction.",
    internalOnly: true,
  };
}

export function createCompanionImprovementSummary(params: {
  craftDecision: ConversationCraftDecision;
  savedInsight: boolean;
  unresolvedNeed?: HumanNeed;
  escalationNeeded: boolean;
}): CompanionImprovementSummary {
  const signals: CompanionQualitySignal[] = [];
  if (params.craftDecision.move === "ask_follow_up") signals.push({ kind: "helpful_follow_up", consentAware: true, sensitiveContentStored: false });
  if (params.craftDecision.move === "summarize") signals.push({ kind: "conversation_stall", consentAware: true, sensitiveContentStored: false });
  if (params.craftDecision.move === "professional_boundary" || params.escalationNeeded) signals.push({ kind: "professional_boundary", consentAware: true, sensitiveContentStored: false });
  if (params.savedInsight) signals.push({ kind: "saved_insight", consentAware: true, sensitiveContentStored: false });
  if (params.unresolvedNeed) signals.push({ kind: "unresolved_need", consentAware: true, sensitiveContentStored: false });
  return {
    signals,
    unresolvedNeed: params.unresolvedNeed,
    internalOnly: true,
    privacyPreserved: true,
  };
}

export function createCompanionQualityIntelligence(params: {
  request: UnifiedCompanionRequest;
  response: string;
  context: PresenceContext;
  primaryNeed?: HumanNeed;
  escalationNeeded: boolean;
}): CompanionQualityIntelligence {
  const craftDecision = decideConversationCraftMove(params.request, params.context);
  const memoryProfile = derivePresenceMemoryHints(params.request.conversationHistory, params.request.consentToRemember);
  const memoryApplication = applyPresenceMemoryToResponse(params.request, memoryProfile);
  const wonder = generateWonderPrompt({
    need: params.primaryNeed,
    emotionalTone: params.context.emotionalTone,
    escalationNeeded: params.escalationNeeded,
    practicalUrgency: craftDecision.move === "professional_boundary",
  });
  return {
    qualityEvaluation: evaluatePresenceQuality(params.response, params.context),
    craftDecision,
    memoryProfile,
    memoryApplication,
    wonder,
    improvementSummary: createCompanionImprovementSummary({
      craftDecision,
      savedInsight: params.request.saveInsight,
      unresolvedNeed: params.escalationNeeded ? params.primaryNeed : undefined,
      escalationNeeded: params.escalationNeeded,
    }),
    internalOnly: true,
  };
}
