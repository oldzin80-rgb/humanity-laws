import type { SupabaseMembershipConfig } from "./supabaseMembership.js";

export interface CompanionTurnPersistenceParams {
  memberId: string;
  companion: "Adam" | "Eve";
  userInput: string;
  companionMessage: string;
  humanSovereigntyReminder: string;
  sourceSummary?: string;
  consentToRemember: boolean;
  saveInsight: boolean;
}

export interface CompanionTurnPersistenceResult {
  success: boolean;
  persisted: boolean;
  turnId?: string;
  savedInsightId?: string;
  error?: string;
}

function baseUrl(url?: string): string | undefined {
  return url?.replace(/\/$/, "");
}

function serviceHeaders(config: SupabaseMembershipConfig): HeadersInit {
  const key = config.serviceRoleKey ?? "";
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    prefer: "return=representation",
  };
}

export function companionPersistenceConfigured(config: SupabaseMembershipConfig): boolean {
  return Boolean(config.supabaseUrl && config.serviceRoleKey);
}

export async function persistCompanionTurn(
  config: SupabaseMembershipConfig,
  params: CompanionTurnPersistenceParams,
): Promise<CompanionTurnPersistenceResult> {
  if (!companionPersistenceConfigured(config)) return { success: true, persisted: false };

  const fetcher = config.fetchImpl ?? fetch;
  const response = await fetcher(`${baseUrl(config.supabaseUrl)}/rest/v1/companion_conversation_turns`, {
    method: "POST",
    headers: serviceHeaders(config),
    body: JSON.stringify({
      member_id: params.memberId,
      companion: params.companion,
      user_input: params.userInput,
      companion_message: params.companionMessage,
      human_sovereignty_reminder: params.humanSovereigntyReminder,
      source_summary: params.sourceSummary ?? null,
      consent_to_remember: params.consentToRemember,
      saved_insight: params.saveInsight,
    }),
  });

  const json = (await response.json().catch(() => [])) as unknown;
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return { success: false, persisted: false, error: text || `Companion turn persistence failed with HTTP ${response.status}.` };
  }

  const first = Array.isArray(json) ? (json[0] as Record<string, unknown> | undefined) : undefined;
  const turnId = typeof first?.turn_id === "string" ? first.turn_id : undefined;
  return {
    success: true,
    persisted: true,
    turnId,
    savedInsightId: params.saveInsight ? turnId : undefined,
  };
}
