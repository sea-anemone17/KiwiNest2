create table public.study_diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),

  subject text not null,
  title text,
  content text,
  explanation text,
  confused_point text,
  trap_point text,

  understanding integer,
  difficulty integer,
  focus_score integer,

  situation text,
  moods text[] default '{}',
  needs_review boolean default false,

  reward jsonb default '{}'::jsonb
);

alter table public.study_diaries enable row level security;

create policy "study_diaries_select_own"
on public.study_diaries for select
using (auth.uid() = user_id);

create policy "study_diaries_insert_own"
on public.study_diaries for insert
with check (auth.uid() = user_id);

create policy "study_diaries_update_own"
on public.study_diaries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "study_diaries_delete_own"
on public.study_diaries for delete
using (auth.uid() = user_id);
