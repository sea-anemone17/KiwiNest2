import { supabase } from "./client.js";

export async function ensureUserRows(user, state) {
  if (!user?.id) throw new Error("로그인이 필요해요.");

  const profile = mapProfile(user.id, state);
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" });
  if (profileError) throw profileError;

  const kiwiState = mapKiwiState(user.id, state);
  const { error: kiwiError } = await supabase
    .from("kiwi_state")
    .upsert(kiwiState, { onConflict: "user_id" });
  if (kiwiError) throw kiwiError;
}

export async function uploadLocalState(user, state) {
  if (!user?.id) throw new Error("로그인이 필요해요.");
  await ensureUserRows(user, state);

  await replaceTable("study_diaries", user.id, mapDiaries(user.id, state.diaries));
  await replaceTable("meta_sessions", user.id, mapMetaSessions(user.id, state.metaSessions));
  await replaceTable("calm_logs", user.id, mapCalmLogs(user.id, state.calmLogs));
  await replaceTable("review_items", user.id, mapReviewItems(user.id, state.reviewQueue));
  await replaceTable("reward_events", user.id, mapRewardEvents(user.id, state));

  return true;
}

export async function downloadCloudState(user, fallbackState) {
  if (!user?.id) throw new Error("로그인이 필요해요.");

  const [profileRes, kiwiRes, diaryRes, metaRes, calmRes, reviewRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("kiwi_state").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("study_diaries").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("meta_sessions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("calm_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("review_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  for (const res of [profileRes, kiwiRes, diaryRes, metaRes, calmRes, reviewRes]) {
    if (res.error) throw res.error;
  }

  return {
    ...fallbackState,
    kiwi: {
      ...fallbackState.kiwi,
      name: profileRes.data?.kiwi_name ?? fallbackState.kiwi?.name ?? "위키",
      exp: profileRes.data?.exp ?? fallbackState.kiwi?.exp ?? 0,
      affection: profileRes.data?.affection ?? fallbackState.kiwi?.affection ?? 0,
      titleTickets: profileRes.data?.title_tickets ?? fallbackState.kiwi?.titleTickets ?? 0,
    },
    kiwiDex: {
      selectedVariantId: kiwiRes.data?.selected_variant_id ?? "basic",
      unlockedVariantIds: kiwiRes.data?.unlocked_variant_ids ?? ["basic"],
      newlyUnlockedIds: [],
    },
    titles: {
      equippedTitleId: kiwiRes.data?.equipped_title_id ?? "nest_beginner",
      ownedTitleIds: kiwiRes.data?.owned_title_ids?.length ? kiwiRes.data.owned_title_ids : ["nest_beginner"],
      recentTitleIds: [],
    },
    achievements: {
      unlockedIds: kiwiRes.data?.unlocked_achievement_ids ?? [],
      recentIds: [],
    },
    letters: {
      unlockedIds: kiwiRes.data?.unlocked_letter_ids ?? [],
      recentIds: [],
    },
    diaries: (diaryRes.data ?? []).map(fromDiaryRow),
    metaSessions: (metaRes.data ?? []).map(fromMetaRow),
    calmLogs: (calmRes.data ?? []).map(fromCalmRow),
    reviewQueue: (reviewRes.data ?? []).map(fromReviewRow),
    lastMessage: profileRes.data?.last_message ?? fallbackState.lastMessage,
  };
}

async function replaceTable(table, userId, rows) {
  const { error: deleteError } = await supabase.from(table).delete().eq("user_id", userId);
  if (deleteError) throw deleteError;
  if (!rows.length) return;
  const { error: insertError } = await supabase.from(table).insert(rows);
  if (insertError) throw insertError;
}

function mapProfile(userId, state) {
  return {
    id: userId,
    kiwi_name: state.kiwi?.name ?? "위키",
    exp: state.kiwi?.exp ?? 0,
    affection: state.kiwi?.affection ?? 0,
    title_tickets: state.kiwi?.titleTickets ?? 0,
    last_message: state.lastMessage ?? null,
    updated_at: new Date().toISOString(),
  };
}

function mapKiwiState(userId, state) {
  return {
    user_id: userId,
    selected_variant_id: state.kiwiDex?.selectedVariantId ?? "basic",
    unlocked_variant_ids: state.kiwiDex?.unlockedVariantIds ?? ["basic"],
    equipped_title_id: state.titles?.equippedTitleId ?? "nest_beginner",
    owned_title_ids: state.titles?.ownedTitleIds ?? ["nest_beginner"],
    unlocked_achievement_ids: state.achievements?.unlockedIds ?? [],
    unlocked_letter_ids: state.letters?.unlockedIds ?? [],
    newly_unlocked: state.kiwiDex?.newlyUnlockedIds ?? [],
    updated_at: new Date().toISOString(),
  };
}

function mapDiaries(userId, diaries = []) {
  return diaries.map((diary) => ({
    id: safeUuidOrNull(diary.id),
    user_id: userId,
    created_at: diary.createdAt ?? new Date().toISOString(),
    subject: diary.subject ?? "기타",
    title: diary.title ?? null,
    content: diary.content ?? null,
    explanation: diary.explanation ?? diary.longExplanation ?? diary.explanationToKiwi ?? null,
    confused_point: diary.confusedPoint ?? null,
    trap_point: diary.trapPoint ?? diary.examTrap ?? null,
    understanding: toNumberOrNull(diary.understanding),
    difficulty: toNumberOrNull(diary.difficulty),
    focus_score: toNumberOrNull(diary.focusScore),
    situation: diary.situation ?? null,
    moods: Array.isArray(diary.moods) ? diary.moods : [],
    needs_review: Boolean(diary.needsReview ?? diary.confusedPoint),
    reward: diary.reward ?? {},
  })).map(removeNullId);
}

function mapMetaSessions(userId, sessions = []) {
  return sessions.map((session) => ({
    id: safeUuidOrNull(session.id),
    user_id: userId,
    created_at: session.createdAt ?? new Date().toISOString(),
    goal: session.goal ?? null,
    session_type: session.sessionType ?? session.type ?? null,
    subject: session.subject ?? null,
    target_minutes: toNumberOrNull(session.targetMinutes),
    actual_minutes: toNumberOrNull(session.actualMinutes),
    expected_difficulty: toNumberOrNull(session.expectedDifficulty),
    actual_difficulty: toNumberOrNull(session.actualDifficulty),
    expected_focus: toNumberOrNull(session.expectedFocus),
    actual_focus: toNumberOrNull(session.actualFocus),
    achieved: Boolean(session.achieved),
    reflection: session.reflection ?? session.note ?? null,
    reward: session.reward ?? {},
  })).map(removeNullId);
}

function mapCalmLogs(userId, logs = []) {
  return logs.map((log) => ({
    id: safeUuidOrNull(log.id),
    user_id: userId,
    created_at: log.createdAt ?? new Date().toISOString(),
    situation: log.situation ?? "normal",
    moods: Array.isArray(log.moods) ? log.moods : log.mood ? [log.mood] : [],
    note: log.note ?? null,
    kiwi_message: log.kiwiMessage ?? log.message ?? null,
    reward: log.reward ?? {},
  })).map(removeNullId);
}

function mapReviewItems(userId, items = []) {
  return items.map((item) => ({
    id: safeUuidOrNull(item.id),
    user_id: userId,
    source_diary_id: safeUuidOrNull(item.sourceDiaryId),
    created_at: item.createdAt ?? new Date().toISOString(),
    due_at: toDateOnly(item.nextReviewAt ?? item.dueAt ?? item.createdAt),
    subject: item.subject ?? null,
    title: item.title ?? null,
    content: item.content ?? null,
    confused_point: item.confusedPoint ?? null,
    status: item.status ?? "pending",
    review_count: toNumberOrNull(item.reviewCount) ?? 0,
    last_result: item.lastResult ?? null,
    last_reviewed_at: item.lastReviewedAt ?? null,
    next_interval_days: toNumberOrNull(item.nextIntervalDays) ?? 1,
  })).map(removeNullId);
}

function mapRewardEvents(userId, state) {
  const achievementEvents = (state.achievements?.unlockedIds ?? []).map((id) => ({
    user_id: userId,
    type: "achievement",
    source_type: "achievement",
    title: id,
    message: "업적 해금",
    payload: { id },
  }));
  const letterEvents = (state.letters?.unlockedIds ?? []).map((id) => ({
    user_id: userId,
    type: "letter",
    source_type: "letter",
    title: id,
    message: "편지 해금",
    payload: { id },
  }));
  return [...achievementEvents, ...letterEvents];
}

function fromDiaryRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    subject: row.subject,
    title: row.title,
    content: row.content,
    explanation: row.explanation,
    confusedPoint: row.confused_point,
    trapPoint: row.trap_point,
    understanding: row.understanding,
    difficulty: row.difficulty,
    focusScore: row.focus_score,
    situation: row.situation,
    moods: row.moods ?? [],
    needsReview: row.needs_review,
    reward: row.reward ?? {},
  };
}

function fromMetaRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    goal: row.goal,
    sessionType: row.session_type,
    subject: row.subject,
    targetMinutes: row.target_minutes,
    actualMinutes: row.actual_minutes,
    expectedDifficulty: row.expected_difficulty,
    actualDifficulty: row.actual_difficulty,
    expectedFocus: row.expected_focus,
    actualFocus: row.actual_focus,
    achieved: row.achieved,
    reflection: row.reflection,
    reward: row.reward ?? {},
  };
}

function fromCalmRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    situation: row.situation,
    moods: row.moods ?? [],
    note: row.note,
    kiwiMessage: row.kiwi_message,
    reward: row.reward ?? {},
  };
}

function fromReviewRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    sourceDiaryId: row.source_diary_id,
    nextReviewAt: row.due_at,
    subject: row.subject,
    title: row.title,
    content: row.content,
    confusedPoint: row.confused_point,
    status: row.status,
    reviewCount: row.review_count,
    lastResult: row.last_result,
    lastReviewedAt: row.last_reviewed_at,
    nextIntervalDays: row.next_interval_days,
  };
}

function toNumberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toDateOnly(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function safeUuidOrNull(value) {
  const text = String(value ?? "");
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text) ? text : null;
}

function removeNullId(row) {
  if (row.id === null) delete row.id;
  if (row.source_diary_id === null) row.source_diary_id = null;
  return row;
}
