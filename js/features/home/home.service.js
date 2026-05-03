export function buildTodayMissions({
  kiwiName = "위키",
  reviewStats = {},
  todayDiaryCount = 0,
  todayMetaSessionCount = 0,
  todayCalmLogCount = 0,
  recentDiaries = [],
} = {}) {
  const missions = [];

  if ((reviewStats.due ?? 0) > 0) {
    missions.push({
      id: "due-review",
      icon: "🪺",
      title: `오늘 복습 ${reviewStats.due}개 꺼내기`,
      description: "헷갈렸던 씨앗부터 먼저 꺼내면 시험 직전 부담이 줄어요.",
      target: "review",
      actionLabel: "복습하러 가기",
      priority: "high",
    });
  }

  if (todayDiaryCount <= 0) {
    missions.push({
      id: "first-diary",
      icon: "✏️",
      title: `${kiwiName}에게 개념 1개 설명하기`,
      description: "오늘 배운 것 하나만 골라서 자기 설명으로 바꾸세요.",
      target: "diary",
      actionLabel: "일기 쓰기",
      priority: "high",
    });
  }

  if (todayMetaSessionCount <= 0) {
    missions.push({
      id: "meta-check",
      icon: "⏱️",
      title: "25분 공부 실험 1회 기록하기",
      description: "예상 시간과 실제 시간을 비교하면 다음 계획이 더 정확해져요.",
      target: "meta",
      actionLabel: "타이머 켜기",
      priority: "normal",
    });
  }

  if (recentDiaries.some((diary) => String(diary.trapPoint ?? "").trim().length <= 0)) {
    missions.push({
      id: "trap-point",
      icon: "🧩",
      title: "최근 개념의 시험 함정 1개 떠올리기",
      description: "‘선지에서 어떻게 꼬일까?’를 적으면 복습 카드가 더 강해져요.",
      target: "diary",
      actionLabel: "함정 적기",
      priority: "normal",
    });
  }

  if (todayCalmLogCount <= 0 && missions.length < 3) {
    missions.push({
      id: "calm-log",
      icon: "🌿",
      title: "공부 전 상태 10초 체크하기",
      description: "컨디션을 먼저 적으면 ‘내가 못함’이 아니라 ‘조건’을 볼 수 있어요.",
      target: "calm",
      actionLabel: "상태 기록",
      priority: "soft",
    });
  }

  if (!missions.length) {
    missions.push({
      id: "free-review",
      icon: "🥝",
      title: "오늘 둥지 기본 루프 완료",
      description: "복습·기록·메타인지 흐름이 잡혔어요. 남은 힘은 가볍게 유지해도 됩니다.",
      target: "kiwi",
      actionLabel: "키위 보러 가기",
      priority: "soft",
    });
  }

  return missions.slice(0, 3);
}
