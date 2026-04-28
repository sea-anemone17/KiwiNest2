import { appState, getRecentMetaSessions } from "../../state.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { formatDateTime } from "../../utils/date.js";
import { formatTimerSeconds, getTimerSeconds } from "./meta.timer.js";

export function renderMeta() {
  const recentSessions = getRecentMetaSessions(6);
  const kiwiName = appState.kiwi.name;

  return `
    <div class="meta-layout">
      <section class="card">
        <h2 class="card-title">메타인지 실험실</h2>
        <p class="muted">공부를 시작하기 전 예상하고, 끝난 뒤 실제 결과를 비교해요. ${escapeHTML(kiwiName)}가 공부 감각을 같이 기록해 줄 거예요.</p>

        <form id="metaForm" class="form-grid">
          <label class="field">
            <span class="label">오늘의 목표</span>
            <input class="input" id="metaGoal" maxlength="80" placeholder="예: 영어 어법 20문장 분석" />
          </label>

          <label class="field">
            <span class="label">공부 타입</span>
            <select class="select" id="metaStudyType">
              <option value="concept">개념 이해</option>
              <option value="memorize">암기</option>
              <option value="problem">문제풀이</option>
              <option value="wrong">오답 분석</option>
              <option value="review">복습</option>
              <option value="exam">시험 대비</option>
            </select>
          </label>

          <div class="meta-mini-grid">
            <label class="field">
              <span class="label">목표 시간(분)</span>
              <input class="input" id="metaGoalMinutes" type="number" min="1" max="360" value="25" />
            </label>

            <label class="field">
              <span class="label">실제 시간(분)</span>
              <input class="input" id="metaActualMinutes" type="number" min="0" max="480" placeholder="타이머 사용 시 자동" />
            </label>
          </div>

          <div class="meta-mini-grid">
            ${renderRangeField("metaExpectedDifficulty", "예상 난이도", 3)}
            ${renderRangeField("metaExpectedFocus", "예상 집중도", 3)}
            ${renderRangeField("metaActualDifficulty", "실제 난이도", 3)}
            ${renderRangeField("metaActualFocus", "실제 집중도", 3)}
          </div>

          <label class="field">
            <span class="label">목표 달성 여부</span>
            <select class="select" id="metaCompletedGoal">
              <option value="true">달성했어요</option>
              <option value="false">아직 덜 했어요</option>
            </select>
          </label>

          <label class="field">
            <span class="label">막힌 이유</span>
            <select class="select" id="metaBlockReason">
              <option value="">없음 / 잘 진행됨</option>
              <option value="sleepy">졸림</option>
              <option value="too_big">목표가 너무 컸음</option>
              <option value="hard_concept">개념이 어려웠음</option>
              <option value="late_start">시작이 늦었음</option>
              <option value="environment">환경 문제</option>
              <option value="distraction">딴짓/산만함</option>
              <option value="emotion">감정 문제</option>
            </select>
          </label>

          <label class="field">
            <span class="label">관찰 메모</span>
            <textarea class="textarea" id="metaReflection" rows="4" placeholder="예: 생각보다 시작은 힘들었는데, 타이머 켜고 나니 문장 구조가 보였다."></textarea>
          </label>

          <button class="button" type="submit">메타인지 기록 저장</button>
        </form>
      </section>

      <aside class="card">
        <h3 class="card-title">공부 타이머</h3>
        <div class="timer-card">
          <div id="metaTimerDisplay" class="timer-display">${escapeHTML(formatTimerSeconds(getTimerSeconds()))}</div>
          <p class="timer-caption">타이머로 잰 시간은 저장할 때 실제 시간에 반영할 수 있어요.</p>
          <div class="button-row">
            <button class="button" id="metaTimerStart" type="button">시작</button>
            <button class="button secondary" id="metaTimerPause" type="button">일시정지</button>
            <button class="button secondary" id="metaTimerReset" type="button">초기화</button>
          </div>
        </div>
      </aside>
    </div>

    <section class="card">
      <h3 class="card-title">최근 메타인지 기록</h3>
      ${renderMetaList(recentSessions)}
    </section>
  `;
}

function renderRangeField(id, label, value) {
  return `
    <label class="field">
      <span class="label">${escapeHTML(label)}</span>
      <span class="range-row">
        <input id="${id}" class="input" type="range" min="1" max="5" value="${value}" />
        <b class="range-value" data-range-output="${id}">${value}</b>
      </span>
    </label>
  `;
}

function renderMetaList(sessions) {
  if (!sessions.length) {
    return `<div class="empty">아직 메타인지 기록이 없어요. 첫 실험을 시작해 볼까요?</div>`;
  }

  return `
    <div class="meta-list">
      ${sessions.map(renderMetaItem).join("")}
    </div>
  `;
}

function renderMetaItem(session) {
  const reward = session.reward ?? { exp: 0, affection: 0, titleTickets: 0 };
  const analysis = session.analysis ?? {};
  const completed = session.completedGoal ? "목표 달성" : "부분 완료";

  return `
    <article class="meta-item">
      <h3>${escapeHTML(session.goal)}</h3>
      <p class="muted">${escapeHTML(formatDateTime(session.createdAt))} · ${escapeHTML(completed)}</p>
      <div class="meta-tags">
        <span class="meta-tag">${escapeHTML(getStudyTypeLabel(session.studyType))}</span>
        <span class="meta-tag">목표 ${Number(session.goalMinutes) || 0}분</span>
        <span class="meta-tag">실제 ${Number(session.actualMinutes) || 0}분</span>
        <span class="meta-tag">집중 ${Number(session.actualFocus) || 0}/5</span>
        <span class="meta-tag">난이도 ${Number(session.actualDifficulty) || 0}/5</span>
      </div>
      <div class="meta-result">
        <b>키위의 관찰</b>
        <p>${escapeHTML(analysis.focusLabel ?? "집중도 기록을 저장했어요.")} · ${escapeHTML(analysis.difficultyLabel ?? "난이도 기록을 저장했어요.")}</p>
      </div>
      <div class="meta-result">
        <b>다음 전략</b>
        <p>${escapeHTML(session.nextStrategy ?? "다음 공부에서 다시 관찰해 볼 전략을 아직 만들지 않았어요.")}</p>
      </div>
      ${session.reflection ? `<p>${escapeHTML(session.reflection)}</p>` : ""}
      <div class="reward-line">EXP +${reward.exp} · 친밀도 +${reward.affection}${reward.titleTickets ? ` · 칭호 티켓 +${reward.titleTickets}` : ""}</div>
    </article>
  `;
}

function getStudyTypeLabel(type) {
  const labels = {
    concept: "개념 이해",
    memorize: "암기",
    problem: "문제풀이",
    wrong: "오답 분석",
    review: "복습",
    exam: "시험 대비",
  };

  return labels[type] ?? "공부 기록";
}
