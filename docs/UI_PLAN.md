# UI plan v2: minimal professional business site (Tailwind CSS v4)

_Save as `docs/UI_PLAN.md` (replace the earlier version). It builds on `docs/IMPLEMENTATION_AUDIT.md`, `AGENTS.md` and `docs/PROJECT_BRIEF.md`._
_I have only seen the audit, not the source files. Cursor must adapt names and structure to what actually exists._

**What changed from v1:** the owner approved **Tailwind CSS**. This version adds a Tailwind adoption step (U0), converts the design tokens to Tailwind's `@theme`, and updates the rules. **SCSS is not used** (see Section 2).

---

## 1. Design rationale (one paragraph)

Contractors and people starting a trade business are busy and cautious. They want an answer fast and a reason to trust it. The look should be calm and plain: white space, one dark text color, one blue accent, one sans-serif family, thin borders instead of heavy cards, and short sentences. Every page should answer three questions: _What can I do here? Where did this fact come from? When was it checked?_ Trust elements (source, date, "Needs confirmation") are part of the design, quiet but always visible.

## 2. CSS approach: Tailwind v4 with plain CSS, no SCSS

| Decision                | Choice                                                                                                                                   | Reason                                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Utility framework       | **Tailwind CSS v4**                                                                                                                      | Approved by the owner                                                                                                                                                 |
| Install method          | **`tailwindcss` + `@tailwindcss/vite`** plugin in `astro.config.mjs`, and `@import "tailwindcss";` at the top of `src/styles/global.css` | This is Tailwind's documented Astro setup. **Cursor must re-check the official guide for Astro 7.3.8**                                                                |
| Fallback                | `@tailwindcss/postcss`                                                                                                                   | A reported build error with the Vite plugin on an Astro 6 project was fixed this way. Only try it if the build fails, and tell the owner first                        |
| Tokens                  | Tailwind `@theme` block in `global.css` (native CSS variables)                                                                           | Colors, fonts and sizes become classes like `text-ink` and `bg-surface`                                                                                               |
| **SCSS / Sass**         | **Do not use**                                                                                                                           | Tailwind v4's own compatibility docs say it is not designed to be used with CSS preprocessors like Sass, Less or Stylus. Native CSS already has variables and nesting |
| CSS Modules / CSS-in-JS | Do not use                                                                                                                               | Not needed with utility classes                                                                                                                                       |
| Typography plugin       | **Ask first**                                                                                                                            | `@tailwindcss/typography` is optional; a small hand-written prose style may be enough (Section 5.5)                                                                   |

If a feature seems to need SCSS (mixins, loops, math), tell the owner and propose a native CSS or Tailwind alternative instead.

### Tailwind rules for this project

1. Use **v4 class names**. Many v3 snippets online are outdated (for example some shadow, radius and outline utilities were renamed). Check the current docs, not memory.
2. Keep design values in the **`@theme` tokens**. Avoid arbitrary values such as `w-[437px]` or `text-[#123456]`.
3. Put **repeated patterns** (buttons, panels, fact tables, form fields) into named classes in `global.css` under `@layer components`. Do not repeat 15-class strings across pages.
4. Do **not** use `@apply` inside component-level `<style>` blocks. Shared patterns live in `global.css`.
5. Tailwind's base reset removes default styling from headings, lists and paragraphs. Restore it deliberately (Section 5.5).
6. Keep **JavaScript minimal**. Tailwind does not change this rule.
7. Do not add Tailwind plugins, the Prettier Tailwind plugin, or UI kits (daisyUI, shadcn and similar) without asking.
8. Output CSS must stay small. Report the built CSS size after U0 and after U3.

## 3. Decisions I'm assuming (change any)

| Open question from the audit | Default                                                                | Why                                    |
| ---------------------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| Brand name and domain        | Unknown. One config value marked `TODO(user)`                          | Never invent a brand                   |
| Accent color                 | Calm blue `#1d4f9c`                                                    | Neutral, credible, passes contrast     |
| Dev component page           | Remove from nav, add `noindex`, delete before launch                   | Keeps the gallery for development only |
| Home page                    | Short value line, three doors, one featured tool, "how we handle data" | Clear actions without fluff            |
| Launch scope                 | **Not public yet** (Section 8)                                         | One state, still a draft               |

