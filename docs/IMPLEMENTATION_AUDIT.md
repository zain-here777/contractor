# Implementation audit (for Claude / next agent)

**Purpose:** Give any AI assistant a single, accurate picture of what is built, what is placeholder, and what the site owner should do before launch.

**Last aligned with:** `docs/TASKS.md` **T1–T11** (complete), `docs/UI_PLAN.md` **U0–U6** (complete), **deploy hardening**, **UI polish**, and **FL/TX partial-draft state pages** (October 2026).

**Read first:** `AGENTS.md`, `.cursor/rules/`, `docs/PROJECT_BRIEF.md`, `docs/UI_PLAN.md`, `docs/DEPLOY.md`.

---

## 1. What this product is

A **static** Astro site for U.S. trade contractors and people starting a trade business:

- **State licensing data** (YAML in `data/states/`, sources + dates on the site; California verified-style page, Florida partial draft)
- **Free tools** (calculators + California “do I need a license?” checker)
- **Trust/legal scaffolding** (About, Methodology, etc.—mostly placeholders)

**Hosting:** See `docs/DEPLOY.md`. **Recommended for new projects:** Cloudflare Workers static assets. **Supported alternative:** Cloudflare Pages (Git or Direct Upload). Output folder: **`dist/`**.

---

## 2. Task completion (T1–T11)

| Task    | Status | Summary                                                                                                                                                                               |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **T1**  | Done   | Astro 7.3.8, strict TS, scripts, ESLint, Prettier, Vitest, `.gitignore`                                                                                                               |
| **T2**  | Done   | `scripts/validate-data.ts` + `src/lib/validate-state-data.ts`, fixtures, 180-day warn; **nested fee containers** (section = fact leaves only, no section-level `confidence`/`source`) |
| **T3**  | Done   | `BaseLayout`, trust components (`SourceBox`, `VerifiedBadge`, `FactTable`, `NotLegalAdvice`), dev preview page                                                                        |
| **T4**  | Done   | `/licensing/[state]/` from YAML; CA live; **Florida** and **Texas** partial drafts                                                                                                    |
| **T5**  | Done   | Pure calculators in `src/lib/calculators/` + unit tests                                                                                                                               |
| **T6**  | Done   | Four calculator tool pages + `/tools/` index (vanilla TS forms, no Preact)                                                                                                            |
| **T7**  | Done   | `/tools/do-i-need-a-license/` reads threshold from `california.yaml`                                                                                                                  |
| **T8**  | Done   | Sitemap, robots.txt, OG tags, JSON-LD, 404, Pagefind, `public/ads.txt` stub                                                                                                           |
| **T9**  | Done   | About, Methodology, Editorial standards, Corrections, Privacy, Terms, Contact (scaffolding)                                                                                           |
| **T10** | Done   | `.github/workflows/ci.yml`, `npm run check:links`                                                                                                                                     |
| **T11** | Done   | `docs/DEPLOY.md` (updated for staging gate, Workers vs Pages, Node pin)                                                                                                               |

---

## 3. UI completion (U0–U6 + post-U6 polish)

