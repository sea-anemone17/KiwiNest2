export function getKiwiDisplayName(variant, kiwiName) {
  const baseName = String(kiwiName ?? "위키").trim() || "위키";
  const prefix = String(variant?.prefix ?? "").trim();
  return prefix ? `${prefix} ${baseName}` : baseName;
}

export function getKiwiRarityLabel(rarity) {
  if (rarity === "special") return "특별";
  if (rarity === "rare") return "희귀";
  return "일반";
}
