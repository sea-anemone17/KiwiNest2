import { calculateDiaryReward, buildKiwiThanksMessage } from "../rewards/rewards.logic.js";

export function buildDiaryEntry(input, kiwiName) {
  const reward = calculateDiaryReward(input);
  const message = buildKiwiThanksMessage(kiwiName, reward, input.explanation.length);

  return {
    diary: {
      subject: input.subject,
      title: input.title,
      content: input.content,
      explanation: input.explanation,
      confusedPoint: input.confusedPoint,
      understanding: input.understanding,
      reward,
    },
    reward: {
      ...reward,
      message,
    },
  };
}

export function validateDiaryInput(input) {
  if (!input.title) return "공부 제목을 적어 주세요.";
  if (!input.content) return "오늘 공부한 내용을 한 줄 이상 적어 주세요.";
  if (!input.explanation) return "키위에게 설명할 내용을 적어 주세요.";
  if (input.explanation.length < 20) {
    return "설명이 너무 짧아요. 키위가 이해할 수 있게 20자 이상 적어 주세요.";
  }
  return "";
}
