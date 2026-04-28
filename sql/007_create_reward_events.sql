create table public.reward_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),

  type text not null,
  source_type text,
  source_id uuid,

  title text,
  message text,
  payload jsonb default '{}'::jsonb
);

alter table public.reward_events enable row level security;

create policy "reward_events_select_own"
on public.reward_events for select
using (auth.uid() = user_id);

create policy "reward_events_insert_own"
on public.reward_events for insert
with check (auth.uid() = user_id);

create policy "reward_events_delete_own"
on public.reward_events for delete
using (auth.uid() = user_id);
