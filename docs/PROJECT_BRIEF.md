# Project brief

## One-line summary

A fast, trustworthy website for **U.S. trade contractors** (electricians, plumbers, HVAC, roofers, general contractors, handymen, landscapers, painters, etc.) and **people starting a trade business**. It combines **verified state licensing data** with **free tools** (calculators and checkers).

## Why this site can win

- Many existing sites **disagree with each other** on basic licensing facts, and many are outdated (for example the California unlicensed-work limit became $1,000 on 2025-01-01, but older pages still say $500).
- We show an **official source link and a "last verified" date** for every fact.
- Tools that use **verified data** are hard for a chatbot to copy reliably.

## Audience

- People starting or growing a trade business in the U.S.
- Career changers going solo.
- Small contractor office managers.
- Primary country: United States.

## Who is building it

The site owner is **not a contractor** and relies on official sources plus real expert reviewers. Do not invent expertise, authors or credentials anywhere on the site. Use `TODO(user)` placeholders for names, bios and reviewer credits.

## Content model (what pages exist)

| Section           | URL pattern                                                          | Built from                                                                   |
| ----------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Home              | `/`                                                                  | three entry doors: Find your state, Find your trade, Plan your startup costs |
| State page        | `/licensing/<state>/`                                                | `data/states/<state>.yaml`                                                   |
| Trade overview    | `/trades/<trade>/`                                                   | `data/trades.yaml` plus state data                                           |
| Tools             | `/tools/<tool>/`                                                     | `src/lib/calculators/` plus data                                             |
| Research and data | `/research/...`                                                      | data files                                                                   |
| Trust pages       | `/about/`, `/methodology/`, `/editorial-standards/`, `/corrections/` | Markdown                                                                     |

## Tools (build order)

1. License lookup hub (links to official lookup pages)
2. "Do I need a license for this job?" checker (starts with California)
3. Markup vs margin calculator
4. Contractor hourly rate calculator
5. Startup cost calculator (later; needs more data)
6. Break-even calculator, overhead rate calculator
7. Later: license cost and timeline estimator, Licensing Path Finder, Licensing Difficulty Map, reciprocity checker

## Quality bar

- Static site, very little JavaScript, fast on phones.
- Every fact: value + official source URL + verified date + confidence.
- Missing or unconfirmed facts display "Needs confirmation".
- Clear "not legal advice" notes. Public corrections log.

## Current data status

- `data/states/california.yaml`: drafted from official CSLB sources on 2026-10-09. Some fields flagged `confirm`.
- Florida and Texas: not yet in the repo (research in progress; do not create values from memory).

## Out of scope (for now)

Accounts/logins, payments, ads, affiliate links, user-generated content, AI chat features.
