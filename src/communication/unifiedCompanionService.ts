import { createConfiguredCompanionGateway } from "../experiences/companionGateway.js";
import type { CompanionGateway } from "../experiences/types.js";
import { createMergedHumanityLawsRuntime } from "../runtime/mergedHumanityLaws.js";
import { createPlaceholderChannelAdapters, isPlaceholderOnlyChannel } from "./channelAdapters.js";
import { createCompanionExcellenceContext, createConversationQualityReviewHook, excellenceLine } from "./companionExcellenceEngine.js";
import { createCompanionQualityIntelligence } from "./companionQualityIntelligence.js";
import { buildHumanityLawsCompanionOS } from "./humanityLawsCompanionOperatingSystem.js";
import { createImmersivePresenceMetadata } from "./immersivePresence.js";
import { MasterCompanionOrchestrator } from "./masterCompanionOrchestrator.js";
import { aiDisclosure, buildRelevantNextSteps, companionVoiceProfiles, createPresenceContext, shapeCompanionMessage, shapeCouncilMessage } from "./presenceEngine.js";
import { createAvatarPresenceMetadata, RealtimeAvatarAdapter } from "./realtimeAvatarAdapter.js";
import type { CompanionOperatingSystemRuntime, CompanionParticipant, EscalationBoundary, UnifiedCompanionRequest, UnifiedCompanionResponse } from "./types.js";

const humanSovereigntyReminder = "This is reflective support from AI; your human judgment remains final.";

function isDirectCompanion(companion: CompanionParticipant): companion is "Adam" | "Eve" {
  return companion === "Adam" || companion === "Eve";
}

function detectEscalationBoundary(input: string): EscalationBoundary {
  const lower = input.toLowerCase();
  if (/(suicide|self[- ]?harm|kill myself|hurt myself|violence|emergency|immediate danger)/.test(lower)) {
    return {
      triggered: true,
      reason: "Possible emergency, self-harm, violence, or immediate safety concern.",
      recommendedAction: "Contact local emergency services or a qualified crisis professional now. AI companionship is not emergency care.",
    };
  }
  if (/(doctor|medical|diagnos|prescription|lawyer|legal|invest|retirement|large money|child|minor|elder|abuse|neglect)/.test(lower)) {
    return {
      triggered: true,
      reason: "The message may involve professional medical, legal, financial, or vulnerable-person support.",
      recommendedAction: "Use this as reflection only and involve qualified human help before acting.",
    };
  }
  return { triggered: false };
}

function nextStepsFor(request: UnifiedCompanionRequest): string[] {
  if (request.channel === "council_session" || request.companion === "Council" || request.companion === "AdamEve") {
    return ["Review Adam's perspective", "Review Eve's perspective", "Choose the human next step", "Save the outcome if it is useful"];
  }
  if (request.intent === "spark_discussion") return ["Reflect on today's Spark", "Save the insight", "Continue reading"];
  if (request.intent === "book_discussion") return ["Return to the chapter", "Start a Spark", "Save to Library"];
  if (request.intent === "wellness_support") return ["Choose one gentle habit", "Seek qualified care for health concerns", "Return to Human OS"];
  return ["Reflect on the response", "Save the insight if useful", "Open Council for deeper perspective"];
}

function principleSummary(sourcePrinciple: string): string {
  return sourcePrinciple.replace(/^Humanity Laws source remains preserved:\s*/i, "");
}

function companionOSModeFor(companion: CompanionParticipant): "Adam" | "Eve" | "Council" {
  if (companion === "Eve") return "Eve";
  if (companion === "Council" || companion === "AdamEve") return "Council";
  return "Adam";
}

