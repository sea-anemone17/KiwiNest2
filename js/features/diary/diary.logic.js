import { calculateDiaryReward, createKiwiThanksMessage } from "../rewards/rewards.logic.js";

export function validateDiaryInput(input) {
  const errors = [];

  if (!input.title.trim()) errors.push("공부 제목을 적어 주세요.");
  if (!input.content.trim()) errors.push("공부 내용을 적어 주세요.");
  if (input.explanation.trim().length < 20) errors.push("키위에게 설명하기는 20자 이상 적어 주세요.");

  return errors;
}

export function buildDiaryPayload(input, kiwiName) {
  const reward = calculateDiaryReward(input);
  const message = createKiwiThanksMessage(kiwiName, reward);

  return {
    diary: {
      subject: input.subject,
      title: input.title.trim(),
      content: input.content.trim(),
      explanation: input.explanation.trim(),
      confusedPoint: input.confusedPoint.trim(),
      understanding: Number(input.understanding),
      reward,
    },
    reward: {
      ...reward,
      message,
    },
  };
}
