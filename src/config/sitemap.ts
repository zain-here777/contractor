import { readdirSync } from "node:fs";
import { join } from "node:path";
import {
  isProductionIndexableBuild,
  shouldIndexStateLicensingPage,
} from "./state-licensing";

function listStateSlugsFromData(): string[] {
  const statesDir = join(process.cwd(), "data", "states");
  try {
    return readdirSync(statesDir)
      .filter((name) => name.endsWith(".yaml"))
      .map((name) => name.replace(/\.yaml$/, ""));
  } catch {
    return [];
  }
}

/** Astro @astrojs/sitemap filter (staging includes all states; production strict excludes non-indexable). */
export function createSitemapPageFilter(): (page: string) => boolean {
  const stateSlugs = listStateSlugsFromData();
  return (page: string) => {
    if (page.includes("/dev/")) {
      return false;
    }
    if (!isProductionIndexableBuild()) {
      return true;
    }
    for (const slug of stateSlugs) {
      if (
        !shouldIndexStateLicensingPage(slug) &&
        page.includes(`/licensing/${slug}/`)
      ) {
        return false;
      }
    }
    return true;
  };
}
