import type { ApiRequest, ApiResponse } from "../src/server/http.js";
import { bearerToken, methodNotAllowed, readJsonBody, sendJson } from "../src/server/http.js";
import { verifySupabaseAccessToken } from "../src/server/supabaseMembership.js";
import { DemoCompanionGateway } from "../src/experiences/companionGateway.js";

function isCompanion(value: unknown): value is "Adam" | "Eve" {
  return value === "Adam" || value === "Eve";
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

  const gateway = new DemoCompanionGateway();
  const response = await gateway.respond(body.companion, input);

  return {
    status: 200,
    body: {
      success: true,
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
