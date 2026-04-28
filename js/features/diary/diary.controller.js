import { qs, on, showToast } from "../../utils/dom.js";
import {
  addCustomSubject,
  addDiary,
  addReviewItemFromDiary,
  appState,
  applyReward,
} from "../../state.js";
import { buildDiaryPayload, validateDiaryInput } from "./diary.logic.js";

export function bindDiaryEvents(renderApp) {
  const form = qs("#diaryForm");
  const addSubjectButton = qs("#addSubjectButton");

  on(addSubjectButton, "click", () => {
    const input = qs("#newSubjectInput");
    const subject = addCustomSubject(input?.value ?? "");

    if (!subject) {
      showToast("추가할 과목 이름을 입력해 주세요.");
      return;
    }

    showToast(`${subject.name} 과목이 추가되었어요.`);
    renderApp();
  });

  on(form, "submit", (event) => {
    event.preventDefault();

    const input = collectDiaryInput();
    const errors = validateDiaryInput(input);

    if (errors.length) {
      showToast(errors[0]);
      return;
    }

    const { diary, reward } = buildDiaryPayload(input, appState.kiwi.name);
    const savedDiary = addDiary(diary);
    const reviewItem = shouldCreateReview(input) ? addReviewItemFromDiary(savedDiary) : null;
    applyReward(reward);

    showToast(
      reviewItem
        ? `공부 일기를 저장하고 복습 둥지에 넣었어요. EXP +${reward.exp} 🪺`
        : `공부 일기를 저장했어요. EXP +${reward.exp} 🥝`
    );

    renderApp();
  });
}

function collectDiaryInput() {
  return {
    subject: qs("#diarySubject")?.value ?? "etc",
    title: qs("#diaryTitle")?.value ?? "",
    content: qs("#diaryContent")?.value ?? "",
    explanation: qs("#diaryExplanation")?.value ?? "",
    confusedPoint: qs("#diaryConfused")?.value ?? "",
    understanding: qs("#diaryUnderstanding")?.value ?? "3",
  };
}

function shouldCreateReview(input) {
  return String(input.confusedPoint ?? "").trim().length > 0 || Number(input.understanding) <= 2;
}
