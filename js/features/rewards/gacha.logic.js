import { KIWI_TITLES, getTitleById } from "../../data/titles.js";

export function drawTitleFromGacha(ownedTitleIds = []) {
  const owned = new Set(ownedTitleIds);
  const candidates = KIWI_TITLES.filter((title) => !owned.has(title.id));

  if (!candidates.length) {
    return {
      title: null,
      isComplete: true,
    };
  }

  const roll = Math.random();
  const rarity = roll < 0.08 ? "special" : roll < 0.35 ? "rare" : "common";
  const pool = candidates.filter((title) => title.rarity === rarity);
  const fallbackPool = candidates;
  const finalPool = pool.length ? pool : fallbackPool;
  const title = finalPool[Math.floor(Math.random() * finalPool.length)];

  return {
    title: getTitleById(title.id),
    isComplete: false,
  };
}
