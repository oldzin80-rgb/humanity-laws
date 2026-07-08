import type { ApiRequest, ApiResponse } from "../src/server/http.js";
import { bearerToken, methodNotAllowed, readJsonBody, sendJson } from "../src/server/http.js";
import { verifySupabaseAccessToken } from "../src/server/supabaseMembership.js";
import { persistCompanionTurn } from "../src/server/supabaseCompanionPersistence.js";
import type { CompanionTurnPersistenceResult } from "../src/server/supabaseCompanionPersistence.js";
import type { CommunicationIntent, CompanionChannel, UnifiedCompanionResponse } from "../src/communication/types.js";

function isCompanion(value: unknown): value is "Adam" | "Eve" {
  return value === "Adam" || value === "Eve";
}

function isChannel(value: unknown): value is CompanionChannel {
  return value === "in_app" || value === "sms" || value === "phone_voice" || value === "email" || value === "council_session" || value === "future_video_avatar";
}

function isIntent(value: unknown): value is CommunicationIntent {
  return value === "reflection"
    || value === "encouragement"
    || value === "decision_support"
    || value === "spark_discussion"
    || value === "book_discussion"
    || value === "wellness_support"
    || value === "table_community_connection"
    || value === "saved_insight"
    || value === "crisis_escalation_boundary"
    || value === "council_request";
}

async function generateCompanionResponse(params: {
  memberId: string;
  companion: "Adam" | "Eve";
  channel: CompanionChannel;
  input: string;
  consentToRemember: boolean;
  saveInsight: boolean;
  intent: CommunicationIntent;
  conversationHistory: Array<{ companion: string; input?: string; message?: string; createdAt?: string }>;
}): Promise<UnifiedCompanionResponse> {
  try {
    const { UnifiedCompanionService } = await import("../src/communication/unifiedCompanionService.js");
    return await new UnifiedCompanionService().respond({
      memberId: params.memberId,
      companion: params.companion,
      channel: params.channel,
      message: params.input,
      consentToRemember: params.consentToRemember,
      saveInsight: params.saveInsight,
      contextSources: [],
      intent: params.intent,
      conversationHistory: params.conversationHistory,
    });
  } catch (error) {
    console.error("Companion runtime unavailable", error);
    return {
      companion: params.companion,
      channel: params.channel,
      responseOrigin: "emergency_fallback",
      providerName: "emergency_fallback",
      message:
        params.companion === "Adam"
          ? "Adam: I am an AI companion. I can still help you slow down, name the truth in front of you, and choose one responsible next step."
          : "Eve: I am an AI companion. I can still help you slow down, honor the human being in the moment, and choose one caring next step.",
      persisted: false,
      savedInsight: false,
      transparency: "AI_TRANSPARENT",
      humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
      sourceSummary: "Source ledger temporarily unavailable.",
      nextSteps: ["Use your human judgment", "Try again in a moment", "Seek qualified help for high-risk concerns"],
      aiDisclosure: "AI companion; not a real person; human final judgment remains central.",
      presence: {
        detectedIntent: params.intent,
        emotionalTone: "neutral",
        warmth: params.companion === "Eve" ? "gentle" : "steady",
        clarity: "brief",
        memoryStatus: params.consentToRemember ? "consented_context_available" : "no_long_term_memory_implied",
      },
      voiceProfile: {
        companion: params.companion,
        qualities: params.companion === "Adam" ? ["calm", "steady", "practical", "truth-oriented"] : ["warm", "perceptive", "relational", "reflective"],
        bestFor: params.companion === "Adam" ? ["decisions", "discipline", "responsibility"] : ["feelings", "connection", "meaning"],
        avoid: ["fake certainty", "dependency", "deception"],
      },
      memoryStatus: params.consentToRemember ? "consented_context_available" : "no_long_term_memory_implied",
      excellence: {
        warmth: params.companion === "Eve" ? "high" : "steady",
        clarity: "simple",
        brevity: "brief",
        helpfulness: "next_step_focused",
        humility: true,
        humanDignity: true,
        lifeStage: "unspecified",
        humanNeeds: ["reflection", "practical_next_steps"],
        loveInAction: {
          acknowledge: "You are being met with attention, not judgment.",
          understand: "The visible need appears to include reflection.",
          clarify: "Keep the center simple and truthful.",
          encourage: "You are still capable of one faithful next step.",
          guide: "Move gently, clearly, and without giving your agency away.",
          preserveAgency: "Adam and Eve can support reflection; they do not choose for you.",
          nextStep: "choose one honest, small next step you can take today",
        },
      },
      qualityReview: {
        savedInsight: false,
        escalationNeeded: false,
        topicCategory: "reflection",
        userNextStepSuccess: "unknown",
        invasiveAnalytics: false,
      },
      escalationBoundary: { triggered: false },
      avatarPresence: {
        state: "unavailable",
        providerConfigured: false,
        placeholderOnly: true,
        visibleParticipants: [params.companion],
        qualities: {
          humanLikePresence: true,
          warmFacialExpression: true,
          naturalEyeContact: true,
          calmBodyLanguage: true,
          subtleMicroExpressions: true,
          voiceSyncedSpeakingLater: true,
          emotionallyAppropriateTone: true,
          aiTransparency: true,
        },
        statusMessage: "Avatar presence coming soon. Voice and avatar support will be connected after provider verification.",
        transparencyLabel: "AI_AVATAR_PLACEHOLDER",
        councilMode: false,
      },
      immersivePresence: {
        sessionState: "text_fallback",
        avatarRoomState: "fallback_text",
        voiceState: "unavailable",
        emotionalExpression: params.companion === "Eve" ? "warm" : "calm",
        gestureState: params.companion === "Eve" ? "open_posture" : "gentle_nod",
        naturalTurnTakingReady: false,
        voiceSyncedExpressionReady: false,
        eyeContactReady: false,
        microExpressionReady: false,
        bodyLanguageReady: false,
        continuityChannels: ["in_app", "sms", "phone_voice", "email", "future_video_avatar"],
        providerReadiness: {
          avatarProviderConfigured: false,
          voiceProviderConfigured: false,
          smsProviderConfigured: false,
          emailProviderConfigured: false,
        },
        fallback: {
          mode: "text",
          reason: "Immersive voice/avatar presence is architected but not live until providers are connected and verified.",
        },
        trustBoundary: {
          aiTransparent: true,
          neverClaimsHumanIdentity: true,
          humanSovereignty: true,
        },
      },
    };
  }
}

