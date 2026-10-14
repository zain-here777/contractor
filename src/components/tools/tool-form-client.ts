export function parseInputNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function getFormNumber(
  form: HTMLFormElement,
  name: string,
): number | null {
  const field = form.elements.namedItem(name);
  if (!(field instanceof HTMLInputElement)) {
    return null;
  }
  return parseInputNumber(field.value);
}

const RESULT_PANEL_BASE = "result-panel";

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function errorResultHtml(message: string): string {
  return `<p class="field-error">${escapeHtml(message)}</p>`;
}

export type RenderResultOptions =
  | { type: "result" | "warn"; html: string }
  | { type: "error"; message: string };

export function renderResultPanel(
  panel: HTMLElement,
  options: RenderResultOptions,
): void {
  panel.hidden = false;
  const typeClass =
    options.type === "error"
      ? `${RESULT_PANEL_BASE} result-panel--error`
      : options.type === "warn"
        ? `${RESULT_PANEL_BASE} result-panel--warn`
        : RESULT_PANEL_BASE;
  panel.className = typeClass;
  panel.innerHTML =
    options.type === "error" ? errorResultHtml(options.message) : options.html;
}

export function clearResultPanel(panel: HTMLElement): void {
  panel.hidden = true;
  panel.innerHTML = "";
  panel.className = RESULT_PANEL_BASE;
}
