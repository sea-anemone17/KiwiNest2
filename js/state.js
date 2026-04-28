import { readStorage, writeStorage } from "./utils/storage.js";
import { createId } from "./utils/id.js";
import { getTodayKey } from "./utils/date.js";
import { buildReviewItemFromDiary, completeReviewItem as completeReviewItemLogic } from "./features/review/review.logic.js";
import { evaluateKiwiUnlocks } from "./features/kiwi/kiwi.unlock.js";
import { getKiwiVariantById } from "./data/kiwiVariants.js";
import { getKiwiDisplayName } from "./features/kiwi/kiwi.naming.js";
import { KIWI_TITLES, getTitleById } from "./data/titles.js";
import { getAchievementById } from "./data/achievements.js";
import { getLetterById } from "./data/letters.js";
import { evaluateAchievements } from "./features/rewards/achievement.logic.js";
import { evaluateLetters } from "./features/rewards/letters.logic.js";
import { drawTitleFromGacha } from "./features/rewards/gacha.logic.js";

const STORAGE_KEY = "kiwinest-alpha-state-v1";

const DEFAULT_STATE = {
  schemaVersion: 6,
  kiwi: {
    name: "위키",
    exp: 0,
    affection: 0,
    titleTickets: 0,
  },
  kiwiDex: {
    selectedVariantId: "basic",
    unlockedVariantIds: ["basic"],
    newlyUnlockedIds: [],
  },
  titles: {
    equippedTitleId: "nest_beginner",
    ownedTitleIds: ["nest_beginner"],
    recentTitleIds: [],
  },
  achievements: {
    unlockedIds: [],
    recentIds: [],
  },
  letters: {
    unlockedIds: [],
    recentIds: [],
  },
  diaries: [],
  metaSessions: [],
  calmLogs: [],
  reviewQueue: [],
  customSubjects: [],
  lastMessage: "둥지에 온 걸 환영해요.\n오늘은 무엇을 가르쳐 줄 건가요?",
};

export let appState = createDefaultState();

export function createDefaultState() {
  return structuredCloneSafe(DEFAULT_STATE);
}

export function loadState() {
  const saved = readStorage(STORAGE_KEY, null);
  appState = migrateState(saved);
  syncProgressUnlocks({ announce: false });
  saveState();
  return appState;
}

export function saveState() {
  writeStorage(STORAGE_KEY, appState);
}

export function resetState() {
  appState = createDefaultState();
  saveState();
}

export function setKiwiName(name) {
  const cleaned = String(name ?? "").trim().slice(0, 16);
  appState.kiwi.name = cleaned || "위키";
  appState.lastMessage = `${appState.kiwi.name}가 자기 이름을 기억했어요.\n작은 발로 둥지를 톡톡 두드려요.`;
  saveState();
}

export function setSelectedKiwiVariant(variantId) {
  const unlocked = appState.kiwiDex.unlockedVariantIds.includes(variantId);
  if (!unlocked) return false;

  appState.kiwiDex.selectedVariantId = variantId;
  const variant = getKiwiVariantById(variantId);
  appState.lastMessage = `${getKiwiDisplayName(variant, appState.kiwi.name)}가 대표 키위가 되었어요.\n둥지 앞에 자리를 잡고 앉았어요.`;
  saveState();
  return true;
}

export function setEquippedTitle(titleId) {
  ensureTitleState();
  if (!appState.titles.ownedTitleIds.includes(titleId)) return false;

  appState.titles.equippedTitleId = titleId;
  const title = getTitleById(titleId);
  appState.lastMessage = `${appState.kiwi.name}가 [${title.name}] 칭호를 달았어요.\n조금 의젓해 보이는 것 같아요.`;
  saveState();
  return true;
}

export function drawTitleGacha() {
  ensureTitleState();

  if ((appState.kiwi.titleTickets ?? 0) <= 0) {
    return {
      ok: false,
      reason: "no_ticket",
      message: "칭호 티켓이 부족해요.",
    };
  }

  const result = drawTitleFromGacha(appState.titles.ownedTitleIds);
  if (result.isComplete || !result.title) {
    return {
      ok: false,
      reason: "complete",
      message: "모든 칭호를 이미 모았어요!",
    };
  }

  appState.kiwi.titleTickets -= 1;
  appState.titles.ownedTitleIds.unshift(result.title.id);
  appState.titles.recentTitleIds = [result.title.id];
  appState.lastMessage = `${appState.kiwi.name}가 새 칭호를 뽑았어요!\n[${result.title.name}] 칭호가 둥지에 반짝여요.`;
  saveState();

  return {
    ok: true,
    title: result.title,
  };
}

