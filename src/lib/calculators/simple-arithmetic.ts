import { fail, ok, type CalcResult } from "./types.ts";

export type BinaryOperator = "+" | "-" | "*" | "/";

const OPERATOR_SYMBOL: Record<BinaryOperator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

export function operatorDisplaySymbol(operator: BinaryOperator): string {
  return OPERATOR_SYMBOL[operator];
}

export function applyBinaryOperator(
  left: number,
  right: number,
  operator: BinaryOperator,
): CalcResult<number> {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return fail("Enter valid numbers.");
  }

  switch (operator) {
    case "+":
      return ok(left + right);
    case "-":
      return ok(left - right);
    case "*":
      return ok(left * right);
    case "/":
      if (right === 0) {
        return fail("Cannot divide by zero.");
      }
      return ok(left / right);
    default:
      return fail("Unknown operation.");
  }
}

/** Format a finite number for the calculator display (grouped, no scientific notation for typical ranges). */
export function formatCalculatorNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "Error";
  }
  const rounded = Math.round(value * 1e10) / 1e10;
  if (
    Math.abs(rounded) >= 1e12 ||
    (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-8)
  ) {
    return rounded.toPrecision(10).replace(/\.?0+$/, "");
  }
  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: 10,
    useGrouping: true,
  });
}

/** Turn 25 into 0.25 (percent as a decimal). */
export function applyUnaryPercent(value: number): CalcResult<number> {
  if (!Number.isFinite(value)) {
    return fail("Enter a valid number.");
  }
  return ok(value / 100);
}

/**
 * With a pending operation, treat `percentValue` as a percent of `stored`.
 * + / −: amount = stored × (percent ÷ 100) — use with = to add or subtract.
 * ×: stored × (percent ÷ 100) — e.g. 200 × 10% → 20.
 * ÷: stored ÷ (percent ÷ 100) — e.g. 200 ÷ 10% → 2,000.
 */
export function applyPercentWithOperator(
  stored: number,
  percentValue: number,
  operator: BinaryOperator,
): CalcResult<number> {
  if (!Number.isFinite(stored) || !Number.isFinite(percentValue)) {
    return fail("Enter valid numbers.");
  }
  const fraction = percentValue / 100;
  if (operator === "+") {
    return ok(stored * fraction);
  }
  if (operator === "-") {
    return ok(stored * fraction);
  }
  if (operator === "*") {
    return ok(stored * fraction);
  }
  if (fraction === 0) {
    return fail("Cannot divide by zero.");
  }
  return ok(stored / fraction);
}
