-- Customers belong to the signed-in Clerk user (the sub claim).
-- The app uses the Supabase publishable key plus the Clerk session token.

create table if not exists public.customers (
  id uuid primary key,
  user_id text not null default (auth.jwt() ->> 'sub'),
  name text not null check (char_length(name) between 2 and 60),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.customers enable row level security;

grant select, insert on public.customers to authenticated;
revoke update on public.customers from authenticated;
grant update (name, phone) on public.customers to authenticated;
revoke all on public.customers from anon;

drop policy if exists "customers_select_own" on public.customers;
create policy "customers_select_own"
  on public.customers
  for select
  to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id and deleted_at is null);

drop policy if exists "customers_insert_own" on public.customers;
create policy "customers_insert_own"
  on public.customers
  for insert
  to authenticated
  with check ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists "customers_update_own" on public.customers;
create policy "customers_update_own"
  on public.customers
  for update
  to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);