export function applyReward(reward) {
  appState.kiwi.exp += reward.exp ?? 0;
  appState.kiwi.affection += reward.affection ?? 0;
  appState.kiwi.titleTickets += reward.titleTickets ?? 0;
  appState.lastMessage = reward.message ?? appState.lastMessage;
  syncProgressUnlocks({ announce: true });
  saveState();
}

export function addDiary(diary) {
  const fullDiary = {
    id: createId("diary"),
    createdAt: new Date().toISOString(),
    ...diary,
  };

  appState.diaries.unshift(fullDiary);
  syncProgressUnlocks({ announce: false });
  saveState();
  return fullDiary;
}

export function addMetaSession(session) {
  const fullSession = {
    id: createId("meta"),
    createdAt: new Date().toISOString(),
    ...session,
  };

  appState.metaSessions.unshift(fullSession);
  syncProgressUnlocks({ announce: false });
  saveState();
  return fullSession;
}

export function addCalmLog(log) {
  const fullLog = {
    id: createId("calm"),
    createdAt: new Date().toISOString(),
    ...log,
  };

  appState.calmLogs.unshift(fullLog);
  syncProgressUnlocks({ announce: false });
  saveState();
  return fullLog;
}

export function addReviewItemFromDiary(diary) {
  const reviewItem = buildReviewItemFromDiary(diary);
  if (!reviewItem) return null;

  appState.reviewQueue.unshift(reviewItem);
  syncProgressUnlocks({ announce: false });
  saveState();
  return reviewItem;
}

export function completeReviewItem(reviewId, result) {
  const index = appState.reviewQueue.findIndex((item) => item.id === reviewId);
  if (index < 0) return null;

  const updated = completeReviewItemLogic(appState.reviewQueue[index], result);
  appState.reviewQueue[index] = updated;
  syncProgressUnlocks({ announce: false });
  saveState();
  return updated;
}

export function getRecentDiaries(limit = 3) {
  return appState.diaries.slice(0, limit);
}

export function getRecentMetaSessions(limit = 3) {
  return appState.metaSessions.slice(0, limit);
}

export function getRecentCalmLogs(limit = 3) {
  return appState.calmLogs.slice(0, limit);
}

export function getReviewItems() {
  return appState.reviewQueue;
}

export function getDueReviewItems() {
  const today = getTodayKey();
  return appState.reviewQueue.filter((item) => item.status !== "mastered" && getTodayKey(item.nextReviewAt) <= today);
}

export function getUpcomingReviewItems() {
  const today = getTodayKey();
  return appState.reviewQueue.filter((item) => item.status !== "mastered" && getTodayKey(item.nextReviewAt) > today);
}

export function getMasteredReviewItems() {
  return appState.reviewQueue.filter((item) => item.status === "mastered");
}

export function getReviewStats() {
  const due = getDueReviewItems().length;
  const upcoming = getUpcomingReviewItems().length;
  const mastered = getMasteredReviewItems().length;
  const total = appState.reviewQueue.length;

  return { due, upcoming, mastered, total };
}

export function getKiwiDexStats() {
  const unlocked = appState.kiwiDex?.unlockedVariantIds?.length ?? 1;
  return {
    unlocked,
    selectedVariantId: appState.kiwiDex?.selectedVariantId ?? "basic",
    newlyUnlocked: appState.kiwiDex?.newlyUnlockedIds ?? [],
  };
}

export function getSelectedKiwiVariant() {
  return getKiwiVariantById(appState.kiwiDex?.selectedVariantId ?? "basic");
}

export function getEquippedTitle() {
  ensureTitleState();
  return getTitleById(appState.titles.equippedTitleId);
}

export function getRecentAchievements(limit = 3) {
  ensureAchievementState();
  return appState.achievements.recentIds.slice(0, limit).map(getAchievementById).filter(Boolean);
}

