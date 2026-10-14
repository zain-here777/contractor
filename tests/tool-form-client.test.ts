import { describe, expect, it } from "vitest";
import { errorResultHtml } from "../src/components/tools/tool-form-client";

describe("tool-form-client", () => {
  it("prefixes errors with the field-error pattern (Error: via CSS)", () => {
    const html = errorResultHtml("Billable hours must be greater than zero.");
    expect(html).toContain('class="field-error"');
    expect(html).toContain("Billable hours must be greater than zero.");
    expect(html).not.toContain("<script");
  });

  it("escapes HTML in error messages", () => {
    const html = errorResultHtml('<img onerror="alert(1)">');
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});
