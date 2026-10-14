import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
import {
  collectProductionIssues,
  distRelativePathToLabel,
  findPlaceholderSeoFileIssues,
  findPlaceholderUrlIssues,
  findTodoUserMatches,
  formatProductionIssues,
  htmlPathToRoute,
  isScannableDistFile,
  isStrictProductionBuild,
  PLACEHOLDER_SITE_URL,
  stripStagingNoindexMetaFromHtml,
} from "../src/lib/build-guard/production-readiness";
import { finalizeIndexableDist } from "../scripts/finalize-indexable-build.ts";

const repoRoot = join(import.meta.dirname, "..");
const checkScript = join(repoRoot, "scripts", "check-production-build.ts");
const fixtureDist = join(
  repoRoot,
  "tests",
  "fixtures",
  "production-guard-dist",
);

function resetFixtureDist(): void {
  rmSync(fixtureDist, { recursive: true, force: true });
  mkdirSync(fixtureDist, { recursive: true });
}

function runCheck(
  extraArgs: string[] = [],
  env: Record<string, string | undefined> = {},
): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync(
    "node",
    ["--experimental-strip-types", checkScript, ...extraArgs],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        DIST_DIR: "tests/fixtures/production-guard-dist",
        ...env,
      },
      encoding: "utf8",
    },
  );
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

afterEach(() => {
  rmSync(fixtureDist, { recursive: true, force: true });
});

describe("production-readiness helpers", () => {
  it("maps dist paths to labels", () => {
    expect(htmlPathToRoute("about/index.html")).toBe("/about/");
    expect(distRelativePathToLabel("ads.txt")).toBe("ads.txt");
    expect(distRelativePathToLabel("sitemap-0.xml")).toBe("sitemap-0.xml");
  });

  it("recognizes scannable dist extensions", () => {
    expect(isScannableDistFile("index.html")).toBe(true);
    expect(isScannableDistFile("ads.txt")).toBe(true);
    expect(isScannableDistFile("og-default.svg")).toBe(true);
    expect(isScannableDistFile("site.webmanifest")).toBe(true);
    expect(isScannableDistFile("pagefind.js")).toBe(false);
  });

  it("finds TODO(user) case-insensitively", () => {
    const matches = findTodoUserMatches(
      "<p>todo(user): fill this in</p><!-- TODO(user): logo -->",
    );
    expect(matches).toContain("TODO(user): fill this in");
    expect(matches).toContain("TODO(user): logo");
  });

  it("flags example.com in canonical and og:image", () => {
    const html = `<head>
      <link rel="canonical" href="https://example.com/about/">
      <meta property="og:image" content="https://example.com/og-default.svg">
    </head>`;
    const issues = findPlaceholderUrlIssues(html, "/about/");
    expect(issues).toHaveLength(2);
    expect(issues[0]?.match).toContain("canonical");
    expect(issues[1]?.match).toContain("og:image");
  });

  it("flags example.com in robots.txt and sitemap XML", () => {
    const robotsIssues = findPlaceholderSeoFileIssues(
      "robots.txt",
      "Sitemap: https://example.com/sitemap-index.xml\n",
    );
    expect(robotsIssues).toHaveLength(1);
    expect(robotsIssues[0]?.kind).toBe("placeholder_seo");

    const sitemapIssues = findPlaceholderSeoFileIssues(
      "sitemap-0.xml",
      "<loc>https://example.com/about/</loc>",
    );
    expect(sitemapIssues).toHaveLength(1);
  });

  it("formats issues with each page and match", () => {
    const text = formatProductionIssues([
      {
        kind: "site_url",
        message: `SITE_URL is still ${PLACEHOLDER_SITE_URL}.`,
      },
      {
        kind: "todo",
        page: "ads.txt",
        match: "TODO(user): ads placeholder",
      },
      {
        kind: "placeholder_url",
        page: "/",
        match: "canonical URL uses example.com (https://example.com/)",
      },
      {
        kind: "placeholder_seo",
        page: "robots.txt",
        match: "file contains example.com",
      },
    ]);
    expect(text).toContain("ads.txt");
    expect(text).toContain("Placeholder example.com URLs");
    expect(text).toContain("Placeholder example.com in robots.txt or sitemap");
  });

  it("detects strict mode from argv or STRICT_PRODUCTION", () => {
    expect(isStrictProductionBuild(["node", "script.ts"], {})).toBe(false);
    expect(isStrictProductionBuild(["node", "script.ts", "--strict"], {})).toBe(
      true,
    );
    expect(
      isStrictProductionBuild(["node", "script.ts"], {
        STRICT_PRODUCTION: "1",
      }),
    ).toBe(true);
    expect(
      isStrictProductionBuild(["node", "script.ts"], {
        STRICT_PRODUCTION: "yes",
      }),
    ).toBe(true);
  });

  it("collects SITE_URL and TODO issues from multiple file types", () => {
    const issues = collectProductionIssues("https://real.example", [
      {
        label: "/about/",
        relativePath: "about/index.html",
        content: "<p>TODO(user): about copy</p>",
        isHtml: true,
      },
      {
        label: "ads.txt",
        relativePath: "ads.txt",
        content: "todo(user): line in ads file",
        isHtml: false,
      },
    ]);
    expect(issues.some((issue) => issue.kind === "site_url")).toBe(false);
    expect(
      issues.some((issue) => issue.kind === "todo" && issue.page === "ads.txt"),
    ).toBe(true);
  });

  it("strips staging noindex meta by attribute", () => {
    const html = `<head>
<meta name="robots" content="noindex, nofollow" data-build-staging-noindex />
<title>Test</title>
</head>`;
    const stripped = stripStagingNoindexMetaFromHtml(html);
    expect(stripped).not.toContain("data-build-staging-noindex");
    expect(stripped).toContain("<title>Test</title>");
  });
});

