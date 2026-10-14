import { ok, type CalcResult } from "./types.ts";
import { requirePositiveNumber } from "./validate.ts";

export type DailyRateResult = {
  dailyRate: number;
};

/** daily rate = hourly rate × billable hours per day */
export function calculateDailyRate(
  hourlyRate: number,
  billableHoursPerDay: number,
): CalcResult<DailyRateResult> {
  const hourlyCheck = requirePositiveNumber(hourlyRate, "Hourly rate");
  if (!hourlyCheck.ok) {
    return hourlyCheck;
  }
  const hoursCheck = requirePositiveNumber(
    billableHoursPerDay,
    "Billable hours per day",
  );
  if (!hoursCheck.ok) {
    return hoursCheck;
  }

  const dailyRate = hourlyCheck.value * hoursCheck.value;
  if (!Number.isFinite(dailyRate)) {
    return {
      ok: false,
      error: "Could not calculate daily rate with the numbers provided.",
    };
  }

  return ok({ dailyRate });
}
