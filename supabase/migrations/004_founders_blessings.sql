create table if not exists public.founders_blessings_profiles (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  enrollment_status text not null default 'included' check (enrollment_status in ('included', 'paused', 'removed')),
  enrolled_at timestamptz not null default now(),
  eligibility_status text not null default 'pending' check (eligibility_status in ('eligible', 'paused', 'pending')),
  eligibility_reason text not null default 'membership_status_pending',
  current_level text not null default 'level_1' check (current_level in ('level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'level_6')),
  lifetime_blessings_received integer not null default 0,
  last_included_event_id uuid,
  last_selected_event_id uuid,
  active_member_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_id)
);

create table if not exists public.founders_blessings_events (
  id uuid primary key default gen_random_uuid(),
  event_month text not null,
  event_date date not null,
  status text not null default 'in_preparation' check (status in ('in_preparation', 'pending_founder_review', 'recipient_suggested', 'founder_approved', 'gift_prepared', 'completed', 'cancelled', 'postponed')),
  blessing_theme text not null default 'Member appreciation',
  gift_type text not null default 'other' check (gift_type in ('money', 'product', 'experience', 'trip', 'book', 'technology', 'clothing', 'other')),
  gift_description_private text not null default '',
  estimated_gift_value numeric(12, 2) not null default 0,
  selected_member_id_nullable uuid references auth.users(id) on delete set null,
  founder_approved_member_id_nullable uuid references auth.users(id) on delete set null,
  founder_approval_status text not null default 'pending' check (founder_approval_status in ('not_requested', 'pending', 'approved', 'rejected')),
  admin_review_status text not null default 'pending' check (admin_review_status in ('not_requested', 'pending', 'approved', 'rejected')),
  tax_accounting_review_status text not null default 'pending' check (tax_accounting_review_status in ('not_requested', 'pending', 'approved', 'rejected')),
  legal_review_status text not null default 'pending' check (legal_review_status in ('not_requested', 'pending', 'approved', 'rejected')),
  activation_status text not null default 'review_required' check (activation_status in ('not_active', 'review_required', 'approved_for_manual_operation')),
  public_visibility_status text not null default 'private' check (public_visibility_status in ('private', 'anonymized', 'recipient_opted_in')),
  community_page_launch_ready boolean not null default true,
  founders_blessings_plumbing_ready boolean not null default false,
  founders_blessings_profiles_ready boolean not null default false,
  founders_blessings_monthly_pool_ready boolean not null default false,
  founders_blessings_randomizer_ready boolean not null default false,
  real_money_movement_enabled boolean not null default false,
  automatic_gift_enabled boolean not null default false,
  automatic_gift_delivery_enabled boolean not null default false,
  public_announcement_enabled boolean not null default false,
  founder_final_approval_required boolean not null default true,
  admin_review_required boolean not null default true,
  admin_release_required boolean not null default true,
  tax_accounting_review_required boolean not null default true,
  legal_review_recommended boolean not null default true,
  activation_blocking boolean not null default true,
  launch_blocking boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founders_blessings_candidates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.founders_blessings_events(id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.founders_blessings_profiles(id) on delete cascade,
  eligibility_status text not null check (eligibility_status in ('eligible', 'excluded')),
  exclusion_reason_nullable text,
  blessing_level_at_event text not null default 'level_1' check (blessing_level_at_event in ('level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'level_6')),
  created_at timestamptz not null default now(),
  unique (event_id, member_id)
);

create table if not exists public.founders_blessings_random_audits (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.founders_blessings_events(id) on delete cascade,
  algorithm_name text not null default 'node_crypto_randomInt',
  algorithm_version text not null default 'founders_blessings_v1',
  candidate_count integer not null default 0,
  candidate_pool_hash text not null,
  random_selection_index integer,
  selected_candidate_member_id uuid references auth.users(id) on delete set null,
  audit_hash text not null,
  request_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.founders_blessings_gifts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.founders_blessings_events(id) on delete cascade,
  recipient_member_id uuid not null references auth.users(id) on delete cascade,
  gift_type text not null check (gift_type in ('money', 'product', 'experience', 'trip', 'book', 'technology', 'clothing', 'other')),
  gift_description_private text not null default '',
  estimated_value numeric(12, 2) not null default 0,
  delivery_status text not null default 'not_prepared' check (delivery_status in ('not_prepared', 'held_for_founder_approval', 'held_for_admin_release', 'held_for_tax_accounting_review', 'ready_for_manual_release', 'delivered_manually', 'cancelled')),
  payout_provider_nullable text,
  payout_status_nullable text,
  tax_hold_required boolean not null default true,
  accounting_category_pending boolean not null default true,
  founder_release_required boolean not null default true,
  admin_release_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founders_blessings_notifications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.founders_blessings_events(id) on delete cascade,
  recipient_member_id uuid references auth.users(id) on delete cascade,
  notification_type text not null check (notification_type in ('private_in_app', 'private_email', 'anonymized_community_update')),
  notification_status text not null default 'draft_only' check (notification_status in ('draft_only', 'ready_for_private_review', 'sent')),
  private_message text not null,
  public_identity_exposed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.founders_blessings_outcome_confirmations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.founders_blessings_events(id) on delete cascade,
  internal_gift_id uuid references public.founders_blessings_gifts(id) on delete set null,
  public_confirmation_status text not null default 'draft_private' check (public_confirmation_status in ('draft_private', 'pending_admin_approval', 'approved_anonymized', 'rejected')),
  public_month text not null,
  public_year integer not null,
  public_category text not null check (public_category in ('Financial Blessing', 'Product Blessing', 'Experience Blessing', 'Book Blessing', 'Personal Appreciation Gift', 'Community Blessing')),
  public_message text not null,
  exact_value_hidden boolean not null default true,
  recipient_identity_hidden boolean not null default true,
  communication_private boolean not null default true,
  approved_for_public_display boolean not null default false,
  approved_by_admin_id uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founders_blessings_private_communications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.founders_blessings_events(id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade,
  communication_type text not null check (communication_type in ('private_member_notification', 'private_email', 'private_secure_message', 'future_private_voice_video', 'future_founder_personal_message')),
  communication_channel text not null check (communication_channel in ('in_app', 'email', 'secure_message', 'future_voice', 'future_video')),
  message_status text not null default 'draft_only' check (message_status in ('draft_only', 'ready_for_private_review', 'delivered_privately', 'read_privately', 'archived_private')),
  delivered_at timestamptz,
  read_at timestamptz,
  founder_message_optional text,
  follow_up_required boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.founders_blessings_profiles enable row level security;
alter table public.founders_blessings_events enable row level security;
alter table public.founders_blessings_candidates enable row level security;
alter table public.founders_blessings_random_audits enable row level security;
alter table public.founders_blessings_gifts enable row level security;
alter table public.founders_blessings_notifications enable row level security;
alter table public.founders_blessings_outcome_confirmations enable row level security;
alter table public.founders_blessings_private_communications enable row level security;

create policy "members can read their own founder blessing profile"
  on public.founders_blessings_profiles
  for select
  using (auth.uid() = member_id);

create policy "members can read anonymized founder blessing events"
  on public.founders_blessings_events
  for select
  using (public_visibility_status in ('anonymized', 'recipient_opted_in'));

create policy "members can read their own founder blessing candidate record"
  on public.founders_blessings_candidates
  for select
  using (auth.uid() = member_id);

create policy "members can read their own founder blessing gift"
  on public.founders_blessings_gifts
  for select
  using (auth.uid() = recipient_member_id);

create policy "members can read their own founder blessing notification"
  on public.founders_blessings_notifications
  for select
  using (auth.uid() = recipient_member_id);

create policy "members can read approved anonymized founder blessing outcome confirmations"
  on public.founders_blessings_outcome_confirmations
  for select
  using (
    approved_for_public_display = true
    and public_confirmation_status = 'approved_anonymized'
    and exact_value_hidden = true
    and recipient_identity_hidden = true
    and communication_private = true
  );

create policy "members can read their own private founder blessing communication"
  on public.founders_blessings_private_communications
  for select
  using (auth.uid() = member_id);

create policy "service role can manage founders blessings profiles"
  on public.founders_blessings_profiles
  for all
  to service_role
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage founders blessings events"
  on public.founders_blessings_events
  for all
  to service_role
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage founders blessings candidates"
  on public.founders_blessings_candidates
  for all
  to service_role
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage founders blessings random audits"
  on public.founders_blessings_random_audits
  for all
  to service_role
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage founders blessings gifts"
  on public.founders_blessings_gifts
  for all
  to service_role
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage founders blessings notifications"
  on public.founders_blessings_notifications
  for all
  to service_role
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage founders blessings outcome confirmations"
  on public.founders_blessings_outcome_confirmations
  for all
  to service_role
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage founders blessings private communications"
  on public.founders_blessings_private_communications
  for all
  to service_role
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
