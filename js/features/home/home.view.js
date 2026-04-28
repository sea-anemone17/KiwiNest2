import { appState, getRecentDiaries, getTodayDiaryCount } from "../../state.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { formatDateTime } from "../../utils/date.js";
import { getSubjectName } from "../../data/subjects.js";

export function renderHome() {
  const recentDiaries = getRecentDiaries(3);
  const kiwi = appState.kiwi;

  return `
    <div class="page-grid">
      <section class="card">
        <h2 class="card-title">${escapeHTML(kiwi.name)}의 둥지</h2>
        <p class="muted">공부를 설명으로 바꾸면, ${escapeHTML(kiwi.name)}가 조금씩 강해져요.</p>

        <div class="kiwi-stage" aria-label="키위새">
          <div>
            <div class="kiwi-bird">•ө•</div>
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
          <div class="stat"><span>오늘 일기</span><b>${getTodayDiaryCount()}</b></div>
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

    <section class="card">
      <h3 class="card-title">최근 공부 일기</h3>
      ${renderRecentList(recentDiaries)}
    </section>
  `;
}

function renderRecentList(diaries) {
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
