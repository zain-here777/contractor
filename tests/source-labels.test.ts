import { describe, expect, it } from "vitest";
import {
  buildSourceBoxTitle,
  formatSourceLinkLabel,
  statuteEditionHintFromUrl,
} from "../src/lib/state-data/source-labels";

describe("source-labels", () => {
  it("derives Florida Statutes edition from flsenate.gov URLs", () => {
    const hint = statuteEditionHintFromUrl(
      "https://www.flsenate.gov/Laws/Statutes/2024/489.111",
    );
    expect(hint).toContain("Florida Statutes, 2024 edition");
    expect(hint).toContain("Check for newer amendments");
  });

  it("labels PDF sources with a readable title", () => {
    const label = formatSourceLinkLabel(
      "https://www.cslb.ca.gov/Resources/GuidesAndPublications/GetLicensedToBuild_ENG0525_ADA.pdf",
    );
    expect(label).toContain("Get Licensed To Build");
    expect(label).toContain("(PDF)");
  });

  it("labels Florida Statute URLs with section reference", () => {
    const label = formatSourceLinkLabel(
      "https://www.flsenate.gov/Laws/Statutes/2024/489.111",
    );
    expect(label).toBe("Florida Statutes § 489.111 (2024)");
  });

  it("adds edition hint to SourceBox title when a source URL has a year", () => {
    const title = buildSourceBoxTitle("Experience and qualifier requirements", [
      "https://www.flsenate.gov/Laws/Statutes/2024/489.111",
    ]);
    expect(title).toContain("Sources: Experience and qualifier requirements");
    expect(title).toContain("Florida Statutes, 2024 edition");
  });
});
