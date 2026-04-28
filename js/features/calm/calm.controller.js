import { qs, on, showToast } from "../../utils/dom.js";
import { addCalmLog, appState, applyReward } from "../../state.js";
import { calculateCalmReward } from "../rewards/rewards.logic.js";
import { createCalmMessage } from "./calm.messages.js";
import { buildCalmPayload, validateCalmInput } from "./calm.service.js";

export function bindCalmEvents(renderApp) {
  const form = qs("#calmForm");

  on(form, "submit", (event) => {
    event.preventDefault();

    const input = collectCalmInput();
    const errors = validateCalmInput(input);

    if (errors.length) {
      showToast(errors[0]);
      return;
    }

    const reward = calculateCalmReward(input);
    const message = createCalmMessage({ ...input, kiwiName: appState.kiwi.name });
    const calmLog = buildCalmPayload(input, message, reward);

    addCalmLog(calmLog);
    applyReward({ ...reward, message });

    showToast(`마음 기록을 저장했어요. EXP +${reward.exp} 🥝`);
    renderApp();
  });
}

function collectCalmInput() {
  return {
    situation: qs("#calmSituation")?.value ?? "normal",
    mood: qs("#calmMood")?.value ?? "okay",
    note: String(qs("#calmNote")?.value ?? "").trim(),
  };
}
