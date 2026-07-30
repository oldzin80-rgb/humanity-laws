-- Sprint 025 founder-only executive read models. No operational write authority.
create table if not exists public.executive_scorecards(
 id uuid not null,version bigint not null,name text not null,definition jsonb not null,founder_id uuid not null references auth.users(id),
 active boolean not null default false,created_at timestamptz not null default now(),primary key(id,version));
create table if not exists public.executive_kpi_snapshots(
 id uuid primary key default gen_random_uuid(),scorecard_id uuid not null,scorecard_version bigint not null,
 readiness_score integer not null check(readiness_score between 0 and 100),launch_ready boolean not null default false,
 results jsonb not null,blockers jsonb not null,evidence_references text[] not null,generated_at timestamptz not null);
create table if not exists public.executive_anomalies(
 id uuid primary key default gen_random_uuid(),domain text not null,metric text not null,severity text not null,
 observed numeric not null,baseline numeric not null,reason text not null,evidence_references text[] not null,detected_at timestamptz not null default now());
create table if not exists public.executive_recommendations(
 id uuid primary key default gen_random_uuid(),title text not null,rationale text not null,evidence_references text[] not null,
 confidence numeric not null,risk text not null,expires_at timestamptz not null,advisory_only boolean not null default true,created_at timestamptz not null default now());
create table if not exists public.founder_decisions(
 id uuid primary key default gen_random_uuid(),founder_id uuid not null references auth.users(id),recommendation_id uuid not null references public.executive_recommendations(id),
 decision text not null,reason text not null,expected_version bigint not null,external_actions integer not null default 0,created_at timestamptz not null default now());
alter table public.executive_scorecards enable row level security;alter table public.executive_kpi_snapshots enable row level security;
alter table public.executive_anomalies enable row level security;alter table public.executive_recommendations enable row level security;alter table public.founder_decisions enable row level security;
revoke all on public.executive_scorecards,public.executive_kpi_snapshots,public.executive_anomalies,public.executive_recommendations,public.founder_decisions from anon,authenticated;
