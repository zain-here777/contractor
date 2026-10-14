import { describe, expect, it } from "vitest";
import { calculateMaterialWaste } from "../../src/lib/calculators/material-waste";

describe("material-waste calculator", () => {
  it("100 units with 10% waste -> order 110", () => {
    const result = calculateMaterialWaste(100, 0.1);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.orderQuantity).toBeCloseTo(110, 10);
    expect(result.value.wasteAmount).toBeCloseTo(10, 10);
  });

  it("rejects zero net quantity", () => {
    expect(calculateMaterialWaste(0, 0.1).ok).toBe(false);
  });

  it("rejects negative waste fraction", () => {
    expect(calculateMaterialWaste(100, -0.05).ok).toBe(false);
  });
});
