import { qs, showToast } from "../../utils/dom.js";
import { setKiwiName } from "../../state.js";

export function bindHomeEvents(renderApp) {
  qs("#saveKiwiNameButton")?.addEventListener("click", () => {
    const input = qs("#kiwiNameInput");
    setKiwiName(input?.value ?? "");
    renderApp();
    showToast("키위 이름을 저장했어요 🥝");
  });

  qs("#goDiaryButton")?.addEventListener("click", () => {
    qs('[data-tab-target="diary"]')?.click();
  });
}
