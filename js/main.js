import { qs, setHTML } from "./utils/dom.js";
import { loadState } from "./state.js";
import { initRouter } from "./router.js";
import { renderHome } from "./features/home/home.view.js";
import { bindHomeEvents } from "./features/home/home.controller.js";
import { renderDiary } from "./features/diary/diary.view.js";
import { bindDiaryEvents } from "./features/diary/diary.controller.js";

function renderApp() {
  setHTML(qs("#home"), renderHome());
  setHTML(qs("#diary"), renderDiary());

  bindHomeEvents(renderApp);
  bindDiaryEvents(renderApp);
}

function initApp() {
  loadState();
  renderApp();
  initRouter();
}

document.addEventListener("DOMContentLoaded", initApp);
