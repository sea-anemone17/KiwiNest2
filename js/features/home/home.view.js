import {
  appState,
  getEquippedTitle,
  getRecentAchievements,
  getRecentCalmLogs,
  getRecentDiaries,
  getRecentLetters,
  getRecentMetaSessions,
  getReviewStats,
  getSelectedKiwiVariant,
  getTodayCalmLogCount,
  getTodayDiaryCount,
  getTodayMetaSessionCount,
} from "../../state.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { formatDateTime } from "../../utils/date.js";
import { getSubjectName } from "../../data/subjects.js";
import { getMoodEmoji, getMoodName } from "../../data/moods.js";
import { getSituationEmoji, getSituationName } from "../../data/situations.js";
import { KIWI_VARIANTS } from "../../data/kiwiVariants.js";
import { ACHIEVEMENTS } from "../../data/achievements.js";
import { LETTERS } from "../../data/letters.js";
import { getKiwiDisplayName } from "../kiwi/kiwi.naming.js";

export function renderHome() {
  const recentDiaries = getRecentDiaries(3);
  const recentMetaSessions = getRecentMetaSessions(2);
  const recentCalmLogs = getRecentCalmLogs(2);
  const recentAchievements = getRecentAchievements(3);
  const recentLetters = getRecentLetters(2);
  const reviewStats = getReviewStats();
  const kiwi = appState.kiwi;
  const selectedVariant = getSelectedKiwiVariant();
  const equippedTitle = getEquippedTitle();
  const selectedKiwiName = getKiwiDisplayName(selectedVariant, kiwi.name);
  const todayRecordCount = getTodayDiaryCount() + getTodayMetaSessionCount() + getTodayCalmLogCount();
  const unlockedCount = appState.kiwiDex?.unlockedVariantIds?.length ?? 1;
  const achievementCount = appState.achievements?.unlockedIds?.length ?? 0;
  const letterCount = appState.letters?.unlockedIds?.length ?? 0;

  return `
    <div class="page-grid">
      <section class="card">
        <h2 class="card-title">[${escapeHTML(equippedTitle.name)}] ${escapeHTML(selectedKiwiName)}의 둥지</h2>
        <p class="muted">공부를 설명으로 바꾸고, 메타인지·회복·복습·수집·업적 보상으로 공부 방식을 키워요.</p>

        <div class="kiwi-stage" aria-label="키위새">
          <div>
            <div class="kiwi-bird">${escapeHTML(selectedVariant.emoji)}<span class="kiwi-face">•ө•</span></div>
            <p class="kiwi-variant-name">[${escapeHTML(equippedTitle.name)}] ${escapeHTML(selectedKiwiName)}</p>
            <p class="kiwi-message">${escapeHTML(appState.lastMessage)}</p>
          </div>
        </div>
      </section>

      <aside class="card">
        <h3 class="card-title">오늘의 상태</h3>
        <div class="stat-grid">
          <div class="stat"><span>EXP</span><b>${kiwi.exp}</b></div>
          <div class="stat"><span>친밀도</span><b>${kiwi.affection}</b></div>
          <div class="stat"><span>칭호 티켓</span><b>${kiwi.titleTickets}</b></div>
          <div class="stat"><span>오늘 기록</span><b>${todayRecordCount}</b></div>
          <div class="stat"><span>오늘 복습</span><b>${reviewStats.due}</b></div>
          <div class="stat"><span>키위 도감</span><b>${unlockedCount}/${KIWI_VARIANTS.length}</b></div>
          <div class="stat"><span>업적</span><b>${achievementCount}/${ACHIEVEMENTS.length}</b></div>
          <div class="stat"><span>편지</span><b>${letterCount}/${LETTERS.length}</b></div>
        </div>

        <form id="kiwiNameForm" class="form-grid" style="margin-top: 18px;">
          <label class="field">
            <span class="label">키위 이름 설정</span>
            <input class="input" id="kiwiNameInput" maxlength="16" value="${escapeHTML(kiwi.name)}" />
          </label>
          <button class="button" type="submit">이름 저장</button>
        </form>
      </aside>
    </div>

    ${renderNewKiwiNotice()}
    ${renderRecentRewardNotice(recentAchievements, recentLetters)}

    <section class="card">
      <h3 class="card-title">복습 둥지 상태</h3>
      ${renderReviewSummary(reviewStats)}
    </section>

    <section class="card">
      <h3 class="card-title">최근 공부 일기</h3>
      ${renderRecentDiaryList(recentDiaries)}
    </section>

    <section class="card">
      <h3 class="card-title">최근 메타인지 기록</h3>
      ${renderRecentMetaList(recentMetaSessions)}
    </section>

    <section class="card">
      <h3 class="card-title">최근 마음 상태</h3>
      ${renderRecentCalmList(recentCalmLogs)}
    </section>
  `;
}

