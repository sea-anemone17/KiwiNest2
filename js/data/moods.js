export const MOODS = [
  { id: "anxious", name: "불안", emoji: "🫧" },
  { id: "guilty", name: "죄책감", emoji: "🌧️" },
  { id: "tired", name: "지침", emoji: "🛌" },
  { id: "blank", name: "멍함", emoji: "☁️" },
  { id: "proud", name: "뿌듯함", emoji: "✨" },
  { id: "dopamine_low", name: "도파민 부족", emoji: "🍬" },
  { id: "relieved", name: "후련함", emoji: "🌿" },
  { id: "okay", name: "괜찮음", emoji: "🥝" },
];

export function getMoodName(moodId) {
  return MOODS.find((mood) => mood.id === moodId)?.name ?? "기분";
}

export function getMoodEmoji(moodId) {
  return MOODS.find((mood) => mood.id === moodId)?.emoji ?? "🥝";
}
