import { getMoodName } from "../../data/moods.js";
import { getSituationName } from "../../data/situations.js";

const SITUATION_MESSAGES = {
  normal: "오늘이 특별하지 않아도 괜찮아요. 평범한 날에 남긴 기록이 제일 오래 버티는 힘이 되기도 해요.",
  played: "논 날은 망한 날이 아니에요. 돌아올 수 있는 둥지가 있다는 걸 확인한 날이에요.",
  exam_period: "시험 기간의 둥지는 조금 좁고 시끄러워요. 그래도 지금의 당신은 할 일을 하나씩 볼 수 있어요.",
  after_exam: "시험을 친 뒤에는 몸과 마음이 먼저 돌아와야 해요. 채점보다 숨을 먼저 골라도 돼요.",
  low_condition: "컨디션이 낮은 날에는 기준도 낮춰야 해요. 오늘의 목표는 무너지지 않고 돌아오는 거예요.",
  restart: "다시 시작하는 날은 늦은 날이 아니라 연결이 복구된 날이에요.",
  late_start: "늦게 시작했어도 시작한 사실은 사라지지 않아요. 작은 불씨를 둥지에 다시 올려 둔 거예요.",
};

const MOOD_MESSAGES = {
  anxious: "불안은 지금 중요한 걸 지키고 싶다는 신호일 수 있어요. 먼저 몸을 안전한 곳에 앉혀 주세요.",
  guilty: "죄책감이 공부를 대신해 주지는 않아요. 대신 지금의 기록이 다음 한 걸음을 가볍게 만들어 줄 거예요.",
  tired: "지친 날에는 의지보다 회복이 먼저예요. 쉬는 것도 다음 공부를 위한 준비예요.",
  blank: "멍한 상태는 고장 난 게 아니에요. 머리가 잠깐 소리를 줄이는 중일 수 있어요.",
  proud: "뿌듯함은 저장해도 되는 감정이에요. 오늘의 좋은 감각을 둥지에 남겨 둘게요.",
  dopamine_low: "자극이 부족한 날에는 작은 보상부터 붙여도 괜찮아요. 아주 작은 시작도 게임의 첫 턴이에요.",
  relieved: "후련함이 왔다면, 오늘의 긴장이 조금 내려간 거예요. 그 감각을 기억해 둬요.",
  okay: "괜찮은 날은 좋은 실험 날이에요. 무리하지 않고 리듬을 관찰해 봐요.",
};

export function createCalmMessage({ kiwiName, situation, mood, note }) {
  const situationMessage = SITUATION_MESSAGES[situation] ?? "오늘의 상황을 둥지에 조용히 적어 둘게요.";
  const moodMessage = MOOD_MESSAGES[mood] ?? "지금 느끼는 감정을 그대로 적어도 괜찮아요.";
  const hasNote = String(note ?? "").trim().length >= 10;
  const situationName = getSituationName(situation);
  const moodName = getMoodName(mood);

  if (hasNote) {
    return `${kiwiName}가 기록을 조심스럽게 읽었어요.\n“${situationName}에 ${moodName}을 느낀 날이었네요. ${moodMessage}”`;
  }

  return `${kiwiName}가 둥지 한쪽을 비워 두었어요.\n“${situationMessage} ${moodMessage}”`;
}
