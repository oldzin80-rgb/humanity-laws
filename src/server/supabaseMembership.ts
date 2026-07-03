export interface SupabaseMembershipConfig {
  supabaseUrl?: string;
  serviceRoleKey?: string;
  anonKey?: string;
  tableName?: string;
  fetchImpl?: typeof fetch;
}

export interface VerifiedSupabaseUser {
  id: string;
  email?: string;
}

export interface PersistMembershipParams {
  memberId: string;
  email?: string;
  status: "ACTIVE" | "PAST_DUE" | "CANCELLED" | "FREE";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

const defaultTable = "memberships";

function baseUrl(url?: string): string | undefined {
  return url?.replace(/\/$/, "");
}

function serviceHeaders(config: SupabaseMembershipConfig): HeadersInit {
  const key = config.serviceRoleKey ?? "";
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

export function membershipPersistenceConfigured(config: SupabaseMembershipConfig): boolean {
  return Boolean(config.supabaseUrl && config.serviceRoleKey);
}

export async function verifySupabaseAccessToken(
  config: SupabaseMembershipConfig,
  accessToken: string | undefined,
): Promise<{ success: boolean; user?: VerifiedSupabaseUser; error?: string }> {
  if (!config.supabaseUrl || !config.anonKey) return { success: false, error: "Supabase auth env vars are missing." };
  if (!accessToken) return { success: false, error: "Authentication token is missing." };

  const fetcher = config.fetchImpl ?? fetch;
  const response = await fetcher(`${baseUrl(config.supabaseUrl)}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${accessToken}`,
    },
  });
  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) return { success: false, error: "Supabase session could not be verified." };
  const id = typeof json.id === "string" ? json.id : undefined;
  if (!id) return { success: false, error: "Supabase session did not include a user id." };

  return {
    success: true,
    user: {
      id,
      email: typeof json.email === "string" ? json.email : undefined,
    },
  };
}

export async function persistMembershipStatus(
  config: SupabaseMembershipConfig,
  params: PersistMembershipParams,
): Promise<{ success: boolean; error?: string }> {
  if (!membershipPersistenceConfigured(config)) return { success: false, error: "Supabase service role persistence is not configured." };

  const table = config.tableName ?? defaultTable;
  const now = new Date().toISOString();
  const payload = {
    member_id: params.memberId,
    email: params.email ?? null,
    membership_status: params.status,
    stripe_customer_id: params.stripeCustomerId ?? null,
    stripe_subscription_id: params.stripeSubscriptionId ?? null,
    updated_at: now,
  };

  const fetcher = config.fetchImpl ?? fetch;
  const response = await fetcher(`${baseUrl(config.supabaseUrl)}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...serviceHeaders(config),
      prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return { success: false, error: text || `Supabase membership persistence failed with HTTP ${response.status}.` };
  }

  return { success: true };
}

export async function getMembershipStatus(
  config: SupabaseMembershipConfig,
  memberId: string,
): Promise<{ success: boolean; active: boolean; status?: string; error?: string }> {
  if (!membershipPersistenceConfigured(config)) return { success: false, active: false, error: "Supabase service role persistence is not configured." };

  const table = config.tableName ?? defaultTable;
  const fetcher = config.fetchImpl ?? fetch;
  const response = await fetcher(
    `${baseUrl(config.supabaseUrl)}/rest/v1/${table}?member_id=eq.${encodeURIComponent(memberId)}&select=membership_status&limit=1`,
    { headers: serviceHeaders(config) },
  );
  const json = (await response.json().catch(() => [])) as unknown;

  if (!response.ok) return { success: false, active: false, error: `Supabase membership lookup failed with HTTP ${response.status}.` };
  const first = Array.isArray(json) ? (json[0] as Record<string, unknown> | undefined) : undefined;
  const status = typeof first?.membership_status === "string" ? first.membership_status : "FREE";

  return { success: true, active: status === "ACTIVE", status };
}