function buildCompanionOSRuntime(request: UnifiedCompanionRequest, sourceContext: string): {
  prompt: string;
  runtime: CompanionOperatingSystemRuntime;
} {
  const os = buildHumanityLawsCompanionOS({
    mode: companionOSModeFor(request.companion),
    memberId: request.memberId,
    userMessage: request.message,
    humanityLawsBookContext: [sourceContext],
    memberContext: [
      `Intent: ${request.intent}`,
      `Channel: ${request.channel}`,
      `Consent to remember: ${request.consentToRemember ? "yes" : "no"}`,
      ...(request.conversationHistory ?? []).slice(-6).map((turn) => `${turn.companion}: ${turn.input ?? ""} ${turn.message ?? ""}`.trim()),
    ],
    sparkContext: request.intent === "spark_discussion" ? ["Spark context requested for this companion turn."] : [],
    tableContext: request.intent === "table_community_connection" ? ["The Table/community context requested for this companion turn."] : [],
    wellnessContext: request.intent === "wellness_support" ? ["Wellness context requested; preserve educational boundaries."] : [],
    researchContext: ["Use safety, source hierarchy, AI transparency, and human sovereignty checks before answering."],
  });
  return {
    prompt: os.systemPrompt,
    runtime: {
      mode: os.mode,
      activeLayers: os.activeLayers,
      launchStandard: os.launchStandard,
      qualityGates: os.qualityGates,
      governingLayer: true,
      promptIncludedInProviderPath: true,
      preservedEngines: [
        "memory",
        "communication",
        "source",
        "avatar_presence",
        "quality_intelligence",
        "safety_boundaries",
      ],
    },
  };
}

export class UnifiedCompanionService {
  constructor(private readonly gateway: CompanionGateway = createConfiguredCompanionGateway()) {}

  async respond(request: UnifiedCompanionRequest): Promise<UnifiedCompanionResponse> {
    if (isPlaceholderOnlyChannel(request.channel)) return this.placeholderResponse(request);
    if (request.channel === "council_session" || request.companion === "Council" || request.companion === "AdamEve") {
      return this.councilResponse(request);
    }
    if (!isDirectCompanion(request.companion)) return this.councilResponse({ ...request, channel: "council_session", companion: "Council" });

    const presence = createPresenceContext(request);
    const escalationBoundary = detectEscalationBoundary(request.message);
    if (escalationBoundary.triggered) return this.safetyBoundaryResponse(request, presence, escalationBoundary);
    const runtime = createMergedHumanityLawsRuntime();
    const sourceContext = `Humanity Laws source remains preserved: SHA-256 ${runtime.bookRegistry.source.sha256}, ${runtime.archiveManifest.source.pageCount} pages.`;
    const companionOS = buildCompanionOSRuntime(request, sourceContext);
    const response = await this.gateway.respond(request.companion, request.message, {
      memberId: request.memberId,
      conversationHistory: request.conversationHistory,
      sourceContext,
      companionOperatingSystem: {
        mode: companionOS.runtime.mode,
        systemPrompt: companionOS.prompt,
        activeLayers: companionOS.runtime.activeLayers,
        launchStandard: companionOS.runtime.launchStandard,
        qualityGates: companionOS.runtime.qualityGates,
      },
      intent: request.intent,
      consentToRemember: request.consentToRemember,
      safetyBoundary: escalationBoundary,
    });
    const excellence = createCompanionExcellenceContext(request, presence);
    const message = response.responseOrigin === "provider"
      ? response.message
      : `${shapeCompanionMessage(request.companion, request, presence)} ${excellenceLine(excellence)}`;
    const primaryNeed = excellence.humanNeeds[0];
    const internalQuality = createCompanionQualityIntelligence({
      request,
      response: message,
      context: presence,
      primaryNeed,
      escalationNeeded: escalationBoundary.triggered,
    });
    const orchestration = new MasterCompanionOrchestrator().orchestrate({ request, response: message, internalQuality });
    return {
      message,
      companion: response.companion,
      channel: request.channel,
      responseOrigin: response.responseOrigin ?? "demo_fallback",
      providerName: response.providerName,
      model: response.model,
      persisted: false,
      savedInsight: false,
      humanSovereigntyReminder: response.humanSovereigntyReminder,
      sourceSummary: response.sourceSummary ?? sourceContext,
      nextSteps: buildRelevantNextSteps(request, presence),
      transparency: response.transparency,
      aiDisclosure,
      presence,
      voiceProfile: companionVoiceProfiles[request.companion],
      memoryStatus: presence.memoryStatus,
      excellence,
      qualityReview: createConversationQualityReviewHook(excellence, request, escalationBoundary.triggered),
      escalationBoundary,
      avatarPresence: createAvatarPresenceMetadata({
        companion: request.companion,
        state: "reflecting",
      }),
      immersivePresence: createImmersivePresenceMetadata(request),
      internalQuality,
      orchestration,
      companionOS: companionOS.runtime,
    };
  }

