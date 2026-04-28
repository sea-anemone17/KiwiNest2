import { qsa } from "./utils/dom.js";

export function initRouter(onRouteChange) {
  const buttons = qsa("[data-tab-target]");
  const panels = qsa(".tab-panel");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tabTarget;

      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === targetId));

      if (typeof onRouteChange === "function") {
        onRouteChange(targetId);
      }
    });
  });
}
