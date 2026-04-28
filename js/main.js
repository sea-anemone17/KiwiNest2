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
import { renderReview } from "./features/review/review.view.js";
import { bindReviewEvents } from "./features/review/review.controller.js";
import { renderKiwiDex } from "./features/kiwi/kiwi.view.js";
import { bindKiwiEvents } from "./features/kiwi/kiwi.controller.js";

function renderApp() {
  setHTML(qs("#home"), renderHome());
  setHTML(qs("#diary"), renderDiary());
  setHTML(qs("#meta"), renderMeta());
  setHTML(qs("#calm"), renderCalm());
  setHTML(qs("#review"), renderReview());
  setHTML(qs("#kiwi"), renderKiwiDex());

  bindHomeEvents(renderApp);
  bindDiaryEvents(renderApp);
  bindMetaEvents(renderApp);
  bindCalmEvents(renderApp);
  bindReviewEvents(renderApp);
  bindKiwiEvents(renderApp);
}

function initApp() {
  loadState();
  renderApp();
  initRouter();
}

document.addEventListener("DOMContentLoaded", initApp);
