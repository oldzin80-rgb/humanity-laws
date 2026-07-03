create table if not exists public.memberships (
  member_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  membership_status text not null default 'FREE' check (membership_status in ('FREE', 'ACTIVE', 'PAST_DUE', 'CANCELLED')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.memberships enable row level security;

create policy "members can read their own membership"
  on public.memberships
  for select
  using (auth.uid() = member_id);

create policy "service role can manage memberships"
  on public.memberships
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
