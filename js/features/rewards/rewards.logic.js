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

export function calculateMetaReward({ actualMinutes, goalMinutes, completedGoal, reflection }) {
  const actual = Number(actualMinutes) || 0;
  const goal = Number(goalMinutes) || 0;
  const hasReflection = String(reflection ?? "").trim().length >= 10;

  let exp = 8;
  let affection = 1;
  let titleTickets = 0;

  if (actual >= 5) exp += 4;
  if (actual >= 15) exp += 8;
  if (actual >= 25) {
    exp += 10;
    affection += 1;
  }

  if (goal > 0 && actual >= goal) {
    exp += 8;
    titleTickets += 1;
  }

  if (completedGoal) {
    exp += 7;
    affection += 1;
  }

  if (hasReflection) {
    exp += 5;
    affection += 2;
  }

  return { exp, affection, titleTickets };
}

export function createKiwiMetaMessage(kiwiName, reward, analysis) {
  if (reward.titleTickets > 0) {
    return `${kiwiName}가 작은 스톱워치를 꼭 안았어요.\n“목표를 끝까지 관찰했네요. 이건 진짜 강한 공부예요!”`;
  }

  if (analysis?.focusGap > 0) {
    return `${kiwiName}가 눈을 동그랗게 떠요.\n“예상보다 더 집중했네요. 오늘의 감각을 기억해 둘게요!”`;
  }

  if (analysis?.focusGap < 0) {
    return `${kiwiName}가 조용히 고개를 끄덕여요.\n“괜찮아요. 오늘은 집중이 어려웠다는 걸 알아낸 날이에요.”`;
  }

  return `${kiwiName}가 기록지를 둥지에 넣었어요.\n“오늘의 공부 방식을 같이 관찰했어요.”`;
}

export function calculateCalmReward({ note, mood }) {
  const noteLength = String(note ?? "").trim().length;

  let exp = 4;
  let affection = 2;
  let titleTickets = 0;

  if (noteLength >= 10) {
    exp += 3;
    affection += 1;
  }

  if (noteLength >= 50) {
    exp += 5;
    affection += 2;
  }

  if (["anxious", "guilty", "tired", "dopamine_low"].includes(mood)) {
    exp += 3;
    affection += 1;
  }

  return { exp, affection, titleTickets };
}

export function calculateReviewReward(result) {
  if (result === "remembered") {
    return { exp: 16, affection: 3, titleTickets: 0 };
  }

  if (result === "shaky") {
    return { exp: 10, affection: 2, titleTickets: 0 };
  }

  return { exp: 7, affection: 2, titleTickets: 0 };
}

export function createKiwiReviewMessage(kiwiName, result, updatedItem) {
  if (updatedItem?.status === "mastered") {
    return `${kiwiName}가 복습 노트를 꼭 안았어요.\n“이건 이제 둥지 깊은 곳에 잘 자리 잡았어요!”`;
  }

  if (result === "remembered") {
    return `${kiwiName}가 작은 발로 동그라미를 그려요.\n“기억해냈네요! 다음엔 조금 더 멀리서 다시 만나요.”`;
  }

  if (result === "shaky") {
    return `${kiwiName}가 고개를 갸웃하다가 끄덕여요.\n“애매한 걸 알아낸 것도 복습이에요. 내일 다시 같이 볼게요.”`;
  }

  return `${kiwiName}가 노트를 조용히 다시 펼쳐요.\n“괜찮아요. 모른다는 걸 발견했으니까, 이제 다시 붙잡을 수 있어요.”`;
}
