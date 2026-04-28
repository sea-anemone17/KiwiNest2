import { on, qs, showToast } from "../../utils/dom.js";
import { getKiwiDisplayName } from "./kiwi.naming.js";
import { selectKiwiVariant } from "./kiwi.service.js";
import { appState } from "../../state.js";

export function bindKiwiEvents(renderApp) {
  const panel = qs("#kiwi");

  on(panel, "click", (event) => {
    const button = event.target.closest("[data-select-kiwi]");
    if (!button) return;

    const variant = selectKiwiVariant(button.dataset.selectKiwi);
    if (!variant) {
      showToast("아직 해금되지 않은 키위예요.");
      return;
    }

    showToast(`${getKiwiDisplayName(variant, appState.kiwi.name)}를 대표 키위로 세웠어요 🥝`);
    renderApp();
  });
}
