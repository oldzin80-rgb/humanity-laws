create table if not exists public.communication_preferences (
  member_id uuid not null, channel text not null, purpose text not null,
  opt_in_source text not null, consent_text_version text not null,
  captured_at timestamptz not null, jurisdiction text not null,
  verified boolean not null default false, revoked_at timestamptz,
  revocation_reason text, timezone text not null, quiet_hours jsonb not null,
  locale text not null, accessibility_preferences jsonb not null default '[]',
  version bigint not null default 1,
  primary key(member_id, channel, purpose)
);
create table if not exists public.communication_suppressions (
  suppression_id uuid primary key default gen_random_uuid(), member_id uuid,
  scope text not null, scope_value_hash text not null, reason text not null,
  active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.communication_destinations (
  destination_id uuid primary key default gen_random_uuid(), member_id uuid not null,
  channel text not null, destination_fingerprint text not null unique,
  encrypted_reference text not null, masked_display text not null,
  verified boolean not null default false, country text, region text,
  created_at timestamptz not null default now()
);
create table if not exists public.communication_templates (
  template_id text not null, semantic_version text not null, channel text not null,
  purpose text not null, locale text not null, subject text, body jsonb not null,
  variable_schema jsonb not null, maximum_rendered_length integer not null,
  approval_state text not null, compliance_reference text not null,
  brand_review_state text not null, active_from timestamptz not null,
  active_to timestamptz, supersedes text, immutable boolean not null default false,
  primary key(template_id, semantic_version)
);
create table if not exists public.communication_message_intents (
  intent_id uuid primary key default gen_random_uuid(), member_id uuid not null,
  capability text not null, channel text not null, purpose text not null,
  environment text not null, destination_id uuid not null,
  template_id text not null, template_version text not null, state text not null,
  idempotency_key text not null unique, expected_version bigint not null,
  rendered_payload_reference text not null, estimated_cost_minor bigint not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.communication_delivery_history (
  delivery_event_id uuid primary key default gen_random_uuid(), intent_id uuid not null,
  provider_event_fingerprint text not null unique, prior_state text,
  new_state text not null, provider_status text, occurred_at timestamptz not null
);
create table if not exists public.communication_inbound_events (
  inbound_event_id uuid primary key default gen_random_uuid(),
  provider_event_fingerprint text not null unique, command_type text not null,
  signature_valid boolean not null, payload_reference text not null,
  received_at timestamptz not null default now()
);
create table if not exists public.communication_rate_limits (
  limit_key text primary key, window_started_at timestamptz not null,
  used bigint not null default 0, limit_value bigint not null, version bigint not null default 1
);
create table if not exists public.communication_budget_reservations (
  reservation_id uuid primary key default gen_random_uuid(), intent_id uuid not null unique,
  reserved_minor bigint not null, actual_minor bigint,
  status text not null, created_at timestamptz not null default now()
);
create table if not exists public.communication_staging_authorizations (
  authorization_id uuid primary key default gen_random_uuid(), founder_id uuid not null,
  environment text not null check(environment = 'STAGING'),
  destination_fingerprint text not null, template_id text not null,
  estimated_charge_minor bigint not null, expires_at timestamptz not null,
  used_at timestamptz, revoked_at timestamptz
);
alter table public.communication_preferences enable row level security;
alter table public.communication_suppressions enable row level security;
alter table public.communication_destinations enable row level security;
alter table public.communication_templates enable row level security;
alter table public.communication_message_intents enable row level security;
alter table public.communication_delivery_history enable row level security;
alter table public.communication_inbound_events enable row level security;
alter table public.communication_rate_limits enable row level security;
alter table public.communication_budget_reservations enable row level security;
alter table public.communication_staging_authorizations enable row level security;
create policy "Members read own communication preferences" on public.communication_preferences
for select using(auth.uid() = member_id);
create policy "Members update own communication preferences" on public.communication_preferences
for update using(auth.uid() = member_id) with check(auth.uid() = member_id);
create index if not exists communication_intents_state_idx
on public.communication_message_intents(environment, state, created_at);
