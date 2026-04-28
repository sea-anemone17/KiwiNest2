create table public.meta_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),

  goal text,
  session_type text,
  subject text,

  target_minutes integer,
  actual_minutes integer,

  expected_difficulty integer,
  actual_difficulty integer,
  expected_focus integer,
  actual_focus integer,

  achieved boolean default false,
  reflection text,

  reward jsonb default '{}'::jsonb
);

alter table public.meta_sessions enable row level security;

create policy "meta_sessions_select_own"
on public.meta_sessions for select
using (auth.uid() = user_id);

create policy "meta_sessions_insert_own"
on public.meta_sessions for insert
with check (auth.uid() = user_id);

create policy "meta_sessions_update_own"
on public.meta_sessions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "meta_sessions_delete_own"
on public.meta_sessions for delete
using (auth.uid() = user_id);
