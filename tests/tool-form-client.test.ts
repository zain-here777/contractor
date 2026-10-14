import { describe, expect, it, vi } from "vitest";
import {
  debounce,
  renderMetricGridHtml,
  TOOL_LIVE_DEBOUNCE_MS,
} from "../src/components/tools/tool-form-client.ts";

describe("renderMetricGridHtml", () => {
  it("escapes metric labels and marks the first metric primary by default", () => {
    const html = renderMetricGridHtml([
      { label: "Price <test>", value: "$1,250.00" },
      { label: "Margin", value: "20%" },
    ]);
    expect(html).toContain("Price &lt;test&gt;");
    expect(html).toContain("tool-metric--primary");
    expect(html).toContain("$1,250.00");
  });
});

describe("debounce", () => {
  it("waits before invoking", async () => {
    vi.useFakeTimers();
    let count = 0;
    const fn = debounce(() => {
      count += 1;
    }, TOOL_LIVE_DEBOUNCE_MS);
    fn();
    fn();
    expect(count).toBe(0);
    await vi.advanceTimersByTimeAsync(TOOL_LIVE_DEBOUNCE_MS);
    expect(count).toBe(1);
    vi.useRealTimers();
  });
});
