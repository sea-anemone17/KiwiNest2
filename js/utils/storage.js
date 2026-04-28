const PREFIX = "kiwinest:";

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("Failed to read localStorage:", error);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Failed to write localStorage:", error);
    return false;
  }
}
