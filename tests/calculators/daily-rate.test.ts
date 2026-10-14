import { describe, expect, it } from "vitest";
import { calculateDailyRate } from "../../src/lib/calculators/daily-rate";

describe("daily-rate calculator", () => {
  it("116.67 per hour × 8 hours -> 933.36 per day", () => {
    const result = calculateDailyRate(116.67, 8);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.dailyRate).toBeCloseTo(933.36, 2);
  });

  it("rejects zero hours per day", () => {
    expect(calculateDailyRate(100, 0).ok).toBe(false);
  });
});
