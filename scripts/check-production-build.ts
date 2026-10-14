import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectProductionIssues,
  distRelativePathToLabel,
  formatProductionIssues,
  isScannableDistFile,
  isStrictProductionBuild,
  type DistTextFile,
} from "../src/lib/build-guard/production-readiness.ts";
import { finalizeIndexableDist } from "./finalize-indexable-build.ts";

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
    if (
      !isScannableDistFile(entry) &&
      normalized.toLowerCase() !== "_headers"
    ) {
      continue;
    }
    files.push({
      label: distRelativePathToLabel(normalized),
      relativePath: normalized,
      content: readFileSync(fullPath, "utf8"),
      isHtml: normalized.toLowerCase().endsWith(".html"),
    });
  }
  return files;
}

function main(): void {
  if (!existsSync(distDir)) {
    console.error(
      "check-production-build: dist/ not found. Run astro build first.",
    );
    process.exit(1);
  }

  const strict = isStrictProductionBuild(process.argv, process.env);
  const files = walkDistTextFiles(distDir);
  const issues = collectProductionIssues(process.env.SITE_URL, files);

  if (issues.length > 0) {
    const message = formatProductionIssues(issues);
    if (strict) {
      console.error(message);
      process.exit(1);
    }

    console.warn("Production build check (development mode — warnings only):");
    console.warn(message);
    return;
  }

  if (strict) {
    const finalizeResult = finalizeIndexableDist(
      distDir,
      process.env.SITE_URL?.trim() ?? "",
      files,
    );
    if (!finalizeResult.ok) {
      console.error(finalizeResult.message);
      process.exit(1);
    }
    console.log("Production build check passed.");
    return;
  }
}

main();
