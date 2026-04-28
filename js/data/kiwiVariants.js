export const KIWI_VARIANTS = [
  {
    id: "basic",
    prefix: "",
    emoji: "🥝",
    name: "기본 키위",
    description: "처음부터 둥지에 함께 있던 키위예요.",
    conditionText: "기본 지급",
    rarity: "common",
  },
  {
    id: "teacher",
    prefix: "설명을 듣는",
    emoji: "📖",
    name: "설명을 듣는 키위",
    description: "공부 일기를 차곡차곡 들으며 자란 키위예요.",
    conditionText: "공부 일기 3개 작성",
    rarity: "common",
  },
  {
    id: "sleepy",
    prefix: "졸린",
    emoji: "😴",
    name: "졸린 키위",
    description: "늦은 시간에도 둥지 옆에 앉아 있던 키위예요.",
    conditionText: "밤/새벽 기록 1회",
    rarity: "common",
  },
  {
    id: "focused",
    prefix: "집중하는",
    emoji: "⏱️",
    name: "집중하는 키위",
    description: "타이머 소리를 들으며 공부 실험을 함께한 키위예요.",
    conditionText: "메타인지 기록 3개 작성",
    rarity: "common",
  },
  {
    id: "calm",
    prefix: "위로하는",
    emoji: "💛",
    name: "위로하는 키위",
    description: "공부하지 못한 날에도 둥지를 지켜 준 키위예요.",
    conditionText: "마음 안정소 기록 3개 작성",
    rarity: "common",
  },
  {
    id: "review",
    prefix: "복습하는",
    emoji: "🪺",
    name: "복습하는 키위",
    description: "헷갈린 개념을 다시 꺼내 보는 키위예요.",
    conditionText: "복습 결과 3회 기록",
    rarity: "rare",
  },
  {
    id: "confused",
    prefix: "갸웃한",
    emoji: "🤔",
    name: "갸웃한 키위",
    description: "헷갈림을 숨기지 않고 기록하는 키위예요.",
    conditionText: "헷갈린 점 5개 기록",
    rarity: "rare",
  },
  {
    id: "exam",
    prefix: "버티는",
    emoji: "📚",
    name: "버티는 키위",
    description: "시험 기간에도 둥지로 돌아오는 키위예요.",
    conditionText: "시험 기간 마음 기록 3회",
    rarity: "rare",
  },
  {
    id: "returning",
    prefix: "다시 돌아온",
    emoji: "🌱",
    name: "다시 돌아온 키위",
    description: "완벽하지 않아도 다시 시작하는 키위예요.",
    conditionText: "다시 시작 상황 기록 1회",
    rarity: "special",
  },
];

export function getKiwiVariantById(id) {
  return KIWI_VARIANTS.find((variant) => variant.id === id) ?? KIWI_VARIANTS[0];
}

export function getKiwiVariantMap() {
  return Object.fromEntries(KIWI_VARIANTS.map((variant) => [variant.id, variant]));
}