  private safetyBoundaryResponse(
    request: UnifiedCompanionRequest,
    presence: ReturnType<typeof createPresenceContext>,
    escalationBoundary: EscalationBoundary,
  ): UnifiedCompanionResponse {
    const companion = request.companion === "Eve" ? "Eve" : "Adam";
    const excellence = createCompanionExcellenceContext({ ...request, companion }, presence);
    const message = `${companion}: I am an AI companion, not a real person. This may involve safety, medical, legal, financial, or other qualified human support. ${escalationBoundary.recommendedAction ?? "Please involve qualified human help before acting."} Your human judgment and real-world support come first.`;
    const internalQuality = createCompanionQualityIntelligence({
      request: { ...request, companion },
      response: message,
      context: presence,
      primaryNeed: excellence.humanNeeds[0],
      escalationNeeded: true,
    });
    const orchestration = new MasterCompanionOrchestrator().orchestrate({ request: { ...request, companion }, response: message, internalQuality });
    return {
      message,
      companion,
      channel: request.channel,
      responseOrigin: "demo_fallback",
      providerName: "safety_boundary",
      persisted: false,
      savedInsight: false,
      humanSovereigntyReminder,
      sourceSummary: "Safety boundary response. Humanity Laws source remains preserved; qualified human support is required for high-risk concerns.",
      nextSteps: ["Pause and seek qualified human support", "Use your human judgment", "Return when it is safe to reflect"],
      transparency: "AI_TRANSPARENT",
      aiDisclosure,
      presence,
      voiceProfile: companionVoiceProfiles[companion],
      memoryStatus: presence.memoryStatus,
      excellence,
      qualityReview: createConversationQualityReviewHook(excellence, { ...request, companion }, true),
      escalationBoundary,
      avatarPresence: createAvatarPresenceMetadata({
        companion,
        state: "reflecting",
      }),
      immersivePresence: createImmersivePresenceMetadata({ ...request, companion }),
      internalQuality,
      orchestration,
    };
  }

