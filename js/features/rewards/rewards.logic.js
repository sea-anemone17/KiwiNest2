export function calculateDiaryReward({ explanation, confusedPoint, understanding }) {
  const explanationLength = explanation.length;
  const baseExp = 10;
  const explanationBonus = getExplanationBonus(explanationLength);
  const confusedBonus = confusedPoint ? 4 : 0;
  const understandingBonus = Number(understanding) >= 4 ? 6 : Number(understanding) >= 3 ? 3 : 0;
  const affection = 2 + (explanationLength >= 200 ? 2 : 0) + (confusedPoint ? 1 : 0);
  const titleTickets = explanationLength >= 350 ? 1 : 0;

  return {
    exp: baseExp + explanationBonus + confusedBonus + understandingBonus,
    affection,
    titleTickets,
  };
}

export function buildKiwiThanksMessage(kiwiName, reward, explanationLength) {
  if (explanationLength >= 350) {
    return `${kiwiName}가 반짝이는 눈으로 고개를 끄덕였어요. “자세히 설명해 줘서 고마워요. 저도 조금 더 똑똑해진 것 같아요!”`;
  }

  if (explanationLength >= 140) {
    return `${kiwiName}가 작은 발로 노트를 꾹 눌렀어요. “이해했어요. 이렇게 설명해 주니까 기억에 오래 남을 것 같아요!”`;
  }

  return `${kiwiName}가 고개를 갸웃하다가 웃었어요. “고마워요. 다음엔 조금만 더 자세히 알려 주세요!”`;
}

function getExplanationBonus(length) {
  if (length >= 350) return 18;
  if (length >= 220) return 14;
  if (length >= 120) return 9;
  if (length >= 40) return 5;
  return 0;
}
