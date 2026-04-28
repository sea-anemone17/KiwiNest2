import { appState } from "../../state.js";
import { getAllSubjects, getSubjectName } from "../../data/subjects.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { formatDateTime } from "../../utils/date.js";

export function renderDiary() {
  return `
    <section class="card">
      <h2 class="card-title">공부 일기장</h2>
      <p class="muted">공부한 내용을 기록하고, ${escapeHTML(appState.kiwi.name)}에게 길게 설명해 보세요.</p>

      <form id="diaryForm" class="form-grid">
        <label class="field">
          <span class="label">과목</span>
          <select class="select" id="diarySubject">
            ${getAllSubjects(appState.customSubjects)
             .map((subject) => `<option value="${escapeHTML(subject.id)}">${escapeHTML(subject.name)}</option>`)
             .join("")}
          </select>
        </label>

        <label class="field">
          <span class="label">공부 제목</span>
          <input class="input" id="diaryTitle" placeholder="예: 관계대명사 whose 정리" />
        </label>

        <label class="field">
          <span class="label">공부 내용</span>
          <textarea class="textarea" id="diaryContent" rows="4" placeholder="오늘 실제로 한 공부를 적어 주세요."></textarea>
        </label>

        <label class="field">
          <span class="label">${escapeHTML(appState.kiwi.name)}에게 설명하기</span>
          <textarea class="textarea" id="diaryExplanation" rows="8" placeholder="키위에게 가르치듯 길게 설명해 보세요. 20자 이상부터 저장됩니다. 350자 이상이면 칭호 티켓을 얻어요."></textarea>
        </label>

        <label class="field">
          <span class="label">헷갈린 점</span>
          <textarea class="textarea" id="diaryConfused" rows="3" placeholder="아직 애매한 점이나 다시 볼 포인트를 적어 주세요."></textarea>
        </label>

        <label class="field">
          <span class="label">이해도</span>
          <select class="select" id="diaryUnderstanding">
            <option value="1">1 · 아직 애매함</option>
            <option value="2">2 · 대충 이해</option>
            <option value="3" selected>3 · 설명 가능</option>
            <option value="4">4 · 가르칠 수 있음</option>
          </select>
        </label>

        <button class="button" type="submit">공부 일기 저장하기</button>
      </form>
    </section>

    <section class="card">
      <h3 class="card-title">저장된 일기</h3>
      ${renderDiaryList(appState.diaries)}
    </section>
  `;
}

function renderDiaryList(diaries) {
  if (!diaries.length) {
    return `<div class="empty">아직 저장된 일기가 없어요. 첫 기록을 남기면 여기에 쌓입니다.</div>`;
  }

  return `<div class="diary-list">${diaries.map(renderDiaryItem).join("")}</div>`;
}

function renderDiaryItem(diary) {
  const reward = diary.reward ?? { exp: 0, affection: 0, titleTickets: 0 };

  return `
    <article class="diary-item">
      <h3>${escapeHTML(diary.title)}</h3>
      <div class="diary-meta">
        <span>${escapeHTML(getSubjectName(diary.subject))}</span>
        <span>이해도 ${escapeHTML(diary.understanding)}</span>
        <span>${escapeHTML(formatDateTime(diary.createdAt))}</span>
      </div>

      <div class="diary-section">
        <b>공부 내용</b>
        <p>${escapeHTML(diary.content)}</p>
      </div>

      <div class="diary-section">
        <b>키위에게 설명</b>
        <p>${escapeHTML(diary.explanation)}</p>
      </div>

      ${diary.confusedPoint ? `
        <div class="diary-section">
          <b>헷갈린 점</b>
          <p>${escapeHTML(diary.confusedPoint)}</p>
        </div>
      ` : ""}

      <div class="reward-line">EXP +${reward.exp} · 친밀도 +${reward.affection}${reward.titleTickets ? ` · 칭호 티켓 +${reward.titleTickets}` : ""}</div>
    </article>
  `;
}
