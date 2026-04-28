import { readStorage, writeStorage } from "./utils/storage.js";
import { createId } from "./utils/id.js";
import { getTodayKey } from "./utils/date.js";
import { buildReviewItemFromDiary, completeReviewItem as completeReviewItemLogic } from "./features/review/review.logic.js";
import { evaluateKiwiUnlocks } from "./features/kiwi/kiwi.unlock.js";
import { getKiwiVariantById } from "./data/kiwiVariants.js";
import { getKiwiDisplayName } from "./features/kiwi/kiwi.naming.js";

const STORAGE_KEY = "kiwinest-alpha-state-v1";

const DEFAULT_STATE = {
  schemaVersion: 5,
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
  diaries: [],
  metaSessions: [],
  calmLogs: [],
  reviewQueue: [],
  lastMessage: "둥지에 온 걸 환영해요.\n오늘은 무엇을 가르쳐 줄 건가요?",
};

export let appState = createDefaultState();

export function createDefaultState() {
  return structuredCloneSafe(DEFAULT_STATE);
}

export function loadState() {
  const saved = readStorage(STORAGE_KEY, null);
  appState = migrateState(saved);
  syncKiwiUnlocks({ announce: false });
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

export function applyReward(reward) {
  appState.kiwi.exp += reward.exp ?? 0;
  appState.kiwi.affection += reward.affection ?? 0;
  appState.kiwi.titleTickets += reward.titleTickets ?? 0;
  appState.lastMessage = reward.message ?? appState.lastMessage;
  syncKiwiUnlocks({ announce: true });
  saveState();
}

export function addDiary(diary) {
  const fullDiary = {
    id: createId("diary"),
    createdAt: new Date().toISOString(),
    ...diary,
  };

  appState.diaries.unshift(fullDiary);
  syncKiwiUnlocks({ announce: false });
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
  syncKiwiUnlocks({ announce: false });
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
  syncKiwiUnlocks({ announce: false });
  saveState();
  return fullLog;
}

export function addReviewItemFromDiary(diary) {
  const reviewItem = buildReviewItemFromDiary(diary);
  if (!reviewItem) return null;

  appState.reviewQueue.unshift(reviewItem);
  syncKiwiUnlocks({ announce: false });
  saveState();
  return reviewItem;
}

export function completeReviewItem(reviewId, result) {
  const index = appState.reviewQueue.findIndex((item) => item.id === reviewId);
  if (index < 0) return null;

  const updated = completeReviewItemLogic(appState.reviewQueue[index], result);
  appState.reviewQueue[index] = updated;
  syncKiwiUnlocks({ announce: false });
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

function syncKiwiUnlocks({ announce = false } = {}) {
  ensureKiwiDex();
  const result = evaluateKiwiUnlocks(appState);
  const previousIds = new Set(appState.kiwiDex.unlockedVariantIds);
  const actuallyNew = result.unlockedVariantIds.filter((id) => !previousIds.has(id));

  appState.kiwiDex.unlockedVariantIds = result.unlockedVariantIds;
  appState.kiwiDex.newlyUnlockedIds = actuallyNew.length ? actuallyNew : appState.kiwiDex.newlyUnlockedIds.filter((id) => result.unlockedVariantIds.includes(id));

  if (!result.unlockedVariantIds.includes(appState.kiwiDex.selectedVariantId)) {
    appState.kiwiDex.selectedVariantId = "basic";
  }

  if (announce && actuallyNew.length) {
    const variant = getKiwiVariantById(actuallyNew[0]);
    appState.lastMessage = `${getKiwiDisplayName(variant, appState.kiwi.name)}가 새로 둥지에 찾아왔어요!\n키위 도감에서 대표로 세울 수 있어요.`;
  }
}

function migrateState(saved) {
  if (!saved || typeof saved !== "object") return createDefaultState();

  const next = createDefaultState();
  next.schemaVersion = 5;
  next.kiwi = {
    ...next.kiwi,
    ...(saved.kiwi && typeof saved.kiwi === "object" ? saved.kiwi : {}),
  };
  next.kiwiDex = normalizeKiwiDex(saved.kiwiDex);
  next.diaries = Array.isArray(saved.diaries) ? saved.diaries : [];
  next.metaSessions = Array.isArray(saved.metaSessions) ? saved.metaSessions : [];
  next.calmLogs = Array.isArray(saved.calmLogs) ? saved.calmLogs : [];
  next.reviewQueue = Array.isArray(saved.reviewQueue) ? saved.reviewQueue : [];
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

function ensureKiwiDex() {
  appState.kiwiDex = normalizeKiwiDex(appState.kiwiDex);
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
