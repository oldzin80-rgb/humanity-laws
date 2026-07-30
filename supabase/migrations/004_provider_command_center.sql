create table if not exists public.provider_definitions (
  provider_id text primary key,
  display_name text not null,
  category text not null,
  schema_version integer not null check (schema_version > 0),
  definition jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_configurations (
  provider_id text not null references public.provider_definitions(provider_id),
  environment text not null check (environment in ('LOCAL','DEVELOPMENT','STAGING','PRODUCTION')),
  state text not null,
  readiness text not null,
  version bigint not null default 1 check (version > 0),
  policy_validated boolean not null default false,
  founder_authorized boolean not null default false,
  global_paused boolean not null default true,
  provider_paused boolean not null default true,
  evidence_references jsonb not null default '[]',
  updated_at timestamptz not null default now(),
  primary key (provider_id, environment)
);

create table if not exists public.provider_credential_references (
  credential_reference_id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  environment text not null,
  reference_name text not null,
  version_fingerprint text,
  configured boolean not null default false,
  last_validated_at timestamptz,
  validation_result text not null default 'NOT_VALIDATED',
  rotation_status text not null default 'CURRENT',
  unique (provider_id, environment, reference_name),
  foreign key (provider_id, environment)
    references public.provider_configurations(provider_id, environment)
);

create table if not exists public.provider_capabilities (
  provider_id text not null references public.provider_definitions(provider_id),
  capability text not null,
  state text not null default 'DISABLED',
  policy jsonb not null default '{}',
  primary key (provider_id, capability)
);

create table if not exists public.provider_health_observations (
  observation_id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  environment text not null,
  status text not null,
  evidence_reference text,
  observed_at timestamptz not null default now()
);

create table if not exists public.provider_validation_attempts (
  attempt_id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  environment text not null,
  result text not null,
  blocker_codes jsonb not null default '[]',
  evidence_reference text,
  attempted_at timestamptz not null default now()
);

create table if not exists public.provider_activation_requests (
  request_id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  environment text not null,
  requested_by uuid not null,
  expected_version bigint not null,
  status text not null default 'PENDING',
  evidence_references jsonb not null default '[]',
  requested_at timestamptz not null default now(),
  check (environment <> 'PRODUCTION')
);

create table if not exists public.provider_state_transitions (
  transition_id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  environment text not null,
  prior_state text not null,
  new_state text not null,
  actor_id uuid not null,
  expected_version bigint not null,
  reason text not null,
  evidence_references jsonb not null default '[]',
  occurred_at timestamptz not null default now()
);

create table if not exists public.provider_usage_observations (
  observation_id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  environment text not null,
  capability text not null,
  units numeric not null check (units >= 0),
  observed_at timestamptz not null default now()
);

create table if not exists public.provider_budget_controls (
  provider_id text not null,
  environment text not null,
  capability text not null,
  authorized_minor bigint not null default 0 check (authorized_minor >= 0),
  reserved_minor bigint not null default 0 check (reserved_minor >= 0),
  consumed_minor bigint not null default 0 check (consumed_minor >= 0),
  hard_cap_minor bigint not null default 0 check (hard_cap_minor >= 0),
  version bigint not null default 1,
  primary key (provider_id, environment, capability)
);

create table if not exists public.provider_webhook_configurations (
  provider_id text not null,
  environment text not null,
  webhook_type text not null,
  secret_reference_name text,
  readiness text not null default 'NOT_VERIFIED',
  replay_window_seconds integer not null default 300,
  primary key (provider_id, environment, webhook_type)
);

create table if not exists public.provider_incidents (
  incident_id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  environment text not null,
  severity text not null,
  status text not null default 'OPEN',
  containment text,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_audit_events (
  event_id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  environment text not null,
  actor_id text not null,
  action text not null,
  outcome text not null,
  reason_codes jsonb not null default '[]',
  correlation_id text not null,
  occurred_at timestamptz not null default now()
);

create table if not exists public.provider_idempotency_keys (
  idempotency_key text primary key,
  actor_id text not null,
  provider_id text not null,
  request_hash text not null,
  result_reference text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_outbox (
  outbox_id uuid primary key default gen_random_uuid(),
  topic text not null,
  aggregate_id text not null,
  payload_reference text not null,
  status text not null default 'PENDING',
  attempts integer not null default 0,
  created_at timestamptz not null default now()
);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'provider_definitions','provider_configurations','provider_credential_references',
    'provider_capabilities','provider_health_observations','provider_validation_attempts',
    'provider_activation_requests','provider_state_transitions','provider_usage_observations',
    'provider_budget_controls','provider_webhook_configurations','provider_incidents',
    'provider_audit_events','provider_idempotency_keys','provider_outbox'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy "Founder may read %1$s" on public.%1$I for select using ((auth.jwt()->''app_metadata''->>''role'') = ''founder'')',
      table_name
    );
    execute format(
      'create policy "Founder may insert %1$s" on public.%1$I for insert with check ((auth.jwt()->''app_metadata''->>''role'') = ''founder'')',
      table_name
    );
  end loop;
end $$;

create or replace function public.prevent_provider_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'provider audit events are immutable';
end;
$$;

drop trigger if exists provider_audit_events_immutable_update on public.provider_audit_events;
create trigger provider_audit_events_immutable_update
before update or delete on public.provider_audit_events
for each row execute function public.prevent_provider_audit_mutation();

create index if not exists provider_health_latest_idx
on public.provider_health_observations(provider_id, environment, observed_at desc);
create index if not exists provider_audit_lookup_idx
on public.provider_audit_events(provider_id, environment, occurred_at desc);
create index if not exists provider_outbox_pending_idx
on public.provider_outbox(status, created_at) where status = 'PENDING';