export async function handleCompanionRequest(req: ApiRequest): Promise<{ status: number; body: Record<string, unknown> }> {
  if (req.method !== "POST") return methodNotAllowed(req.method);

  const auth = await verifySupabaseAccessToken(
    {
      supabaseUrl: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    bearerToken(req),
  );
  if (!auth.success || !auth.user) return { status: 401, body: { success: false, error: auth.error ?? "Authentication required." } };

  const body = await readJsonBody(req);
  if (!isCompanion(body.companion)) return { status: 400, body: { success: false, error: "Companion must be Adam or Eve." } };

  const input = typeof body.input === "string" ? body.input.trim() : "";
  if (input.length < 2) return { status: 400, body: { success: false, error: "Write a short message first." } };
  if (input.length > 2000) return { status: 413, body: { success: false, error: "Please keep the message under 2,000 characters." } };
  const consentToRemember = body.consentToRemember === true;
  const saveInsight = body.saveInsight === true;
  const channel = isChannel(body.channel) ? body.channel : "in_app";
  const intent = isIntent(body.intent) ? body.intent : "reflection";
  const conversationHistory = Array.isArray(body.history)
    ? body.history.slice(-8).map((item) => {
      const record = item as Record<string, unknown>;
      return {
        companion: typeof record.companion === "string" ? record.companion : "",
        input: typeof record.input === "string" ? record.input.slice(0, 500) : undefined,
        message: typeof record.message === "string" ? record.message.slice(0, 500) : undefined,
        createdAt: typeof record.createdAt === "string" ? record.createdAt : undefined,
      };
    })
    : [];

  const response = await generateCompanionResponse({
    memberId: auth.user.id,
    companion: body.companion,
    channel,
    input,
    consentToRemember,
    saveInsight,
    intent,
    conversationHistory,
  });
  const persistence = await persistCompanionTurn(
    {
      supabaseUrl: process.env.SUPABASE_URL,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    {
      memberId: auth.user.id,
      companion: body.companion,
      userInput: input,
      companionMessage: response.message,
      humanSovereigntyReminder: response.humanSovereigntyReminder,
      sourceSummary: response.sourceSummary,
      consentToRemember,
      saveInsight,
    },
  ).catch((error: unknown): CompanionTurnPersistenceResult => {
    console.error("Companion persistence unavailable", error);
    return { success: false, persisted: false, error: `${body.companion} returned a response, but saving was unavailable.` };
  });
  const persistenceWarning = persistence.success ? undefined : `${body.companion} returned a response, but saving was unavailable.`;
  if (!persistence.success) console.error("Companion persistence failed", persistence.error);

  return {
    status: 200,
    body: {
      success: true,
      conversationId: persistence.turnId ?? `local_${crypto.randomUUID()}`,
      persisted: persistence.success ? persistence.persisted : false,
      persistenceWarning,
      memoryConsent: consentToRemember,
      savedInsight: persistence.success ? Boolean(persistence.savedInsightId) : false,
      savedInsightId: persistence.success ? persistence.savedInsightId : undefined,
      companion: response.companion,
      channel: response.channel,
      responseOrigin: response.responseOrigin,
      providerName: response.providerName,
      model: response.model,
      message: response.message,
      transparency: response.transparency,
      humanSovereigntyReminder: response.humanSovereigntyReminder,
      sourceSummary: response.sourceSummary,
      nextSteps: response.nextSteps,
      aiDisclosure: response.aiDisclosure,
      presence: response.presence,
      voiceProfile: response.voiceProfile,
      memoryStatus: response.memoryStatus,
      excellence: response.excellence,
      qualityReview: response.qualityReview,
      escalationBoundary: response.escalationBoundary,
      avatarPresence: response.avatarPresence,
      immersivePresence: response.immersivePresence,
    },
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    const result = await handleCompanionRequest(req);
    sendJson(res, result.status, result.body);
  } catch (error) {
    sendJson(res, 500, { success: false, error: error instanceof Error ? error.message : "Companion response failed." });
  }
}
