-- Sprint 024 canonical member support. Outbound communication and provider mutations remain disabled.
create table if not exists public.support_cases(
 id uuid primary key default gen_random_uuid(),member_id uuid references auth.users(id),source_channel text not null,
 category text not null,priority text not null,state text not null,assigned_queue text not null,assigned_operator uuid references auth.users(id),
 privacy_classification text not null,safety_classification text not null,minimized_summary text not null,
 verification_state text not null,expected_version bigint not null default 1,due_at timestamptz not null,
 resolution_code text,closure_reason text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.support_case_events(
 id uuid primary key default gen_random_uuid(),case_id uuid not null references public.support_cases(id),prior_state text,new_state text not null,
 actor_id uuid references auth.users(id),reason text not null,correlation_id text not null,idempotency_key text not null unique,created_at timestamptz not null default now());
create table if not exists public.support_knowledge_articles(
 id uuid not null,locale text not null,version bigint not null,owner_id uuid not null references auth.users(id),review_at timestamptz not null,
 evidence_references text[] not null,approved boolean not null default false,member_wording text not null,operator_guidance text not null,
 prohibited_disclosures text[] not null,primary key(id,locale,version));
create table if not exists public.support_action_requests(
 id uuid primary key default gen_random_uuid(),case_id uuid not null references public.support_cases(id),action text not null,status text not null,
 verification_evidence text[],founder_approval_id uuid,idempotency_key text not null unique,expected_version bigint not null,created_at timestamptz not null default now());
create table if not exists public.support_quality_reviews(
 id uuid primary key default gen_random_uuid(),case_id uuid not null references public.support_cases(id),reviewer_id uuid not null references auth.users(id),
 version bigint not null,scores jsonb not null,internal_notes text not null,created_at timestamptz not null default now());
alter table public.support_cases enable row level security;alter table public.support_case_events enable row level security;
alter table public.support_knowledge_articles enable row level security;alter table public.support_action_requests enable row level security;
alter table public.support_quality_reviews enable row level security;
create policy support_case_member_read on public.support_cases for select using(auth.uid()=member_id);
revoke insert,update,delete on public.support_case_events,public.support_knowledge_articles,public.support_action_requests,public.support_quality_reviews from anon,authenticated;
