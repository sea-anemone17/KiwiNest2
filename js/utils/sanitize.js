const ENTITY_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

export function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ENTITY_MAP[char]);
}

export function normalizeText(value, maxLength = 4000) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}
