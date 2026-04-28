import { appState } from "../../state.js";
import { SUBJECTS, getSubjectName } from "../../data/subjects.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { formatDateTime } from "../../utils/date.js";

export function renderDiary() {
  return `
    <div class="page-header">
      <div>
        <h2 id="diary-title">공부 일기장</h2>
        <p>공부한 내용을 기록하고, ${escapeHTML(appState.kiwi.name)}에게 길게 설명해 보세요.</p>
      </div>
    </div>

    <div class="grid-2">
      <section class="card">
        <h3 class="card-title">오늘의 설명 남기기</h3>
        <form class="form-grid" id="diaryForm">
          <div class="field">
            <label for="subjectSelect">과목</label>
            <select class="select" id="subjectSelect" name="subject">
              ${SUBJECTS.map((subject) => `<option value="${escapeHTML(subject.id)}">${escapeHTML(subject.name)}</option>`).join("")}
            </select>
          </div>

          <div class="field">
            <label for="diaryTitleInput">공부 제목</label>
            <input class="input" id="diaryTitleInput" name="title" type="text" placeholder="예: 관계대명사 whose 정리" maxlength="80" />
          </div>

          <div class="field">
            <label for="diaryContentInput">공부 내용</label>
            <textarea class="textarea" id="diaryContentInput" name="content" placeholder="오늘 실제로 한 공부를 적어 주세요."></textarea>
          </div>

          <div class="field">
            <label for="explanationInput">${escapeHTML(appState.kiwi.name)}에게 설명하기</label>
            <textarea class="textarea long" id="explanationInput" name="explanation" placeholder="키위가 이해할 수 있게 길게 설명해 주세요. 예시, 조건, 함정까지 적으면 보상이 커져요."></textarea>
            <small>20자 이상부터 저장됩니다. 350자 이상이면 칭호 티켓을 얻어요.</small>
          </div>

          <div class="field">
            <label for="confusedInput">헷갈린 점</label>
            <textarea class="textarea" id="confusedInput" name="confusedPoint" placeholder="아직 애매한 부분이 있으면 적어 주세요. 없어도 괜찮아요."></textarea>
          </div>

          <div class="field">
            <label for="understandingSelect">이해도</label>
            <select class="select" id="understandingSelect" name="understanding">
              <option value="1">1 · 아직 애매함</option>
              <option value="2">2 · 대충 이해</option>
              <option value="3" selected>3 · 설명 가능</option>
              <option value="4">4 · 가르칠 수 있음</option>
            </select>
          </div>

          <button class="btn" type="submit">공부 일기 저장하기</button>
        </form>
      </section>

      <section class="card">
        <h3 class="card-title">저장된 일기</h3>
        ${renderDiaryList(appState.diaries)}
      </section>
    </div>
  `;
}

function renderDiaryList(diaries) {
  if (!diaries.length) {
    return `<p class="empty-state">아직 저장된 일기가 없어요. 첫 기록을 남기면 여기에 쌓입니다.</p>`;
  }

  return `
    <div class="diary-list">
      ${diaries.map(renderDiaryItem).join("")}
    </div>
  `;
}

function renderDiaryItem(diary) {
  const reward = diary.reward ?? { exp: 0, affection: 0, titleTickets: 0 };

  return `
    <article class="diary-item">
      <div class="diary-item-header">
        <div>
          <h3>${escapeHTML(diary.title)}</h3>
          <div class="badge-row">
            <span class="badge">${escapeHTML(getSubjectName(diary.subject))}</span>
            <span class="badge">이해도 ${escapeHTML(diary.understanding)}</span>
          </div>
        </div>
        <span class="diary-date">${escapeHTML(formatDateTime(diary.createdAt))}</span>
      </div>

      <div class="diary-block">
        <strong>공부 내용</strong>
        <p>${escapeHTML(diary.content)}</p>
      </div>

      <div class="diary-block">
        <strong>키위에게 설명</strong>
        <p>${escapeHTML(diary.explanation)}</p>
      </div>

      ${
        diary.confusedPoint
          ? `<div class="diary-block"><strong>헷갈린 점</strong><p>${escapeHTML(diary.confusedPoint)}</p></div>`
          : ""
      }

      <p class="reward-preview">EXP +${reward.exp} · 친밀도 +${reward.affection}${reward.titleTickets ? ` · 칭호 티켓 +${reward.titleTickets}` : ""}</p>
    </article>
  `;
}
