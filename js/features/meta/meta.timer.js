let timerSeconds = 0;
let intervalId = null;

export function startTimer(onTick) {
  if (intervalId) return;

  intervalId = window.setInterval(() => {
    timerSeconds += 1;
    if (typeof onTick === "function") onTick(timerSeconds);
  }, 1000);

  if (typeof onTick === "function") onTick(timerSeconds);
}

export function pauseTimer() {
  if (!intervalId) return;
  window.clearInterval(intervalId);
  intervalId = null;
}

export function resetTimer(onTick) {
  pauseTimer();
  timerSeconds = 0;
  if (typeof onTick === "function") onTick(timerSeconds);
}

export function getTimerSeconds() {
  return timerSeconds;
}

export function getTimerMinutesRounded() {
  if (timerSeconds <= 0) return 0;
  return Math.max(1, Math.round(timerSeconds / 60));
}

export function formatTimerSeconds(seconds = timerSeconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const restSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
}
