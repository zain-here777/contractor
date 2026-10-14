import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, beforeAll } from "vitest";
import { factNeedsConfirmation, formatFactValue } from "../src/lib/format-fact";
import {
  getSectionSources,
  getStateSlugs,
  loadStateYaml,
} from "../src/lib/state-data/load-states";
import { sectionToFactRows } from "../src/lib/state-data/section-rows";
import { buildAtAGlanceItems } from "../src/lib/state-data/at-a-glance";
import { buildVerifiedSummary } from "../src/lib/state-data/summary";
import { STATE_PAGE_SECTIONS } from "../src/lib/state-data/state-page-sections";
import {
  applyFloridaFactRowRules,
  floridaFeeSectionOmitKeys,
  resolveStatePageSections,
} from "../src/lib/state-data/state-display";

const repoRoot = join(import.meta.dirname, "..");
const statesDir = join(repoRoot, "data", "states");
const california = loadStateYaml(statesDir, "california");
const florida = loadStateYaml(statesDir, "florida");
const texas = loadStateYaml(statesDir, "texas");

const FLORIDA_FORBIDDEN_IN_HTML = [
  "$335",
  "$250",
  "$150",
  "$349",
  "$2,500",
  "$249",
  "$295",
  "Pearson",
  "Professional Testing",
];

describe("buildAtAGlanceItems", () => {
  it("shows primary scalar facts from california.yaml", () => {
    const items = buildAtAGlanceItems(california);
    const threshold = items.find((item) =>
      item.label.includes("License required when"),
    );
    expect(threshold?.display).toContain("1,000");
    const fee = items.find((item) => item.label.includes("Application fee"));
    expect(fee?.display).toBe("$450");
    const bond = items.find((item) => item.label.includes("Contractor bond"));
    expect(bond?.display).toBe("$25,000");
  });

  it("uses Needs confirmation for confirm-only nested fees", () => {
    const feesOnly = {
      fees_usd: california.fees_usd,
    };
    const items = buildAtAGlanceItems(feesOnly);
    const fee = items.find((item) => item.label.includes("Application fee"));
    expect(fee?.display).toBe("$450");

    const glanceFromEmpty = buildAtAGlanceItems({});
    expect(
      glanceFromEmpty.every((item) => item.display === "Needs confirmation"),
    ).toBe(true);
  });
});

describe("buildVerifiedSummary", () => {
  it("uses only primary verified fields from the YAML", () => {
    const bullets = buildVerifiedSummary(california);
    expect(bullets.length).toBeGreaterThan(0);
    expect(bullets.some((line) => line.includes("1000"))).toBe(true);
    expect(bullets.some((line) => line.includes("CSLB"))).toBe(true);
  });
});

describe("sectionToFactRows for california.yaml", () => {
  it("marks confirm and null leaf values as needing confirmation", () => {
    const fees = california.fees_usd as Record<string, unknown>;
    const rows = sectionToFactRows(fees);
    const doj = rows.find((row) =>
      row.label.toLowerCase().includes("doj fingerprint"),
    );
    expect(doj).toBeDefined();
    expect(formatFactValue(doj!)).toBe("Needs confirmation");
  });

  it("shows primary scalar fees from the data file", () => {
    const fees = california.fees_usd as Record<string, unknown>;
    const rows = sectionToFactRows(fees);
    const application = rows.find((row) =>
      row.label.toLowerCase().includes("application fee"),
    );
    expect(application?.value).toBe(450);
    expect(factNeedsConfirmation(application!)).toBe(false);
  });

  it("never treats confirm-only exam fees as published numbers", () => {
    const exams = california.exams as Record<string, unknown>;
    const rows = sectionToFactRows(exams);
    const psiFee = rows.find((row) => row.label.toLowerCase().includes("psi"));
    expect(psiFee).toBeDefined();
    expect(formatFactValue(psiFee!)).toBe("Needs confirmation");
  });

  it("includes a row for every T4 section in california data", () => {
    for (const { key } of STATE_PAGE_SECTIONS) {
      const section = california[key];
      expect(section, `missing section ${key}`).toBeTruthy();
      const rows = sectionToFactRows(section as Record<string, unknown>);
      expect(rows.length).toBeGreaterThan(0);
    }
  });

  it("gives every T4 section official https sources", () => {
    for (const { key } of STATE_PAGE_SECTIONS) {
      const section = california[key] as Record<string, unknown>;
      const sources = getSectionSources(section);
      expect(sources.length, key).toBeGreaterThan(0);
      expect(sources.every((url) => url.startsWith("https://"))).toBe(true);
    }
  });

  it("never formats confirm or null rows as numeric facts", () => {
    for (const { key } of STATE_PAGE_SECTIONS) {
      const rows = sectionToFactRows(
        california[key] as Record<string, unknown>,
      );
      for (const row of rows) {
        if (factNeedsConfirmation(row)) {
          expect(formatFactValue(row)).toBe("Needs confirmation");
        }
      }
    }
  });
});