## 4. Design tokens (top of `src/styles/global.css`)

```css
@import "tailwindcss";

@theme {
  /* Color: text pairs checked against WCAG AA (4.5:1) */
  --color-ink: #1b2430; /* body text, 15.7:1 on white */
  --color-muted: #556070; /* secondary text, 6.4:1 */
  --color-bg: #ffffff;
  --color-surface: #f5f7fa; /* soft panels */
  --color-border: #e3e7ec; /* decorative dividers */
  --color-border-strong: #768091; /* form fields, 4.0:1 (needs 3:1) */
  --color-accent: #1d4f9c; /* links and buttons, 7.9:1 */
  --color-accent-hover: #163d7a;
  --color-warn-bg: #fff4dc; /* "Needs confirmation" */
  --color-warn-ink: #7a4b00; /* 6.8:1 on warn-bg */
  --color-ok-bg: #e8f5ec; /* "Verified from official source" */
  --color-ok-ink: #14532d; /* 8.1:1 on ok-bg */

  /* Type: system stack for now. Self-hosting a font needs the owner's OK. */
  --font-sans:
    system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    sans-serif;

  /* Layout widths (used as max-w-page and max-w-prose-site) */
  --container-page: 68rem;
  --container-prose-site: 42rem;

  /* Shape */
  --radius-card: 6px;
  --shadow-soft: 0 1px 2px rgb(27 36 48 / 0.06);
}

@layer base {
  html {
    color: var(--color-ink);
    background: var(--color-bg);
    font-family: var(--font-sans);
  }
  body {
    font-size: 1.0625rem;
    line-height: 1.6;
  } /* 17px for comfortable reading */
  a {
    color: var(--color-accent);
    text-underline-offset: 0.15em;
  }
  a:hover {
    color: var(--color-accent-hover);
  }
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

Cursor: check Tailwind's current docs for exactly how `@theme` names map to utility classes (for example `--color-ink` gives `text-ink`, `bg-ink`, `border-ink`). Confirm after the build that classes like `text-ink`, `bg-surface` and `max-w-page` work.

### Shared component classes (also in `global.css`)

Create these under `@layer components`, using `@apply` with the tokens:

| Class                                    | Purpose                                                   |
| ---------------------------------------- | --------------------------------------------------------- |
| `.btn`, `.btn-primary`, `.btn-secondary` | Buttons (min height 44px, visible focus)                  |
| `.panel`                                 | Soft panel: surface background, thin border, small radius |
| `.fact-table`                            | Zebra rows, header cells, horizontal scroll wrapper       |
| `.badge-ok`, `.badge-warn`               | "Verified" and "Needs confirmation"                       |
| `.field`, `.field-label`, `.field-error` | Tool form fields                                          |
| `.result-panel`                          | Calculator result with a 4px accent left border           |
| `.prose-site`                            | Readable long text for trust and legal pages              |

Existing component names (`SourceBox`, `VerifiedBadge`, `FactTable`, `NotLegalAdvice`) keep their API. Only their styling changes.

## 5. Page designs

### 5.1 Header and footer (`BaseLayout.astro`)

**Header:** brand text at left (plain text, with a `TODO(user): logo` comment). Nav at right: **Licensing · Tools · About · Search**. No "Component test" link. On narrow screens the nav wraps to a second row or uses a `<details>` menu. No JavaScript menus.

**Footer**, three short columns:

- **Explore:** Licensing, Tools, Search
- **Trust:** Methodology, Editorial standards, Corrections
- **Legal:** Privacy, Terms, Contact

One line below: "Information only. Not legal advice. Always confirm with the official licensing board." Keep the ad-slot placeholder with reserved height but no visible dashed box.

### 5.2 Home page (`src/pages/index.astro`)

No fake statistics, testimonials, or claims about experts. Say only what is true today.

**A. Hero**

- H1: **"Clear, sourced answers on U.S. contractor licensing."** `TODO(user): final wording`
- Sub-text: "Every fact links to an official source and shows when it was last checked. Free tools for contractors and people starting a trade business."
- Buttons: **Find your state** (`/licensing/`, primary) and **Try a free tool** (`/tools/`, secondary).
- Small muted line: "Currently covering California. More states are added as they are verified."

**B. Three doors** (three equal blocks, thin border)

1. **Find your state**: "See licensing rules, fees and sources by state." Links to `/licensing/`.
2. **Find your trade**: "Rules for electricians, plumbers, HVAC and more." Label **Coming soon** (no link).
3. **Plan your startup costs**: "Estimate what it takes to get licensed and start." Label **Coming soon** (no link).

**C. Featured tool:** "Do I need a license for this job? (California)" with one sentence and a button to `/tools/do-i-need-a-license/`.

**D. How we handle data** (three short items and a link to `/methodology/`)

- **Official sources only.** We read the licensing board's own pages and publications.
- **Source and date on every fact.** You can see where it came from and when it was checked.
- **"Needs confirmation" when unsure.** We would rather show a blank than a wrong number.

**E. Free tools:** links to the four calculators.

**Example markup pattern** (Cursor may adapt):

```astro
<section class="mx-auto max-w-page px-4 py-12 md:py-20">
  <h1 class="max-w-prose-site text-4xl font-semibold leading-tight text-ink md:text-5xl">
    Clear, sourced answers on U.S. contractor licensing.
  </h1>
  <p class="mt-4 max-w-prose-site text-lg text-muted">
    Every fact links to an official source and shows when it was last checked.
  </p>
  <div class="mt-6 flex flex-wrap gap-3">
    <a class="btn btn-primary" href="/licensing/">Find your state</a>
    <a class="btn btn-secondary" href="/tools/">Try a free tool</a>
  </div>
  <p class="mt-4 text-sm text-muted">Currently covering California. More states are added as they are verified.</p>
