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
