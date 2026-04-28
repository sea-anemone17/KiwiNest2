import { appState } from "../../state.js";
import { escapeHTML } from "../../utils/sanitize.js";

export function renderSettings() {
  const email = window.kiwiCurrentUser?.email ?? "로그아웃 상태";
  const isLoggedIn = Boolean(window.kiwiCurrentUser);

  return `
    <section class="settings-page stack">
      <div class="card hero-card">
        <p class="eyebrow">Beta v1</p>
        <h2>⚙️ 설정 / 클라우드 둥지</h2>
        <p class="muted">Supabase 계정으로 로그인하면 현재 둥지 데이터를 클라우드에 저장하거나 다시 불러올 수 있어요.</p>
      </div>

      <div class="card stack">
        <div class="section-heading">
          <div>
            <p class="eyebrow">AUTH</p>
            <h3>로그인 상태</h3>
          </div>
          <span class="pill ${isLoggedIn ? "good" : ""}">${escapeHTML(email)}</span>
        </div>

        <div class="form-grid two-columns">
          <label class="field-label">
            이메일
            <input id="authEmail" class="input" type="email" autocomplete="email" placeholder="you@example.com" />
          </label>
          <label class="field-label">
            비밀번호
            <input id="authPassword" class="input" type="password" autocomplete="current-password" placeholder="6자 이상" />
          </label>
        </div>

        <div class="button-row">
          <button id="signUpButton" class="button secondary" type="button">회원가입</button>
          <button id="signInButton" class="button primary" type="button">로그인</button>
          <button id="signOutButton" class="button ghost" type="button">로그아웃</button>
        </div>
      </div>

      <div class="card stack">
        <div class="section-heading">
          <div>
            <p class="eyebrow">SYNC</p>
            <h3>로컬 ↔ 클라우드 동기화</h3>
          </div>
        </div>

        <div class="notice-box">
          <strong>처음엔 수동 동기화가 안전해요.</strong>
          <p>업로드는 현재 브라우저의 둥지를 Supabase에 저장하고, 불러오기는 Supabase 데이터를 현재 브라우저에 덮어씁니다.</p>
        </div>

        <div class="stats-grid small-stats">
          <div class="stat-card"><span>공부 일기</span><strong>${appState.diaries.length}</strong></div>
          <div class="stat-card"><span>메타인지</span><strong>${appState.metaSessions.length}</strong></div>
          <div class="stat-card"><span>마음 기록</span><strong>${appState.calmLogs.length}</strong></div>
          <div class="stat-card"><span>복습 항목</span><strong>${appState.reviewQueue.length}</strong></div>
        </div>

        <div class="button-row">
          <button id="uploadCloudButton" class="button primary" type="button">현재 둥지 업로드</button>
          <button id="downloadCloudButton" class="button secondary" type="button">클라우드에서 불러오기</button>
        </div>

        <p class="muted small-text">이미지 첨부와 Supabase Storage는 Beta v2에서 붙이는 게 안전해요.</p>
      </div>
    </section>
  `;
}
