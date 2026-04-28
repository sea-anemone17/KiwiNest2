export const LETTERS = [
  {
    id: "first_diary_letter",
    achievementId: "first_diary",
    title: "첫 수업 후 온 편지",
    preview: "오늘 처음으로 둥지에 공부를 남겼네요.",
    body: "오늘 처음으로 둥지에 공부를 남겼네요. 완벽한 설명이 아니어도 괜찮아요. 작은 키위는 누군가 자기에게 알려 주려고 멈춰 앉은 시간을 오래 기억해요.",
  },
  {
    id: "long_explanation_letter",
    achievementId: "long_explainer",
    title: "긴 설명의 편지",
    preview: "설명이 길다는 건, 머릿속 길을 직접 걸어 봤다는 뜻이에요.",
    body: "설명이 길다는 건, 머릿속 길을 직접 걸어 봤다는 뜻이에요. 키위는 그 길 위에 작은 발자국을 남겨 두었어요. 다음에 다시 와도 길을 잃지 않게요.",
  },
  {
    id: "calm_letter",
    achievementId: "calm_return",
    title: "돌아온 날의 편지",
    preview: "공부하지 못한 날에도 둥지는 닫히지 않아요.",
    body: "공부하지 못한 날에도 둥지는 닫히지 않아요. 오늘 마음을 적었다는 건, 도망친 게 아니라 다시 돌아올 길을 표시했다는 뜻이에요.",
  },
  {
    id: "review_letter",
    achievementId: "review_first",
    title: "복습 씨앗의 편지",
    preview: "헷갈림은 실패가 아니라 다시 심을 씨앗이에요.",
    body: "헷갈림은 실패가 아니라 다시 심을 씨앗이에요. 오늘 키위는 그 씨앗을 둥지 안쪽에 조심히 묻어 두었어요. 나중에 더 단단한 기억으로 자랄 거예요.",
  },
  {
    id: "exam_letter",
    achievementId: "exam_survivor",
    title: "시험 기간의 편지",
    preview: "버티는 날에는 작아 보여도 많은 힘이 들어가요.",
    body: "버티는 날에는 작아 보여도 많은 힘이 들어가요. 키위는 오늘의 기록을 성과표가 아니라 생존 지도처럼 접어 두었어요. 돌아온 것만으로도 길은 이어졌어요.",
  },
  {
    id: "collector_letter",
    achievementId: "kiwi_collector",
    title: "도감의 편지",
    preview: "키위의 여러 모습은 사실 공부하는 당신의 여러 모습이에요.",
    body: "키위의 여러 모습은 사실 공부하는 당신의 여러 모습이에요. 졸려도, 헷갈려도, 다시 돌아와도 모두 둥지에 남을 수 있어요. 그래서 이 도감은 실패를 지우는 곳이 아니라, 계속 살아남은 흔적을 모으는 곳이에요.",
  },
];

export function getLetterById(id) {
  return LETTERS.find((letter) => letter.id === id);
}