  private async councilResponse(request: UnifiedCompanionRequest): Promise<UnifiedCompanionResponse> {
    const runtime = createMergedHumanityLawsRuntime();
    const principle = `Humanity Laws source remains preserved: SHA-256 ${runtime.bookRegistry.source.sha256}, ${runtime.archiveManifest.source.pageCount} pages.`;
    const presence = createPresenceContext({ ...request, companion: "Council", channel: "council_session", intent: "council_request" });
    const councilRequest = { ...request, companion: "Council" as const, channel: "council_session" as const, intent: "council_request" as const };
    const companionOS = buildCompanionOSRuntime(councilRequest, principle);
    const councilGatewayContext = {
      memberId: request.memberId,
      conversationHistory: request.conversationHistory,
      sourceContext: principle,
      companionOperatingSystem: {
        mode: companionOS.runtime.mode,
        systemPrompt: companionOS.prompt,
        activeLayers: companionOS.runtime.activeLayers,
        launchStandard: companionOS.runtime.launchStandard,
        qualityGates: companionOS.runtime.qualityGates,
      },
      intent: "council_request",
      consentToRemember: request.consentToRemember,
    };
    const adam = await this.gateway.respond("Adam", request.message, councilGatewayContext);
    const eve = await this.gateway.respond("Eve", request.message, councilGatewayContext);
    const escalationBoundary = detectEscalationBoundary(request.message);
    const excellence = createCompanionExcellenceContext(councilRequest, presence);
    const adamSees = "truth, responsibility, and one clear next step";
    const eveSees = "dignity, presence, relationship, and care";
    const message = shapeCouncilMessage(adamSees, eveSees, principleSummary(principle));
    const primaryNeed = excellence.humanNeeds[0];
    const internalQuality = createCompanionQualityIntelligence({
      request: councilRequest,
      response: message,
      context: presence,
      primaryNeed,
      escalationNeeded: escalationBoundary.triggered,
    });
    const orchestration = new MasterCompanionOrchestrator().orchestrate({ request: councilRequest, response: message, internalQuality });
    return {
      message,
      companion: "Council",
      channel: "council_session",
      persisted: false,
      savedInsight: false,
      humanSovereigntyReminder,
      sourceSummary: principle,
      nextSteps: buildRelevantNextSteps({ ...request, companion: "Council", channel: "council_session" }, presence),
      transparency: "AI_TRANSPARENT",
      aiDisclosure,
      presence,
      voiceProfile: companionVoiceProfiles.Council,
      memoryStatus: presence.memoryStatus,
      excellence,
      qualityReview: createConversationQualityReviewHook(excellence, councilRequest, escalationBoundary.triggered),
      escalationBoundary,
      avatarPresence: createAvatarPresenceMetadata({
        companion: "Council",
        state: "council_mode",
      }),
      immersivePresence: createImmersivePresenceMetadata(councilRequest),
      internalQuality,
      orchestration,
      companionOS: companionOS.runtime,
      council: {
        adamPerspective: adam.message,
        evePerspective: eve.message,
        humanityLawsPrinciple: principle,
        humanFinalChoice: "Adam and Eve can support reflection; the member remains the final decision-maker.",
        savedOutcome: request.saveInsight,
      },
    };
  }

  private async placeholderResponse(request: UnifiedCompanionRequest): Promise<UnifiedCompanionResponse> {
    if (!isPlaceholderOnlyChannel(request.channel)) throw new Error("Placeholder response requires a placeholder-only channel.");
    const adapters = createPlaceholderChannelAdapters();
    const adapter = adapters[request.channel];
    const presence = createPresenceContext(request);
    const escalationBoundary = detectEscalationBoundary(request.message);
    const excellence = createCompanionExcellenceContext(request, presence);
    const message = `${request.companion}: I am an AI companion. ${request.channel} is prepared for future connection, but it is not live yet. Please use the in-app conversation for now.`;
    const primaryNeed = excellence.humanNeeds[0];
    const internalQuality = createCompanionQualityIntelligence({
      request,
      response: message,
      context: presence,
      primaryNeed,
      escalationNeeded: escalationBoundary.triggered,
    });
    const orchestration = new MasterCompanionOrchestrator().orchestrate({ request, response: message, internalQuality });
    const response: UnifiedCompanionResponse = {
      message,
      companion: request.companion,
      channel: request.channel,
      persisted: false,
      savedInsight: false,
      humanSovereigntyReminder,
      nextSteps: ["Use in-app conversation", "Keep consent choices clear", "Connect and verify a real provider before activation"],
      transparency: "AI_TRANSPARENT",
      aiDisclosure,
      presence,
      voiceProfile: companionVoiceProfiles[request.companion],
      memoryStatus: request.consentToRemember ? "consented_context_available" : "no_long_term_memory_implied",
      excellence,
      qualityReview: createConversationQualityReviewHook(excellence, request, escalationBoundary.triggered),
      escalationBoundary,
      orchestration,
    };
    const delivery = await adapter.deliver(request, response);
    const avatarPresence = request.channel === "future_video_avatar"
      ? await new RealtimeAvatarAdapter().renderPresence(request, response)
      : createAvatarPresenceMetadata({ companion: request.companion, state: "unavailable" });
    return {
      ...response,
      sourceSummary: delivery.message,
      avatarPresence,
      immersivePresence: createImmersivePresenceMetadata(request),
      internalQuality,
      orchestration,
    };
  }
}
