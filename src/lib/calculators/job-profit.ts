import { marginFromPriceAndCost, markupFromMargin } from "./markup-margin.ts";
import { ok, type CalcResult } from "./types.ts";
import { requirePositiveNumber } from "./validate.ts";

export type JobProfitResult = {
  profit: number;
  margin: number;
  markup: number;
};

/** Profit, margin, and markup from a quoted job price and your cost. */
export function calculateJobProfit(
  jobPrice: number,
  jobCost: number,
): CalcResult<JobProfitResult> {
  const priceCheck = requirePositiveNumber(jobPrice, "Job price");
  if (!priceCheck.ok) {
    return priceCheck;
  }
  const costCheck = requirePositiveNumber(jobCost, "Job cost");
  if (!costCheck.ok) {
    return costCheck;
  }

  const profit = priceCheck.value - costCheck.value;
  const margin = marginFromPriceAndCost(priceCheck.value, costCheck.value);
  if (!Number.isFinite(margin)) {
    return {
      ok: false,
      error: "Could not calculate margin from these numbers.",
    };
  }

  const markupResult = markupFromMargin(margin);
  if (!markupResult.ok) {
    return markupResult;
  }

  return ok({
    profit,
    margin,
    markup: markupResult.value,
  });
}
