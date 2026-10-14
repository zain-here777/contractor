/**
 * Generates state card map SVGs from U.S. Census boundaries (via us-atlas, public domain).
 * Run: node scripts/generate-state-map-svgs.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";
import { geoPath, geoMercator } from "d3-geo";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(repoRoot, "public", "images", "states");
mkdirSync(outDir, { recursive: true });

const topo = JSON.parse(
  readFileSync(
    join(repoRoot, "node_modules", "us-atlas", "states-10m.json"),
    "utf8",
  ),
);
const states = feature(topo, topo.objects.states);

/** slug → Census state FIPS id (string) */
const STATE_FIPS = {
  california: "06",
  florida: "12",
  texas: "48",
};

const WIDTH = 400;
const HEIGHT = 240;
const PAD = 20;

function buildStateSvg(stateFeature, title, slug) {
  const projection = geoMercator();
  projection.fitExtent(
    [
      [PAD, PAD],
      [WIDTH - PAD, HEIGHT - PAD],
    ],
    stateFeature,
  );
  const path = geoPath(projection);
  const d = path(stateFeature);
  if (!d) {
    throw new Error(`Could not project geometry for ${title}`);
  }

  const gradId = `land-${slug.replace(/[^a-z0-9]/gi, "")}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${title}">
  <!-- State boundary: U.S. Census Bureau cartographic boundaries (public domain), via us-atlas -->
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1d4f9c" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#1d4f9c" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  <path
    fill="url(#${gradId})"
    stroke="#163d7a"
    stroke-width="1.25"
    stroke-linejoin="round"
    d="${d}"
  />
</svg>
`;
}

for (const [slug, fips] of Object.entries(STATE_FIPS)) {
  const stateFeature = states.features.find((f) => f.id === fips);
  if (!stateFeature) {
    throw new Error(`Missing state feature for FIPS ${fips} (${slug})`);
  }
  const name = stateFeature.properties?.name ?? slug;
  const svg = buildStateSvg(stateFeature, name, slug);
  writeFileSync(join(outDir, `${slug}.svg`), svg, "utf8");
  console.log(`Wrote ${slug}.svg (${name})`);
}

console.log("Done.");