describe("florida.yaml partial draft (data layer)", () => {
  it("lists California, Florida and Texas in state data slugs", () => {
    expect(getStateSlugs(statesDir)).toEqual([
      "california",
      "florida",
      "texas",
    ]);
  });

  it("at-a-glance shows primary qualifier facts", () => {
    const items = buildAtAGlanceItems(florida, "florida");
    const minAge = items.find((i) => i.label.includes("Minimum qualifier age"));
    expect(minAge?.display).toBe("18");
    const experience = items.find((i) =>
      i.label.includes("Experience options"),
    );
    expect(experience?.display).toContain("Option 1");
    const certified = items.find((i) => i.label.includes("Certified"));
    expect(certified?.display).toContain("Statewide");
  });

  it("marks non-primary qualifier fields as Needs confirmation on display", () => {
    const section = florida.qualifier_requirements as Record<string, unknown>;
    const rows = sectionToFactRows(section);
    const adjusted = applyFloridaFactRowRules("qualifier_requirements", rows);
    const moral = adjusted.find((r) => r.fieldKey === "good_moral_character");
    expect(formatFactValue(moral!)).toBe("Needs confirmation");
    const experience = adjusted.find(
      (r) => r.fieldKey === "experience_options",
    );
    expect(formatFactValue(experience!)).toContain("Option 1");
  });

  it("resolves page sections without known_conflicts_on_secondary_sites", () => {
    const sections = resolveStatePageSections("florida", florida);
    expect(
      sections.some((s) => s.key === "known_conflicts_on_secondary_sites"),
    ).toBe(false);
    expect(sections.some((s) => s.key === "license_types")).toBe(true);
  });

  it("omits fee draft leaves that must not appear in HTML", () => {
    const fees = florida.fees_usd as Record<string, unknown>;
    const omit = floridaFeeSectionOmitKeys("fees_usd");
    const rows = applyFloridaFactRowRules(
      "fees_usd",
      sectionToFactRows(fees, { omitKeys: omit }),
      { omitKeys: omit },
    );
    expect(rows.some((r) => r.fieldKey === "statutory_maximums_seen")).toBe(
      false,
    );
    expect(rows.every((r) => formatFactValue(r) === "Needs confirmation")).toBe(
      true,
    );
  });
});

