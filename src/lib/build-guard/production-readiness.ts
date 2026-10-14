export const PLACEHOLDER_SITE_URL = "https://example.com";

/** Attribute on staging-only `<meta name="robots">` tags (removed after strict finalize). */
export const STAGING_NOINDEX_ATTR = "data-build-staging-noindex";

export const STAGING_ROBOTS_DISALLOW = "Disallow: /";

export const STAGING_X_ROBOTS_HEADER = "X-Robots-Tag: noindex";

/** Stops at quotes, tags, or newlines so meta/JSON-LD matches stay readable. Case-insensitive. */
export const TODO_USER_PATTERN = /TODO\(user\):[^"<\n]*/gi;

export const SCANNABLE_DIST_EXTENSIONS = new Set([
  ".html",
  ".txt",
  ".xml",
  ".svg",
  ".json",
  ".webmanifest",
]);

export type DistTextFile = {
  /** Route for HTML (e.g. `/about/`) or relative path under `dist/` for other files. */
  label: string;
  relativePath: string;
  content: string;
  isHtml: boolean;
};

export type ProductionIssue =
  | { kind: "site_url"; message: string }
  | { kind: "todo"; page: string; match: string }
  | { kind: "placeholder_url"; page: string; match: string }
  | { kind: "placeholder_seo"; page: string; match: string };

/** @deprecated Use DistTextFile */
export type HtmlPage = DistTextFile;

const EXAMPLE_COM_PATTERN = /example\.com/i;

export function isStrictTruthyEnv(value: string | undefined): boolean {
  if (!value?.trim()) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

/** Strict production gate: CLI `--strict` or env `STRICT_PRODUCTION`. */
export function isStrictProductionBuild(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return argv.includes("--strict") || isStrictTruthyEnv(env.STRICT_PRODUCTION);
}

/** @deprecated Use isStrictProductionBuild */
export function isStrictFromArgv(argv: string[]): boolean {
  return isStrictProductionBuild(argv, {});
}

/** Map a path under `dist/` to a site route (for error messages). */
export function htmlPathToRoute(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized === "index.html") {
    return "/";
  }
  if (normalized === "404.html") {
    return "/404/";
  }
  if (normalized.endsWith("/index.html")) {
    return `/${normalized.slice(0, -"index.html".length)}`;
  }
  if (normalized.endsWith(".html")) {
    return `/${normalized}`;
  }
  return `/${normalized}`;
}

export function distRelativePathToLabel(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized.toLowerCase().endsWith(".html")) {
    return htmlPathToRoute(normalized);
  }
  return normalized;
}

export function isScannableDistFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".webmanifest")) {
    return true;
  }
  const dot = lower.lastIndexOf(".");
  if (dot === -1) {
    return false;
  }
  return SCANNABLE_DIST_EXTENSIONS.has(lower.slice(dot));
}

function normalizeTodoMatch(raw: string): string {
  const trimmed = raw.trim().replace(/\s*-->$/, "");
  return trimmed.replace(/^todo\(user\):/i, "TODO(user):");
}

export function findTodoUserMatches(content: string): string[] {
  const matches = [...content.matchAll(TODO_USER_PATTERN)].map((match) =>
    normalizeTodoMatch(match[0]),
  );
  return [...new Set(matches)];
}

export function findPlaceholderUrlIssues(
  html: string,
  page: string,
): ProductionIssue[] {
  const issues: ProductionIssue[] = [];

  const canonical =
    /rel=["']canonical["'][^>]*href=["']([^"']*example\.com[^"']*)["']/i.exec(
      html,
    ) ??
    /href=["']([^"']*example\.com[^"']*)["'][^>]*rel=["']canonical["']/i.exec(
      html,
    );
  if (canonical) {
    issues.push({
      kind: "placeholder_url",
      page,
      match: `canonical URL uses example.com (${canonical[1]})`,
    });
  }

  const ogImage =
    /property=["']og:image["'][^>]*content=["']([^"']*example\.com[^"']*)["']/i.exec(
      html,
    ) ??
    /content=["']([^"']*example\.com[^"']*)["'][^>]*property=["']og:image["']/i.exec(
      html,
    );
  if (ogImage) {
    issues.push({
      kind: "placeholder_url",
      page,
      match: `og:image URL uses example.com (${ogImage[1]})`,
    });
  }

  return issues;
}

function basenamePath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/");
  const slash = normalized.lastIndexOf("/");
  return slash === -1 ? normalized : normalized.slice(slash + 1);
}

export function isRobotsTxtPath(relativePath: string): boolean {
  return basenamePath(relativePath).toLowerCase() === "robots.txt";
}

export function isSitemapXmlPath(relativePath: string): boolean {
  const base = basenamePath(relativePath).toLowerCase();
  return base.startsWith("sitemap") && base.endsWith(".xml");
}