function renderNewKiwiNotice() {
  const newlyUnlocked = appState.kiwiDex?.newlyUnlockedIds ?? [];
  if (!newlyUnlocked.length) return "";

  const variant = KIWI_VARIANTS.find((item) => item.id === newlyUnlocked[0]);
  if (!variant) return "";

  return `
    <section class="card new-kiwi-notice">
      <h3 class="card-title">${escapeHTML(variant.emoji)} 새 키위 발견!</h3>
      <p><b>${escapeHTML(getKiwiDisplayName(variant, appState.kiwi.name))}</b>가 둥지에 찾아왔어요.</p>
      <p class="muted">키위 도감 탭에서 대표 키위로 설정할 수 있어요.</p>
    </section>
  `;
}

function renderRecentRewardNotice(achievements, letters) {
  if (!achievements.length && !letters.length) return "";

  return `
    <section class="card new-kiwi-notice">
      <h3 class="card-title">새 보상 기록</h3>
      ${achievements.length ? `<p><b>최근 업적:</b> ${achievements.map((item) => `${escapeHTML(item.emoji)} ${escapeHTML(item.name)}`).join(" · ")}</p>` : ""}
      ${letters.length ? `<p><b>최근 편지:</b> ${letters.map((item) => escapeHTML(item.title)).join(" · ")}</p>` : ""}
      <p class="muted">자세한 내용은 키위 도감 탭의 업적/편지 영역에서 볼 수 있어요.</p>
    </section>
  `;
}

function renderReviewSummary(stats) {
  if (!stats.total) {
    return `<div class="empty">아직 복습할 씨앗이 없어요. 공부 일기에 헷갈린 점을 남기면 자동으로 복습 둥지에 들어갑니다.</div>`;
  }

  return `
    <div class="recent-list">
      <article class="recent-item">
        <h4>오늘 꺼낼 복습 ${stats.due}개</h4>
        <p class="muted">예정 ${stats.upcoming}개 · 완료 ${stats.mastered}개 · 전체 ${stats.total}개</p>
      </article>
    </div>
  `;
}

function renderRecentDiaryList(diaries) {
  if (!diaries.length) {
    return `<div class="empty">아직 공부 일기가 없어요. 첫 설명을 ${escapeHTML(appState.kiwi.name)}에게 들려주세요.</div>`;
  }

  return `
    <div class="recent-list">
      ${diaries.map((diary) => `
        <article class="recent-item">
          <h4>${escapeHTML(diary.title)}</h4>
          <p class="muted">${escapeHTML(getSubjectName(diary.subject))} · ${escapeHTML(formatDateTime(diary.createdAt))}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderRecentMetaList(sessions) {
  if (!sessions.length) {
    return `<div class="empty">아직 메타인지 기록이 없어요. 타이머로 첫 공부 실험을 해 보세요.</div>`;
  }

  return `
    <div class="recent-list">
      ${sessions.map((session) => `
        <article class="recent-item">
          <h4>${escapeHTML(session.goal)}</h4>
          <p class="muted">${escapeHTML(formatDateTime(session.createdAt))} · 실제 ${Number(session.actualMinutes) || 0}분 · 집중 ${Number(session.actualFocus) || 0}/5</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderRecentCalmList(logs) {
  if (!logs.length) {
    return `<div class="empty">아직 마음 기록이 없어요. 공부하지 못한 날에도 둥지는 열려 있어요.</div>`;
  }

  return `
    <div class="recent-list">
      ${logs.map((log) => `
        <article class="recent-item">
          <h4>${escapeHTML(getSituationEmoji(log.situation))} ${escapeHTML(getSituationName(log.situation))}</h4>
          <p class="muted">${escapeHTML(getMoodEmoji(log.mood))} ${escapeHTML(getMoodName(log.mood))} · ${escapeHTML(formatDateTime(log.createdAt))}</p>
        </article>
      `).join("")}
    </div>
  `;
}
