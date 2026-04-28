import { appState } from "../../state.js";
import { KIWI_VARIANTS } from "../../data/kiwiVariants.js";
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
        <b>${unlockedCount}</b><span>/ ${totalCount}</span>
        <p>수집 완료</p>
      </div>
    </section>

    ${renderNewUnlocks()}

    <section class="kiwi-dex-grid">
      ${KIWI_VARIANTS.map((variant) => renderKiwiCard({ variant, unlockedIds, selectedId })).join("")}
    </section>
  `;
}

function renderNewUnlocks() {
  const newlyUnlocked = appState.kiwiDex?.newlyUnlockedIds ?? [];
  if (!newlyUnlocked.length) return "";

  const cards = newlyUnlocked
    .map((id) => KIWI_VARIANTS.find((variant) => variant.id === id))
    .filter(Boolean)
    .map((variant) => `
      <span class="unlock-pill">${escapeHTML(variant.emoji)} ${escapeHTML(getKiwiDisplayName(variant, appState.kiwi.name))}</span>
    `)
    .join("");

  return `
    <section class="card unlock-card">
      <h3 class="card-title">새 키위가 둥지에 찾아왔어요!</h3>
      <div class="unlock-row">${cards}</div>
      <p class="muted">새로 해금된 모습은 대표 키위로 설정할 수 있어요.</p>
    </section>
  `;
}

function renderKiwiCard({ variant, unlockedIds, selectedId }) {
  const isUnlocked = unlockedIds.has(variant.id);
  const isSelected = selectedId === variant.id;
  const displayName = getKiwiDisplayName(variant, appState.kiwi.name);

  return `
    <article class="kiwi-card ${isUnlocked ? "is-unlocked" : "is-locked"} ${isSelected ? "is-selected" : ""}">
      <div class="kiwi-card-top">
        <div class="kiwi-card-emoji" aria-hidden="true">${isUnlocked ? escapeHTML(variant.emoji) : "🔒"}</div>
        <div>
          <h3>${escapeHTML(isUnlocked ? displayName : variant.name)}</h3>
          <p class="rarity">${escapeHTML(getKiwiRarityLabel(variant.rarity))}</p>
        </div>
      </div>

      <p class="kiwi-card-desc">${escapeHTML(isUnlocked ? variant.description : "아직 둥지에 오지 않았어요.")}</p>
      <p class="kiwi-condition"><b>조건</b> ${escapeHTML(variant.conditionText)}</p>

      <div class="kiwi-card-actions">
        ${renderCardAction({ variant, isUnlocked, isSelected })}
      </div>
    </article>
  `;
}

function renderCardAction({ variant, isUnlocked, isSelected }) {
  if (!isUnlocked) return `<span class="badge muted-badge">잠김</span>`;
  if (isSelected) return `<span class="badge selected-badge">대표 키위</span>`;
  return `<button class="button button-small" type="button" data-select-kiwi="${escapeHTML(variant.id)}">대표로 설정</button>`;
}
