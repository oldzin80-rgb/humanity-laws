create table if not exists public.companion_conversation_turns (
  turn_id uuid primary key default gen_random_uuid(),
  member_id uuid not null,
  companion text not null check (companion in ('Adam', 'Eve')),
  user_input text not null,
  companion_message text not null,
  human_sovereignty_reminder text not null,
  source_summary text,
  consent_to_remember boolean not null default false,
  saved_insight boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.companion_conversation_turns enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'companion_conversation_turns'
      and policyname = 'Members can read their own companion turns'
  ) then
    create policy "Members can read their own companion turns"
    on public.companion_conversation_turns
    for select
    using (auth.uid() = member_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'companion_conversation_turns'
      and policyname = 'Members can insert their own companion turns'
  ) then
    create policy "Members can insert their own companion turns"
    on public.companion_conversation_turns
    for insert
    with check (auth.uid() = member_id);
  end if;
end $$;

create index if not exists companion_conversation_turns_member_created_idx
on public.companion_conversation_turns (member_id, created_at desc);

create index if not exists companion_conversation_turns_saved_idx
on public.companion_conversation_turns (member_id, saved_insight)
where saved_insight = true;
