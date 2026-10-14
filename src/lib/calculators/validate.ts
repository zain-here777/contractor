import { fail, type CalcFailure, type CalcResult } from "./types";

export function requireFiniteNumber(
  value: number,
  label: string,
): CalcResult<number> | CalcFailure {
  if (!Number.isFinite(value)) {
    return fail(`${label} must be a valid number.`);
  }
  if (value < 0) {
    return fail(`${label} cannot be negative.`);
  }
  return { ok: true, value };
}

export function requirePositiveNumber(
  value: number,
  label: string,
): CalcResult<number> | CalcFailure {
  const base = requireFiniteNumber(value, label);
  if (!base.ok) {
    return base;
  }
  if (value <= 0) {
    return fail(`${label} must be greater than zero.`);
  }
  return base;
}
