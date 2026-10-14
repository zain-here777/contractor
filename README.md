# Contractor Compliance and Tools Site: starter pack

This folder is a ready-to-use starting point for building the site with **Cursor** (or any AI coding agent that reads `AGENTS.md`).

## What is inside

| File                          | Purpose                                                           |
| ----------------------------- | ----------------------------------------------------------------- |
| `AGENTS.md`                   | Main instructions the AI agent reads (rules, stack, commands)     |
| `.cursor/rules/*.mdc`         | Cursor project rules (data integrity, calculators, site quality)  |
| `docs/PROJECT_BRIEF.md`       | What the site is and who it is for                                |
| `docs/TASKS.md`               | Step-by-step build tasks T1 to T11 with acceptance checks         |
| `docs/DATA_DICTIONARY.md`     | What each state data file should contain                          |
| `docs/FULL_PLAN.md`           | The full human-readable plan (research, phases, stack, data pack) |
| `data/states/california.yaml` | Draft licensing data for California, with official sources        |

## How to start (about 10 minutes)

1. Install **Node.js (LTS)** and **Git** if you do not have them. (Ask Cursor to guide you if unsure.)
2. Unzip this folder and open it in Cursor (File, Open Folder).
3. Open Cursor's **Agent** chat and paste the prompt below.
4. After each task: read the summary, run the commands it lists, and look at the result in the browser.
5. Commit to Git when you are happy (ask Cursor to create the first commit).

## First prompt (copy and paste)

```
Read AGENTS.md, docs/PROJECT_BRIEF.md and docs/TASKS.md.
We are building a static Astro website that publishes verified U.S. contractor
licensing data and free tools.

Rules: never invent facts or data; follow AGENTS.md and the rules in .cursor/rules.

Start with Task T1 only. Before you change anything, tell me your plan in 5 bullets,
including the Astro version you will use (check it with npm view astro version)
and any dependencies you want to add. Wait for my approval before installing anything.

After finishing T1, summarise what changed, list the commands I should run, and stop.
Do not start T2 until I say so.
```

## Check that Cursor is following the rules

Cursor has no indicator for active rules, so ask it: "Which rules from AGENTS.md and .cursor/rules are you following for this task?"

## Safety checklist for you (the owner)

- Look at every change inside `data/`. Cursor must **never** edit facts without a source you gave it.
- Confirm calculator results by hand with a normal calculator.
- Do not publish the site until a real expert has reviewed the legal facts.
- Do not let Cursor invent an About page story, reviewer names or credentials.
- Keep the "Needs confirmation" behaviour. A blank is better than a wrong number.

## What you still need to provide

- A brand name and domain
- Real contractor input (interviews) and a real expert reviewer
- Verified data for more states (ask Claude to research each state, then verify the risky facts yourself)
- Decisions about ads, affiliates and the newsletter later

## Data status (as of 2026-10-09)

- California: drafted from official CSLB sources. Flagged items must be confirmed before use.
- Florida and Texas: research in progress. Do not add values from memory.
