create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  kiwi_name text default '위키',
  exp integer default 0,
  affection integer default 0,
  title_tickets integer default 0,
  last_message text
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);
