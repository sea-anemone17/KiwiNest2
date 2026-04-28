import {
  appState,
  getUnlockedAchievements,
  getUnlockedLetters,
} from "../../state.js";
import { KIWI_VARIANTS } from "../../data/kiwiVariants.js";
import { KIWI_TITLES, getTitleById, getTitleRarityLabel } from "../../data/titles.js";
import { ACHIEVEMENTS } from "../../data/achievements.js";
import { LETTERS } from "../../data/letters.js";
import { escapeHTML } from "../../utils/sanitize.js";
import { getKiwiDisplayName, getKiwiRarityLabel } from "./kiwi.naming.js";

export function renderKiwiDex() {
  const unlockedIds = new Set(appState.kiwiDex?.unlockedVariantIds ?? ["basic"]);
  const selectedId = appState.kiwiDex?.selectedVariantId ?? "basic";
  const unlockedCount = unlockedIds.size;
  const totalCount = KIWI_VARIANTS.length;

  return `
    <section class="card kiwi-dex-hero">
      <div>
        <p class="eyebrow">Kiwi Dex</p>
        <h2 class="card-title">키위 도감</h2>
        <p class="muted">공부, 설명, 복습, 마음 기록을 쌓으면 ${escapeHTML(appState.kiwi.name)}의 다양한 모습이 해금돼요.</p>
      </div>
      <div class="dex-progress" aria-label="키위 도감 수집 현황">
        <b>${unlockedCount}/${totalCount}</b>
        <p>수집 완료</p>
      </div>
    </section>

    ${renderNewKiwiNotice()}
    ${renderTitlePanel()}
    ${renderAchievementPanel()}
    ${renderLetterPanel()}

    <section class="kiwi-dex-grid" aria-label="키위 바리에이션 목록">
      ${KIWI_VARIANTS.map((variant) => renderKiwiCard(variant, unlockedIds, selectedId)).join("")}
    </section>
  `;
}

function renderNewKiwiNotice() {
  const newlyUnlocked = appState.kiwiDex?.newlyUnlockedIds ?? [];
  if (!newlyUnlocked.length) return "";

  const variants = newlyUnlocked
    .map((id) => KIWI_VARIANTS.find((variant) => variant.id === id))
    .filter(Boolean);

  if (!variants.length) return "";

  return `
    <section class="card unlock-card">
      <h3 class="card-title">새 키위 발견!</h3>
      <div class="unlock-row">
        ${variants.map((variant) => `
          <span class="unlock-pill">${escapeHTML(variant.emoji)} ${escapeHTML(getKiwiDisplayName(variant, appState.kiwi.name))}</span>
        `).join("")}
      </div>
      <p class="muted">해금된 키위는 대표 키위로 설정할 수 있어요.</p>
    </section>
  `;
}

function renderKiwiCard(variant, unlockedIds, selectedId) {
  const isUnlocked = unlockedIds.has(variant.id);
  const isSelected = selectedId === variant.id;
  const displayName = isUnlocked ? getKiwiDisplayName(variant, appState.kiwi.name) : variant.name;

  return `
    <article class="kiwi-card ${isUnlocked ? "" : "is-locked"} ${isSelected ? "is-selected" : ""}">
      <div class="kiwi-card-top">
        <div class="kiwi-card-emoji">${escapeHTML(isUnlocked ? variant.emoji : "❔")}</div>
        <div>
          <h3>${escapeHTML(displayName)}</h3>
          <p class="rarity">${escapeHTML(getKiwiRarityLabel(variant.rarity))}</p>
        </div>
      </div>
      <p class="kiwi-card-desc">${escapeHTML(isUnlocked ? variant.description : "아직 둥지에 찾아오지 않았어요.")}</p>
      <p class="kiwi-condition">조건: ${escapeHTML(variant.conditionText)}</p>
      <div class="kiwi-card-actions">
        ${renderKiwiAction(variant, isUnlocked, isSelected)}
      </div>
    </article>
  `;
}

function renderKiwiAction(variant, isUnlocked, isSelected) {
  if (!isUnlocked) return `<span class="badge muted-badge">잠김</span>`;
  if (isSelected) return `<span class="badge selected-badge">대표 키위</span>`;
  return `<button class="button button-small" type="button" data-select-kiwi="${escapeHTML(variant.id)}">대표로 설정</button>`;
}

