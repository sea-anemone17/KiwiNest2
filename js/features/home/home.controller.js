import { qs, qsa, on, showToast } from "../../utils/dom.js";
import { setKiwiName } from "../../state.js";

export function bindHomeEvents(renderApp) {
  const form = qs("#kiwiNameForm");
  const input = qs("#kiwiNameInput");

  qsa("[data-home-nav-target]").forEach((button) => {
    on(button, "click", () => {
      const target = button.dataset.homeNavTarget;
      const navButton = document.querySelector(`[data-tab-target="${target}"]`);
      navButton?.click();
    });
  });

  on(form, "submit", (event) => {
    event.preventDefault();
    setKiwiName(input?.value ?? "위키");
    showToast("키위 이름을 저장했어요 🥝");
    renderApp();
  });
}
