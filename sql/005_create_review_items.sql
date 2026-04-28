create table public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  source_diary_id uuid references public.study_diaries(id) on delete set null,

  created_at timestamptz default now(),
  due_at date not null,

  subject text,
  title text,
  content text,
  confused_point text,

  status text default 'pending',
  review_count integer default 0,
  last_result text,
  last_reviewed_at timestamptz,

  next_interval_days integer default 1
);

alter table public.review_items enable row level security;

create policy "review_items_select_own"
on public.review_items for select
using (auth.uid() = user_id);

create policy "review_items_insert_own"
on public.review_items for insert
with check (auth.uid() = user_id);

create policy "review_items_update_own"
on public.review_items for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "review_items_delete_own"
on public.review_items for delete
using (auth.uid() = user_id);
