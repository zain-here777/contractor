import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import {
  formatValidationMessages,
  validateStateDocument,
  validateStateFile,
} from "../src/lib/validate-state-data";

const fixturesDir = join(import.meta.dirname, "fixtures", "validation");
const repoRoot = join(import.meta.dirname, "..");

function loadFixture(name: string): unknown {
  const raw = readFileSync(join(fixturesDir, name), "utf8");
  return parseYaml(raw);
}

function validateFixture(name: string) {
  return validateStateDocument(name, loadFixture(name));
}

const failureFixtures: [string, string][] = [
  ["missing-source.yaml", "no source URL"],
  ["bad-url.yaml", "valid https URL"],
  ["empty-sources.yaml", "no source URL"],
  ["bad-source-in-sources-array.yaml", "valid https URL"],
  ["bad-nested-source.yaml", "valid https URL"],
  ["missing-verified-on.yaml", "missing verified_on"],
  ["invalid-verified-on.yaml", "invalid verified_on"],
  ["future-verified-on.yaml", "in the future"],
  ["missing-confidence.yaml", "missing confidence"],
  ["invalid-confidence.yaml", 'confidence must be "primary" or "confirm"'],
];

describe("validate-state-data failure fixtures", () => {
  it("fails when the state file name is not lowercase hyphenated", () => {
    const result = validateStateDocument(
      "Bad_State.yaml",
      loadFixture("missing-source.yaml"),
    );
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]?.problem).toContain("lowercase hyphenated");
  });
  it.each(failureFixtures)(
    "%s fails validation",
    (fixture, problemFragment) => {
      const result = validateFixture(fixture);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some((e) => e.problem.includes(problemFragment)),
      ).toBe(true);
    },
  );
});

describe("validate-state-data passing fixtures", () => {
  it("accepts nested { value: null, confidence: confirm } when the section has sources", () => {
    const result = validateFixture("valid-nested-confirm.yaml");
    expect(result.errors).toEqual([]);
  });

  it("accepts a fees section whose only children are nested fact leaves (no section-level confidence)", () => {
    const result = validateFixture("valid-nested-fee-container.yaml");
    expect(result.errors).toEqual([]);
  });

  it("warns when verified_on is older than 180 days (does not fail)", () => {
    const result = validateFixture("stale-verified-on.yaml");
    expect(result.errors).toHaveLength(0);
    expect(
      result.warnings.some((w) => w.problem.includes("older than 180 days")),
    ).toBe(true);
  });
});

describe("message format", () => {
  it("includes file, section, and problem in each line", () => {
    const result = validateFixture("missing-source.yaml");
    const lines = formatValidationMessages(result.errors);
    expect(lines[0]).toMatch(/^missing-source\.yaml → sample_section: /);
    expect(lines[0]).toContain("no source URL");
  });
});

describe("california.yaml", () => {
  it("passes validation (section sources and nested confirm leaves)", () => {
    const result = validateStateFile(
      join(repoRoot, "data", "states", "california.yaml"),
    );
    expect(result.errors).toEqual([]);
  });
});

describe("florida.yaml", () => {
  it("passes validation as a partial draft with nested fee leaves", () => {
    const result = validateStateFile(
      join(repoRoot, "data", "states", "florida.yaml"),
    );
    expect(result.errors).toEqual([]);
  });
});

describe("texas.yaml", () => {
  it("passes validation as a partial draft with trade-specific sections", () => {
    const result = validateStateFile(
      join(repoRoot, "data", "states", "texas.yaml"),
    );
    expect(result.errors).toEqual([]);
  });
});

describe("validate:data CLI", () => {
  it("exits 0 when real state data passes", () => {
    expect(() =>
      execSync("npm run validate:data", {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }),
    ).not.toThrow();
  });
});