</section>
```

### 5.3 State page (`/licensing/[state]/`)

1. **Title and status row:** state name, "Last verified: [date]", `VerifiedBadge`.
2. **"At a glance" panel:** 4 to 6 key facts in a grid (license needed from what dollar amount, experience, application fee, bond, license term). **Only facts with `confidence: primary`.** Anything else shows "Needs confirmation".
3. **In-page contents:** a plain list of anchor links, no JavaScript.
4. **Sections:** H2, a short plain-English line, a fact table, then a `SourceBox`. Thin dividers between sections.
5. **"Not legal advice"** near the top and the bottom.

### 5.4 Tool pages

One shared layout: H1, one-sentence intro, form, result panel, then formula in words, worked example, limits, related links.

- Labels above inputs. Inputs at least 44px high. Borders use `border-border-strong`.
- Primary button in the accent color. Result panel uses `.result-panel`.
- Errors are text with a prefix word ("Error:"), not color-only. Results use `aria-live="polite"`.

### 5.5 Trust and legal pages

Use the `.prose-site` class, with a maximum width of `max-w-prose-site`. Because Tailwind's reset strips default heading, list and paragraph styles, define small, explicit styles for: H2/H3 sizes and spacing, paragraph spacing, bullet and numbered lists, links, tables, and block quotes. Do not add `@tailwindcss/typography` without asking.

Any `TODO(user)` must be visible in development and **fail the production build** (Section 8).

## 6. Build steps for Cursor (small steps, approve each)

| Step   | Do                                                                                                                                                                                  | Likely files                                     | Done when                                                |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| **U0** | **Adopt Tailwind v4.** Plan first, wait for approval, then install, wire into Astro, import in `global.css`. Keep the existing CSS working during migration. Report built CSS size. | `package.json`, `astro.config.mjs`, `global.css` | Build passes; a test class renders; no visual regression |
| **U1** | Add `@theme` tokens and base styles. Create the shared component classes (Section 4). Migrate old styles to use them.                                                               | `global.css`                                     | Site looks the same or cleaner; all checks pass          |
| **U2** | Add `src/config/site.ts` (brand placeholder). Redo header and footer. Remove the dev link. Add `noindex` to `/dev/trust-components/` or exclude it from production builds.          | `BaseLayout.astro`, config                       | No dev link in nav; sitemap still excludes it            |
| **U3** | Build the home page (5.2)                                                                                                                                                           | `index.astro`                                    | Matches the brief; fine at 375px                         |
| **U4** | State page hierarchy (5.3)                                                                                                                                                          | state page, components                           | Only `primary` facts in "At a glance"                    |
| **U5** | Tool page consistency (5.4)                                                                                                                                                         | tool layout, components                          | Keyboard-usable, 44px targets, results announced         |
| **U6** | Trust pages prose styles, placeholder favicon (SVG), default Open Graph image placeholder, 404 polish                                                                               | `public/`, layout, CSS                           | No broken icon requests; readable legal pages            |

After each step run `npm run validate:data`, `npm test`, `npm run lint`, `npm run build`. Then summarise, list changed files, and stop.

## 7. Accessibility checklist (every step)

- [ ] One H1 per page; headings in order
- [ ] Skip link works; focus ring visible on every control
- [ ] Text contrast at least 4.5:1; input borders at least 3:1
- [ ] Tap targets at least 44px high on mobile
- [ ] Form fields have visible labels; errors are text, not color only
- [ ] Tables have header cells and scroll sideways inside their own container on small screens
- [ ] Layout works at 375px, 768px and 1280px
- [ ] Pages work with JavaScript off (except the calculators)
- [ ] `prefers-reduced-motion` respected; no animation libraries

## 8. Before anything goes public

1. **California data is a draft.** It needs your spot-check of the riskiest facts and a real expert's review.
2. **Trust pages are placeholders** (`TODO(user)`). Add a build check that **fails the production build if `TODO(user)` appears in any built page**.
3. **Only one state exists.** Fine for a private preview, not for a launch.
4. **Until then:** keep the site private, or public but `noindex` (meta tag plus `robots.txt`) behind a password such as Cloudflare Access.
5. Set `SITE_URL` to the real domain at build time, and resolve the `robots.txt` and `ads.txt` TODOs.

## 9. Do not do without the owner's approval

- SCSS/Sass/Less or any CSS preprocessor (not compatible with Tailwind v4's design)
- Other CSS frameworks or UI kits (Bootstrap, daisyUI, shadcn, etc.), Tailwind plugins, the Prettier Tailwind plugin, `@tailwindcss/typography`
- Third-party font CDNs (self-host later, with the owner's OK)
- Analytics, ads, chat widgets, cookie banners
- Any new facts, statistics, testimonials, "trusted by" claims, reviewer names or credentials
- Pop-ups, auto-playing media, animation libraries

---

## 10. Documents to update after U0 (so they match)

**`AGENTS.md`**, replace the styling line(s) with:

```
- Styling: Tailwind CSS v4 (CSS-first, tokens in @theme in src/styles/global.css). Plain CSS only for custom rules.
  No SCSS/Sass/Less. Shared patterns go in @layer components in global.css. Use v4 class names (check the docs).
- Ask before adding Tailwind plugins, UI kits or font CDNs.
```

**`docs/IMPLEMENTATION_AUDIT.md`**

- Section 3, "Styling" row: change to "Tailwind CSS v4 + native CSS in `src/styles/global.css`. No SCSS."
- Section 8.4, first bullet: change to "New CSS frameworks other than Tailwind, UI kits, or any CSS preprocessor."
- Section 11 prompt: replace "plain CSS in src/styles/global.css" with "Tailwind v4 with tokens in src/styles/global.css (no SCSS)".

**`.cursor/rules/site-quality.mdc`**: add one line: "Use Tailwind v4 utilities and the @theme tokens. No SCSS. No arbitrary color or size values."
