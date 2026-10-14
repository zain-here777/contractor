import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { StateDocument } from "./types";

export function getStateSlugs(statesDir: string): string[] {
  return readdirSync(statesDir)
    .filter((name) => name.endsWith(".yaml"))
    .map((name) => name.replace(/\.yaml$/, ""))
    .sort();
}

export function loadStateYaml(statesDir: string, slug: string): StateDocument {
  const filePath = join(statesDir, `${slug}.yaml`);
  const raw = readFileSync(filePath, "utf8");
  const document = parseYaml(raw) as StateDocument;
  return document;
}

export function getSectionSources(section: Record<string, unknown>): string[] {
  const urls: string[] = [];
  if (typeof section.source === "string") {
    urls.push(section.source);
  }
  if (Array.isArray(section.sources)) {
    for (const item of section.sources) {
      if (typeof item === "string") {
        urls.push(item);
      }
    }
  }
  return urls;
}
