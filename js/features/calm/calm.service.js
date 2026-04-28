export function buildCalmPayload(input, message, reward) {
  return {
    situation: input.situation,
    mood: input.mood,
    note: input.note,
    message,
    reward,
  };
}

export function validateCalmInput(input) {
  const errors = [];

  if (!input.situation) errors.push("오늘 상황을 골라 주세요.");
  if (!input.mood) errors.push("지금 기분을 골라 주세요.");
  if (input.note && input.note.length < 3) errors.push("짧은 기록은 3자 이상 적거나 비워 주세요.");

  return errors;
}
