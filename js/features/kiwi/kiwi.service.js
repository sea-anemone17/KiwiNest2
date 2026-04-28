import { appState, setSelectedKiwiVariant } from "../../state.js";
import { getKiwiVariantById } from "../../data/kiwiVariants.js";

export function selectKiwiVariant(variantId) {
  const isUnlocked = appState.kiwiDex.unlockedVariantIds.includes(variantId);
  if (!isUnlocked) return null;
  setSelectedKiwiVariant(variantId);
  return getKiwiVariantById(variantId);
}
