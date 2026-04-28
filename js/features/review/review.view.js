import { appState, getReviewItems } from "../../state.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { formatDateTime, getTodayKey } from "../../utils/date.js";
import { getSubjectName } from "../../data/subjects.js";
import { getReviewStageLabel, splitReviewItems } from "./review.logic.js";

export function renderReview() {
  const { due, upcoming, mastered } = splitReviewItems(getReviewItems());

  return `
    <section class="card review-hero">
      <div>
        <p class="eyebrow">Review Nest</p>
        <h2 class="card-title">복습 둥지</h2>
        <p class="muted">헷갈린 점을 남긴 공부 일기는 자동으로 복습 둥지에 들어와요. ${escapeHTML(appState.kiwi.name)}와 함께 기억을 다시 꺼내 봐요.</p>
      </div>
      <div class="review-counts" aria-label="복습 현황">
        <div class="review-count"><span>오늘</span><b>${due.length}</b></div>
        <div class="review-count"><span>예정</span><b>${upcoming.length}</b></div>
        <div class="review-count"><span>완료</span><b>${mastered.length}</b></div>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">오늘 복습할 것</h3>
      ${renderDueList(due)}
    </section>

    <section class="card">
      <h3 class="card-title">다가오는 복습</h3>
      ${renderUpcomingList(upcoming)}
    </section>

    <section class="card">
      <h3 class="card-title">완료한 복습</h3>
      ${renderMasteredList(mastered)}
    </section>
  `;
}

function renderDueList(items) {
  if (!items.length) {
    return `<div class="empty">오늘 복습 둥지는 조용해요. 헷갈린 점을 적으면 여기에 자동으로 들어옵니다.</div>`;
  }

  return `<div class="review-list">${items.map(renderDueItem).join("")}</div>`;
}

function renderDueItem(item) {
  return `
    <article class="review-item is-due">
      <div class="review-item-head">
        <div>
          <p class="review-badge">${escapeHTML(getSubjectName(item.subject))} · ${escapeHTML(getReviewStageLabel(item))}</p>
          <h4>${escapeHTML(item.title)}</h4>
        </div>
        <span class="review-date">${escapeHTML(formatReviewDate(item.nextReviewAt))}</span>
      </div>

      <div class="review-prompt">
        <b>다시 붙잡을 포인트</b>
        <p>${escapeHTML(item.prompt)}</p>
      </div>

      <details class="review-details">
        <summary>처음 설명 보기</summary>
        <p>${escapeHTML(item.originalExplanation)}</p>
      </details>

      <div class="review-actions" data-review-id="${escapeHTML(item.id)}">
        <button class="button review-action" type="button" data-review-result="remembered">기억남</button>
        <button class="button secondary review-action" type="button" data-review-result="shaky">애매함</button>
        <button class="button ghost review-action" type="button" data-review-result="forgot">모름</button>
      </div>
    </article>
  `;
}

function renderUpcomingList(items) {
  if (!items.length) {
    return `<div class="empty">예정된 복습이 아직 없어요.</div>`;
  }

  return `<div class="review-list compact">${items.slice(0, 8).map((item) => `
    <article class="review-item">
      <div class="review-item-head">
        <div>
          <p class="review-badge">${escapeHTML(getSubjectName(item.subject))} · ${escapeHTML(getReviewStageLabel(item))}</p>
          <h4>${escapeHTML(item.title)}</h4>
        </div>
        <span class="review-date">${escapeHTML(formatReviewDate(item.nextReviewAt))}</span>
      </div>
      <p class="muted">${escapeHTML(item.prompt)}</p>
    </article>
  `).join("")}</div>`;
}

function renderMasteredList(items) {
  if (!items.length) {
    return `<div class="empty">아직 완전히 자리 잡은 복습은 없어요. 천천히 쌓으면 됩니다.</div>`;
  }

  return `<div class="review-list compact">${items.slice(0, 6).map((item) => `
    <article class="review-item mastered">
      <div class="review-item-head">
        <div>
          <p class="review-badge">${escapeHTML(getSubjectName(item.subject))} · 완료</p>
          <h4>${escapeHTML(item.title)}</h4>
        </div>
        <span class="review-date">${escapeHTML(formatDateTime(item.lastReviewedAt))}</span>
      </div>
    </article>
  `).join("")}</div>`;
}

function formatReviewDate(dateLike) {
  const key = getTodayKey(dateLike);
  const today = getTodayKey();
  if (key === today) return "오늘";
  return formatDateTime(dateLike);
}
