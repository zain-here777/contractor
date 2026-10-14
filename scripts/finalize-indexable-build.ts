import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectProductionIssues,
  distRelativePathToLabel,
  findStagingArtifactsInDist,
  formatProductionIssues,
  formatProductionRobotsTxt,
  formatStagingArtifactFailures,
  isScannableDistFile,
  PLACEHOLDER_SITE_URL,
  stripStagingNoindexMetaFromHtml,
  type DistTextFile,
} from "../src/lib/build-guard/production-readiness.ts";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const distDir = process.env.DIST_DIR?.trim()
  ? join(root, process.env.DIST_DIR.trim())
  : join(root, "dist");

function walkDistTextFiles(dir: string, baseDir = dir): DistTextFile[] {
  const files: DistTextFile[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...walkDistTextFiles(fullPath, baseDir));
      continue;
    }
    const relative = fullPath.slice(baseDir.length + 1);
    const normalized = relative.replace(/\\/g, "/");
    const lower = normalized.toLowerCase();
    const isHtml = lower.endsWith(".html");
    const scannable = isScannableDistFile(entry) || lower === "_headers";
    if (!scannable) {
      continue;
    }
    files.push({
      label: distRelativePathToLabel(normalized),
      relativePath: normalized,
      content: readFileSync(fullPath, "utf8"),
      isHtml,
    });
  }
  return files;
}

function walkHtmlFiles(
  dir: string,
  baseDir = dir,
): { relativePath: string; fullPath: string }[] {
  const htmlFiles: { relativePath: string; fullPath: string }[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      htmlFiles.push(...walkHtmlFiles(fullPath, baseDir));
      continue;
    }
    if (!entry.toLowerCase().endsWith(".html")) {
      continue;
    }
    const relative = fullPath.slice(baseDir.length + 1).replace(/\\/g, "/");
    htmlFiles.push({ relativePath: relative, fullPath });
  }
  return htmlFiles;
}

export function finalizeIndexableDist(
  distDirectory: string,
  siteUrl: string,
  filesForGuard: DistTextFile[],
): { ok: true } | { ok: false; message: string } {
  const guardIssues = collectProductionIssues(siteUrl, filesForGuard);
  if (guardIssues.length > 0) {
    return {
      ok: false,
      message: `Refusing to finalize: production guard reported issues.\n${formatProductionIssues(guardIssues)}`,
    };
  }

  const resolvedSiteUrl = siteUrl.trim() || PLACEHOLDER_SITE_URL;
  if (resolvedSiteUrl === PLACEHOLDER_SITE_URL) {
    return {
      ok: false,
      message: "Refusing to finalize: SITE_URL is still the placeholder.",
    };
  }

  for (const { fullPath } of walkHtmlFiles(distDirectory)) {
    const content = readFileSync(fullPath, "utf8");
    const updated = stripStagingNoindexMetaFromHtml(content);
    if (updated !== content) {
      writeFileSync(fullPath, updated, "utf8");
    }
  }

  writeFileSync(
    join(distDirectory, "robots.txt"),
    formatProductionRobotsTxt(resolvedSiteUrl),
    "utf8",
  );

  const headersPath = join(distDirectory, "_headers");
  if (existsSync(headersPath)) {
    writeFileSync(
      headersPath,
      "# Public production build (no X-Robots-Tag).\n",
      "utf8",
    );
  }

  const afterFiles = walkDistTextFiles(distDirectory);
  const stagingLeft = findStagingArtifactsInDist(afterFiles);
  if (stagingLeft.length > 0) {
    return {
      ok: false,
      message: formatStagingArtifactFailures(stagingLeft),
    };
  }

  return { ok: true };
}

function main(): void {
  if (!existsSync(distDir)) {
    console.error("finalize-indexable-build: dist/ not found.");
    process.exit(1);
  }

  const siteUrl = process.env.SITE_URL?.trim() ?? "";
  const files = walkDistTextFiles(distDir);
  const result = finalizeIndexableDist(distDir, siteUrl, files);

  if (!result.ok) {
    console.error(result.message);
    process.exit(1);
  }

  console.log("Indexable production artifacts written to dist/.");
}

const isDirectRun =
  process.argv[1] !== undefined &&
  resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);

if (isDirectRun) {
  main();
}
