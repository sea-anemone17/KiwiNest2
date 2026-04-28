export const KIWI_TITLES = [
  {
    id: "nest_beginner",
    name: "첫 둥지의 친구",
    rarity: "common",
    description: "처음부터 키위와 함께한 사용자에게 주어지는 기본 칭호예요.",
  },
  {
    id: "gentle_teacher",
    name: "친절한 설명가",
    rarity: "common",
    description: "키위에게 개념을 차분히 설명해 주는 사람에게 어울려요.",
  },
  {
    id: "focus_spark",
    name: "집중 불씨",
    rarity: "common",
    description: "짧더라도 타이머를 켜고 공부 실험을 시작한 흔적이에요.",
  },
  {
    id: "review_keeper",
    name: "복습 둥지지기",
    rarity: "rare",
    description: "헷갈린 개념을 다시 꺼내 보는 습관을 지켜요.",
  },
  {
    id: "brave_returner",
    name: "다시 돌아온 자",
    rarity: "rare",
    description: "완벽하지 않아도 둥지로 돌아온 날의 칭호예요.",
  },
  {
    id: "grammar_guardian",
    name: "문법을 지키는",
    rarity: "rare",
    description: "문법과 구조를 끝까지 붙잡는 키위에게 어울려요.",
  },
  {
    id: "quiet_strategist",
    name: "조용한 전략가",
    rarity: "rare",
    description: "공부 방식을 관찰하고 다음 전략으로 바꾸는 사람에게 주어져요.",
  },
  {
    id: "dawn_explorer",
    name: "새벽의 탐구자",
    rarity: "special",
    description: "조용한 시간에도 작은 불빛을 켠 키위의 특별 칭호예요.",
  },
  {
    id: "kiwi_master",
    name: "키위의 스승",
    rarity: "special",
    description: "설명과 복습으로 키위를 똑똑하게 만든 사람에게 어울려요.",
  },
];

export function getTitleById(id) {
  return KIWI_TITLES.find((title) => title.id === id) ?? KIWI_TITLES[0];
}

export function getTitleRarityLabel(rarity) {
  if (rarity === "special") return "특별";
  if (rarity === "rare") return "희귀";
  return "일반";
}
