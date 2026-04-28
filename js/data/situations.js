export const SITUATIONS = [
  { id: "normal", name: "평상시", emoji: "🏡" },
  { id: "played", name: "놀았음", emoji: "🎮" },
  { id: "exam_period", name: "시험 기간", emoji: "📚" },
  { id: "after_exam", name: "시험 친 후", emoji: "🫠" },
  { id: "low_condition", name: "컨디션 나쁨", emoji: "🌧️" },
  { id: "restart", name: "다시 시작", emoji: "🌱" },
  { id: "late_start", name: "늦게 시작함", emoji: "🌙" },
];

export function getSituationName(situationId) {
  return SITUATIONS.find((situation) => situation.id === situationId)?.name ?? "상황";
}

export function getSituationEmoji(situationId) {
  return SITUATIONS.find((situation) => situation.id === situationId)?.emoji ?? "🥝";
}
