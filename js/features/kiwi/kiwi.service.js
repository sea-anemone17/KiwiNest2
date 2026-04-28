import { appState, drawTitleGacha, setEquippedTitle, setSelectedKiwiVariant } from "../../state.js";
import { getKiwiVariantById } from "../../data/kiwiVariants.js";
import { getTitleById } from "../../data/titles.js";

export function selectKiwiVariant(variantId) {
  const isUnlocked = appState.kiwiDex.unlockedVariantIds.includes(variantId);
  if (!isUnlocked) return null;
  setSelectedKiwiVariant(variantId);
  return getKiwiVariantById(variantId);
}

export function equipKiwiTitle(titleId) {
  const isOwned = appState.titles?.ownedTitleIds?.includes(titleId);
  if (!isOwned) return null;
  setEquippedTitle(titleId);
  return getTitleById(titleId);
}

export function drawKiwiTitle() {
  return drawTitleGacha();
}
