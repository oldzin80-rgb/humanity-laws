import type { ApiRequest, ApiResponse } from "../src/server/http.js";
import { bearerToken, methodNotAllowed, readJsonBody, sendJson } from "../src/server/http.js";
import { verifySupabaseAccessToken } from "../src/server/supabaseMembership.js";
import { persistCompanionTurn } from "../src/server/supabaseCompanionPersistence.js";
import type { CompanionTurnPersistenceResult } from "../src/server/supabaseCompanionPersistence.js";
import type { CompanionResponse } from "../src/experiences/types.js";

function isCompanion(value: unknown): value is "Adam" | "Eve" {
  return value === "Adam" || value === "Eve";
}

async function generateCompanionResponse(companion: "Adam" | "Eve", input: string): Promise<CompanionResponse> {
  try {
    const { DemoCompanionGateway } = await import("../src/experiences/companionGateway.js");
    return await new DemoCompanionGateway().respond(companion, input);
  } catch (error) {
    console.error("Companion runtime unavailable", error);
    return {
      companion,
      message:
        companion === "Adam"
          ? "Adam: I am an AI companion. I can still help you slow down, name the truth in front of you, and choose one responsible next step."
          : "Eve: I am an AI companion. I can still help you slow down, honor the human being in the moment, and choose one caring next step.",
      transparency: "AI_TRANSPARENT",
      humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
      sourceSummary: "Source ledger temporarily unavailable.",
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

  const response = await generateCompanionResponse(body.companion, input);
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
    return { success: false, persisted: false, error: "Conversation response returned, but saving was unavailable." };
  });
  const persistenceWarning = persistence.success ? undefined : "Conversation response returned, but saving was unavailable.";
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
      message: response.message,
      transparency: response.transparency,
      humanSovereigntyReminder: response.humanSovereigntyReminder,
      sourceSummary: response.sourceSummary,
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
