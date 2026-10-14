import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import { licenseCheckConfigFromState } from "../../src/lib/license-check/config-from-state";
import { evaluateLicenseCheck } from "../../src/lib/license-check/evaluate";

const repoRoot = join(import.meta.dirname, "..", "..");
const californiaYaml = parseYaml(
  readFileSync(join(repoRoot, "data", "states", "california.yaml"), "utf8"),
) as Record<string, unknown>;

describe("license-required checker (California data file)", () => {
  const configResult = licenseCheckConfigFromState(
    "california",
    californiaYaml,
  );

  it("loads threshold from california.yaml (not hard-coded in tests)", () => {
    expect(configResult.ok).toBe(true);
    if (!configResult.ok) {
      return;
    }
    const section = californiaYaml.license_required as
      { threshold_usd?: number } | undefined;
    expect(configResult.value.thresholdUsd).toBe(section?.threshold_usd);
    expect(configResult.value.thresholdUsd).toBe(1000);
  });

  it("value 900, no permit, no workers -> exemption may apply", () => {
    if (!configResult.ok) {
      throw new Error("config failed to load");
    }
    const result = evaluateLicenseCheck(
      { jobValueUsd: 900, needsPermit: false, hiresWorkers: false },
      configResult.value,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.outcome).toBe("exemption_may_apply");
    expect(result.value.headline).toBe("Minor work exemption may apply");
  });

  it("value 1000 -> license required", () => {
    if (!configResult.ok) {
      throw new Error("config failed to load");
    }
    const result = evaluateLicenseCheck(
      { jobValueUsd: 1000, needsPermit: false, hiresWorkers: false },
      configResult.value,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.outcome).toBe("license_required");
  });

  it("value 500 with permit -> license required", () => {
    if (!configResult.ok) {
      throw new Error("config failed to load");
    }
    const result = evaluateLicenseCheck(
      { jobValueUsd: 500, needsPermit: true, hiresWorkers: false },
      configResult.value,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.outcome).toBe("license_required");
  });

  it("value 500 with workers -> license required", () => {
    if (!configResult.ok) {
      throw new Error("config failed to load");
    }
    const result = evaluateLicenseCheck(
      { jobValueUsd: 500, needsPermit: false, hiresWorkers: true },
      configResult.value,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.outcome).toBe("license_required");
  });
});
