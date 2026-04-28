import { readStorage, writeStorage } from "./utils/storage.js";
import { createId } from "./utils/id.js";
import { getTodayKey } from "./utils/date.js";
import { buildReviewItemFromDiary, completeReviewItem as completeReviewItemLogic } from "./features/review/review.logic.js";

const STORAGE_KEY = "kiwinest-alpha-state-v1";

const DEFAULT_STATE = {
  schemaVersion: 4,
  kiwi: {
    name: "위키",
    exp: 0,
    affection: 0,
    titleTickets: 0,
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

export function applyReward(reward) {
  appState.kiwi.exp += reward.exp ?? 0;
  appState.kiwi.affection += reward.affection ?? 0;
  appState.kiwi.titleTickets += reward.titleTickets ?? 0;
  appState.lastMessage = reward.message ?? appState.lastMessage;
  saveState();
}

export function addDiary(diary) {
  const fullDiary = {
    id: createId("diary"),
    createdAt: new Date().toISOString(),
    ...diary,
  };

  appState.diaries.unshift(fullDiary);
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
  saveState();
  return fullLog;
}

export function addReviewItemFromDiary(diary) {
  const reviewItem = buildReviewItemFromDiary(diary);
  if (!reviewItem) return null;

  appState.reviewQueue.unshift(reviewItem);
  saveState();
  return reviewItem;
}

export function completeReviewItem(reviewId, result) {
  const index = appState.reviewQueue.findIndex((item) => item.id === reviewId);
  if (index < 0) return null;

  const updated = completeReviewItemLogic(appState.reviewQueue[index], result);
  appState.reviewQueue[index] = updated;
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

function migrateState(saved) {
  if (!saved || typeof saved !== "object") return createDefaultState();

  const next = createDefaultState();
  next.schemaVersion = 4;
  next.kiwi = {
    ...next.kiwi,
    ...(saved.kiwi && typeof saved.kiwi === "object" ? saved.kiwi : {}),
  };
  next.diaries = Array.isArray(saved.diaries) ? saved.diaries : [];
  next.metaSessions = Array.isArray(saved.metaSessions) ? saved.metaSessions : [];
  next.calmLogs = Array.isArray(saved.calmLogs) ? saved.calmLogs : [];
  next.reviewQueue = Array.isArray(saved.reviewQueue) ? saved.reviewQueue : [];
  next.lastMessage = typeof saved.lastMessage === "string" ? saved.lastMessage : next.lastMessage;
  return next;
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
