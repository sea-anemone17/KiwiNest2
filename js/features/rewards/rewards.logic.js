export function calculateDiaryReward({ explanation, confusedPoint, understanding }) {
  const explanationLength = String(explanation ?? "").trim().length;
  const hasConfusedPoint = String(confusedPoint ?? "").trim().length > 0;
  const understandingScore = Number(understanding);

  let exp = 10;
  let affection = 2;
  let titleTickets = 0;

  if (explanationLength >= 80) exp += 8;
  if (explanationLength >= 180) {
    exp += 10;
    affection += 2;
  }
  if (explanationLength >= 350) {
    exp += 15;
    affection += 3;
    titleTickets += 1;
  }
  if (hasConfusedPoint) {
    exp += 5;
    affection += 2;
  }
  if (understandingScore >= 3) exp += 5;
  if (understandingScore >= 4) {
    exp += 8;
    affection += 2;
  }

  return { exp, affection, titleTickets };
}

export function createKiwiThanksMessage(kiwiName, reward) {
  if (reward.titleTickets > 0) {
    return `${kiwiName}가 반짝이는 눈으로 설명을 들었어요.\n“이건 정말 잘 배웠어요. 고마워요!”`;
  }

  if (reward.exp >= 25) {
    return `${kiwiName}가 고개를 끄덕여요.\n“설명이 길고 친절해서 저도 이해한 것 같아요!”`;
  }

  return `${kiwiName}가 작은 발로 노트를 꾹 눌러요.\n“오늘도 알려 줘서 고마워요.”`;
}
