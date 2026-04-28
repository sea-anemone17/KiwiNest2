export const ACHIEVEMENTS = [
  {
    id: "first_diary",
    name: "첫 수업",
    emoji: "📚",
    description: "첫 공부 일기를 저장했어요.",
    conditionText: "공부 일기 1개 작성",
  },
  {
    id: "teacher_three",
    name: "작은 선생님",
    emoji: "🥝",
    description: "키위에게 여러 번 설명하며 공부를 내 말로 바꿨어요.",
    conditionText: "공부 일기 3개 작성",
  },
  {
    id: "long_explainer",
    name: "긴 설명의 힘",
    emoji: "📝",
    description: "길게 설명하며 개념을 구조화했어요.",
    conditionText: "350자 이상 설명 1회",
  },
  {
    id: "meta_start",
    name: "첫 공부 실험",
    emoji: "⏱️",
    description: "예상과 실제를 비교하기 시작했어요.",
    conditionText: "메타인지 기록 1개 작성",
  },
  {
    id: "calm_return",
    name: "둥지로 돌아온 날",
    emoji: "💛",
    description: "감정을 기록하고 다시 돌아올 자리를 만들었어요.",
    conditionText: "마음 안정소 기록 1개 작성",
  },
  {
    id: "review_first",
    name: "첫 복습 씨앗",
    emoji: "🪺",
    description: "헷갈린 것을 다시 꺼내 보기 시작했어요.",
    conditionText: "복습 결과 1회 기록",
  },
  {
    id: "confusion_collector",
    name: "헷갈림 수집가",
    emoji: "🤔",
    description: "모르는 부분을 숨기지 않고 기록했어요.",
    conditionText: "헷갈린 점 5개 기록",
  },
  {
    id: "exam_survivor",
    name: "시험 기간 생존자",
    emoji: "📚",
    description: "시험 기간에도 감정과 공부를 함께 관리했어요.",
    conditionText: "시험 기간 마음 기록 3회",
  },
  {
    id: "kiwi_collector",
    name: "키위 관찰자",
    emoji: "🐣",
    description: "키위의 여러 모습을 발견했어요.",
    conditionText: "키위 바리에이션 5개 해금",
  },
];

export function getAchievementById(id) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
