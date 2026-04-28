import { appState, getRecentDiaries, getTodayDiaryCount } from "../../state.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { formatDateTime } from "../../utils/date.js";
import { getSubjectName } from "../../data/subjects.js";

export function renderHome() {
  const recentDiaries = getRecentDiaries(3);
  const kiwi = appState.kiwi;

  return `
    <div class="page-header">
      <div>
        <h2 id="home-title">${escapeHTML(kiwi.name)}의 둥지</h2>
        <p>공부를 설명으로 바꾸면, ${escapeHTML(kiwi.name)}가 조금씩 강해져요.</p>
      </div>
      <button class="btn secondary" id="goDiaryButton" type="button">오늘 공부 기록하기</button>
    </div>

    <div class="nest-hero">
      <article class="card">
        <div class="kiwi-stage">
          <div>
            <div class="kiwi-emoji" aria-hidden="true">•ө•</div>
            <p class="kiwi-dialogue">${escapeHTML(appState.lastMessage)}</p>
          </div>
        </div>
      </article>

      <aside class="card">
        <h3 class="card-title">오늘의 상태</h3>
        <div class="stat-list">
          <div class="stat-item"><span>EXP</span><strong>${kiwi.exp}</strong></div>
          <div class="stat-item"><span>친밀도</span><strong>${kiwi.affection}</strong></div>
          <div class="stat-item"><span>칭호 티켓</span><strong>${kiwi.titleTickets}</strong></div>
          <div class="stat-item"><span>오늘 일기</span><strong>${getTodayDiaryCount()}</strong></div>
        </div>
      </aside>
    </div>

    <section class="card">
      <h3 class="card-title">키위 이름 설정</h3>
      <div class="name-row">
        <input class="input" id="kiwiNameInput" type="text" maxlength="16" value="${escapeHTML(kiwi.name)}" aria-label="키위 이름" />
        <button class="btn" id="saveKiwiNameButton" type="button">이름 저장</button>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">최근 공부 일기</h3>
      ${renderRecentList(recentDiaries)}
    </section>
  `;
}

function renderRecentList(diaries) {
  if (!diaries.length) {
    return `<p class="empty-state">아직 공부 일기가 없어요. 첫 설명을 ${escapeHTML(appState.kiwi.name)}에게 들려주세요.</p>`;
  }

  return `
    <div class="recent-list">
      ${diaries
        .map(
          (diary) => `
            <article class="recent-item">
              <h4>${escapeHTML(diary.title)}</h4>
              <p>${escapeHTML(getSubjectName(diary.subject))} · ${escapeHTML(formatDateTime(diary.createdAt))}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}
