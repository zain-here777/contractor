# Tasks for the coding agent

Work **one task at a time, in order**. After each task: run `npm run validate:data`, `npm test` and `npm run build`, then summarise what changed and what the user should check. Ask before adding dependencies. Never invent data (see AGENTS.md).

---

## T1. Scaffold the project

**Do:** Create an Astro project (latest stable, TypeScript strict) in this repo. Set up `package.json` scripts: `dev`, `build`, `validate:data`, `test`, `lint`. Add Vitest, ESLint and Prettier. Add `.gitignore`. Keep existing files (`AGENTS.md`, `.cursor/`, `docs/`, `data/`).
**Done when:** `npm run build` passes and a blank home page loads locally.

## T2. Data loading and validation

**Do:**

1. Create a script `scripts/validate-data.ts` (run by `npm run validate:data`) that reads every file in `data/states/` and enforces `.cursor/rules/data-integrity.mdc`.
2. Make it print clear messages (file, section, problem).
3. Add tests that prove it fails for: missing source, bad URL, missing/invalid/future `verified_on`, missing or invalid `confidence`. Use small fake fixtures in `tests/fixtures/` (never real state data).
4. Warn when `verified_on` is older than 180 days.
   **Done when:** `data/states/california.yaml` passes, and every failure fixture fails.
   **Note:** `california.yaml` uses section-level `confidence` and `source`/`sources`, and some leaf values like `{value: null, confidence: confirm}`. Support both.

## T3. Base layout and trust components

**Do:** Create a mobile-first base layout (header, footer, skip link), plain CSS (no framework needed), and components:

- `SourceBox` (shows source link(s) and "Last verified" date)
- `VerifiedBadge` ("Verified from official source" or "Needs confirmation")
- `FactTable` (renders label/value rows; shows "Needs confirmation" for null or `confirm` values)
- `NotLegalAdvice` (short note)
  Reserve an empty, fixed-height area where an ad slot may go later (no ad code).
  **Done when:** components are used on a test page and look right at 375px width.

## T4. State page template

**Do:** Create `/licensing/[state]/` generated from `data/states/*.yaml`. Show: plain-English summary box (only from verified fields), key facts table (license needed when, experience, exams, fees, bond, workers comp, license term, reciprocity), "Needs confirmation" items clearly marked, source box per section, last verified date, breadcrumbs.
**Done when:** `/licensing/california/` renders every verified field with its source and never shows a `confirm` or null value as a fact.

## T5. Calculators (pure functions + tests)

Create these in `src/lib/calculators/` with tests (known answers are hand-checked):

**Markup / margin**

- price = cost x (1 + markup)
- margin = (price - cost) / price
- price from target margin = cost / (1 - margin)
- markup = margin / (1 - margin), margin = markup / (1 + markup)
- Tests: cost 1000, markup 25% -> price 1250, margin 20%. Cost 1000, margin 20% -> price 1250, markup 25%. Markup 50% -> margin 33.33%. Margin 100% or more is invalid.

**Hourly rate**

- hourly rate = (pay goal + yearly overhead + profit goal) / billable hours
- Test: pay 80000 + overhead 40000 + profit 20000, billable hours 1200 -> 116.67 per hour. Hours must be above 0. Warn if hours exceed 2080.

**Break-even**

- jobs = fixed costs / (average job revenue - average job variable cost)
- revenue = jobs x average job revenue
- Test: fixed 6000, revenue 3000, variable 1500 -> 4 jobs, 12000 revenue. Reject variable cost greater than or equal to revenue.

**Overhead rate**

- overhead per hour = yearly overhead / billable hours
- Test: 40000 / 1200 -> 33.33.

**Done when:** all tests pass and edge cases return clear errors, not NaN.

## T6. Tool pages

**Do:** Create `/tools/markup-margin-calculator/`, `/tools/hourly-rate-calculator/`, `/tools/break-even-calculator/`, `/tools/overhead-rate-calculator/`. Each page: short plain-English intro, the calculator (small island, works with keyboard), the formula in words, one worked example, limits note, related links. Add `TODO(user)` markers where the owner should add real contractor advice. Do not invent advice.
**Done when:** each tool matches the tested functions and works on a phone.

## T7. "Do I need a license for this job?" checker (California first)

**Do:** Build a tool that reads California data from `data/states/california.yaml` (threshold, permit and workers exceptions). Inputs: total job value (labor + materials), does the work need a permit (yes/no), will you hire workers (yes/no). Output: "License required" or "Minor work exemption may apply", with the reason, the source link, the effective date and a not-legal-advice note.
**Rules (from the data):** license required if a permit is needed OR workers are hired OR value >= threshold. Splitting a job to get under the threshold is illegal (show this).
**Tests:** value 900, no permit, no workers -> exemption may apply. Value 1000 -> license required. Value 500 with permit -> required. Value 500 with workers -> required.
**Done when:** the tool reads the threshold from the data file (not hard-coded) and its tests pass.

## T8. Site basics

**Do:** sitemap, robots.txt, canonical URLs, Open Graph basics, Organization and BreadcrumbList structured data, 404 page, Pagefind search, a `public/ads.txt` placeholder file marked TODO.
**Done when:** build passes and sitemap lists all pages.

## T9. Trust and legal pages (scaffolding only)

**Do:** Create About, Methodology, Editorial standards, Corrections, Privacy, Terms, Contact pages with short, honest placeholder text and `TODO(user)` for anything personal (who runs the site, reviewers, contact details). Methodology page explains: official sources only, source and date on every fact, "Needs confirmation" rule, update schedule. Do not invent names, credentials or testimonials.
**Done when:** all pages exist and are linked in the footer.

## T10. Automated checks (CI)

**Do:** GitHub Actions workflow that runs on every push and pull request: install, `validate:data`, `test`, `lint`, `build`. Add a link checker for internal links.
**Done when:** the workflow file is valid and passes locally with the same commands.

## T11. Deployment notes

**Do:** Write `docs/DEPLOY.md` with step-by-step instructions for deploying the static build to Cloudflare, checking the current official docs for the right product and settings. State which docs you checked.
**Done when:** a non-developer could follow it.

## After T11: stop and report

Summarise what exists, what is placeholder, and what the owner must provide (domain, brand, reviewers, real contractor input, verified data for more states).
