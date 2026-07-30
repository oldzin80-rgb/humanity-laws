-- Sprint 023 paid-media planning and budget controls. Spend and production activation remain prohibited.
create table if not exists public.paid_campaign_versions (
 id uuid primary key default gen_random_uuid(), version bigint not null, channel text not null, objective text not null,
 creative_version_id uuid not null, landing_page_version_id uuid not null, audience_version bigint not null,
 conversion_event text not null, attribution_model text not null, immutable boolean not null default false,
 currency char(3) not null, expected_version bigint not null default 1, created_at timestamptz not null default now(), unique(id,version)
);
create table if not exists public.paid_audience_versions (
 id uuid primary key default gen_random_uuid(), version bigint not null, purpose text not null, kind text not null,
 consent_rule text not null, advertising_consent_proven boolean not null default false,
 suppression_applied boolean not null default false, allowed_fields text[] not null default '{}',
 retention_days integer not null, destination text not null, unique(id,version)
);
create table if not exists public.paid_budget_caps (
 id uuid primary key default gen_random_uuid(), scope_type text not null, scope_id text not null,
 amount_minor bigint not null check(amount_minor >= 0), currency char(3) not null, effective_at timestamptz not null,
 expires_at timestamptz, version bigint not null, founder_id uuid not null references auth.users(id), unique(scope_type,scope_id,version)
);
create table if not exists public.paid_budget_reservations (
 id uuid primary key default gen_random_uuid(), campaign_id uuid not null, amount_minor bigint not null check(amount_minor >= 0),
 currency char(3) not null, status text not null, idempotency_key text not null unique,
 expected_version bigint not null, created_at timestamptz not null default now()
);
create table if not exists public.paid_experiments (
 id uuid primary key default gen_random_uuid(), campaign_id uuid not null, hypothesis text not null,
 primary_metric text not null, guardrail_metrics text[] not null, minimum_sample bigint not null,
 maximum_duration interval not null, stopping_criteria jsonb not null, allocation jsonb not null,
 budget_cap_minor bigint not null, founder_approval_id uuid not null, status text not null
);
create table if not exists public.paid_media_action_intents (
 id uuid primary key default gen_random_uuid(), campaign_id uuid not null, campaign_version bigint not null,
 environment text not null, action text not null, status text not null, idempotency_key text not null unique,
 audit_reference text not null, created_at timestamptz not null default now()
);
alter table public.paid_campaign_versions enable row level security;
alter table public.paid_audience_versions enable row level security;
alter table public.paid_budget_caps enable row level security;
alter table public.paid_budget_reservations enable row level security;
alter table public.paid_experiments enable row level security;
alter table public.paid_media_action_intents enable row level security;
revoke all on public.paid_campaign_versions, public.paid_audience_versions, public.paid_budget_caps,
 public.paid_budget_reservations, public.paid_experiments, public.paid_media_action_intents from anon, authenticated;