export function getRecentLetters(limit = 2) {
  ensureLetterState();
  return appState.letters.recentIds.slice(0, limit).map(getLetterById).filter(Boolean);
}

export function getUnlockedAchievements() {
  ensureAchievementState();
  return appState.achievements.unlockedIds.map(getAchievementById).filter(Boolean);
}

export function getUnlockedLetters() {
  ensureLetterState();
  return appState.letters.unlockedIds.map(getLetterById).filter(Boolean);
}

export function getTodayDiaryCount() {
  const today = getTodayKey();
  return appState.diaries.filter((diary) => getTodayKey(diary.createdAt) === today).length;
}

export function getTodayMetaSessionCount() {
  const today = getTodayKey();
  return appState.metaSessions.filter((session) => getTodayKey(session.createdAt) === today).length;
}

export function getTodayCalmLogCount() {
  const today = getTodayKey();
  return appState.calmLogs.filter((log) => getTodayKey(log.createdAt) === today).length;
}

export function addCustomSubject(name) {
  const cleaned = String(name ?? "").trim().slice(0, 20);
  if (!cleaned) return null;

  const id = `custom_${Date.now()}`;

  const subject = {
    id,
    name: cleaned,
    custom: true,
  };

  appState.customSubjects.unshift(subject);
  saveState();
  return subject;
}

function syncProgressUnlocks({ announce = false } = {}) {
  ensureKiwiDex();
  ensureTitleState();
  ensureAchievementState();
  ensureLetterState();

  const kiwiResult = evaluateKiwiUnlocks(appState);
  const previousKiwiIds = new Set(appState.kiwiDex.unlockedVariantIds);
  const newKiwiIds = kiwiResult.unlockedVariantIds.filter((id) => !previousKiwiIds.has(id));

  appState.kiwiDex.unlockedVariantIds = kiwiResult.unlockedVariantIds;
  appState.kiwiDex.newlyUnlockedIds = newKiwiIds.length ? newKiwiIds : appState.kiwiDex.newlyUnlockedIds.filter((id) => kiwiResult.unlockedVariantIds.includes(id));

  if (!kiwiResult.unlockedVariantIds.includes(appState.kiwiDex.selectedVariantId)) {
    appState.kiwiDex.selectedVariantId = "basic";
  }

  const achievementResult = evaluateAchievements(appState);
  const previousAchievementIds = new Set(appState.achievements.unlockedIds);
  const newAchievementIds = achievementResult.unlockedIds.filter((id) => !previousAchievementIds.has(id));
  appState.achievements.unlockedIds = achievementResult.unlockedIds;
  appState.achievements.recentIds = newAchievementIds.length ? [...newAchievementIds, ...appState.achievements.recentIds].slice(0, 8) : appState.achievements.recentIds;

  const letterResult = evaluateLetters(appState);
  const previousLetterIds = new Set(appState.letters.unlockedIds);
  const newLetterIds = letterResult.unlockedIds.filter((id) => !previousLetterIds.has(id));
  appState.letters.unlockedIds = letterResult.unlockedIds;
  appState.letters.recentIds = newLetterIds.length ? [...newLetterIds, ...appState.letters.recentIds].slice(0, 8) : appState.letters.recentIds;

  if (!appState.titles.ownedTitleIds.includes(appState.titles.equippedTitleId)) {
    appState.titles.equippedTitleId = "nest_beginner";
  }

  if (announce) {
    if (newKiwiIds.length) {
      const variant = getKiwiVariantById(newKiwiIds[0]);
      appState.lastMessage = `${getKiwiDisplayName(variant, appState.kiwi.name)}가 새로 둥지에 찾아왔어요!\n키위 도감에서 대표로 세울 수 있어요.`;
      return;
    }

    if (newAchievementIds.length) {
      const achievement = getAchievementById(newAchievementIds[0]);
      if (achievement) {
        appState.lastMessage = `${appState.kiwi.name}가 업적 배지를 물고 왔어요!\n[${achievement.name}] 업적을 달성했어요.`;
        return;
      }
    }

    if (newLetterIds.length) {
      const letter = getLetterById(newLetterIds[0]);
      if (letter) {
        appState.lastMessage = `${appState.kiwi.name}가 작은 편지를 밀어 왔어요.\n“${letter.preview}”`;
      }
    }
  }
}

