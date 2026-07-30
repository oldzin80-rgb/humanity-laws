create table if not exists public.provider_accounts (
  provider_id text not null, environment text not null, account_fingerprint text,
  identity_status text not null default 'UNKNOWN', version bigint not null default 1,
  primary key(provider_id, environment)
);
create table if not exists public.provider_resources (
  provider_id text not null, environment text not null, resource_type text not null,
  resource_key text not null, canonical_fingerprint text, evidence_reference text not null,
  primary key(provider_id, environment, resource_type, resource_key)
);
create table if not exists public.provider_configuration_observations (
  observation_id uuid primary key default gen_random_uuid(), provider_id text not null,
  environment text not null, resource_key text not null, observed_fingerprint text,
  configured boolean not null, authorized boolean not null, evidence_reference text,
  observed_at timestamptz not null
);
create table if not exists public.provider_permission_observations (
  observation_id uuid primary key default gen_random_uuid(), provider_id text not null,
  environment text not null, scopes jsonb not null, approved boolean not null,
  evidence_reference text, observed_at timestamptz not null
);
create table if not exists public.provider_deployment_observations (
  observation_id uuid primary key default gen_random_uuid(), provider_id text not null,
  environment text not null, branch text, commit_sha text, deployment_url_fingerprint text,
  status text not null, observed_at timestamptz not null
);
create table if not exists public.provider_migration_observations (
  observation_id uuid primary key default gen_random_uuid(), provider_id text not null,
  environment text not null, migration_id text not null, checksum text,
  status text not null, observed_at timestamptz not null
);
create table if not exists public.provider_payment_configuration_observations (
  observation_id uuid primary key default gen_random_uuid(), environment text not null,
  resource_key text not null, mode text not null, amount_minor bigint,
  currency text, status text not null, observed_at timestamptz not null
);
create table if not exists public.provider_ai_model_policy_observations (
  observation_id uuid primary key default gen_random_uuid(), environment text not null,
  model_id text not null, purpose text not null, data_classification text not null,
  retention_posture text not null, token_limit bigint not null, approved boolean not null,
  observed_at timestamptz not null
);
create table if not exists public.provider_publishing_configuration_observations (
  observation_id uuid primary key default gen_random_uuid(), environment text not null,
  product_key text not null, specification_fingerprint text,
  status text not null, observed_at timestamptz not null
);
create table if not exists public.provider_drift_findings (
  finding_id uuid primary key default gen_random_uuid(), provider_id text not null,
  environment text not null, resource_key text not null, classification text not null,
  explanation text not null, expected_evidence text not null, observed_evidence text,
  acknowledged_at timestamptz, acknowledged_by uuid, version bigint not null default 1,
  detected_at timestamptz not null
);
create table if not exists public.provider_staging_action_requests (
  request_id uuid primary key default gen_random_uuid(), provider_id text not null,
  environment text not null check(environment = 'STAGING'), capability text not null,
  mutating boolean not null, estimated_cost_minor bigint not null default 0,
  founder_id uuid not null, expected_version bigint not null, idempotency_key text not null unique,
  reason text not null, status text not null default 'PENDING',
  expires_at timestamptz not null, executed_at timestamptz
);
alter table public.provider_accounts enable row level security;
alter table public.provider_resources enable row level security;
alter table public.provider_configuration_observations enable row level security;
alter table public.provider_permission_observations enable row level security;
alter table public.provider_deployment_observations enable row level security;
alter table public.provider_migration_observations enable row level security;
alter table public.provider_payment_configuration_observations enable row level security;
alter table public.provider_ai_model_policy_observations enable row level security;
alter table public.provider_publishing_configuration_observations enable row level security;
alter table public.provider_drift_findings enable row level security;
alter table public.provider_staging_action_requests enable row level security;
create policy "Founder reads provider drift" on public.provider_drift_findings
for select using((auth.jwt()->'app_metadata'->>'role') = 'founder');
create policy "Founder acknowledges provider drift" on public.provider_drift_findings
for update using((auth.jwt()->'app_metadata'->>'role') = 'founder')
with check((auth.jwt()->'app_metadata'->>'role') = 'founder');
create index if not exists provider_drift_open_idx
on public.provider_drift_findings(provider_id, environment, classification, detected_at desc)
where acknowledged_at is null;
