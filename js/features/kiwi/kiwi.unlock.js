import { KIWI_VARIANTS } from "../../data/kiwiVariants.js";

export function evaluateKiwiUnlocks(state) {
  const unlocked = new Set(["basic", ...(state.kiwiDex?.unlockedVariantIds ?? [])]);
  const newlyUnlocked = [];

  const unlockIf = (id, condition) => {
    if (!condition || unlocked.has(id)) return;
    unlocked.add(id);
    newlyUnlocked.push(id);
  };

  const diaries = Array.isArray(state.diaries) ? state.diaries : [];
  const metaSessions = Array.isArray(state.metaSessions) ? state.metaSessions : [];
  const calmLogs = Array.isArray(state.calmLogs) ? state.calmLogs : [];
  const reviewQueue = Array.isArray(state.reviewQueue) ? state.reviewQueue : [];

  const confusedCount = diaries.filter((diary) => String(diary.confusedPoint ?? "").trim().length > 0).length;
  const reviewActionCount = reviewQueue.reduce((sum, item) => sum + Number(item.reviewCount || 0), 0);
  const examPeriodCount = calmLogs.filter((log) => log.situation === "exam_period").length;
  const hasRestartLog = calmLogs.some((log) => log.situation === "restart");
  const hasNightRecord = [...diaries, ...metaSessions, ...calmLogs].some((record) => isNightRecord(record.createdAt));

  unlockIf("teacher", diaries.length >= 3);
  unlockIf("sleepy", hasNightRecord);
  unlockIf("focused", metaSessions.length >= 3);
  unlockIf("calm", calmLogs.length >= 3);
  unlockIf("review", reviewActionCount >= 3);
  unlockIf("confused", confusedCount >= 5);
  unlockIf("exam", examPeriodCount >= 3);
  unlockIf("returning", hasRestartLog);

  const validIds = new Set(KIWI_VARIANTS.map((variant) => variant.id));
  const unlockedVariantIds = [...unlocked].filter((id) => validIds.has(id));

  return {
    unlockedVariantIds,
    newlyUnlockedIds: newlyUnlocked,
  };
}

function isNightRecord(createdAt) {
  if (!createdAt) return false;
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return false;
  const hour = date.getHours();
  return hour >= 22 || hour < 6;
}
