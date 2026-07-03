alter table public.memberships
  add column if not exists digital_book_access boolean not null default false;

update public.memberships
set digital_book_access = true
where membership_status = 'ACTIVE';