function migrateState(saved) {
  if (!saved || typeof saved !== "object") return createDefaultState();

  const next = createDefaultState();
  next.schemaVersion = 6;
  next.kiwi = {
    ...next.kiwi,
    ...(saved.kiwi && typeof saved.kiwi === "object" ? saved.kiwi : {}),
  };
  next.kiwiDex = normalizeKiwiDex(saved.kiwiDex);
  next.titles = normalizeTitleState(saved.titles);
  next.achievements = normalizeAchievementState(saved.achievements);
  next.letters = normalizeLetterState(saved.letters);
  next.diaries = Array.isArray(saved.diaries) ? saved.diaries : [];
  next.metaSessions = Array.isArray(saved.metaSessions) ? saved.metaSessions : [];
  next.calmLogs = Array.isArray(saved.calmLogs) ? saved.calmLogs : [];
  next.reviewQueue = Array.isArray(saved.reviewQueue) ? saved.reviewQueue : [];
  next.customSubjects = Array.isArray(saved.customSubjects) ? saved.customSubjects : [];
  next.lastMessage = typeof saved.lastMessage === "string" ? saved.lastMessage : next.lastMessage;
  return next;
}

function normalizeKiwiDex(kiwiDex) {
  const next = structuredCloneSafe(DEFAULT_STATE.kiwiDex);
  if (!kiwiDex || typeof kiwiDex !== "object") return next;

  const unlocked = Array.isArray(kiwiDex.unlockedVariantIds) ? kiwiDex.unlockedVariantIds : next.unlockedVariantIds;
  next.unlockedVariantIds = [...new Set(["basic", ...unlocked])];
  next.selectedVariantId = typeof kiwiDex.selectedVariantId === "string" ? kiwiDex.selectedVariantId : "basic";
  next.newlyUnlockedIds = Array.isArray(kiwiDex.newlyUnlockedIds) ? kiwiDex.newlyUnlockedIds : [];
  return next;
}

function normalizeTitleState(titles) {
  const next = structuredCloneSafe(DEFAULT_STATE.titles);
  if (!titles || typeof titles !== "object") return next;

  const validIds = new Set(KIWI_TITLES.map((title) => title.id));
  const owned = Array.isArray(titles.ownedTitleIds) ? titles.ownedTitleIds : [];
  next.ownedTitleIds = [...new Set(["nest_beginner", ...owned])].filter((id) => validIds.has(id));
  next.equippedTitleId = validIds.has(titles.equippedTitleId) ? titles.equippedTitleId : "nest_beginner";
  next.recentTitleIds = Array.isArray(titles.recentTitleIds) ? titles.recentTitleIds.filter((id) => validIds.has(id)) : [];
  return next;
}

function normalizeAchievementState(achievements) {
  const next = structuredCloneSafe(DEFAULT_STATE.achievements);
  if (!achievements || typeof achievements !== "object") return next;
  next.unlockedIds = Array.isArray(achievements.unlockedIds) ? achievements.unlockedIds : [];
  next.recentIds = Array.isArray(achievements.recentIds) ? achievements.recentIds : [];
  return next;
}

function normalizeLetterState(letters) {
  const next = structuredCloneSafe(DEFAULT_STATE.letters);
  if (!letters || typeof letters !== "object") return next;
  next.unlockedIds = Array.isArray(letters.unlockedIds) ? letters.unlockedIds : [];
  next.recentIds = Array.isArray(letters.recentIds) ? letters.recentIds : [];
  return next;
}

function ensureKiwiDex() {
  appState.kiwiDex = normalizeKiwiDex(appState.kiwiDex);
}

function ensureTitleState() {
  appState.titles = normalizeTitleState(appState.titles);
}

function ensureAchievementState() {
  appState.achievements = normalizeAchievementState(appState.achievements);
}

function ensureLetterState() {
  appState.letters = normalizeLetterState(appState.letters);
}

export function exportStateSnapshot() {
  return structuredCloneSafe(appState);
}

export function replaceStateFromSnapshot(snapshot) {
  appState = migrateState(snapshot);
  syncProgressUnlocks({ announce: false });
  saveState();
  return appState;
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
