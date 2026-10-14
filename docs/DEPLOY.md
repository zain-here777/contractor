# Deploy this site to Cloudflare

This project is a **static** Astro site. The live site is the contents of the **`dist/`** folder after you run the build command. You do **not** need the Cloudflare SSR adapter (`@astrojs/cloudflare`) for this repo.

**Hosting recommendation for new projects:** [Cloudflare Workers with static assets](https://developers.cloudflare.com/workers/static-assets/) (Wrangler, `dist/` as the assets directory). Cloudflare treats Workers as the primary platform for new apps.

**Supported alternative:** [Cloudflare Pages](https://developers.cloudflare.com/pages/) (Git integration or Direct Upload). This guide uses Pages in the dashboard steps below; the same `dist/` output and environment variables apply to Workers.

**Staging safety:** Every build ships **noindex** controls by default (HTML meta tag, `robots.txt`, and `_headers`). They are removed only when a **strict** production build runs and the production guard passes. **Noindex and `robots.txt` are not access control**—anyone with the URL can still view the site. Use [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) or similar **password protection** if you share a staging or preview URL outside your team.

---

## What you need before you start

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up).
2. This project in a **Git** host (for example GitHub). Cloudflare Pages can deploy automatically when you push.
3. Your **real domain name** (optional at first; Cloudflare gives you a `*.pages.dev` URL for free).
4. About 15–30 minutes for the first setup.

---

## Step 1 — Check the site builds on your computer

Open a terminal in this project folder. Use **Node 22.12.0 or newer** (see `.nvmrc` and `package.json` `engines`).

```bash
npm install
npm run validate:data
npm test
npm run lint
npm run build
npm run check:links
```

For a **preview** or CI-style build, `npm run build` is enough. It runs Astro and Pagefind, then runs the production-readiness check in **warn-only** mode. **`dist/` stays noindex-safe** even when the guard only warns.

Before you **deploy the public, indexable site**, run a strict production build with your real site URL (no trailing slash).

**macOS / Linux / bash:**

```bash
SITE_URL=https://YOUR-DOMAIN.com npm run build:production
```

**PowerShell:**

```powershell
$env:SITE_URL="https://YOUR-DOMAIN.com"; npm run build:production
```

`npm run build:production` is a local alias for `npm run check:production -- --strict`. On Cloudflare **Production**, set `STRICT_PRODUCTION=1` and keep the build command as `npm run build` (see Step 3).

The guard **fails** if `dist/` still contains `TODO(user)`, placeholder `example.com` in canonical/`og:image`, `example.com` in `robots.txt` or `sitemap*.xml`, or if `SITE_URL` is still `https://example.com`. When strict mode passes, the build **finalizes** `dist/` (indexable HTML, `Allow: /` in `robots.txt`, no staging `X-Robots-Tag` in `_headers`).

**What the build does:** `npm run build:astro` runs Astro and Pagefind and writes files into `dist/` with staging noindex defaults. `npm run check:production` scans those files; in strict mode it finalizes or exits with a per-file list.

---

## Step 2 — Push the project to GitHub

If the code is not on GitHub yet:

1. Create a new empty repository on GitHub.
2. In this folder, commit and push (ask a developer if you are unsure):

```bash
git add .
git commit -m "Prepare for Cloudflare Pages"
git branch -M main
git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
git push -u origin main
```

---

## Step 3 — Create a Cloudflare Pages project (Git)

These steps follow Cloudflare’s **Get started** and **Astro** guides (see [Official docs checked](#official-docs-checked) below).

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** → **Create application** → **Pages** tab.
3. Choose **Import an existing Git repository** and connect GitHub.
4. Select this repository.
5. On **Set up builds and deployments**, use:

| Setting                    | Value                                            |
| -------------------------- | ------------------------------------------------ |
| **Production branch**      | `main` (or your default branch)                  |
| **Framework preset**       | Astro (optional; settings below are what matter) |
| **Build command**          | `npm run build`                                  |
| **Build output directory** | `dist`                                           |

6. Open **Environment variables**:

**Production**

| Variable            | Value                     | Why                                                                                                                |
| ------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `SITE_URL`          | `https://YOUR-DOMAIN.com` | Canonical URLs and sitemap at build time                                                                           |
| `STRICT_PRODUCTION` | `1`                       | Fail the build if placeholders remain; finalize indexable `dist/` when the guard passes                            |
| `NODE_VERSION`      | `22.12.0`                 | Optional; CI uses `.nvmrc` (see [build image](https://developers.cloudflare.com/pages/configuration/build-image/)) |

**Preview** (pull request previews)

| Variable   | Value                     | Why                                                                                            |
| ---------- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| `SITE_URL` | `https://YOUR-DOMAIN.com` | Same production domain in URLs (previews stay **noindex**; do **not** set `STRICT_PRODUCTION`) |

7. Click **Save and Deploy** and wait for the first build to finish.
8. Open the `*.pages.dev` URL Cloudflare shows you and click through Home, Licensing, Tools, and Search.

---

## Workers static assets (recommended for new projects)

Documentation only—no Wrangler dependency is required in this repo.

1. Build locally with strict production settings (see Step 1).
2. Create a Worker with static assets pointing at `./dist` ([Static Assets](https://developers.cloudflare.com/workers/static-assets/)).
3. Set the same **Production** environment variables (`SITE_URL`, `STRICT_PRODUCTION=1`) on the Worker build.

Example Wrangler shape (adjust names and dates):

```toml
name = "contractor-site"
compatibility_date = "2026-10-09"

[assets]
directory = "./dist"
```

---

## Step 4 — Content and data before public launch

1. Clear every `TODO(user)` the strict guard reports.
2. Confirm **`SITE_URL`** in Cloudflare Production matches your live domain.
3. Redeploy. Production builds with `STRICT_PRODUCTION=1` must pass the guard to publish an indexable site.

Source **`public/robots.txt`** and **`public/_headers`** stay staging-safe on purpose; indexable versions are written to **`dist/`** only after strict finalize.

---

## Step 5 — Add your custom domain (optional)

1. In your Pages project: **Custom domains** → **Set up a custom domain**.
2. Enter your domain and follow Cloudflare’s DNS steps ([Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) in their docs).
3. Keep `SITE_URL` on your canonical `https://yourdomain.com` and redeploy.

---

## Step 6 — After every content or data change

1. Run locally: `npm run validate:data`, `npm test`, and `npm run build` (or rely on GitHub Actions CI if enabled).
2. Push to `main`. Cloudflare rebuilds automatically.
3. Spot-check `/licensing/california/` and one calculator page. Search works on the **built** site (`/search/`), not always the same in dev-only mode.

---

## Alternative: upload `dist/` without Git (Direct Upload)

If you do not want Git integration:

1. Run a **strict** production build locally.

**macOS / Linux / bash:**

```bash
SITE_URL=https://YOUR-DOMAIN.com npm run build:production
```

**PowerShell:**

```powershell
$env:SITE_URL="https://YOUR-DOMAIN.com"; npm run build:production
```

2. In **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
3. Upload the **`dist`** folder.

You must repeat the upload after each change. Git integration is easier long term.

---

## GitHub Actions (CI)

This repo includes `.github/workflows/ci.yml`. It reads Node from **`.nvmrc`**, sets `SITE_URL=https://example.com`, and runs the same checks as Step 1 on every push and pull request. Fix failing CI before you depend on a production deploy.

---

## Troubleshooting

| Problem                             | What to try                                                                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build fails on Cloudflare           | Open the build log. Often: wrong Node version → set `NODE_VERSION=22.12.0`. Missing env → set `SITE_URL`. Production: set `STRICT_PRODUCTION=1` only on Production. |
| Search page empty                   | Search needs a production build with Pagefind (`npm run build`).                                                                                                    |
| Wrong links in sitemap              | `SITE_URL` was not set at build time. Set it in Cloudflare env vars and redeploy.                                                                                   |
| Preview indexed by Google           | Previews should stay noindex; do not set `STRICT_PRODUCTION` on Preview. Use Access if the URL is shared widely.                                                    |
| `/dev/trust-components/` in sitemap | It should not appear; the sitemap filter excludes `/dev/`. If it does, check `astro.config.mjs`.                                                                    |

---

## Official docs checked

These Cloudflare docs were read when writing this guide (October 2026). Check them again before major changes; Cloudflare updates their dashboard and defaults over time.

| Topic                                                        | URL                                                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Pages overview                                               | https://developers.cloudflare.com/pages/                                                         |
| Getting started (Git, Direct Upload; Workers recommendation) | https://developers.cloudflare.com/pages/get-started/                                             |
| Workers static assets (recommended for new projects)         | https://developers.cloudflare.com/workers/static-assets/                                         |
| Migrate from Pages to Workers                                | https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/     |
| Build configuration (Astro: `npm run build`, output `dist`)  | https://developers.cloudflare.com/pages/configuration/build-configuration/                       |
| Deploy an Astro site (Git dashboard flow)                    | https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/                   |
| Build image / Node.js (`NODE_VERSION`, `.nvmrc`)             | https://developers.cloudflare.com/pages/configuration/build-image/                               |
| Environment variables on Pages                               | https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables |

**Note:** Cloudflare’s Astro guide also covers **SSR** with `@astrojs/cloudflare`. **This project uses static output only** (`output: "static"` in `astro.config.mjs`), so you do not need that adapter for deployment.

**Node.js type stripping:** Guard and validate scripts use `node --experimental-strip-types`. Minimum Node **22.12.0** matches Astro 7 and supports this flag ([TypeScript / type stripping](https://nodejs.org/docs/latest/api/typescript.html#type-stripping)).
