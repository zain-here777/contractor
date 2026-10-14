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

export type ResultMetric = {
  label: string;
  value: string;
  /** Primary number shown larger (first metric only if omitted). */
  primary?: boolean;
};

export function renderMetricGridHtml(
  metrics: ResultMetric[],
  extrasHtml = "",
): string {
  if (metrics.length === 0) {
    return extrasHtml;
  }
  const items = metrics
    .map((metric, index) => {
      const isPrimary = metric.primary ?? index === 0;
      const valueHtml = metric.value;
      return `<div class="tool-metric${isPrimary ? " tool-metric--primary" : ""}">
        <span class="tool-metric__label">${escapeHtml(metric.label)}</span>
        <span class="tool-metric__value">${valueHtml}</span>
      </div>`;
    })
    .join("");
  return `<div class="tool-metric-grid" role="list">${items}</div>${extrasHtml}`;
}

export type RenderResultOptions =
  | { type: "result" | "warn" | "success"; html: string }
  | { type: "error"; message: string };

const RESULT_TYPE_CLASS: Record<
  Exclude<RenderResultOptions["type"], "error">,
  string
> = {
  result: RESULT_PANEL_BASE,
  warn: `${RESULT_PANEL_BASE} result-panel--warn`,
  success: `${RESULT_PANEL_BASE} result-panel--success`,
};

export function renderResultPanel(
  panel: HTMLElement,
  options: RenderResultOptions,
): void {
  panel.hidden = false;
  panel.removeAttribute("data-empty");
  const typeClass =
    options.type === "error"
      ? `${RESULT_PANEL_BASE} result-panel--error`
      : RESULT_TYPE_CLASS[options.type];
  panel.className = typeClass;
  panel.innerHTML =
    options.type === "error" ? errorResultHtml(options.message) : options.html;
}

const PLACEHOLDER_HTML = `<p class="result-panel__hint">Enter your details, then click Calculate to see results here.</p>`;

export function showResultPlaceholder(panel: HTMLElement | null): void {
  if (!panel) {
    return;
  }
  panel.hidden = false;
  panel.dataset.empty = "true";
  panel.className = `${RESULT_PANEL_BASE} result-panel--placeholder`;
  panel.innerHTML = PLACEHOLDER_HTML;
}

export function clearResultPanel(panel: HTMLElement): void {
  showResultPlaceholder(panel);
}

export const TOOL_LIVE_DEBOUNCE_MS = 400;

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  waitMs: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, waitMs);
  };
}

export function bindSubmitToolForm(
  form: HTMLFormElement | null,
  panel: HTMLElement | null,
  run: (form: HTMLFormElement, panel: HTMLElement) => void,
): void {
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form && panel) {
      run(form, panel);
    }
  });
}

export function bindResetToolForm(
  form: HTMLFormElement | null,
  panel: HTMLElement | null,
  resetButton: HTMLElement | null,
  afterReset?: () => void,
): void {
  resetButton?.addEventListener("click", () => {
    form?.reset();
    afterReset?.();
    showResultPlaceholder(panel);
  });
}

export function bindExampleFill(
  form: HTMLFormElement | null,
  exampleButton: HTMLElement | null,
  values: Record<string, string>,
  afterFill?: () => void,
): void {
  exampleButton?.addEventListener("click", () => {
    if (!form) {
      return;
    }
    for (const [name, value] of Object.entries(values)) {
      const field = form.elements.namedItem(name);
      if (field instanceof RadioNodeList) {
        for (const item of field) {
          if (item instanceof HTMLInputElement) {
            item.checked = item.value === value;
          }
        }
        continue;
      }
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement
      ) {
        field.value = value;
      }
    }
    afterFill?.();
  });
}
