import { fail, ok, type CalcResult } from "./types";
import { requireFiniteNumber, requirePositiveNumber } from "./validate";

export type BreakEvenResult = {
  jobsNeeded: number;
  totalRevenue: number;
  contributionPerJob: number;
};

/**
 * jobs = fixed costs / (average job revenue - average job variable cost)
 * revenue = jobs × average job revenue
 */
export function calculateBreakEven(input: {
  fixedCosts: number;
  averageJobRevenue: number;
  averageJobVariableCost: number;
}): CalcResult<BreakEvenResult> {
  const fixedCheck = requireFiniteNumber(input.fixedCosts, "Fixed costs");
  if (!fixedCheck.ok) {
    return fixedCheck;
  }
  const revenueCheck = requirePositiveNumber(
    input.averageJobRevenue,
    "Average job revenue",
  );
  if (!revenueCheck.ok) {
    return revenueCheck;
  }
  const variableCheck = requireFiniteNumber(
    input.averageJobVariableCost,
    "Average job variable cost",
  );
  if (!variableCheck.ok) {
    return variableCheck;
  }

  if (variableCheck.value >= revenueCheck.value) {
    return fail(
      "Average job variable cost must be less than average job revenue, or you cannot break even.",
    );
  }

  const contributionPerJob = revenueCheck.value - variableCheck.value;
  const jobsNeeded = fixedCheck.value / contributionPerJob;
  const totalRevenue = jobsNeeded * revenueCheck.value;

  if (!Number.isFinite(jobsNeeded) || !Number.isFinite(totalRevenue)) {
    return fail("Could not calculate break-even with the numbers provided.");
  }

  return ok({ jobsNeeded, totalRevenue, contributionPerJob });
}