function renderTitlePanel() {
  const ownedTitleIds = appState.titles?.ownedTitleIds ?? ["nest_beginner"];
  const ownedSet = new Set(ownedTitleIds);
  const equippedId = appState.titles?.equippedTitleId ?? "nest_beginner";
  const equippedTitle = getTitleById(equippedId);

  return `
    <section class="card reward-panel">
      <div class="reward-panel-head">
        <div>
          <p class="eyebrow">Titles</p>
          <h3 class="card-title">칭호</h3>
          <p class="muted">칭호 티켓으로 키위에게 붙일 칭호를 뽑고 장착할 수 있어요.</p>
        </div>
        <div class="ticket-box">
          <span>칭호 티켓</span>
          <b>${Number(appState.kiwi.titleTickets) || 0}</b>
        </div>
      </div>

      <div class="equipped-title-card">
        <span class="badge selected-badge">현재 장착</span>
        <strong>[${escapeHTML(equippedTitle.name)}]</strong>
        <span>${escapeHTML(appState.kiwi.name)}</span>
      </div>

      <button class="button" type="button" data-title-gacha>칭호 뽑기</button>

      <div class="title-grid">
        ${KIWI_TITLES.map((title) => renderTitleCard(title, ownedSet, equippedId)).join("")}
      </div>
    </section>
  `;
}

function renderTitleCard(title, ownedSet, equippedId) {
  const isOwned = ownedSet.has(title.id);
  const isEquipped = equippedId === title.id;

  return `
    <article class="title-card ${isOwned ? "" : "is-locked"} ${isEquipped ? "is-equipped" : ""}">
      <div>
        <h4>[${escapeHTML(isOwned ? title.name : "????")}]</h4>
        <p class="rarity">${escapeHTML(getTitleRarityLabel(title.rarity))}</p>
      </div>
      <p>${escapeHTML(isOwned ? title.description : "아직 얻지 못한 칭호예요.")}</p>
      ${renderTitleAction(title, isOwned, isEquipped)}
    </article>
  `;
}

function renderTitleAction(title, isOwned, isEquipped) {
  if (!isOwned) return `<span class="badge muted-badge">미보유</span>`;
  if (isEquipped) return `<span class="badge selected-badge">장착 중</span>`;
  return `<button class="button button-small" type="button" data-equip-title="${escapeHTML(title.id)}">장착</button>`;
}

function renderAchievementPanel() {
  const unlocked = new Set(appState.achievements?.unlockedIds ?? []);
  const unlockedCount = unlocked.size;
  const recent = getUnlockedAchievements().slice(0, 4);

  return `
    <section class="card reward-panel">
      <div class="reward-panel-head">
        <div>
          <p class="eyebrow">Achievements</p>
          <h3 class="card-title">업적</h3>
          <p class="muted">공부·메타인지·회복·복습 행동이 업적으로 남아요.</p>
        </div>
        <div class="ticket-box">
          <span>업적</span>
          <b>${unlockedCount}/${ACHIEVEMENTS.length}</b>
        </div>
      </div>
      <div class="achievement-grid">
        ${ACHIEVEMENTS.map((achievement) => renderAchievementCard(achievement, unlocked.has(achievement.id))).join("")}
      </div>
      ${recent.length ? `<p class="muted mini-note">최근 달성: ${recent.map((item) => escapeHTML(item.name)).join(" · ")}</p>` : ""}
    </section>
  `;
}

function renderAchievementCard(achievement, isUnlocked) {
  return `
    <article class="achievement-card ${isUnlocked ? "" : "is-locked"}">
      <div class="achievement-icon">${escapeHTML(isUnlocked ? achievement.emoji : "🔒")}</div>
      <div>
        <h4>${escapeHTML(isUnlocked ? achievement.name : "잠긴 업적")}</h4>
        <p>${escapeHTML(isUnlocked ? achievement.description : achievement.conditionText)}</p>
      </div>
    </article>
  `;
}

function renderLetterPanel() {
  const unlockedIds = new Set(appState.letters?.unlockedIds ?? []);
  const unlockedLetters = getUnlockedLetters();

  return `
    <section class="card reward-panel">
      <div class="reward-panel-head">
        <div>
          <p class="eyebrow">Letters</p>
          <h3 class="card-title">키위의 편지</h3>
          <p class="muted">편지는 랜덤이 아니라 업적을 달성했을 때 해금돼요.</p>
        </div>
        <div class="ticket-box">
          <span>편지</span>
          <b>${unlockedIds.size}/${LETTERS.length}</b>
        </div>
      </div>
      <div class="letter-list">
        ${LETTERS.map((letter) => renderLetterCard(letter, unlockedIds.has(letter.id))).join("")}
      </div>
      ${unlockedLetters.length ? `<p class="muted mini-note">가장 최근 편지: ${escapeHTML(unlockedLetters[0].title)}</p>` : ""}
    </section>
  `;
}

function renderLetterCard(letter, isUnlocked) {
  return `
    <article class="letter-card ${isUnlocked ? "" : "is-locked"}">
      <h4>${escapeHTML(isUnlocked ? letter.title : "잠긴 편지")}</h4>
      <p>${escapeHTML(isUnlocked ? letter.body : "관련 업적을 달성하면 키위가 편지를 가져와요.")}</p>
    </article>
  `;
}
