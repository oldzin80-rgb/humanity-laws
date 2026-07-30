-- Sprint 022 canonical social content and publication records. Provider execution remains disabled.
create table if not exists public.marketing_content_versions (
  id uuid primary key default gen_random_uuid(), campaign_id uuid not null, version bigint not null,
  channel text not null, locale text not null default 'en-US', copy text not null,
  generated_by_ai boolean not null default false, immutable boolean not null default false,
  expected_version bigint not null default 1, supersedes_id uuid references public.marketing_content_versions(id),
  created_by uuid not null references auth.users(id), created_at timestamptz not null default now(),
  unique (campaign_id, channel, version)
);
create table if not exists public.marketing_claims (
  id uuid primary key default gen_random_uuid(), content_version_id uuid not null references public.marketing_content_versions(id),
  statement text not null, risk text not null, evidence_references text[] not null default '{}',
  evidence_expires_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.marketing_assets (
  id uuid primary key default gen_random_uuid(), version bigint not null, checksum text not null,
  rights_status text not null, rights_expires_at timestamptz, channels text[] not null,
  alt_text text, captions_available boolean not null default false, unique(id, version)
);
create table if not exists public.marketing_version_approvals (
  id uuid primary key default gen_random_uuid(), content_version_id uuid not null references public.marketing_content_versions(id),
  content_version bigint not null, asset_bindings text[] not null, channel text not null, campaign_id uuid not null,
  environment text not null, schedule_start timestamptz not null, schedule_end timestamptz not null,
  reviewer_roles text[] not null, founder_id uuid not null references auth.users(id),
  status text not null, expires_at timestamptz not null, created_at timestamptz not null default now()
);
create table if not exists public.marketing_publications (
  id uuid primary key default gen_random_uuid(), content_version_id uuid not null references public.marketing_content_versions(id),
  approval_id uuid not null references public.marketing_version_approvals(id), channel text not null,
  environment text not null, state text not null, scheduled_for timestamptz,
  idempotency_key text not null unique, expected_version bigint not null,
  provider_correlation_id text, audit_reference text not null, created_at timestamptz not null default now()
);
create table if not exists public.marketing_publication_history (
  id uuid primary key default gen_random_uuid(), publication_id uuid not null references public.marketing_publications(id),
  prior_state text, new_state text not null, actor_id uuid not null references auth.users(id),
  reason text not null, correlation_id text not null, created_at timestamptz not null default now()
);
alter table public.marketing_content_versions enable row level security;
alter table public.marketing_claims enable row level security;
alter table public.marketing_assets enable row level security;
alter table public.marketing_version_approvals enable row level security;
alter table public.marketing_publications enable row level security;
alter table public.marketing_publication_history enable row level security;
revoke all on public.marketing_content_versions, public.marketing_claims, public.marketing_assets,
  public.marketing_version_approvals, public.marketing_publications, public.marketing_publication_history from anon, authenticated;
