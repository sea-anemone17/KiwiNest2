import { qs, showToast } from "../../utils/dom.js";
import { normalizeText } from "../../utils/sanitize.js";
import { addDiary, appState, applyReward } from "../../state.js";
import { buildDiaryEntry, validateDiaryInput } from "./diary.logic.js";

export function bindDiaryEvents(renderApp) {
  const form = qs("#diaryForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const input = {
      subject: normalizeText(formData.get("subject"), 40) || "etc",
      title: normalizeText(formData.get("title"), 80),
      content: normalizeText(formData.get("content"), 1500),
      explanation: normalizeText(formData.get("explanation"), 6000),
      confusedPoint: normalizeText(formData.get("confusedPoint"), 1500),
      understanding: Number(formData.get("understanding") || 3),
    };

    const errorMessage = validateDiaryInput(input);
    if (errorMessage) {
      showToast(errorMessage);
      return;
    }

    const { diary, reward } = buildDiaryEntry(input, appState.kiwi.name);
    addDiary(diary);
    applyReward(reward);
    form.reset();
    renderApp();
    showToast(`저장 완료! EXP +${reward.exp}, 친밀도 +${reward.affection}`);
  });
}
