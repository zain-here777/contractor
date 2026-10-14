import { ok, type CalcResult } from "./types";
import { requireFiniteNumber, requirePositiveNumber } from "./validate";

export type OverheadRateResult = {
  overheadPerHour: number;
};

/** overhead per hour = yearly overhead / billable hours */
export function calculateOverheadRate(input: {
  yearlyOverhead: number;
  billableHours: number;
}): CalcResult<OverheadRateResult> {
  const overheadCheck = requireFiniteNumber(
    input.yearlyOverhead,
    "Yearly overhead",
  );
  if (!overheadCheck.ok) {
    return overheadCheck;
  }
  const hoursCheck = requirePositiveNumber(
    input.billableHours,
    "Billable hours",
  );
  if (!hoursCheck.ok) {
    return hoursCheck;
  }

  const overheadPerHour = overheadCheck.value / hoursCheck.value;

  if (!Number.isFinite(overheadPerHour)) {
    return {
      ok: false,
      error: "Could not calculate overhead rate with the numbers provided.",
    };
  }

  return ok({ overheadPerHour });
}
