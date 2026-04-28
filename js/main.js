import { qs, setHTML } from "./utils/dom.js";
import { loadState } from "./state.js";
import { initRouter } from "./router.js";
import { renderHome } from "./features/home/home.view.js";
import { bindHomeEvents } from "./features/home/home.controller.js";
import { renderDiary } from "./features/diary/diary.view.js";
import { bindDiaryEvents } from "./features/diary/diary.controller.js";
import { renderMeta } from "./features/meta/meta.view.js";
import { bindMetaEvents } from "./features/meta/meta.controller.js";
import { renderCalm } from "./features/calm/calm.view.js";
import { bindCalmEvents } from "./features/calm/calm.controller.js";

function renderApp() {
  setHTML(qs("#home"), renderHome());
  setHTML(qs("#diary"), renderDiary());
  setHTML(qs("#meta"), renderMeta());
  setHTML(qs("#calm"), renderCalm());

  bindHomeEvents(renderApp);
  bindDiaryEvents(renderApp);
  bindMetaEvents(renderApp);
  bindCalmEvents(renderApp);
}

function initApp() {
  loadState();
  renderApp();
  initRouter();
}

document.addEventListener("DOMContentLoaded", initApp);
