import { createId } from "../../utils/id.js";
import { getTodayKey } from "../../utils/date.js";

const SUCCESS_INTERVAL_DAYS = [3, 7, 14, 30];

export function buildReviewItemFromDiary(diary) {
  if (!diary) return null;

  const prompt = diary.confusedPoint?.trim() || diary.title;

  return {
    id: createId("review"),
    diaryId: diary.id,
    createdAt: new Date().toISOString(),
    subject: diary.subject,
    title: diary.title,
    prompt,
    originalExplanation: diary.explanation,
    confusedPoint: diary.confusedPoint,
    understandingAtCreation: Number(diary.understanding) || 0,
    nextReviewAt: new Date().toISOString(),
    lastReviewedAt: null,
    reviewCount: 0,
    successCount: 0,
    status: "pending",
    history: [],
  };
}

export function completeReviewItem(item, result) {
  const now = new Date();
  const reviewResult = normalizeResult(result);
  const next = { ...item };

  next.reviewCount = Number(next.reviewCount || 0) + 1;
  next.lastReviewedAt = now.toISOString();
  next.history = Array.isArray(next.history) ? [...next.history] : [];
  next.history.unshift({
    result: reviewResult,
    reviewedAt: now.toISOString(),
  });

  if (reviewResult === "remembered") {
    const successCount = Number(next.successCount || 0) + 1;
    next.successCount = successCount;

    if (successCount >= SUCCESS_INTERVAL_DAYS.length) {
      next.status = "mastered";
      next.nextReviewAt = addDays(now, 30).toISOString();
    } else {
      next.status = "pending";
      next.nextReviewAt = addDays(now, SUCCESS_INTERVAL_DAYS[successCount - 1]).toISOString();
    }
  } else if (reviewResult === "shaky") {
    next.status = "pending";
    next.nextReviewAt = addDays(now, 1).toISOString();
  } else {
    next.successCount = 0;
    next.status = "pending";
    next.nextReviewAt = addDays(now, 1).toISOString();
  }

  return next;
}

export function splitReviewItems(items) {
  const today = getTodayKey();
  const due = [];
  const upcoming = [];
  const mastered = [];

  for (const item of items) {
    if (item.status === "mastered") {
      mastered.push(item);
    } else if (getTodayKey(item.nextReviewAt) <= today) {
      due.push(item);
    } else {
      upcoming.push(item);
    }
  }

  return { due, upcoming, mastered };
}

export function getReviewStageLabel(item) {
  const successCount = Number(item.successCount || 0);
  if (item.status === "mastered") return "완료";
  if (successCount <= 0) return "오늘 복습";
  if (successCount === 1) return "3일 루프";
  if (successCount === 2) return "7일 루프";
  if (successCount === 3) return "14일 루프";
  return "시험 직전 루프";
}

export function getReviewResultLabel(result) {
  if (result === "remembered") return "기억남";
  if (result === "shaky") return "애매함";
  return "모름";
}

function normalizeResult(result) {
  if (["remembered", "shaky", "forgot"].includes(result)) return result;
  return "shaky";
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