describe("florida licensing page (built HTML)", () => {
  beforeAll(() => {
    execSync("npm run build", {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, SITE_URL: "https://example.com" },
    });
  }, 120_000);

  it("includes minimum age and experience options", () => {
    const html = readFileSync(
      join(repoRoot, "dist", "licensing", "florida", "index.html"),
      "utf8",
    );
    expect(html).toContain("Minimum qualifier age");
    expect(html).toContain("18");
    expect(html).toContain("Experience options");
    expect(html).toContain("Option 1");
    expect(html).toContain("Partial draft");
    expect(html).toContain("Not yet expert-reviewed");
    expect(html).not.toContain("Verified from official source");
  });

  it("does not publish secondary-site dollar amounts or exam provider names", () => {
    const html = readFileSync(
      join(repoRoot, "dist", "licensing", "florida", "index.html"),
      "utf8",
    );
    for (const fragment of FLORIDA_FORBIDDEN_IN_HTML) {
      expect(html).not.toContain(fragment);
    }
  });

  it("renders Needs confirmation for confirm-only sections", () => {
    const html = readFileSync(
      join(repoRoot, "dist", "licensing", "florida", "index.html"),
      "utf8",
    );
    for (const { key, anchorId } of STATE_PAGE_SECTIONS) {
      const section = florida[key] as { confidence?: string } | undefined;
      if (!section) {
        continue;
      }
      const isConfirmSection = section.confidence === "confirm";
      const isNestedFeeSection = key === "fees_usd";
      if (!isConfirmSection && !isNestedFeeSection) {
        continue;
      }
      const chunk = html.split(`id="${anchorId}"`)[1]?.slice(0, 5000) ?? "";
      expect(chunk, anchorId).toContain("Needs confirmation");
    }
  });

  it("shows California sourced status and primary fee facts without Verified badge", () => {
    const html = readFileSync(
      join(repoRoot, "dist", "licensing", "california", "index.html"),
      "utf8",
    );
    expect(html).toContain("Sourced from official CSLB pages");
    expect(html).toContain("Not yet expert-reviewed");
    expect(html).not.toContain("Verified from official source");
    expect(html).toContain("$450");
    expect(html).toContain("1,000");
  });

  it("shows statute edition in Florida SourceBox titles when sources include a year", () => {
    const html = readFileSync(
      join(repoRoot, "dist", "licensing", "florida", "index.html"),
      "utf8",
    );
    expect(html).toContain("Florida Statutes, 2024 edition");
  });
});

const TEXAS_FORBIDDEN_IN_HTML = [
  "$78",
  "PSI",
  "third-party",
  "no statewide general",
  "$175",
  "$110",
];

describe("texas.yaml partial draft (data layer)", () => {
  it("uses trade-specific page sections instead of the default T4-only layout", () => {
    const sections = resolveStatePageSections("texas", texas);
    expect(
      sections.some((s) => s.key === "electricians_experience_and_fees"),
    ).toBe(true);
    expect(sections.some((s) => s.key === "qualifier_requirements")).toBe(
      false,
    );
  });

  it("at-a-glance shows primary trade facts and Needs confirmation for statewide GC", () => {
    const items = buildAtAGlanceItems(texas, "texas");
    const je = items.find((i) => i.label.includes("Journeyman electrician"));
    expect(je?.display).toContain("7,000");
    const master = items.find((i) => i.label.includes("Master electrician"));
    expect(master?.display).toContain("12,000");
    const jp = items.find((i) => i.label.includes("Journeyman plumber"));
    expect(jp?.display).toContain("8,000");
    const gc = items.find((i) =>
      i.label.includes("Statewide general-contractor"),
    );
    expect(gc?.display).toBe("Needs confirmation");
  });
});

describe("texas licensing page (built HTML)", () => {
  it("includes confirmed hours and fees from trade sections", () => {
    const html = readFileSync(
      join(repoRoot, "dist", "licensing", "texas", "index.html"),
      "utf8",
    );
    expect(html).toContain("7,000");
    expect(html).toContain("8,000");
    expect(html).toContain("12,000");
    expect(html).toContain("$30");
    expect(html).toContain("$45");
    expect(html).toContain("$40");
    expect(html).toContain("$36");
    expect(html).toContain("Fees as of");
    expect(html).toContain("2026-10-11");
    expect(html).toContain("Partial draft");
    expect(html).toContain("Not yet expert-reviewed");
  });

  it("does not publish confirm-only draft text", () => {
    const html = readFileSync(
      join(repoRoot, "dist", "licensing", "texas", "index.html"),
      "utf8",
    );
    for (const fragment of TEXAS_FORBIDDEN_IN_HTML) {
      expect(html.toLowerCase()).not.toContain(fragment.toLowerCase());
    }
  });

  it("renders Needs confirmation in confirm sections", () => {
    const html = readFileSync(
      join(repoRoot, "dist", "licensing", "texas", "index.html"),
      "utf8",
    );
    for (const anchorId of [
      "licensing-structure",
      "electricians-exam-and-renewal",
      "plumbers-not-yet-confirmed",
      "license-required",
    ]) {
      const chunk = html.split(`id="${anchorId}"`)[1]?.slice(0, 5000) ?? "";
      expect(chunk, anchorId).toContain("Needs confirmation");
    }
  });
});
