-- Sprint 021: governed, consent-aware first-party measurement. Third-party dispatch remains disabled.
create table if not exists public.measurement_consent_preferences (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('ESSENTIAL','FUNCTIONAL','ANALYTICS','PERSONALIZATION','ADVERTISING')),
  granted boolean not null default false,
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  unique (member_id, category)
);

create table if not exists public.analytics_event_taxonomy (
  event_id text not null,
  version integer not null,
  purpose text not null,
  consent_category text not null,
  allowed_destinations text[] not null default array['FIRST_PARTY'],
  prohibited_fields text[] not null,
  retention_days integer not null check (retention_days > 0),
  active boolean not null default true,
  primary key (event_id, version)
);

create table if not exists public.first_party_analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  event_version integer not null,
  environment text not null,
  actor_id uuid references auth.users(id) on delete set null,
  anonymous_id_hash text,
  minimized_properties jsonb not null default '{}'::jsonb,
  idempotency_key text not null unique,
  consent_revision bigint not null,
  occurred_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  foreign key (event_id, event_version) references public.analytics_event_taxonomy(event_id, version)
);

create table if not exists public.analytics_tag_observations (
  id uuid primary key default gen_random_uuid(),
  environment text not null,
  source text not null,
  destination text not null,
  classification text not null check (classification in ('APPROVED','BLOCKED','UNKNOWN','DUPLICATE','STALE','DRIFTED')),
  evidence_reference text not null,
  observed_at timestamptz not null default now()
);

create table if not exists public.attribution_touches (
  id uuid primary key default gen_random_uuid(),
  anonymous_id_hash text,
  member_id uuid references auth.users(id) on delete set null,
  source text, medium text, campaign text, content text, term text,
  consent_revision bigint not null,
  occurred_at timestamptz not null,
  expires_at timestamptz not null
);

alter table public.measurement_consent_preferences enable row level security;
alter table public.analytics_event_taxonomy enable row level security;
alter table public.first_party_analytics_events enable row level security;
alter table public.analytics_tag_observations enable row level security;
alter table public.attribution_touches enable row level security;

create policy measurement_consent_owner_select on public.measurement_consent_preferences for select using (auth.uid() = member_id);
create policy measurement_consent_owner_update on public.measurement_consent_preferences for update using (auth.uid() = member_id) with check (auth.uid() = member_id);
create policy analytics_event_owner_select on public.first_party_analytics_events for select using (auth.uid() = actor_id);
create policy attribution_owner_select on public.attribution_touches for select using (auth.uid() = member_id);

revoke insert, update, delete on public.analytics_event_taxonomy from anon, authenticated;
revoke insert, update, delete on public.first_party_analytics_events from anon, authenticated;
revoke insert, update, delete on public.analytics_tag_observations from anon, authenticated;
revoke insert, update, delete on public.attribution_touches from anon, authenticated;
