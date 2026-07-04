import { categorizeHumanNeeds, inferLifeStageSupport } from "./companionExcellenceEngine.js";
import { createPresenceContext, detectCommunicationIntent, detectEmotionalTone } from "./presenceEngine.js";
import type {
  CompanionEngineName,
  CompanionOrchestrationPlan,
  CompanionQualityIntelligence,
  ConversationCraftMove,
  CrossRoomConnection,
  EngineActivation,
  HumanFlourishingCheck,
  HumanNeed,
  PresenceCalibration,
  PresenceQualityScore,
  ResponseBalancePlan,
  UnifiedCompanionRequest,
} from "./types.js";

function qualityScore(value: number): PresenceQualityScore {
  return Math.max(1, Math.min(10, Math.round(value))) as PresenceQualityScore;
}

function urgencyFor(request: UnifiedCompanionRequest): "low" | "medium" | "high" {
  const lower = request.message.toLowerCase();
  if (/(suicide|self[- ]?harm|emergency|urgent|immediate danger|right now)/.test(lower)) return "high";
  if (/(deadline|major|important|medical|legal|financial|decision)/.test(lower)) return "medium";
  return "low";
}

function uncertaintyFor(request: UnifiedCompanionRequest): "low" | "medium" | "high" {
  const lower = request.message.toLowerCase();
  if (/(i don't know|confused|lost|stuck|unsure|uncertain)/.test(lower)) return "high";
  if (/(maybe|what if|should i|help me decide)/.test(lower)) return "medium";
  return "low";
}

function realAskFor(request: UnifiedCompanionRequest, primaryNeed: HumanNeed): string {
  if (request.companion === "Council" || request.companion === "AdamEve" || request.channel === "council_session") {
    return "The member is asking for integrated perspective while preserving their final choice.";
  }
  if (primaryNeed === "wellness") return "The member is asking for supportive wellness reflection, not medical direction.";
  if (primaryNeed === "relationships") return "The member is asking for relational clarity and a humane next step.";
  if (primaryNeed === "purpose") return "The member is asking for meaning, direction, and one grounded next step.";
  return "The member is asking to be understood and helped toward one clear next step.";
}

function activate(engine: CompanionEngineName, active: boolean, strength: 0 | 1 | 2 | 3, reason: string): EngineActivation {
  return { engine, active, strength: active ? strength : 0, reason };
}

function selectedEngines(params: {
  request: UnifiedCompanionRequest;
  primaryNeed: HumanNeed;
  craftMove?: ConversationCraftMove;
  urgency: "low" | "medium" | "high";
}): EngineActivation[] {
  const isCouncil = params.request.companion === "Council" || params.request.companion === "AdamEve" || params.request.channel === "council_session";
  return [
    activate("presence", true, 3, "Every companion response needs calibrated warmth, clarity, and tone."),
    activate("conversation_craft", true, 3, "One clear conversational move prevents overwhelm."),
    activate("human_presence_memory", params.request.consentToRemember, params.request.consentToRemember ? 2 : 0, "Memory hints only participate with consent."),
    activate("wonder", params.urgency === "low" && ["purpose", "belonging", "spiritual_reflection", "reflection"].includes(params.primaryNeed), 1, "A simple wonder prompt may help when it does not distract."),
    activate("quality_intelligence", true, 2, "Internal scoring improves craft without exposing scores."),
    activate("humanity_laws_principle", true, 3, "Humanity Laws source hierarchy remains aligned."),
    activate("spark_context", params.request.intent === "spark_discussion", 2, "Spark context only helps Spark-related reflection."),
    activate("living_library_context", params.request.intent === "book_discussion" || params.primaryNeed === "learning", 2, "Library context helps source or learning questions."),
    activate("wellness_context", params.primaryNeed === "wellness", 2, "Wellness context helps habits while preserving medical boundaries."),
    activate("table_context", params.primaryNeed === "relationships" || params.primaryNeed === "belonging", 1, "Table context helps connection and hospitality when relevant."),
    activate("council_logic", isCouncil || params.craftMove === "refer_to_council", 3, "Council logic participates for important or multi-perspective decisions."),
    activate("decision_support", params.primaryNeed === "decision_support" || params.craftMove === "refer_to_council", 2, "Decision support helps choose one responsible next step."),
    activate("future_live_feed_context", false, 0, "Future feeds remain inactive until approved and verified."),
  ];
}

function balancePlan(request: UnifiedCompanionRequest, urgency: "low" | "medium" | "high"): ResponseBalancePlan {
  return {
    targetLength: urgency === "high" || request.companion === "Council" ? "short" : "medium",
    emotionalWeight: request.companion === "Eve" ? "high" : urgency === "high" ? "low" : "medium",
    analyticalWeight: request.companion === "Adam" || request.companion === "Council" ? "medium" : "low",
    avoid: ["too long", "too emotional", "too analytical", "repetitive", "robotic", "preachy", "overwhelming"],
  };
}

function rhythmFor(craftMove?: ConversationCraftMove): CompanionOrchestrationPlan["rhythm"] {
  return {
    shouldAnswer: craftMove !== "pause",
    shouldAskFollowUp: craftMove === "ask_follow_up",
    shouldEncourage: craftMove === "encourage",
    shouldInvolveCouncil: craftMove === "refer_to_council",
    shouldRespectSilence: craftMove === "pause",
    shouldOfferNextStep: craftMove !== "pause",
  };
}

function crossRoomConnections(primaryNeed: HumanNeed, request: UnifiedCompanionRequest): CrossRoomConnection[] {
  const connections: CrossRoomConnection[] = [];
  const lower = request.message.toLowerCase();
  if (request.intent === "book_discussion" || primaryNeed === "learning") connections.push({ room: "Book", reason: "Source or learning context is relevant." }, { room: "Library", reason: "Saved source material may help later." });
  if (request.intent === "spark_discussion") connections.push({ room: "Spark", reason: "The member is discussing daily practice." });
  if (primaryNeed === "wellness") connections.push({ room: "Wellness", reason: "A gentle practice may help without replacing care." });
  if (primaryNeed === "relationships" || primaryNeed === "belonging" || /(lonely|connection|family|friend|community|meal|table|welcome)/.test(lower)) connections.push({ room: "Table", reason: "Connection and hospitality may support the need." });
  if (primaryNeed === "decision_support" && request.companion !== "Council") connections.push({ room: "Council", reason: "Important decisions may benefit from Adam and Eve together." });
  return connections.slice(0, 3);
}

function calibrationFor(request: UnifiedCompanionRequest, urgency: "low" | "medium" | "high", uncertainty: "low" | "medium" | "high"): PresenceCalibration {
  return {
    warmth: request.companion === "Eve" || uncertainty === "high" ? "high" : "medium",
    detail: urgency === "high" ? "low" : "medium",
    pace: uncertainty === "high" || urgency === "high" ? "slow" : "normal",
    complexity: request.companion === "Council" ? "moderate" : "simple",
    encouragement: request.companion === "Eve" ? "high" : "medium",
    challenge: /always|never|can't do anything/i.test(request.message) ? "gentle" : "none",
  };
}

function flourishingCheck(response: string): HumanFlourishingCheck {
  const truthful = /AI companion|not a real person|human judgment|final decision/i.test(response);
  const practical = /next step|choose one|one clear|one honest/i.test(response);
  const clear = response.split(/\s+/).length <= 220;
  const check = {
    truthful,
    helpful: /help|support|step|reflect|clear/i.test(response),
    respectful: !/you must|you have no choice/i.test(response),
    empowering: /you remain|your choice|your judgment|human judgment|capable/i.test(response),
    practical,
    hopeful: /capable|peace|support|encourage|faithful|small action|next step/i.test(response),
    clear,
  };
  return { ...check, passed: Object.values(check).every(Boolean) };
}

function completionEvaluation(response: string, internalQuality?: CompanionQualityIntelligence): CompanionOrchestrationPlan["completionEvaluation"] {
  const q = internalQuality?.qualityEvaluation;
  return {
    naturalness: q?.naturalness ?? qualityScore(8),
    helpfulness: q?.usefulness ?? qualityScore(8),
    clarity: q?.clarity ?? qualityScore(8),
    warmth: q?.warmth ?? qualityScore(8),
    practicality: qualityScore(/next step|choose one|action/i.test(response) ? 9 : 7),
    humanAgency: qualityScore(/human judgment|final decision|your choice|do not choose/i.test(response) ? 10 : 6),
    trust: qualityScore(/AI companion|not a real person/i.test(response) ? 10 : 6),
    conversationContinuity: q?.followUpQuality ?? qualityScore(8),
    internalOnly: true,
  };
}

export class MasterCompanionOrchestrator {
  orchestrate(params: {
    request: UnifiedCompanionRequest;
    response: string;
    internalQuality?: CompanionQualityIntelligence;
  }): CompanionOrchestrationPlan {
    const presence = createPresenceContext(params.request);
    const intent = detectCommunicationIntent(params.request.message, params.request.intent);
    const emotionalState = detectEmotionalTone(params.request.message);
    const needs = categorizeHumanNeeds(params.request.message, "reflection");
    const primaryNeed = needs[0] ?? "reflection";
    const urgency = urgencyFor(params.request);
    const uncertaintyLevel = uncertaintyFor(params.request);
    const craftMove = params.internalQuality?.craftDecision.move;
    return {
      understanding: {
        realAsk: realAskFor(params.request, primaryNeed),
        emotionalState,
        practicalNeed: primaryNeed,
        lifeStage: inferLifeStageSupport(params.request.message),
        conversationIntent: intent,
        urgency,
        uncertaintyLevel,
      },
      selectedEngines: selectedEngines({ request: params.request, primaryNeed, craftMove, urgency }),
      balance: balancePlan(params.request, urgency),
      rhythm: rhythmFor(craftMove),
      crossRoomConnections: crossRoomConnections(primaryNeed, params.request),
      presenceCalibration: calibrationFor(params.request, urgency, uncertaintyLevel),
      flourishingCheck: flourishingCheck(params.response),
      completionEvaluation: completionEvaluation(params.response, params.internalQuality),
      internalOnly: true,
    };
  }
}
