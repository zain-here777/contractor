import {
  applyBinaryOperator,
  applyPercentWithOperator,
  applyUnaryPercent,
  formatCalculatorNumber,
  operatorDisplaySymbol,
  type BinaryOperator,
} from "../../lib/calculators/simple-arithmetic.ts";

type CalcState = {
  display: string;
  storedValue: number | null;
  pendingOperator: BinaryOperator | null;
  waitingForOperand: boolean;
  lastCompletedExpression: string | null;
  errorMessage: string | null;
  /** e.g. "10%" after percent key, for the calculation line. */
  lastPercentLabel: string | null;
};

function initialState(): CalcState {
  return {
    display: "0",
    storedValue: null,
    pendingOperator: null,
    waitingForOperand: false,
    lastCompletedExpression: null,
    errorMessage: null,
    lastPercentLabel: null,
  };
}

function parseDisplay(display: string): number {
  const value = Number(display);
  return Number.isFinite(value) ? value : 0;
}

function formatEntryDisplay(raw: string): string {
  if (raw === "Error") {
    return raw;
  }
  if (raw.endsWith(".") || raw === "-" || raw === ".") {
    return raw;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return raw;
  }
  return formatCalculatorNumber(value);
}

function buildExpressionLine(state: CalcState): string {
  if (
    state.errorMessage &&
    state.storedValue !== null &&
    state.pendingOperator
  ) {
    const left = formatCalculatorNumber(state.storedValue);
    const op = operatorDisplaySymbol(state.pendingOperator);
    const right = formatEntryDisplay(state.display);
    return `${left} ${op} ${right}`;
  }

  if (state.lastCompletedExpression) {
    return state.lastCompletedExpression;
  }

  if (state.storedValue === null || state.pendingOperator === null) {
    if (state.display === "0" && !state.waitingForOperand) {
      return "Enter the first number, then tap + − × or ÷.";
    }
    return formatEntryDisplay(state.display);
  }

  const left = formatCalculatorNumber(state.storedValue);
  const op = operatorDisplaySymbol(state.pendingOperator);
  if (state.waitingForOperand) {
    return `${left} ${op}`;
  }
  if (state.lastPercentLabel) {
    return `${left} ${op} ${state.lastPercentLabel}`;
  }
  return `${left} ${op} ${formatEntryDisplay(state.display)}`;
}

function buildResultLine(state: CalcState): string {
  if (state.errorMessage) {
    return state.errorMessage;
  }
  return formatEntryDisplay(state.display);
}

type CalcDom = {
  root: HTMLElement;
  expressionEl: HTMLElement;
  displayEl: HTMLElement;
};

