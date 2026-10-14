# AGENTS.md: Contractor Compliance & Tools Site

## What this project is

A fast, static website for **U.S. trade contractors and people starting a trade business**. It publishes **verified state-by-state licensing data** and **calculators/tools** built on that data. Tone: plain English, no hype.

Read `docs/PROJECT_BRIEF.md` first, then `docs/TASKS.md`. Work through tasks **in order, one at a time**.

## The most important rule: never invent facts

This site gives people legal and financial information. A wrong number can hurt someone.

- Facts come **only** from files in `data/`. Never type a fee, threshold, bond amount, deadline or rule into a page, component or test from memory.
- Never "fill in" a missing value. If a value is `null` or `confidence: confirm`, show **"Needs confirmation"** on the site. Do not guess.
- Do not change the `value`, `source` or `confidence` of an existing fact unless the user gives you a new official source.
- New states may be added only as **drafts** with `confidence: confirm` unless the user supplies verified sources.
- Never invent authors, credentials, reviewers, testimonials, statistics or quotes. Use placeholders clearly marked `TODO(user)`.
- If unsure, ask the user. Do not guess.

## Tech stack

- **Astro** (check the latest stable version with `npm view astro version`; follow the current official docs, not memory)
- **TypeScript** (strict mode)
- Content: YAML data files + Markdown/MDX pages
- Interactivity: small Astro islands (Preact or vanilla TypeScript). **No heavy libraries.**
- Search: Pagefind. Tests: Vitest. CI: GitHub Actions.
- Hosting target: Cloudflare (static output).

## Commands (create these in package.json)

- `npm run dev` start dev server
- `npm run build` production build (must pass)
- `npm run validate:data` check data files (must pass; see rules)
- `npm test` run calculator and data tests
- `npm run lint` lint and format check

Run `validate:data`, `test` and `build` before saying a task is done.

## Conventions

- Small, focused commits with clear messages.
- Calculators are **pure functions** in `src/lib/calculators/`, each with tests that use known answers (hand-checked, listed in `docs/TASKS.md`).
- Styling: Tailwind CSS v4 (CSS-first, tokens in @theme in src/styles/global.css). Plain CSS only for custom rules.
  No SCSS/Sass/Less. Shared patterns go in @layer components in global.css. Use v4 class names (check the docs).
- Ask before adding Tailwind plugins, UI kits or font CDNs.
- Mobile first. Accessible HTML (labels, focus states, contrast, keyboard use).
- Performance: ship almost no JavaScript on content pages. Reserve space for future ad slots to avoid layout shift.
- Do not add third-party scripts (analytics, ads, fonts, widgets) without asking the user.
- Self-host fonts. Optimize images with Astro image tools.
- Every page needs: title, meta description, canonical URL, breadcrumbs where relevant.

## Content and legal rules

- Every page that shows legal or fee data must show: **source link, "Last verified" date, and a "not legal advice" note**.
- Plain-English summary first, details after.
- No keyword stuffing. Write for readers.
- Do not copy text from other websites. Facts only, in our own words, with links to the official source.

## When you are unsure about a framework detail

Check the official docs or the installed package version first. Say what you checked.
