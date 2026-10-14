import { describe, expect, it } from "vitest";
import { getStoredTheme } from "../src/scripts/theme.ts";

describe("theme", () => {
  it("getStoredTheme returns null when storage is empty", () => {
    expect(getStoredTheme()).toBeNull();
  });
});
