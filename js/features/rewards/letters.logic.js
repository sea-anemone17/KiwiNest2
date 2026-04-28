import { LETTERS } from "../../data/letters.js";

export function evaluateLetters(state) {
  const unlocked = new Set(state.letters?.unlockedIds ?? []);
  const achievementIds = new Set(state.achievements?.unlockedIds ?? []);
  const newlyUnlocked = [];

  for (const letter of LETTERS) {
    if (unlocked.has(letter.id)) continue;
    if (!achievementIds.has(letter.achievementId)) continue;

    unlocked.add(letter.id);
    newlyUnlocked.push(letter.id);
  }

  return {
    unlockedIds: [...unlocked],
    newlyUnlockedIds: newlyUnlocked,
  };
}
