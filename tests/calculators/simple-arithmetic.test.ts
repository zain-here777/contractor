import { describe, expect, it } from "vitest";
import {
  applyBinaryOperator,
  applyPercentWithOperator,
  applyUnaryPercent,
  formatCalculatorNumber,
} from "../../src/lib/calculators/simple-arithmetic";

describe("simple-arithmetic", () => {
  it("adds, subtracts, multiplies, and divides", () => {
    expect(applyBinaryOperator(2, 3, "+")).toEqual({ ok: true, value: 5 });
    expect(applyBinaryOperator(10, 4, "-")).toEqual({ ok: true, value: 6 });
    expect(applyBinaryOperator(6, 7, "*")).toEqual({ ok: true, value: 42 });
    expect(applyBinaryOperator(15, 3, "/")).toEqual({ ok: true, value: 5 });
  });

  it("rejects division by zero", () => {
    expect(applyBinaryOperator(1, 0, "/").ok).toBe(false);
  });

  it("formats display numbers with grouping", () => {
    expect(formatCalculatorNumber(1250.5)).toBe("1,250.5");
  });

  it("converts unary percent to a decimal", () => {
    expect(applyUnaryPercent(25)).toEqual({ ok: true, value: 0.25 });
  });

  it("applies percent with each binary operator", () => {
    expect(applyPercentWithOperator(1000, 10, "+")).toEqual({
      ok: true,
      value: 100,
    });
    expect(applyPercentWithOperator(1000, 10, "-")).toEqual({
      ok: true,
      value: 100,
    });
    expect(applyPercentWithOperator(200, 10, "*")).toEqual({
      ok: true,
      value: 20,
    });
    expect(applyPercentWithOperator(200, 10, "/")).toEqual({
      ok: true,
      value: 2000,
    });
  });

  it("rejects divide when percent is zero", () => {
    expect(applyPercentWithOperator(100, 0, "/").ok).toBe(false);
  });
});
