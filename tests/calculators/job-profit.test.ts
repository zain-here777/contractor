import { describe, expect, it } from "vitest";
import { calculateJobProfit } from "../../src/lib/calculators/job-profit";

describe("job-profit calculator", () => {
  it("price 1250, cost 1000 -> profit 250, margin 20%, markup 25%", () => {
    const result = calculateJobProfit(1250, 1000);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.profit).toBe(250);
    expect(result.value.margin).toBeCloseTo(0.2, 10);
    expect(result.value.markup).toBeCloseTo(0.25, 10);
  });

  it("rejects zero job price", () => {
    expect(calculateJobProfit(0, 1000).ok).toBe(false);
  });

  it("rejects negative job cost", () => {
    expect(calculateJobProfit(1000, -1).ok).toBe(false);
  });
});
