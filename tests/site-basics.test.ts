import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, beforeAll } from "vitest";

const repoRoot = join(import.meta.dirname, "..");

/** Public routes that should appear in the sitemap (dev pages excluded). */
const EXPECTED_SITEMAP_PATHS = [
  "/",
  "/licensing/",
  "/licensing/california/",
  "/licensing/florida/",
  "/licensing/texas/",
  "/tools/",
  "/tools/break-even-calculator/",
  "/tools/daily-rate-calculator/",
  "/tools/do-i-need-a-license/",
  "/tools/hourly-rate-calculator/",
  "/tools/job-profit-calculator/",
  "/tools/markup-margin-calculator/",
  "/tools/material-waste-calculator/",
  "/tools/overhead-rate-calculator/",
  "/tools/simple-calculator/",
  "/search/",
  "/about/",
  "/methodology/",
  "/editorial-standards/",
  "/corrections/",
  "/privacy/",
  "/terms/",
  "/contact/",
];

describe("T8 site basics (after production build)", () => {
  beforeAll(() => {
    execSync("npm run build", {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, SITE_URL: "https://example.com" },
    });
  }, 120_000);

  it("builds a home page with hero, doors, and calculator links", () => {
    const home = readFileSync(join(repoRoot, "dist", "index.html"), "utf8");
    expect(home).toContain(
      "Clear, sourced answers on U.S. contractor licensing",
    );
    expect(home).toContain("California licensing overview is available now");
    expect(home).toContain("Florida is a partial draft");
    expect(home).toContain("Coming soon");
    expect(home).toContain('href="/tools/do-i-need-a-license/"');
    expect(home).toContain('href="/tools/markup-margin-calculator/"');
    expect(home).toContain('href="/methodology/"');
  });

  it("does not link to the dev component gallery from public nav", () => {
    const home = readFileSync(join(repoRoot, "dist", "index.html"), "utf8");
    expect(home).not.toContain("Component test");
    expect(home).not.toContain('href="/dev/trust-components/"');
  });

  it("marks the dev trust gallery as noindex", () => {
    const devPage = join(
      repoRoot,
      "dist",
      "dev",
      "trust-components",
      "index.html",
    );
    expect(existsSync(devPage)).toBe(true);
    const html = readFileSync(devPage, "utf8");
    expect(html.toLowerCase()).toContain(
      'name="robots" content="noindex, nofollow"',
    );
  });

  it("writes sitemap with all public pages", () => {
    const sitemapPath = join(repoRoot, "dist", "sitemap-0.xml");
    expect(existsSync(sitemapPath)).toBe(true);
    const xml = readFileSync(sitemapPath, "utf8");
    for (const path of EXPECTED_SITEMAP_PATHS) {
      expect(xml).toContain(`https://example.com${path}`);
    }
    expect(xml).not.toContain("/dev/trust-components/");
  });

  it("writes staging-safe robots.txt after a normal build", () => {
    const robotsPath = join(repoRoot, "dist", "robots.txt");
    expect(existsSync(robotsPath)).toBe(true);
    const robots = readFileSync(robotsPath, "utf8");
    expect(robots).toContain("Disallow: /");
    expect(robots.toLowerCase()).not.toContain("sitemap:");
  });

  it("ships staging noindex meta and _headers on a normal build", () => {
    const home = readFileSync(join(repoRoot, "dist", "index.html"), "utf8");
    expect(home).toContain("data-build-staging-noindex");
    const headersPath = join(repoRoot, "dist", "_headers");
    expect(existsSync(headersPath)).toBe(true);
    expect(readFileSync(headersPath, "utf8").toLowerCase()).toMatch(
      /x-robots-tag:\s*noindex/,
    );
  });

  it("copies ads.txt placeholder to dist", () => {
    const adsPath = join(repoRoot, "dist", "ads.txt");
    expect(existsSync(adsPath)).toBe(true);
    expect(readFileSync(adsPath, "utf8")).toContain("TODO(user)");
  });

  it("indexes content with Pagefind", () => {
    const pagefindDir = join(repoRoot, "dist", "pagefind");
    expect(existsSync(pagefindDir)).toBe(true);
  });

  it("builds a 404 page", () => {
    expect(existsSync(join(repoRoot, "dist", "404.html"))).toBe(true);
  });

  it("ships favicon and default Open Graph placeholder assets", () => {
    expect(existsSync(join(repoRoot, "dist", "favicon.svg"))).toBe(true);
    expect(existsSync(join(repoRoot, "dist", "og-default.svg"))).toBe(true);
    const home = readFileSync(join(repoRoot, "dist", "index.html"), "utf8");
    expect(home).toContain('rel="icon"');
    expect(home).toContain("/favicon.svg");
    expect(home).toContain('property="og:image"');
    expect(home).toContain("/og-default.svg");
  });

  it("marks the 404 page as noindex", () => {
    const html = readFileSync(join(repoRoot, "dist", "404.html"), "utf8");
    expect(html.toLowerCase()).toContain(
      'name="robots" content="noindex, nofollow"',
    );
  });

  it("uses prose-site on trust pages", () => {
    const about = readFileSync(
      join(repoRoot, "dist", "about", "index.html"),
      "utf8",
    );
    expect(about).toContain("prose-site");
  });

  it("has no broken internal links in dist", () => {
    execSync("npm run check:links", {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });
  });
});
