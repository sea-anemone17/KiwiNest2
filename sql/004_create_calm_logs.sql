create table public.calm_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),

  situation text not null,
  moods text[] default '{}',
  note text,
  kiwi_message text,

  reward jsonb default '{}'::jsonb
);

alter table public.calm_logs enable row level security;

create policy "calm_logs_select_own"
on public.calm_logs for select
using (auth.uid() = user_id);

create policy "calm_logs_insert_own"
on public.calm_logs for insert
with check (auth.uid() = user_id);

create policy "calm_logs_update_own"
on public.calm_logs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "calm_logs_delete_own"
on public.calm_logs for delete
using (auth.uid() = user_id);
