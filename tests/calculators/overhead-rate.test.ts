import { describe, expect, it } from "vitest";
import { calculateOverheadRate } from "../../src/lib/calculators/overhead-rate";

describe("overhead-rate calculator", () => {
  it("40000 overhead / 1200 hours -> 33.33 per hour", () => {
    const result = calculateOverheadRate({
      yearlyOverhead: 40000,
      billableHours: 1200,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.overheadPerHour).toBeCloseTo(33.33, 2);
  });

  it("rejects zero billable hours", () => {
    expect(
      calculateOverheadRate({
        yearlyOverhead: 40000,
        billableHours: 0,
      }).ok,
    ).toBe(false);
  });
});
