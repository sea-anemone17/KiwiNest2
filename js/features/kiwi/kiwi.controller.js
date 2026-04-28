import { on, qs, showToast } from "../../utils/dom.js";
import { getKiwiDisplayName } from "./kiwi.naming.js";
import { drawKiwiTitle, equipKiwiTitle, selectKiwiVariant } from "./kiwi.service.js";
import { appState } from "../../state.js";

export function bindKiwiEvents(renderApp) {
  const panel = qs("#kiwi");

  on(panel, "click", (event) => {
    const selectKiwiButton = event.target.closest("[data-select-kiwi]");
    if (selectKiwiButton) {
      const variant = selectKiwiVariant(selectKiwiButton.dataset.selectKiwi);
      if (!variant) {
        showToast("아직 해금되지 않은 키위예요.");
        return;
      }

      showToast(`${getKiwiDisplayName(variant, appState.kiwi.name)}를 대표 키위로 세웠어요 🥝`);
      renderApp();
      return;
    }

    const equipTitleButton = event.target.closest("[data-equip-title]");
    if (equipTitleButton) {
      const title = equipKiwiTitle(equipTitleButton.dataset.equipTitle);
      if (!title) {
        showToast("아직 보유하지 않은 칭호예요.");
        return;
      }

      showToast(`[${title.name}] 칭호를 장착했어요 👑`);
      renderApp();
      return;
    }

    const gachaButton = event.target.closest("[data-title-gacha]");
    if (gachaButton) {
      const result = drawKiwiTitle();
      if (!result.ok) {
        showToast(result.message ?? "칭호를 뽑을 수 없어요.");
        return;
      }

      showToast(`[${result.title.name}] 칭호를 얻었어요 ✨`);
      renderApp();
    }
  });
}
