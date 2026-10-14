import { ok, type CalcResult } from "./types";
import { requireFiniteNumber, requirePositiveNumber } from "./validate";

const FULL_TIME_HOURS_PER_YEAR = 2080;

export type HourlyRateResult = {
  hourlyRate: number;
  totalAnnualTarget: number;
};

/**
 * hourly rate = (pay goal + yearly overhead + profit goal) / billable hours
 */
export function calculateHourlyRate(input: {
  payGoal: number;
  yearlyOverhead: number;
  profitGoal: number;
  billableHours: number;
}): CalcResult<HourlyRateResult> {
  const payCheck = requireFiniteNumber(input.payGoal, "Pay goal");
  if (!payCheck.ok) {
    return payCheck;
  }
  const overheadCheck = requireFiniteNumber(
    input.yearlyOverhead,
    "Yearly overhead",
  );
  if (!overheadCheck.ok) {
    return overheadCheck;
  }
  const profitCheck = requireFiniteNumber(input.profitGoal, "Profit goal");
  if (!profitCheck.ok) {
    return profitCheck;
  }
  const hoursCheck = requirePositiveNumber(
    input.billableHours,
    "Billable hours",
  );
  if (!hoursCheck.ok) {
    return hoursCheck;
  }

  const totalAnnualTarget =
    payCheck.value + overheadCheck.value + profitCheck.value;
  const hourlyRate = totalAnnualTarget / hoursCheck.value;

  const warnings: string[] = [];
  if (hoursCheck.value > FULL_TIME_HOURS_PER_YEAR) {
    warnings.push(
      `Billable hours exceed ${FULL_TIME_HOURS_PER_YEAR} (a common full-time baseline). Check that the hours you entered are realistic.`,
    );
  }

  return ok({ hourlyRate, totalAnnualTarget }, warnings);
}
