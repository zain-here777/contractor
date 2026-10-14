import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  STAGING_NOINDEX_ATTR,
  STAGING_ROBOTS_DISALLOW,
} from "../src/lib/build-guard/production-readiness";

const repoRoot = join(import.meta.dirname, "..");
const distDir = join(repoRoot, "dist");

function runNpmScript(
  script: string,
  extraEnv: Record<string, string> = {},
): ReturnType<typeof spawnSync> {
  const env = { ...process.env, ...extraEnv };
  delete env.STRICT_PRODUCTION;
  return spawnSync("npm", ["run", script], {
    cwd: repoRoot,
    env,
    encoding: "utf8",
    shell: false,
  });
}

function distHasStagingArtifacts(): {
  htmlStagingMeta: boolean;
  robotsDisallow: boolean;
  headersNoindex: boolean;
} {
  const indexHtml = readFileSync(join(distDir, "index.html"), "utf8");
  const robots = readFileSync(join(distDir, "robots.txt"), "utf8");
  const headers = existsSync(join(distDir, "_headers"))
    ? readFileSync(join(distDir, "_headers"), "utf8")
    : "";
  return {
    htmlStagingMeta: indexHtml.includes(STAGING_NOINDEX_ATTR),
    robotsDisallow: robots.includes(STAGING_ROBOTS_DISALLOW),
    headersNoindex: /x-robots-tag:\s*noindex/i.test(headers),
  };
}

describe.sequential("staging build integration", () => {
  it("normal build leaves staging meta, robots.txt, and _headers intact", () => {
    const build = runNpmScript("build", {
      SITE_URL: "https://example.com",
    });
    expect(build.status).toBe(0);

    const staging = distHasStagingArtifacts();
    expect(staging.htmlStagingMeta).toBe(true);
    expect(staging.robotsDisallow).toBe(true);
    expect(staging.headersNoindex).toBe(true);
  }, 120_000);

  it("strict build with guard issues exits 1 and leaves dist fully noindex", () => {
    const build = runNpmScript("build:production", {
      SITE_URL: "https://example.com",
    });
    expect(build.status).toBe(1);
    expect(build.stderr ?? build.stdout).toMatch(
      /Production build is not ready/,
    );

    const staging = distHasStagingArtifacts();
    expect(staging.htmlStagingMeta).toBe(true);
    expect(staging.robotsDisallow).toBe(true);
    expect(staging.headersNoindex).toBe(true);
  }, 120_000);
});