export function findPlaceholderSeoFileIssues(
  relativePath: string,
  content: string,
): ProductionIssue[] {
  if (!isRobotsTxtPath(relativePath) && !isSitemapXmlPath(relativePath)) {
    return [];
  }
  if (!EXAMPLE_COM_PATTERN.test(content)) {
    return [];
  }
  const label = distRelativePathToLabel(relativePath);
  return [
    {
      kind: "placeholder_seo",
      page: label,
      match: "file contains example.com (use SITE_URL at build time)",
    },
  ];
}

export function collectProductionIssues(
  siteUrl: string | undefined,
  files: DistTextFile[],
): ProductionIssue[] {
  const issues: ProductionIssue[] = [];
  const resolvedSiteUrl = siteUrl?.trim() || PLACEHOLDER_SITE_URL;

  if (resolvedSiteUrl === PLACEHOLDER_SITE_URL) {
    issues.push({
      kind: "site_url",
      message: `SITE_URL is still ${PLACEHOLDER_SITE_URL}. Set SITE_URL to your real domain at build time.`,
    });
  }

  for (const file of files) {
    for (const match of findTodoUserMatches(file.content)) {
      issues.push({ kind: "todo", page: file.label, match });
    }
    if (file.isHtml) {
      issues.push(...findPlaceholderUrlIssues(file.content, file.label));
    }
    issues.push(
      ...findPlaceholderSeoFileIssues(file.relativePath, file.content),
    );
  }

  return issues;
}

function appendIssueSection(
  lines: string[],
  title: string,
  items: ProductionIssue[],
  formatLine: (issue: ProductionIssue) => string,
): void {
  if (items.length === 0) {
    return;
  }
  if (lines.length > 2) {
    lines.push("");
  }
  lines.push(`- ${title}`);
  for (const issue of items) {
    lines.push(`  - ${formatLine(issue)}`);
  }
}

export function formatProductionIssues(issues: ProductionIssue[]): string {
  if (issues.length === 0) {
    return "";
  }

  const lines: string[] = ["Production build is not ready:", ""];

  const siteUrlIssues = issues.filter((issue) => issue.kind === "site_url");
  for (const issue of siteUrlIssues) {
    lines.push(`- ${issue.message}`);
  }

  appendIssueSection(
    lines,
    "TODO(user) found in built output:",
    issues.filter((issue) => issue.kind === "todo"),
    (issue) => `${issue.page} — ${issue.match}`,
  );

  appendIssueSection(
    lines,
    "Placeholder example.com URLs in HTML:",
    issues.filter((issue) => issue.kind === "placeholder_url"),
    (issue) => `${issue.page} — ${issue.match}`,
  );

  appendIssueSection(
    lines,
    "Placeholder example.com in robots.txt or sitemap:",
    issues.filter((issue) => issue.kind === "placeholder_seo"),
    (issue) => `${issue.page} — ${issue.match}`,
  );

  return lines.join("\n");
}

export function htmlHasStagingNoindexMeta(content: string): boolean {
  return content.includes(STAGING_NOINDEX_ATTR);
}

export function stripStagingNoindexMetaFromHtml(content: string): string {
  const tagPattern = /<meta\b[^>]*\bdata-build-staging-noindex\b[^>]*\/?>\s*/gi;
  return content.replace(tagPattern, "");
}

export function formatProductionRobotsTxt(siteUrl: string): string {
  const origin = siteUrl.replace(/\/+$/, "");
  return `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap-index.xml
`;
}

export type StagingArtifactCheck = {
  relativePath: string;
  message: string;
};

export function findStagingArtifactsInDist(
  files: DistTextFile[],
): StagingArtifactCheck[] {
  const found: StagingArtifactCheck[] = [];

  for (const file of files) {
    if (file.isHtml && htmlHasStagingNoindexMeta(file.content)) {
      found.push({
        relativePath: file.relativePath,
        message: `HTML still contains ${STAGING_NOINDEX_ATTR}`,
      });
    }
    if (isRobotsTxtPath(file.relativePath)) {
      if (file.content.includes(STAGING_ROBOTS_DISALLOW)) {
        found.push({
          relativePath: file.relativePath,
          message: "robots.txt still contains Disallow: /",
        });
      }
    }
    if (file.relativePath.replace(/\\/g, "/").toLowerCase() === "_headers") {
      if (/x-robots-tag:\s*noindex/i.test(file.content)) {
        found.push({
          relativePath: file.relativePath,
          message: "_headers still sets X-Robots-Tag: noindex",
        });
      }
    }
  }

  return found;
}

export function formatStagingArtifactFailures(
  checks: StagingArtifactCheck[],
): string {
  if (checks.length === 0) {
    return "";
  }
  const lines = [
    "Indexable build post-check failed (staging artifacts remain):",
    "",
  ];
  for (const check of checks) {
    lines.push(`- ${check.relativePath} — ${check.message}`);
  }
  return lines.join("\n");
}
