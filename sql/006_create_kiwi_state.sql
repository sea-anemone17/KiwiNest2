create table public.kiwi_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  updated_at timestamptz default now(),

  selected_variant_id text default 'basic',
  unlocked_variant_ids text[] default array['basic'],

  equipped_title_id text,
  owned_title_ids text[] default '{}',

  unlocked_achievement_ids text[] default '{}',
  unlocked_letter_ids text[] default '{}',

  newly_unlocked jsonb default '[]'::jsonb
);

alter table public.kiwi_state enable row level security;

create policy "kiwi_state_select_own"
on public.kiwi_state for select
using (auth.uid() = user_id);

create policy "kiwi_state_insert_own"
on public.kiwi_state for insert
with check (auth.uid() = user_id);

create policy "kiwi_state_update_own"
on public.kiwi_state for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