function renderState(state: CalcState, dom: CalcDom): void {
  dom.expressionEl.textContent = buildExpressionLine(state);
  dom.displayEl.textContent = buildResultLine(state);
  dom.root.classList.toggle("calc-shell--error", state.errorMessage !== null);

  for (const button of dom.root.querySelectorAll<HTMLButtonElement>(
    "[data-calc-op]",
  )) {
    const op = button.dataset.calcOp;
    const isActive =
      state.pendingOperator !== null &&
      !state.errorMessage &&
      op === state.pendingOperator &&
      state.waitingForOperand;
    button.classList.toggle("calc-key--active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }
}

export function initSimpleCalculator(root: HTMLElement): void {
  const expressionEl = root.querySelector<HTMLElement>(
    "[data-calc-expression]",
  );
  const displayEl = root.querySelector<HTMLElement>("[data-calc-display]");
  if (!expressionEl || !displayEl) {
    return;
  }

  const dom: CalcDom = { root, expressionEl, displayEl };
  let state = initialState();
  renderState(state, dom);

  function clearErrorIfNeeded(): void {
    if (state.errorMessage) {
      state = initialState();
    }
  }

  function startNewCalculation(): void {
    state.lastCompletedExpression = null;
    state.errorMessage = null;
    state.lastPercentLabel = null;
  }

  function commitPendingOperator(nextDisplay: string): boolean {
    const current = parseDisplay(nextDisplay);
    if (state.storedValue === null || state.pendingOperator === null) {
      state.storedValue = current;
      return true;
    }
    const left = state.storedValue;
    const op = state.pendingOperator;
    const result = applyBinaryOperator(left, current, op);
    if (!result.ok) {
      state.errorMessage = result.error;
      renderState(state, dom);
      return false;
    }
    state.storedValue = result.value;
    state.display = formatCalculatorNumber(result.value);
    state.errorMessage = null;
    return true;
  }

  function handleDigit(digit: string): void {
    if (state.errorMessage) {
      state = initialState();
    }
    if (state.lastCompletedExpression) {
      startNewCalculation();
      state.display = "0";
    }
    state.lastPercentLabel = null;
    if (state.waitingForOperand) {
      state.display = digit === "." ? "0." : digit;
      state.waitingForOperand = false;
    } else if (state.display === "0" && digit !== ".") {
      state.display = digit;
    } else if (digit === "." && state.display.includes(".")) {
      return;
    } else {
      state.display = state.display + digit;
    }
    renderState(state, dom);
  }

  function handleOperator(op: BinaryOperator): void {
    clearErrorIfNeeded();
    state.lastPercentLabel = null;
    if (state.lastCompletedExpression) {
      state.lastCompletedExpression = null;
      state.storedValue = parseDisplay(state.display);
    } else if (state.pendingOperator !== null && !state.waitingForOperand) {
      if (!commitPendingOperator(state.display)) {
        return;
      }
    } else {
      state.storedValue = parseDisplay(state.display);
    }
    state.pendingOperator = op;
    state.waitingForOperand = true;
    renderState(state, dom);
  }

  function handleEquals(): void {
    if (state.display === "Error" || state.pendingOperator === null) {
      return;
    }
    const left = state.storedValue ?? parseDisplay(state.display);
    const op = state.pendingOperator;
    const right = parseDisplay(state.display);
    const percentLabel = state.lastPercentLabel;
    if (!commitPendingOperator(state.display)) {
      return;
    }
    const rightLabel = percentLabel ?? formatCalculatorNumber(right);
    state.lastCompletedExpression = `${formatCalculatorNumber(left)} ${operatorDisplaySymbol(op)} ${rightLabel} =`;
    state.lastPercentLabel = null;
    state.pendingOperator = null;
    state.waitingForOperand = true;
    renderState(state, dom);
  }

  function handleClear(): void {
    state = initialState();
    renderState(state, dom);
  }

  function handlePercent(): void {
    if (state.errorMessage) {
      state = initialState();
    }
    if (state.lastCompletedExpression) {
      startNewCalculation();
    }

    const current = parseDisplay(state.display);

    if (state.pendingOperator === null || state.storedValue === null) {
      const unary = applyUnaryPercent(current);
      if (!unary.ok) {
        state.errorMessage = unary.error;
        renderState(state, dom);
        return;
      }
      state.display = formatCalculatorNumber(unary.value);
      state.lastPercentLabel = null;
      renderState(state, dom);
      return;
    }

    if (state.waitingForOperand) {
      return;
    }

    const percentLabel = `${formatEntryDisplay(state.display)}%`;
    const result = applyPercentWithOperator(
      state.storedValue,
      current,
      state.pendingOperator,
    );
    if (!result.ok) {
      state.errorMessage = result.error;
      renderState(state, dom);
      return;
    }
    state.lastPercentLabel = percentLabel;
    state.display = formatCalculatorNumber(result.value);
    state.waitingForOperand = false;
    state.errorMessage = null;
    renderState(state, dom);
  }

  function handleBackspace(): void {
    if (
      state.errorMessage ||
      state.waitingForOperand ||
      state.lastCompletedExpression
    ) {
      return;
    }
    if (state.display.length <= 1) {
      state.display = "0";
    } else {
      state.display = state.display.slice(0, -1);
    }
    renderState(state, dom);
  }

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const key = target.dataset.calcKey;
    if (!key) {
      return;
    }
    if (key === "C") {
      handleClear();
      return;
    }
    if (key === "backspace") {
      handleBackspace();
      return;
    }
    if (key === "=") {
      handleEquals();
      return;
    }
    if (key === "%") {
      handlePercent();
      return;
    }
    if (key === "+" || key === "-" || key === "*" || key === "/") {
      handleOperator(key);
      return;
    }
    handleDigit(key);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key >= "0" && event.key <= "9") {
      event.preventDefault();
      handleDigit(event.key);
      return;
    }
    if (event.key === ".") {
      event.preventDefault();
      handleDigit(".");
      return;
    }
    if (
      event.key === "+" ||
      event.key === "-" ||
      event.key === "*" ||
      event.key === "/"
    ) {
      event.preventDefault();
      handleOperator(event.key);
      return;
    }
    if (event.key === "%") {
      event.preventDefault();
      handlePercent();
      return;
    }
    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      handleEquals();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      handleClear();
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      handleBackspace();
    }
  });
}
