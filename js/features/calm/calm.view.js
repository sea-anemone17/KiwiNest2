import { getRecentCalmLogs } from "../../state.js";
import { MOODS, getMoodEmoji, getMoodName } from "../../data/moods.js";
import { SITUATIONS, getSituationEmoji, getSituationName } from "../../data/situations.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { formatDateTime } from "../../utils/date.js";

export function renderCalm() {
  const recentLogs = getRecentCalmLogs(8);

  return `
    <div class="calm-layout">
      <section class="card">
        <h2 class="card-title">마음 안정소</h2>
        <p class="muted">공부가 잘된 날뿐 아니라, 돌아오기 어려운 날도 둥지에 남겨요. 키위가 해결보다 회복을 먼저 도와줄 거예요.</p>

        <form id="calmForm" class="form-grid">
          <div class="calm-mini-grid">
            <label class="field">
              <span class="label">오늘 상황</span>
              <select class="select" id="calmSituation">
                ${SITUATIONS.map((situation) => `<option value="${escapeHTML(situation.id)}">${escapeHTML(`${situation.emoji} ${situation.name}`)}</option>`).join("")}
              </select>
            </label>

            <label class="field">
              <span class="label">지금 기분</span>
              <select class="select" id="calmMood">
                ${MOODS.map((mood) => `<option value="${escapeHTML(mood.id)}">${escapeHTML(`${mood.emoji} ${mood.name}`)}</option>`).join("")}
              </select>
            </label>
          </div>

          <label class="field">
            <span class="label">짧은 감정 기록</span>
            <textarea class="textarea" id="calmNote" rows="5" placeholder="예: 시험 끝나서 멍한데, 이상하게 쉬는 것도 어색하다."></textarea>
          </label>

          <button class="button" type="submit">키위에게 마음 맡기기</button>
        </form>
      </section>

      <aside class="card calm-guide-card">
        <h3 class="card-title">키위의 안정 규칙</h3>
        <ul class="calm-rule-list">
          <li>해결책보다 안정이 먼저예요.</li>
          <li>공부 못한 날도 기록할 수 있어요.</li>
          <li>감정 기록은 실패가 아니라 복귀 장치예요.</li>
        </ul>
      </aside>
    </div>

    <section class="card">
      <h3 class="card-title">최근 마음 기록</h3>
      ${renderCalmLogList(recentLogs)}
    </section>
  `;
}

function renderCalmLogList(logs) {
  if (!logs.length) {
    return `<div class="empty">아직 마음 기록이 없어요. 공부하지 못한 날에도 이곳은 열려 있어요.</div>`;
  }

  return `
    <div class="calm-list">
      ${logs.map(renderCalmLogItem).join("")}
    </div>
  `;
}

function renderCalmLogItem(log) {
  const reward = log.reward ?? { exp: 0, affection: 0 };

  return `
    <article class="calm-item">
      <div class="calm-item-head">
        <h3>${escapeHTML(getSituationEmoji(log.situation))} ${escapeHTML(getSituationName(log.situation))}</h3>
        <span class="calm-mood-pill">${escapeHTML(getMoodEmoji(log.mood))} ${escapeHTML(getMoodName(log.mood))}</span>
      </div>
      <p class="muted">${escapeHTML(formatDateTime(log.createdAt))}</p>
      ${log.note ? `<p>${escapeHTML(log.note)}</p>` : ""}
      <div class="calm-message-box">${escapeHTML(log.message)}</div>
      <div class="reward-line">EXP +${reward.exp} · 친밀도 +${reward.affection}</div>
    </article>
  `;
}
