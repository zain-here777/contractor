import { afterEach, describe, expect, it } from "vitest";
import { createSitemapPageFilter } from "../src/config/sitemap";
import {
  shouldIndexStateLicensingPage,
  shouldNoindexStateLicensingPage,
} from "../src/config/state-licensing";

const ORIGINAL_STRICT = process.env.STRICT_PRODUCTION;

afterEach(() => {
  if (ORIGINAL_STRICT === undefined) {
    delete process.env.STRICT_PRODUCTION;
  } else {
    process.env.STRICT_PRODUCTION = ORIGINAL_STRICT;
  }
});

describe("state licensing indexability", () => {
  it("includes all state pages in sitemap on staging builds", () => {
    delete process.env.STRICT_PRODUCTION;
    const filter = createSitemapPageFilter();
    expect(filter("https://example.com/licensing/florida/")).toBe(true);
    expect(filter("https://example.com/licensing/california/")).toBe(true);
  });

  it("excludes non-indexable states from sitemap in production indexable builds", () => {
    process.env.STRICT_PRODUCTION = "1";
    const filter = createSitemapPageFilter();
    expect(filter("https://example.com/licensing/florida/")).toBe(false);
    expect(filter("https://example.com/licensing/california/")).toBe(true);
    expect(filter("https://example.com/licensing/")).toBe(true);
  });

  it("requests page-level noindex only for non-indexable states in production", () => {
    delete process.env.STRICT_PRODUCTION;
    expect(shouldNoindexStateLicensingPage("florida")).toBe(false);
    expect(shouldNoindexStateLicensingPage("california")).toBe(false);

    process.env.STRICT_PRODUCTION = "1";
    expect(shouldNoindexStateLicensingPage("florida")).toBe(true);
    expect(shouldNoindexStateLicensingPage("california")).toBe(false);
    expect(shouldIndexStateLicensingPage("california")).toBe(true);
    expect(shouldIndexStateLicensingPage("florida")).toBe(false);
  });
});
