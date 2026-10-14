import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const distDir = join(root, "dist");

function walkHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...walkHtmlFiles(fullPath));
    } else if (entry.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function resolveInternalHref(href) {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return null;
  }
  const withoutHash = href.split("#")[0];
  if (withoutHash === "") {
    return join(distDir, "index.html");
  }

  const relative = withoutHash.replace(/^\//, "");
  if (withoutHash.endsWith("/")) {
    return join(distDir, relative, "index.html");
  }

  const asFile = join(distDir, relative);
  if (existsSync(asFile) && statSync(asFile).isFile()) {
    return asFile;
  }
  const asIndex = join(distDir, relative, "index.html");
  if (existsSync(asIndex)) {
    return asIndex;
  }
  return asIndex;
}

function extractHrefs(html) {
  const hrefs = [];
  const regex = /href="([^"]+)"/g;
  let match = regex.exec(html);
  while (match) {
    hrefs.push(match[1]);
    match = regex.exec(html);
  }
  return hrefs;
}

const htmlFiles = walkHtmlFiles(distDir);
const broken = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const from = file.replace(distDir, "") || "/";
  for (const href of extractHrefs(html)) {
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      continue;
    }
    const target = resolveInternalHref(href);
    if (!target || !existsSync(target)) {
      broken.push({ from, href, target });
    }
  }
}

if (broken.length > 0) {
  console.error("Broken internal links found in dist/:");
  for (const item of broken) {
    console.error(`  ${item.from} -> ${item.href}`);
  }
  process.exit(1);
}

console.log(
  `Internal link check passed (${htmlFiles.length} HTML files scanned).`,
);
