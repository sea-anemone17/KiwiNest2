import { ACHIEVEMENTS } from "../../data/achievements.js";

export function evaluateAchievements(state) {
  const unlocked = new Set(state.achievements?.unlockedIds ?? []);
  const newlyUnlocked = [];

  const diaries = Array.isArray(state.diaries) ? state.diaries : [];
  const metaSessions = Array.isArray(state.metaSessions) ? state.metaSessions : [];
  const calmLogs = Array.isArray(state.calmLogs) ? state.calmLogs : [];
  const reviewQueue = Array.isArray(state.reviewQueue) ? state.reviewQueue : [];
  const kiwiDex = state.kiwiDex ?? {};

  const confusedCount = diaries.filter((diary) => String(diary.confusedPoint ?? "").trim().length > 0).length;
  const longExplanationCount = diaries.filter((diary) => String(diary.explanation ?? "").trim().length >= 350).length;
  const reviewActionCount = reviewQueue.reduce((sum, item) => sum + Number(item.reviewCount || 0), 0);
  const examPeriodCount = calmLogs.filter((log) => log.situation === "exam_period").length;
  const unlockedKiwiCount = Array.isArray(kiwiDex.unlockedVariantIds) ? kiwiDex.unlockedVariantIds.length : 1;

  const unlockIf = (id, condition) => {
    if (!condition || unlocked.has(id)) return;
    unlocked.add(id);
    newlyUnlocked.push(id);
  };

  unlockIf("first_diary", diaries.length >= 1);
  unlockIf("teacher_three", diaries.length >= 3);
  unlockIf("long_explainer", longExplanationCount >= 1);
  unlockIf("meta_start", metaSessions.length >= 1);
  unlockIf("calm_return", calmLogs.length >= 1);
  unlockIf("review_first", reviewActionCount >= 1);
  unlockIf("confusion_collector", confusedCount >= 5);
  unlockIf("exam_survivor", examPeriodCount >= 3);
  unlockIf("kiwi_collector", unlockedKiwiCount >= 5);

  const validIds = new Set(ACHIEVEMENTS.map((achievement) => achievement.id));

  return {
    unlockedIds: [...unlocked].filter((id) => validIds.has(id)),
    newlyUnlockedIds: newlyUnlocked,
  };
}
