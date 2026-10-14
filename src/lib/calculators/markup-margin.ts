import { fail, ok, type CalcResult } from "./types";
import { requireFiniteNumber } from "./validate";

export type MarkupMarginPair = {
  price: number;
  markup: number;
  margin: number;
};

function validateMargin(margin: number): CalcResult<number> {
  const base = requireFiniteNumber(margin, "Margin");
  if (!base.ok) {
    return base;
  }
  if (margin >= 1) {
    return fail("Margin must be less than 100% (1.0).");
  }
  return base;
}

function validateMarkup(markup: number): CalcResult<number> {
  const base = requireFiniteNumber(markup, "Markup");
  if (!base.ok) {
    return base;
  }
  if (markup <= -1) {
    return fail("Markup must be greater than -100% (-1.0).");
  }
  return base;
}

/** margin = (price - cost) / price */
export function marginFromPriceAndCost(price: number, cost: number): number {
  return (price - cost) / price;
}

/** markup = margin / (1 - margin) */
export function markupFromMargin(margin: number): CalcResult<number> {
  const marginCheck = validateMargin(margin);
  if (!marginCheck.ok) {
    return marginCheck;
  }
  return ok(marginCheck.value / (1 - marginCheck.value));
}

/** margin = markup / (1 + markup) */
export function marginFromMarkup(markup: number): CalcResult<number> {
  const markupCheck = validateMarkup(markup);
  if (!markupCheck.ok) {
    return markupCheck;
  }
  return ok(markupCheck.value / (1 + markupCheck.value));
}

/** price = cost × (1 + markup) */
export function priceFromCostAndMarkup(
  cost: number,
  markup: number,
): CalcResult<MarkupMarginPair> {
  const costCheck = requireFiniteNumber(cost, "Cost");
  if (!costCheck.ok) {
    return costCheck;
  }
  const markupCheck = validateMarkup(markup);
  if (!markupCheck.ok) {
    return markupCheck;
  }
  const price = costCheck.value * (1 + markupCheck.value);
  const margin = marginFromPriceAndCost(price, costCheck.value);
  return ok({ price, markup: markupCheck.value, margin });
}

/** price = cost / (1 - margin) */
export function priceFromCostAndMargin(
  cost: number,
  margin: number,
): CalcResult<MarkupMarginPair> {
  const costCheck = requireFiniteNumber(cost, "Cost");
  if (!costCheck.ok) {
    return costCheck;
  }
  const marginCheck = validateMargin(margin);
  if (!marginCheck.ok) {
    return marginCheck;
  }
  const price = costCheck.value / (1 - marginCheck.value);
  const markupResult = markupFromMargin(marginCheck.value);
  if (!markupResult.ok) {
    return markupResult;
  }
  return ok({
    price,
    margin: marginCheck.value,
    markup: markupResult.value,
  });
}
