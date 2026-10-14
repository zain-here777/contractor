import { describe, expect, it } from "vitest";
import { factNeedsConfirmation, formatFactValue } from "../src/lib/format-fact";

describe("format-fact", () => {
  it('shows "Needs confirmation" for confirm confidence', () => {
    expect(
      formatFactValue({ label: "Fee", value: 100, confidence: "confirm" }),
    ).toBe("Needs confirmation");
  });

  it('shows "Needs confirmation" for null value', () => {
    expect(
      formatFactValue({ label: "Fee", value: null, confidence: "primary" }),
    ).toBe("Needs confirmation");
  });

  it("shows the value for primary facts", () => {
    expect(
      formatFactValue({
        label: "Threshold",
        value: 1000,
        confidence: "primary",
      }),
    ).toBe("1000");
  });

  it("formats booleans", () => {
    expect(
      factNeedsConfirmation({ label: "X", value: true, confidence: "primary" }),
    ).toBe(false);
    expect(
      formatFactValue({ label: "X", value: true, confidence: "primary" }),
    ).toBe("Yes");
  });
});
