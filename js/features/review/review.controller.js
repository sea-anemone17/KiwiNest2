import { on, qs, showToast } from "../../utils/dom.js";
import { appState, applyReward } from "../../state.js";
import { calculateReviewReward, createKiwiReviewMessage } from "../rewards/rewards.logic.js";
import { getReviewResultLabel } from "./review.logic.js";
import { saveReviewResult } from "./review.service.js";

export function bindReviewEvents(renderApp) {
  const reviewPanel = qs("#review");

  on(reviewPanel, "click", (event) => {
    const button = event.target.closest(".review-action");
    if (!button) return;

    const container = button.closest("[data-review-id]");
    const reviewId = container?.dataset.reviewId;
    const result = button.dataset.reviewResult;

    if (!reviewId || !result) return;

    const updatedItem = saveReviewResult(reviewId, result);
    if (!updatedItem) {
      showToast("복습 항목을 찾지 못했어요.");
      return;
    }

    const reward = calculateReviewReward(result);
    applyReward({
      ...reward,
      message: createKiwiReviewMessage(appState.kiwi.name, result, updatedItem),
    });

    showToast(`${getReviewResultLabel(result)} 기록 완료! EXP +${reward.exp} 🪺`);
    renderApp();
  });
}
