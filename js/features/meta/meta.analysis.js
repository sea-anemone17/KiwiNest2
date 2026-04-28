export function analyzeMetaSession(input) {
  const goalMinutes = Number(input.goalMinutes) || 0;
  const actualMinutes = Number(input.actualMinutes) || 0;
  const expectedDifficulty = Number(input.expectedDifficulty) || 3;
  const actualDifficulty = Number(input.actualDifficulty) || 3;
  const expectedFocus = Number(input.expectedFocus) || 3;
  const actualFocus = Number(input.actualFocus) || 3;

  const timeGap = actualMinutes - goalMinutes;
  const difficultyGap = actualDifficulty - expectedDifficulty;
  const focusGap = actualFocus - expectedFocus;

  return {
    timeGap,
    difficultyGap,
    focusGap,
    timeLabel: describeTimeGap(timeGap),
    difficultyLabel: describeDifficultyGap(difficultyGap),
    focusLabel: describeFocusGap(focusGap),
  };
}

function describeTimeGap(gap) {
  if (gap >= 10) return "예상보다 오래 버텼어요";
  if (gap >= 0) return "예상 시간에 거의 맞췄어요";
  if (gap >= -5) return "예상보다 조금 짧았어요";
  return "예상보다 일찍 멈췄어요";
}

function describeDifficultyGap(gap) {
  if (gap >= 2) return "생각보다 훨씬 어려웠어요";
  if (gap === 1) return "예상보다 조금 어려웠어요";
  if (gap === 0) return "난이도 예측이 정확했어요";
  if (gap === -1) return "예상보다 조금 쉬웠어요";
  return "생각보다 훨씬 쉬웠어요";
}

function describeFocusGap(gap) {
  if (gap >= 2) return "예상보다 훨씬 잘 집중했어요";
  if (gap === 1) return "예상보다 조금 더 집중했어요";
  if (gap === 0) return "집중도 예측이 정확했어요";
  if (gap === -1) return "예상보다 조금 흐트러졌어요";
  return "집중이 많이 어려웠어요";
}

export function suggestNextStrategy(input, analysis) {
  if (input.blockReason === "sleepy") {
    return "졸린 날은 목표 시간을 줄이고 짧게 시작해 보세요.";
  }

  if (input.blockReason === "too_big") {
    return "목표를 절반으로 줄이면 시작 확률이 높아져요.";
  }

  if (input.blockReason === "hard_concept") {
    return "다음엔 설명형 공부로 개념부터 구조화해 보세요.";
  }

  if (input.blockReason === "environment") {
    return "공부 장소나 주변 소음을 조정해 보는 게 좋아요.";
  }

  if (input.blockReason === "distraction") {
    return "짧은 타이머 + 방해 요소 제거가 효과적일 수 있어요.";
  }

  if (analysis.focusGap <= -2) {
    return "예상보다 집중이 어려웠어요. 시간대를 바꾸거나 시작 단위를 줄여 보세요.";
  }

  if (analysis.timeGap < -10) {
    return "목표 시간이 길었을 수 있어요. 더 작은 목표로 조정해 보세요.";
  }

  if (input.completedGoal) {
    return "현재 방식이 잘 맞아요. 같은 구조를 반복해 보세요.";
  }

  return "오늘 기록을 기반으로 다음 실험 조건을 조금 조정해 보세요.";
}