describe("finalizeIndexableDist (fixture dist)", () => {
  it("refuses to run when the guard reports issues", () => {
    resetFixtureDist();
    const indexPath = join(fixtureDist, "index.html");
    writeFileSync(
      indexPath,
      '<html><head><meta name="robots" content="noindex, nofollow" data-build-staging-noindex /></head><body>TODO(user): x</body></html>',
    );
    writeFileSync(join(fixtureDist, "robots.txt"), "Disallow: /\n");
    writeFileSync(
      join(fixtureDist, "_headers"),
      "/*\n  X-Robots-Tag: noindex\n",
    );

    const indexContent = readFileSync(indexPath, "utf8");
    const result = finalizeIndexableDist(fixtureDist, "https://live.example", [
      {
        label: "/",
        relativePath: "index.html",
        content: indexContent,
        isHtml: true,
      },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("Refusing to finalize");
    }
  });

  it("removes staging artifacts and passes post-check on a clean fixture", () => {
    resetFixtureDist();
    writeFileSync(
      join(fixtureDist, "index.html"),
      `<html><head><meta name="robots" content="noindex, nofollow" data-build-staging-noindex />
<link rel="canonical" href="https://live.example/"></head><body>ok</body></html>`,
    );
    writeFileSync(join(fixtureDist, "robots.txt"), "Disallow: /\n");
    writeFileSync(
      join(fixtureDist, "_headers"),
      "/*\n  X-Robots-Tag: noindex\n",
    );
    writeFileSync(
      join(fixtureDist, "sitemap-0.xml"),
      "<urlset><url><loc>https://live.example/</loc></url></urlset>",
    );

    const files = [
      {
        label: "/",
        relativePath: "index.html",
        content: readFileSync(join(fixtureDist, "index.html"), "utf8"),
        isHtml: true,
      },
      {
        label: "robots.txt",
        relativePath: "robots.txt",
        content: readFileSync(join(fixtureDist, "robots.txt"), "utf8"),
        isHtml: false,
      },
      {
        label: "sitemap-0.xml",
        relativePath: "sitemap-0.xml",
        content: readFileSync(join(fixtureDist, "sitemap-0.xml"), "utf8"),
        isHtml: false,
      },
    ];

    const result = finalizeIndexableDist(
      fixtureDist,
      "https://live.example",
      files,
    );
    expect(result.ok).toBe(true);

    const indexAfter = readFileSync(join(fixtureDist, "index.html"), "utf8");
    const robotsAfter = readFileSync(join(fixtureDist, "robots.txt"), "utf8");
    const headersAfter = readFileSync(join(fixtureDist, "_headers"), "utf8");

    expect(indexAfter).not.toContain("data-build-staging-noindex");
    expect(robotsAfter).toContain("Allow: /");
    expect(robotsAfter).not.toContain("Disallow: /");
    expect(headersAfter.toLowerCase()).not.toMatch(/x-robots-tag:\s*noindex/);
  });
});

describe("check-production-build CLI (fixture dist only)", () => {
  it("warns but exits 0 without strict mode", () => {
    resetFixtureDist();
    writeFileSync(
      join(fixtureDist, "index.html"),
      "<html><body><p>todo(user): visible</p></body></html>",
    );

    const result = runCheck([], { SITE_URL: PLACEHOLDER_SITE_URL });

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("development mode");
    expect(result.stderr).toContain("/");
    expect(result.stderr).toContain("TODO(user): visible");
  });

  it("exits 1 with --strict when TODO(user) is present", () => {
    resetFixtureDist();
    mkdirSync(join(fixtureDist, "about"), { recursive: true });
    writeFileSync(
      join(fixtureDist, "about", "index.html"),
      "<html><body><p>TODO(user): about copy</p></body></html>",
    );

    const result = runCheck(["--strict"], { SITE_URL: PLACEHOLDER_SITE_URL });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Production build is not ready");
    expect(result.stderr).toMatch(/\/about\//);
    expect(result.stderr).toContain("TODO(user): about copy");
  });

  it("exits 1 with STRICT_PRODUCTION=1 when TODO(user) is present", () => {
    resetFixtureDist();
    writeFileSync(
      join(fixtureDist, "index.html"),
      "<html><body><p>TODO(user): visible</p></body></html>",
    );

    const result = runCheck([], {
      SITE_URL: PLACEHOLDER_SITE_URL,
      STRICT_PRODUCTION: "1",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Production build is not ready");
  });

  it("scans txt and svg fixtures and flags placeholder URLs in HTML", () => {
    resetFixtureDist();
    writeFileSync(join(fixtureDist, "ads.txt"), "todo(user): ads line\n");
    writeFileSync(
      join(fixtureDist, "og-default.svg"),
      "<svg><!-- todo(user): replace image --></svg>",
    );
    writeFileSync(
      join(fixtureDist, "index.html"),
      `<html><head>
        <link rel="canonical" href="https://example.com/">
        <meta property="og:image" content="https://example.com/og-default.svg">
      </head><body></body></html>`,
    );

    const result = runCheck(["--strict"], { SITE_URL: PLACEHOLDER_SITE_URL });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("ads.txt");
    expect(result.stderr).toContain("og-default.svg");
    expect(result.stderr).toContain("canonical URL uses example.com");
    expect(result.stderr).toContain("og:image URL uses example.com");
  });

  it("flags example.com in robots.txt under --strict", () => {
    resetFixtureDist();
    writeFileSync(
      join(fixtureDist, "index.html"),
      `<html><head>
        <link rel="canonical" href="https://live.example/">
      </head><body>ok</body></html>`,
    );
    writeFileSync(
      join(fixtureDist, "robots.txt"),
      "Sitemap: https://example.com/sitemap-index.xml\n",
    );

    const result = runCheck(["--strict"], { SITE_URL: "https://live.example" });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("robots.txt");
    expect(result.stderr).toContain("example.com");
  });
});
