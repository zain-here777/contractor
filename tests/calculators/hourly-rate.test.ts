import { describe, expect, it } from "vitest";
import { calculateHourlyRate } from "../../src/lib/calculators/hourly-rate";

describe("hourly-rate calculator", () => {
  it("pay 80000 + overhead 40000 + profit 20000, 1200 hours -> 116.67/hr", () => {
    const result = calculateHourlyRate({
      payGoal: 80000,
      yearlyOverhead: 40000,
      profitGoal: 20000,
      billableHours: 1200,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.hourlyRate).toBeCloseTo(116.67, 2);
    expect(result.value.totalAnnualTarget).toBe(140000);
  });

  it("rejects zero or negative billable hours", () => {
    expect(
      calculateHourlyRate({
        payGoal: 80000,
        yearlyOverhead: 40000,
        profitGoal: 20000,
        billableHours: 0,
      }).ok,
    ).toBe(false);
    expect(
      calculateHourlyRate({
        payGoal: 80000,
        yearlyOverhead: 40000,
        profitGoal: 20000,
        billableHours: -10,
      }).ok,
    ).toBe(false);
  });

  it("warns when billable hours exceed 2080", () => {
    const result = calculateHourlyRate({
      payGoal: 80000,
      yearlyOverhead: 40000,
      profitGoal: 20000,
      billableHours: 2500,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.warnings?.length).toBeGreaterThan(0);
    expect(result.warnings?.[0]).toContain("2080");
  });
});