| Step   | Status | Summary                                                                                                                                                    |
| ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **U0** | Done   | Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/vite`), `@import "tailwindcss"` in `global.css`                                                             |
| **U1** | Done   | `@theme` tokens, `@layer base` / `@layer components` (`.btn`, `.panel`, `.card`, `.field`, `.result-panel`, `.prose-site`, etc.)                           |
| **U2** | Done   | `src/config/site.ts`, header/footer, dev link removed from nav, `/dev/*` → `noindex`                                                                       |
| **U3** | Done   | Home hero band, card grid “doors”, featured CA tool, trust pillars, calculator cards                                                                       |
| **U4** | Done   | State page: status row, at-a-glance tiles, on-page contents, section intros, dual disclaimers; **Florida** uses partial-draft status (no “Verified” badge) |
| **U5** | Done   | Shared `ToolPage`, `PageHero`, emphasized calculator panel, related tools as cards                                                                         |
| **U6** | Done   | Trust pages via `TrustPage` + `PageHero`; favicon/OG SVG; 404 with card links                                                                              |

**Post-U6 UI (same design tokens, no new npm UI deps):**

- **`SiteHeader` / `SiteFooter`:** Sticky header, shield logo mark, active nav (`isNavLinkActive`), desktop CTA, mobile **Menu** `<details>` drawer (no JS).
- **`PageHero`:** Shared gradient header band on interior pages (tools, licensing, trust, search, 404, state pages).
- **`Icon.astro`:** Inline SVG set (no icon library).
- **Layout rail:** All pages use **`site-main`** `max-w-page` + `px-4 md:px-6`; content wrapped in **`.site-page`**. Hero bands do **not** use negative horizontal margins (avoids breadcrumb misalignment).
- **Ad slot:** `public` layout still has `data-ad-slot="reserved"` node; **`--spacing-ad-slot: 0`** so no visible gap under navbar until ads are enabled.

**Built CSS size:** Re-check `dist/_astro/BaseLayout.*.css` after large CSS changes (was ~36 KB after U6).

**Not built:** `/trades/...`, license lookup hub, startup cost calculator, additional full state pages beyond CA + FL draft, final brand assets.

---

## 4. Production build gate and staging safety

Every **`npm run build`** ships **noindex-safe** `dist/` by default:

| Layer        | Staging default                                                                                       | After strict finalize                                |
| ------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| HTML         | `<meta … data-build-staging-noindex>` on pages (plus separate noindex for `/dev/` and explicit props) | Staging meta stripped                                |
| `robots.txt` | `Disallow: /` (from `public/robots.txt`)                                                              | `Allow: /` + `Sitemap: {SITE_URL}/sitemap-index.xml` |
| `_headers`   | `X-Robots-Tag: noindex` (Cloudflare Pages)                                                            | Comment-only / no noindex header                     |

**Guard** (`src/lib/build-guard/production-readiness.ts`, `scripts/check-production-build.ts`):

- Scans `dist/` HTML, txt, xml, svg, json, webmanifest, `_headers`.
- Flags: `TODO(user)`, placeholder `example.com` in canonical/`og:image`, **`example.com` in `robots.txt` / `sitemap*.xml`**, `SITE_URL` still `https://example.com`.

**Strict mode:** `--strict` CLI flag **or** env **`STRICT_PRODUCTION=1`** (also `true` / `yes`). On **zero issues**, **`scripts/finalize-indexable-build.ts`** writes indexable artifacts and **post-check fails** if staging meta, `Disallow: /`, or `X-Robots-Tag: noindex` remain. Finalize **refuses** if the guard still reports issues.

| Script                     | Behavior                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `npm run build`            | Astro + Pagefind + guard (**warn only**); `dist/` stays noindex                    |
| `npm run build:production` | Same + **`--strict`** (local alias)                                                |
| Cloudflare **Production**  | `STRICT_PRODUCTION=1` + real `SITE_URL`; build command stays `npm run build`       |
| Cloudflare **Preview**     | `SITE_URL` = production domain; **no** `STRICT_PRODUCTION` → previews stay noindex |

**Node:** `package.json` `engines.node` **`>=22.12.0`**, **`.nvmrc`** `22.12.0`; CI reads `.nvmrc`. Guard/validate use `node --experimental-strip-types`.

**Tests:** `tests/production-build-guard.test.ts`, `tests/staging-build.test.ts` (integration: normal build keeps staging; strict failure leaves staging).

**Docs:** `docs/DEPLOY.md` — Workers vs Pages, cross-shell `SITE_URL`, Direct Upload uses `build:production`, noindex ≠ access control (Cloudflare Access note).

---

## 5. Tech stack and constraints

| Area          | Choice                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------- |
| Framework     | Astro **7.3.8**, `output: "static"`                                                      |
| Styling       | **Tailwind CSS v4** + native CSS in `src/styles/global.css`. **No SCSS.**                |
| Interactivity | Small **vanilla TypeScript** in `.astro` scripts / `*.client.ts` (no Preact/React added) |
| Search        | **Pagefind** (runs in `npm run build`)                                                   |
| Tests         | **Vitest** (**104 tests**, 15 files; FL/TX partial drafts, indexable states)             |
| Data          | **YAML** in `data/states/`; **`yaml`** package for parse/validate                        |

**Non‑negotiable rules (do not break):**

- **Never invent** fees, thresholds, legal rules, authors, or credentials. Data only from `data/` with sources.
- Null / `confidence: confirm` → show **“Needs confirmation”** on the site.
- Ask before **new npm dependencies** or third-party scripts (fonts, analytics, ads).
- Content pages should work with **minimal JS**; keep calculator JS scoped to tool pages.
- Use **Tailwind v4** utilities and **`@theme` tokens**. Avoid arbitrary colors/sizes unless the owner approves.
- Before claiming a task done: `npm run validate:data`, `npm test`, `npm run lint`, `npm run build`, `npm run check:links` when routes change.

---

## 6. Site map (routes)

### Public content

| URL                                                   | Notes                                                                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `/`                                                   | Home—hero band, card doors, featured tool, trust cards, calculator cards                              |
| `/licensing/`                                         | State list cards (**CA**, **FL**, **TX** from `data/states/*.yaml`)                                   |
| `/licensing/california/`                              | State page: sourced status (not expert-reviewed until `stateExpertReviewed`); indexable in production |
| `/licensing/florida/`                                 | **Partial draft**—see §8.1; staging sitemap; non-indexable in production (`STRICT_PRODUCTION=1`)      |
| `/licensing/texas/`                                   | **Partial draft**—see §8.3; trade-specific layout; same SEO rules as Florida                          |
| `/tools/`                                             | Tool index (card grid)                                                                                |
| `/tools/*-calculator/`, `/tools/do-i-need-a-license/` | `ToolPage` + `PageHero`                                                                               |
| `/search/`                                            | `PageHero` + Pagefind panel                                                                           |
| `/about/`, `/methodology/`, …                         | `TrustPage` → `PageHero` + **`prose-site`**; body mostly **`TODO(user)`**                             |
| `/404`                                                | `404.html`, **`noindex`**, `PageHero`, card links                                                     |

### Dev / internal

| URL                      | Notes                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| `/dev/trust-components/` | Trust component gallery; **not in nav**; **`noindex`**; **excluded from sitemap** (`/dev/` filter) |

**Not built:** `/trades/...`, `/research/...`, license lookup hub, startup cost calculator, etc.

---

## 7. Key files and folders

```
data/states/california.yaml
data/states/florida.yaml          # PARTIAL DRAFT — see §8.1
data/states/texas.yaml            # PARTIAL DRAFT — see §8.3
scripts/validate-data.ts
scripts/check-production-build.ts
scripts/finalize-indexable-build.ts
scripts/check-internal-links.mjs
src/config/site.ts                 # Brand, nav; indexableStates; stateExpertReviewed; stateSourceAttribution
src/config/state-licensing.ts      # isProductionIndexableBuild, shouldNoindexStateLicensingPage
src/config/sitemap.ts              # createSitemapPageFilter (STRICT_PRODUCTION-aware)
src/lib/state-data/source-labels.ts  # Statute edition hints in SourceBox titles
src/layouts/BaseLayout.astro       # SiteHeader, SiteFooter, site-page wrapper, staging meta
src/styles/global.css              # @theme, components, layout rail, cards, PageHero
src/lib/build-guard/production-readiness.ts
src/lib/state-data/*
  state-display.ts               # resolveStatePageSections (CA/FL/TX)
  texas-display.ts               # Texas trade sections, trade table groups
  at-a-glance.ts                 # slug-specific glance (CA / FL / TX)
  TexasTradeSection.astro        # Electrician/plumber trade tables + fees-as-of note
src/lib/calculators/*  src/lib/license-check/*
src/components/
  SiteHeader.astro  SiteFooter.astro  PageHero.astro  Icon.astro
  TrustPage.astro  Breadcrumbs.astro  tools/ToolPage.astro  …
src/pages/**
tests/
  state-page.test.ts             # CA data + FL partial draft (data layer + built HTML)
  validate-data.test.ts          # florida.yaml + valid-nested-fee-container fixture
  site-basics.test.ts            # staging sitemap includes /licensing/florida/
  state-indexable.test.ts        # production sitemap / noindex rules
  source-labels.test.ts          # Florida Statutes edition in SourceBox title
  production-build-guard, staging-build, …
.github/workflows/ci.yml           # node-version-file: .nvmrc
.nvmrc                             # 22.12.0
docs/DEPLOY.md  docs/UI_PLAN.md
public/robots.txt                  # Staging-safe Disallow (source); indexable written on finalize
public/_headers                    # Staging X-Robots-Tag
public/favicon.svg  public/og-default.svg  public/ads.txt
```

**Environment:** `SITE_URL` at build time; `STRICT_PRODUCTION` for indexable Production deploys; `PUBLIC_STAGING_NOINDEX=false` only if you intentionally skip staging meta at build (normally use finalize instead).

---

## 8. Data status

- **California:** `data/states/california.yaml`—researched 2026-10-09, **needs human + expert review**; validator passes.
- **Florida (partial draft):** `data/states/florida.yaml`—added 2026-10-11. **Confirmed on official sources:** license types (certified / registered), official DBPR form numbers, qualifier rules (minimum age 18 and experience options). **Not confirmed (show “Needs confirmation” on site):** fees, exams, license threshold, penalties, insurance/bonds, workers’ comp, license term, reciprocity. Page shows a partial-draft notice; `known_conflicts_on_secondary_sites` and unpublished fee draft notes are not rendered. Validator accepts nested fee containers (fact leaves only, no section-level `confidence`/`source`).
- **Texas (partial draft):** `data/states/texas.yaml`—added 2026-10-11. **No single statewide GC license** (confirm only on site). **Confirmed:** TDLR journeyman/master electrician hours and application fees; TSBPE journeyman and tradesman-limited plumber rules and fees. **Not confirmed:** exams/PSI fees, statewide GC claim, master plumber, AC/refrigeration, standard T4 topics. Custom page sections via `texas-display.ts`; confirm leaf **values never rendered** (`sanitizeRowsForPublicDisplay`).
- **Other states:** Not in repo (do not add from memory).

### 8.1 Florida partial draft (implementation)

**Do not edit** `data/states/florida.yaml` values/sources/confidence unless the owner supplies new official sources.

| Area                   | Behavior                                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Listing**            | `/licensing/` uses `getStateSlugs()`—no hard-coded California-only list.                                                                                                      |
| **Sections shown**     | Extra: `license_types`, `official_forms`. Standard T4 sections present in YAML. **Hidden:** `known_conflicts_on_secondary_sites`.                                             |
| **Primary facts only** | Certified / registered license types; official form list; qualifier **min age 18** and **experience options**. Other qualifier fields render as “Needs confirmation”.         |
| **Confirm sections**   | Generic section note + `SourceBox`; no raw YAML notes that mention unpublished dollar amounts (e.g. threshold note with `$2,500`).                                            |
| **Fees**               | Rows `statutory_maximums_seen` and `rule_notice_values_seen` **omitted** from the table so draft fee text never appears in HTML. `current_fee_values` → “Needs confirmation”. |
| **Hero / badges**      | Partial-draft callout; same **sourced / not expert-reviewed** hero as California (see §8.2). No **Verified** badge until `stateExpertReviewed[slug]` is true.                 |
| **At-a-glance**        | Four tiles (certified, registered, min age, experience)—primary only; else “Needs confirmation”.                                                                              |
| **License tool**       | `/tools/do-i-need-a-license/` remains **California only** (unchanged).                                                                                                        |
| **Tests**              | Built FL HTML must not contain secondary-site strings (`$335`, `Pearson`, etc.); confirm sections show “Needs confirmation”; CA page unchanged.                               |

**Validator (T2):** If a section’s direct children are all fact records (each with `confidence` + `source`), the section does not need top-level `confidence`/`source`. Nested leaves are still validated. Fixture: `tests/fixtures/validation/valid-nested-fee-container.yaml`.

### 8.3 Texas partial draft (implementation)

**Do not edit** `data/states/texas.yaml` without owner-supplied official sources.

| Area               | Behavior                                                                                                                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout**         | Does **not** use the California T4-only section list. Trade blocks: `electricians_experience_and_fees`, `plumbers_journeyman`, `plumbers_tradesman_limited` via `TexasTradeSection.astro` (grouped tables, **Fees as of {verified_on}**, SourceBox). |
| **Other sections** | `licensing_structure`, `agencies_by_trade`, confirm-only blocks, and sparse T4-style sections use `StateSection` with Texas note/row rules.                                                                                                          |
| **Confirm items**  | Stored confirm text (e.g. third-party GC claims, PSI provider) is **never** shown—cells are “Needs confirmation” only.                                                                                                                               |
| **At-a-glance**    | Journeyman electrician hours, master experience, journeyman plumber hours (primary); **Statewide general-contractor license: Needs confirmation**.                                                                                                   |
| **Review / SEO**   | `stateExpertReviewed.texas = false`; `indexableStates` still **`["california"]` only**.                                                                                                                                                              |

### 8.2 State page review and SEO (`src/config/site.ts`)

| Control                     | Default               | Effect                                                                                                                                                                                                                                    |
| --------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stateExpertReviewed[slug]` | `false` for CA and FL | Hero shows `stateSourceAttribution[slug]` + last checked + “Not yet expert-reviewed.” Section **Verified** badges hidden. Set `true` after expert sign-off to restore badges.                                                             |
| `indexableStates`           | `["california"]`      | When `STRICT_PRODUCTION=1` at build: non-listed state pages get `noindex` on the page and are **dropped from sitemap**. Staging builds (`STRICT_PRODUCTION` unset) unchanged—all state pages stay in sitemap with global staging noindex. |
| **SourceBox titles**        | —                     | If a section source URL includes a statutes year (e.g. flsenate.gov `…/Statutes/2024/…`), title includes “Florida Statutes, 2024 edition. Check for newer amendments.”                                                                    |
| **Section notes**           | —                     | YAML notes containing `$` amounts are never rendered on public state pages (`resolvePublicSectionNote`).                                                                                                                                  |

**Copy:** Home and `/licensing/` say California is available and Florida is a partial draft. `/tools/do-i-need-a-license/` stays **California only** in titles and descriptions.

---

## 9. UI / frontend—current state

- **Shell:** Accent `#1d4f9c`, `--color-accent-subtle` for hero/panels, system sans, card + panel patterns.
- **Header/footer:** Full-width components; footer two-tier (brand blurb + columns).
- **Interior pages:** Breadcrumbs (flush left) → `PageHero` → content blocks (`.content-block`, card grids).
- **Tools:** Emphasized calculator panel; formula/example in stacked panels; related tools as horizontal cards.
- **State pages:** Hero with sourced / not-yet-expert-reviewed status (or `VerifiedBadge` when `stateExpertReviewed`); Florida partial-draft callout; at-a-glance tiles; SourceBox statute edition hints.
- **Trust:** Prose width capped with `.prose-site` inside full page rail.
- **Icons:** Self-contained SVG in `Icon.astro` only.
- **Ad slot:** DOM placeholder present; **zero height** until `--spacing-ad-slot` is raised for live ads.

**Design reference:** `docs/UI_PLAN.md` §1–5. Extend existing `@layer components`; do not add UI kits or font CDNs without owner approval.

---

## 10. Before public launch (owner + engineering)

1. **California data**—expert review of YAML; no new facts without sources.
2. **Florida data**—finish research on fees, exams, threshold, penalties, insurance, workers’ comp, term, reciprocity; promote fields to `primary` only with official sources (never guess).
3. Clear **`TODO(user)`** in built output (guard lists every file).
4. Set **`SITE_URL`** on Production; enable **`STRICT_PRODUCTION=1`** so deploy fails until guard passes and finalize runs.
5. Replace **favicon / OG**, **`siteBrand.name`**, trust page copy.
6. **`ads.txt`** when running ads; set **`--spacing-ad-slot`** when reserving ad height.
7. Previews: keep **no** `STRICT_PRODUCTION`; use **Cloudflare Access** if sharing preview URLs widely (`DEPLOY.md`).
8. Optional: remove `/dev/trust-components/` before launch.

---

## 11. Suggested next work

| Priority | Task                         | Notes                                                                         |
| -------- | ---------------------------- | ----------------------------------------------------------------------------- |
| P0       | **Owner content**            | Brand, trust pages, hero TODO, tool intro TODOs                               |
| P0       | **California verification**  | Expert review of YAML                                                         |
| P1       | **Strict production deploy** | Cloudflare Production env vars per `DEPLOY.md`                                |
| P1       | **Florida research**         | Confirm remaining sections in YAML; keep partial-draft UI until expert review |
| P1       | **More states**              | New draft YAML only; `confidence: confirm` until verified                     |
| P2       | **`/trades/` stub**          | When owner defines scope                                                      |
| P2       | **Self-hosted fonts**        | Ask owner; update `@theme` `--font-sans`                                      |
| P3       | **Wrangler in repo**         | Optional; DEPLOY documents Workers path without dependency today              |

---

## 12. Do not do without owner approval

- SCSS/Sass/Less, UI kits, Tailwind plugins, `@tailwindcss/typography`
- Third-party font CDNs, analytics, ads scripts, chat widgets
- Invented licensing facts, testimonials, credentials
- Removing staging noindex defaults without strict gate + finalize path

---

## 13. Commands reference

```bash
npm install
npm run dev
npm run validate:data
npm test
npm run lint
SITE_URL=https://yourdomain.com npm run build              # warn-only; dist stays noindex
SITE_URL=https://yourdomain.com npm run build:production   # strict local alias
STRICT_PRODUCTION=1 SITE_URL=https://yourdomain.com npm run build   # same as Cloudflare Production
npm run check:links
```

CI: validate → test → lint → build → check:links (Node from `.nvmrc`, `SITE_URL=https://example.com`).

---

## 14. Open questions for the site owner

1. Brand name, domain, logo, PNG OG vs SVG.
2. Final hero wording (home still has `TODO(user)` comment).
3. Launch scope: California-first vs promoting Florida from partial draft; which states to add next.
4. When to enable ad slot height and `ads.txt`.

---

## 15. Prompt snippet (paste to a new agent)

```
Read docs/IMPLEMENTATION_AUDIT.md, AGENTS.md, docs/PROJECT_BRIEF.md, docs/UI_PLAN.md, docs/DEPLOY.md.

T1–T11 and U0–U6 are done. Also done: production staging gate (noindex by default, strict finalize),
DEPLOY hardening (.nvmrc, STRICT_PRODUCTION), UI shell (SiteHeader/Footer, PageHero, Icon, cards),
layout rail alignment, collapsed ad slot, Florida partial-draft page, stateExpertReviewed/indexableStates in site.ts.

Rules: never invent licensing data; @theme tokens + global.css components; ask before new dependencies.
Toggle expert review and SEO in src/config/site.ts (stateExpertReviewed, indexableStates).

Typical next work: owner TODO(user) content, California + Florida data review, Production env on Cloudflare,
more state drafts—not a redesign. validate:data, lint, build, check:links before done.

Before finishing code: npm run validate:data && npm test && npm run lint && npm run build && npm run check:links.
```

---

_End of audit._
