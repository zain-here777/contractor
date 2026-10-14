import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { createSitemapPageFilter } from "./src/config/sitemap.ts";

/** Set SITE_URL in production (for example https://yourdomain.com). */
const site = process.env.SITE_URL ?? "https://example.com";

export default defineConfig({
  site,
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: createSitemapPageFilter(),
    }),
  ],
});
