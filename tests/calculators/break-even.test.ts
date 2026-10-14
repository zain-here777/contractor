import { describe, expect, it } from "vitest";
import { calculateBreakEven } from "../../src/lib/calculators/break-even";

describe("break-even calculator", () => {
  it("fixed 6000, revenue 3000, variable 1500 -> 4 jobs, 12000 revenue", () => {
    const result = calculateBreakEven({
      fixedCosts: 6000,
      averageJobRevenue: 3000,
      averageJobVariableCost: 1500,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.jobsNeeded).toBe(4);
    expect(result.value.totalRevenue).toBe(12000);
    expect(result.value.contributionPerJob).toBe(1500);
  });

  it("rejects variable cost greater than or equal to revenue", () => {
    expect(
      calculateBreakEven({
        fixedCosts: 6000,
        averageJobRevenue: 3000,
        averageJobVariableCost: 3000,
      }).ok,
    ).toBe(false);
    expect(
      calculateBreakEven({
        fixedCosts: 6000,
        averageJobRevenue: 3000,
        averageJobVariableCost: 3500,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative fixed costs", () => {
    const result = calculateBreakEven({
      fixedCosts: -1,
      averageJobRevenue: 3000,
      averageJobVariableCost: 1500,
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toMatch(/Fixed costs/i);
  });
});
