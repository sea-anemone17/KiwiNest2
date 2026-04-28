import { qs, on, showToast } from "../../utils/dom.js";
import { setKiwiName } from "../../state.js";

export function bindHomeEvents(renderApp) {
  const form = qs("#kiwiNameForm");
  const input = qs("#kiwiNameInput");

  on(form, "submit", (event) => {
    event.preventDefault();
    setKiwiName(input?.value ?? "위키");
    showToast("키위 이름을 저장했어요 🥝");
    renderApp();
  });
}
