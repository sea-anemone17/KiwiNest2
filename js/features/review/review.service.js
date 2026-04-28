import { completeReviewItem, getReviewItems } from "../../state.js";

export function fetchReviewItems() {
  return getReviewItems();
}

export function saveReviewResult(reviewId, result) {
  return completeReviewItem(reviewId, result);
}
