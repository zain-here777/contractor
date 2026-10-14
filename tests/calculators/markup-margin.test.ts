import { describe, expect, it } from "vitest";
import {
  marginFromMarkup,
  priceFromCostAndMargin,
  priceFromCostAndMarkup,
} from "../../src/lib/calculators/markup-margin";

describe("markup-margin calculator", () => {
  it("cost 1000, markup 25% -> price 1250, margin 20%", () => {
    const result = priceFromCostAndMarkup(1000, 0.25);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.price).toBe(1250);
    expect(result.value.margin).toBeCloseTo(0.2, 10);
  });

  it("cost 1000, margin 20% -> price 1250, markup 25%", () => {
    const result = priceFromCostAndMargin(1000, 0.2);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.price).toBe(1250);
    expect(result.value.markup).toBeCloseTo(0.25, 10);
  });

  it("markup 50% -> margin 33.33%", () => {
    const result = marginFromMarkup(0.5);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value).toBeCloseTo(0.3333, 3);
  });

  it("rejects margin of 100% or more", () => {
    expect(priceFromCostAndMargin(1000, 1).ok).toBe(false);
    expect(priceFromCostAndMargin(1000, 1.2).ok).toBe(false);
  });

  it("rejects negative cost", () => {
    expect(priceFromCostAndMarkup(-100, 0.25).ok).toBe(false);
  });

  it("rejects zero cost so margin is not NaN", () => {
    expect(priceFromCostAndMarkup(0, 0.25).ok).toBe(false);
    expect(priceFromCostAndMargin(0, 0.2).ok).toBe(false);
  });
});
