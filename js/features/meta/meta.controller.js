import { qs, qsa, on, showToast } from "../../utils/dom.js";
import { addMetaSession, appState, applyReward } from "../../state.js";
import { calculateMetaReward, createKiwiMetaMessage } from "../rewards/rewards.logic.js";
import { analyzeMetaSession } from "./meta.analysis.js";
import {
  formatTimerSeconds,
  getTimerMinutesRounded,
  getTimerSeconds,
  pauseTimer,
  resetTimer,
  startTimer,
} from "./meta.timer.js";

export function bindMetaEvents(renderApp) {
  bindRangeOutputs();
  bindTimerButtons();
  bindMetaForm(renderApp);
}

function bindRangeOutputs() {
  qsa("input[type='range']").forEach((input) => {
    const updateOutput = () => {
      const output = qs(`[data-range-output="${input.id}"]`);
      if (output) output.textContent = input.value;
    };

    updateOutput();
    on(input, "input", updateOutput);
  });
}

function bindTimerButtons() {
  const updateDisplay = (seconds = getTimerSeconds()) => {
    const display = qs("#metaTimerDisplay");
    if (display) display.textContent = formatTimerSeconds(seconds);
  };

  updateDisplay();

  on(qs("#metaTimerStart"), "click", () => {
    startTimer(updateDisplay);
  });

  on(qs("#metaTimerPause"), "click", () => {
    pauseTimer();
    updateDisplay();
  });

  on(qs("#metaTimerReset"), "click", () => {
    resetTimer(updateDisplay);
    const actualInput = qs("#metaActualMinutes");
    if (actualInput) actualInput.value = "";
  });
}

function bindMetaForm(renderApp) {
  const form = qs("#metaForm");

  on(form, "submit", (event) => {
    event.preventDefault();

    const input = collectMetaInput();
    const errors = validateMetaInput(input);

    if (errors.length) {
      showToast(errors[0]);
      return;
    }

    const analysis = analyzeMetaSession(input);
    const reward = calculateMetaReward(input);
    const message = createKiwiMetaMessage(appState.kiwi.name, reward, analysis);

    const session = {
      goal: input.goal,
      goalMinutes: input.goalMinutes,
      actualMinutes: input.actualMinutes,
      expectedDifficulty: input.expectedDifficulty,
      actualDifficulty: input.actualDifficulty,
      expectedFocus: input.expectedFocus,
      actualFocus: input.actualFocus,
      completedGoal: input.completedGoal,
      reflection: input.reflection,
      timerSeconds: getTimerSeconds(),
      analysis,
      reward,
    };

    addMetaSession(session);
    applyReward({ ...reward, message });
    resetTimer();

    showToast(`메타인지 기록을 저장했어요. EXP +${reward.exp} 🥝`);
    renderApp();
  });
}

function collectMetaInput() {
  const timerMinutes = getTimerMinutesRounded();
  const actualInputValue = Number(qs("#metaActualMinutes")?.value ?? 0);
  const actualMinutes = actualInputValue > 0 ? actualInputValue : timerMinutes;

  return {
    goal: String(qs("#metaGoal")?.value ?? "").trim(),
    studyType: qs("#metaStudyType")?.value ?? "concept",
    goalMinutes: Number(qs("#metaGoalMinutes")?.value ?? 0),
    actualMinutes,
    expectedDifficulty: Number(qs("#metaExpectedDifficulty")?.value ?? 3),
    actualDifficulty: Number(qs("#metaActualDifficulty")?.value ?? 3),
    expectedFocus: Number(qs("#metaExpectedFocus")?.value ?? 3),
    actualFocus: Number(qs("#metaActualFocus")?.value ?? 3),
    completedGoal: qs("#metaCompletedGoal")?.value === "true",
    blockReason: qs("#metaBlockReason")?.value ?? "",
    reflection: String(qs("#metaReflection")?.value ?? "").trim(),
  };
}

function validateMetaInput(input) {
  const errors = [];

  if (!input.goal) errors.push("오늘의 목표를 적어 주세요.");
  if (!Number.isFinite(input.goalMinutes) || input.goalMinutes <= 0) errors.push("목표 시간을 1분 이상으로 적어 주세요.");
  if (!Number.isFinite(input.actualMinutes) || input.actualMinutes <= 0) errors.push("타이머를 켜거나 실제 시간을 입력해 주세요.");
  if (input.reflection && input.reflection.length < 5) errors.push("관찰 메모는 5자 이상 적거나 비워 주세요.");

  return errors;
}
