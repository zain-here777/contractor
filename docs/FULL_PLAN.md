# Contractor Tools Site: Tools List, Contractor Basics, Data Pack, Phase Plan and Tech Stack

_Plain-English guide. Researched October 9, 2026._

**Labels:**

- ✅ **Verified**: I read it on an official page or publication today.
- 📊 **Secondary**: seen only on non-official sites. Never publish these as fact.
- ⚠️ **Conflict or unknown**: sources disagree, or I could not confirm it.
- 💭 **My guess or advice**: reasoning, not data.

**Not legal advice.** The state board is always the final authority, and rules change.

---

## 0. What I did this round, and what you now have

You said you don't know much about contractors and licenses, and you want my full support in finding authentic data. So I started the real work:

| Item                      | Status                                                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **California** (CSLB)     | ✅ **Verified** from CSLB's own publication, FAQ, fee page and bond pages. A starter data file is included (`california.yaml`)                                                 |
| **Florida** (DBPR / CILB) | 🟡 **Partly verified.** The license structure is confirmed from the official site. Fees, experience and exam details are **not confirmed**, and secondary sources **conflict** |
| **Texas** (TDLR / TSBPE)  | 🟡 **Partly verified.** Secondary sources agree there is no statewide general-contractor license. Official pages and fees still to confirm                                     |
| **Tools list**            | 20 tools, ranked by build effort and expected demand                                                                                                                           |
| **Phase plan**            | Phase 0 to Phase 7, with exact tasks for you                                                                                                                                   |
| **Tech stack**            | Recommendation with reasons                                                                                                                                                    |

**Why the California data matters:** the same facts differ across websites. The unlicensed-work limit, for example, is $1,000 since January 1, 2025 ✅, but older pages still say $500. This is exactly the gap your site can fill.

---

## 1. Contractor basics in plain English (read this first)

You don't need to become a contractor. You need to understand the vocabulary so you can spot mistakes.

**The big idea:** In the US, each _state_ decides who may do construction work and under what conditions. There is no single national contractor license. Some states license many trades. Some, like Texas, license only a few trades. Cities can add their own rules.

| Word                              | Meaning                                                                                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contractor**                    | A person or company paid to build, repair or improve buildings                                                                                                       |
| **License**                       | Government permission to work as a contractor (usually requires experience, exams, bond, insurance)                                                                  |
| **Registration**                  | A lighter form of permission, often local, with fewer tests                                                                                                          |
| **General contractor (GC)**       | Manages a whole project; may hire specialists                                                                                                                        |
| **Specialty / trade contractor**  | Does one trade: electrical, plumbing, HVAC, roofing, painting, etc.                                                                                                  |
| **Classification**                | The type of license (California has 45, for example) ✅                                                                                                              |
| **Qualifier**                     | In California, the person who meets the experience and exam rules for a license ✅                                                                                   |
| **RME / RMO**                     | Responsible managing employee / officer. A person who qualifies a company's license ✅                                                                               |
| **Journey-level (journeyperson)** | An experienced worker who can do the trade without supervision ✅                                                                                                    |
| **Surety bond (license bond)**    | A financial guarantee, bought from an insurer, that protects customers and workers if the contractor breaks the rules. It is **not** insurance for the contractor ✅ |
| **General liability insurance**   | Pays for damage or injury caused by the work                                                                                                                         |
| **Workers' compensation**         | Insurance for employees hurt on the job                                                                                                                              |
| **Reciprocity**                   | One state accepting another state's license or exam, often with conditions. **Never automatic.**                                                                     |
| **NASCLA exam**                   | A national exam some states accept in place of their own trade exam ✅                                                                                               |
| **Permit**                        | City or county approval for specific work                                                                                                                            |
| **Mechanics lien**                | A legal claim on a property by someone who wasn't paid for work. Strict deadlines apply                                                                              |
| **Minor work exemption**          | A dollar limit under which some states allow unlicensed work, with conditions ✅ (California: under $1,000, no permit, no workers)                                   |

**How becoming licensed usually works** (California's version is typical, ✅):

1. Show years of work experience (California: 4 years journey-level in the last 10).
2. Apply and pay fees.
3. Pass exams (usually a law and business exam plus a trade exam).
4. Get fingerprinted for a background check.
5. Buy the required bond; show insurance or an exemption.
6. Receive the license; renew every few years.

**Three examples of why accuracy matters:**

- A contractor starting a job in California over the limit without a license faces criminal and civil penalties ✅.
- A reader who sees "$500" on an old site may take a job they legally can't.
- An LLC in California needs an extra $100,000 worker bond and liability insurance that sole owners don't ✅. Most blogs miss this.

### A one-week learning plan (about 8–10 hours)

1. **Read CSLB's "Get Licensed to Build" guide** (free PDF, 50 pages; link in Section 4).
2. **Attend CSLB's free "Get Licensed to Build" workshop.** CSLB states it runs on the first Friday of each month (English) and the third Friday (Spanish) ✅. Check CSLB's site for the next date.
3. **Talk to 5 real contractors** (script below).
4. **Pick one state's board website and walk the whole application page by page**, as if you were applying.
5. **Read the same state on 3 competitor sites** and write down every disagreement.

**Five-contractor interview script (20 minutes each):**

1. What trade are you in, and how long have you been licensed?
2. What was the hardest part of getting licensed?
3. What surprised you (cost, time, paperwork)?
4. What mistakes do new contractors make?
5. What did you search for online while doing this?
6. What would you pay for, or want as a free tool?
7. Which websites did you trust or distrust, and why?
8. What would make you trust a new site?

Where to find them: local trade associations, trade school instructors, contractor Facebook groups, LinkedIn, and by simply asking local tradespeople. 💭 Offer to share the results.

---

## 2. The tools list: 20 tools, ranked

**How to read this:**

- **Build effort:** S = a few days, M = 1–2 weeks, L = several weeks. 💭 Assumes AI-assisted coding.
- **Needs verified data?** "Yes" means the tool is only as good as your checked database. That is also what makes it hard for a chatbot to copy.
- **Demand guess:** my estimate from the type of query (high commercial intent, how common the question is). **It is not keyword data.** Test each tool with the phrases in the second table before building. 💭
- **Edge:** how hard it is to replace with a chatbot or copy by a competitor.

### Why "tools that need verified data" come first

A study of tools sites found that single-purpose tools lost visits as chatbots grew: Chegg −61%, Quizlet −29%, Grammarly −15%, translators −22.5% (📊 third-party estimates, to April 2026). Generic calculators are easy for a chatbot to do. Tools built on **checked state data** are not, because a chatbot may guess wrong and you can show sources.

### Ranked list (build order)

| #   | Tool                                                                  | What it does                                                | Effort | Verified data?                       | Demand guess 💭                | Edge                                                         |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------- | ------ | ------------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| 1   | **License lookup hub**                                                | Links each state/trade to the official license-lookup page  | S      | URLs only                            | Medium                         | Low (but great for internal links and trust)                 |
| 2   | **"Do I need a license for this job?"**                               | Enter state, job value, permit, workers → plain answer      | M      | **Yes** (thresholds and exceptions)  | **High**                       | **High**                                                     |
| 3   | **Markup vs margin calculator**                                       | Converts markup ↔ margin; price from target margin          | S      | No                                   | Medium–High (crowded)          | Low                                                          |
| 4   | **Contractor hourly rate calculator**                                 | Pay goal + overhead + profit ÷ billable hours               | S      | No                                   | Medium                         | Low–Medium                                                   |
| 5   | **Startup cost calculator**                                           | Trade + state + crew → low/typical/high first-year cost     | M      | **Yes** (fees) + dated vendor prices | **High**                       | **High**                                                     |
| 6   | **License cost and timeline estimator**                               | Official fees, exams, bond, fingerprints by state and trade | M      | **Yes**                              | **High**                       | **High**                                                     |
| 7   | **Licensing Path Finder**                                             | Personal step-by-step roadmap with cost and checklist       | L      | **Yes**                              | **High**                       | **Very high** (your flagship)                                |
| 8   | **Break-even calculator**                                             | Jobs or revenue needed to cover fixed costs                 | S      | No                                   | Medium                         | Low                                                          |
| 9   | **Overhead rate calculator**                                          | Turns yearly overhead into a rate per hour or job           | S      | No                                   | Medium                         | Low                                                          |
| 10  | **Bid / estimate worksheet** (printable PDF)                          | Structured estimate with labor, materials, markup           | M      | No                                   | Medium–High                    | Medium                                                       |
| 11  | **Licensing Difficulty Map and ranking**                              | All states scored on experience, exams, fees, bond, time    | M      | **Yes** (many states)                | Medium (link magnet)           | **Very high**                                                |
| 12  | **Reciprocity checker**                                               | "I'm licensed in X. Where can I work next?"                 | M      | **Yes**                              | Medium                         | High                                                         |
| 13  | **"Which trade should I start?" quiz**                                | Compares trades on pay, startup cost, license difficulty    | M      | BLS wages ✅ + your data             | Low–Medium (shareable)         | Medium–High                                                  |
| 14  | **Sales-tax-on-construction lookup**                                  | Is labor or material taxed in this state?                   | L      | **Yes** (each state's tax agency)    | Medium                         | High (heavy upkeep)                                          |
| 15  | **Mechanics lien deadline calculator**                                | Notice and filing deadlines by state                        | L      | **Yes** (statutes)                   | Medium–High                    | High, but needs attorney review; strong competitor exists 💭 |
| 16  | **License renewal reminder**                                          | Email reminders before renewal                              | M      | Yes (renewal rules)                  | Medium                         | Medium (builds your email list)                              |
| 17  | **Workers' comp exemption checker**                                   | Do I need coverage? Can I get an exemption?                 | M      | **Yes**                              | Medium                         | High (accuracy risk, reviewer needed)                        |
| 18  | **Quote / estimate / invoice generator** (saved templates)            | Branded documents saved to an account                       | L      | No                                   | High (very crowded)            | Medium (retention)                                           |
| 19  | **Material calculators** (roofing squares, concrete, paint, flooring) | Quantities with waste factor                                | S each | No                                   | High (very crowded, low value) | Low                                                          |
| 20  | **Self-employment tax set-aside estimator**                           | Estimates quarterly set-aside                               | M      | IRS rules                            | Medium                         | Low–Medium (CPA review needed)                               |

### Recommended first build (Phases 4–5)

**First five:** #1 (hub), #3 (markup), #4 (hourly rate), #2 (license threshold checker for pilot states), #5 (startup cost, pilot states). They are quick to build and give you something real to launch with.
**Next:** #6, #7 (Path Finder), #11 (Difficulty Map), #12.
**Later (after launch, with expert review):** #14, #15, #17, #16, #18.
**Skip or minimize:** #19 and #20 unless keyword data says otherwise.

### Phrases to test in Google Keyword Planner (or Ahrefs/Semrush) before building

For each, check monthly search volume, CPC, and whether the top 10 are weak, outdated, or conflicting. 💭

| Tool                      | Phrases to test                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| License threshold checker | "do I need a contractor license in [state]", "contractor license limit [state]", "handyman license [state]" |
| Startup cost              | "cost to start a [trade] business", "how much to start a roofing business"                                  |
| License cost estimator    | "[state] contractor license cost", "how much is a contractor license in [state]"                            |
| Path finder               | "how to get a contractor license in [state]", "[trade] license [state]"                                     |
| Reciprocity               | "[state] contractor license reciprocity", "NASCLA exam states"                                              |
| Markup/margin             | "markup vs margin calculator", "contractor markup calculator"                                               |
| Hourly rate               | "contractor hourly rate calculator", "how to calculate hourly rate for contractor"                          |
| Lien deadline             | "mechanics lien deadline [state]", "preliminary notice [state]"                                             |
| Sales tax                 | "is labor taxable in [state] construction"                                                                  |
| Workers' comp             | "workers comp exemption contractor [state]"                                                                 |
| Trade quiz                | "which trade pays the most", "best trade to start a business"                                               |

**Decision rule (💭 my rule of thumb):** build a tool first only if (a) its phrases show real volume, (b) at least some top-10 results are weak or outdated, and (c) you can fill the data from official sources.

---

## 3. Data pack: what I verified (pilot states)

### 3.1 California: ✅ verified from CSLB's own pages (October 9, 2026)

The full structured version with source links is in **`california.yaml`**. Summary:

| Topic                       | Fact                                                                                                                                                                                                                                                                       | Source (official)                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Agency                      | Contractors State License Board (CSLB), under the Dept. of Consumer Affairs. About 285,000 licensees, 45 classifications                                                                                                                                                   | CSLB "Get Licensed to Build" guide, May 2025 ed.                    |
| License needed when         | Work valued at **$1,000 or more** in labor and materials combined. Splitting jobs to avoid the limit is illegal. A permit or hiring workers means a license is needed **regardless of cost**                                                                               | Same guide, p. 3–4; CSLB Winter 2025 newsletter confirms the change |
| When it changed             | Raised from $500 to $1,000 on **January 1, 2025** (AB 2622)                                                                                                                                                                                                                | CSLB Winter 2025 newsletter; CSLB press release                     |
| Penalty for unlicensed work | First offense: up to 6 months jail and/or $5,000 fine; administrative fines $200–$15,000; possible felony in declared disaster areas                                                                                                                                       | Guide, p. 5                                                         |
| Who qualifies               | Qualifier at least 18, with SSN or ITIN, and **4 years of journey-level experience in the last 10 years** in that classification. Education or apprenticeship can substitute for part, but at least 1 year of hands-on experience is required. No residency requirement    | Guide, p. 3, 7–8                                                    |
| Experience proof            | Someone else must certify your experience. Random audits happen                                                                                                                                                                                                            | Guide, p. 7, 19                                                     |
| Exams                       | **Two:** law & business and trade. Computer-based, run by PSI, 3½ hours each. Spanish versions of 10 exams. 21-day wait after a fail. Must pass within 18 months of application acceptance. Passing results valid 5 years                                                  | Guide, p. 21–27; CSLB FAQ                                           |
| Fees                        | Application **$450** (non-refundable). Initial license fee **$200** (sole owner) or **$350** (all other entities), covering the first 2 years. Total **$650 / $800**. Extra classification $150. FBI fingerprint processing $17; Live Scan operator fees vary              | CSLB fee page; guide, p. 33                                         |
| Bond                        | **$25,000** contractor bond (or cashier's check). Effective Jan 1, 2023 (SB 607). Extra $25,000 qualifying-individual bond in some cases                                                                                                                                   | CSLB bond requirements page                                         |
| **LLC extras**              | **$100,000** worker bond **plus** the $25,000 bond, plus $1 million liability insurance (5 or fewer personnel; more for larger)                                                                                                                                            | Guide, p. 30, 33                                                    |
| Workers' comp               | Required if you have employees. Always required for concrete (C-8), HVAC (C-20), asbestos (C-22), roofing (C-39), tree service. Otherwise file an exemption                                                                                                                | Guide, p. 16, 29, 34                                                |
| Other issuance steps        | Fingerprints; asbestos open-book exam                                                                                                                                                                                                                                      | Guide, p. 20                                                        |
| License term                | 2 years initially; active renewals 2 years; inactive renewals 4 years                                                                                                                                                                                                      | Guide, p. 31                                                        |
| Reciprocity                 | California does **not** recognize other states' licenses automatically. Some states have agreements; the trade exam may be waived case-by-case; you still pass the CA law & business exam. CSLB's reciprocity page requires 5 years in good standing in a reciprocal state | Guide, p. 5; CSLB reciprocity page                                  |
| Processing                  | Acknowledgment letter in 4–6 weeks. CSLB updates a processing-times page weekly. No fixed total time                                                                                                                                                                       | CSLB FAQ                                                            |

**Items I flagged ⚠️ in the data file (do not publish until confirmed):**

- PSI exam fees (a school site says $51.43 each; not seen on an official page)
- DOJ fingerprint fee
- Active renewal fee for non-sole-owner licenses
- Which states are on California's reciprocal list
- Tree-service class code wording (the guide uses both C-61/D-49 and C-49)
- Whether the initial license fee may be sent with the application when exams are required (CSLB's FAQ says do not send it; the guide's Q1 says you may). Check the current application form.

### 3.2 Florida: 🟡 structure verified, key numbers in conflict

**✅ Verified from the official DBPR site:**

- Florida's Construction Industry Licensing Board (CILB) sits under the Department of Business and Professional Regulation.
- Two license types: **Certified** (statewide, codes starting with C) and **Registered** (valid only in the local jurisdiction where the contractor registered, codes starting with R).
- Categories include General (CG), Building (CB), Residential (CR), Roofing (CC), Sheet Metal, Class A/B Air-Conditioning, Mechanical, Plumbing (CF), Pool/Spa, Solar, Underground Utility and several specialty categories.
- Official forms exist for each step, for example CILB 1 (exam application), CILB 5-A (certified general contractor as an individual), CILB 32 (reciprocity), CILB 10 (endorsement). The site also lists "Reciprocity and Substantially Equivalent Exams" and "Endorsement" documents.

**⚠️ Numbers that conflict across secondary sites (📊, do not use yet):**

| Item                         | What different sites say                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Application fee              | $145–$305 (range), $149, $249                                                                                          |
| Exam fee                     | $295, or $135 registration + $80 site fee                                                                              |
| Exam provider                | "Professional Testing" on one site, "Pearson VUE" on others                                                            |
| Work limit needing a license | One site says over $2,500, tied to a 2025 change (HB 735)                                                              |
| Experience                   | Several sites agree on 4 years, with 1 year of foreman/supervisor experience (still confirm the exact statute wording) |
| States with reciprocity      | One site says 3 states; another names only Georgia. List not confirmed                                                 |

**To do (primary sources):** open the DBPR checklists for CILB 1 and CILB 5-A, the "Reciprocity" PDF, Florida Statutes Chapter 489 Part I, and the board's rule chapter 61G4. Record each fee with its page.

### 3.3 Texas: 🟡 consistent across sources, official pages still to read

**📊 Eight or more secondary sources agree:**

- **Texas has no statewide general-contractor license.**
- **Electricians and air-conditioning/refrigeration contractors** are licensed by the Texas Department of Licensing and Regulation (**TDLR**).
- **Plumbers** are licensed by the Texas State Board of Plumbing Examiners (**TSBPE**).
- Roofing, painting, handyman and remodeling work generally have no statewide license, but **cities may require registration or permits**.

**To do (primary sources):** read tdlr.texas.gov (electricians and air conditioning/refrigeration pages) and tsbpe.texas.gov (license types and fees), then record fees, exam provider, experience, and insurance rules from those pages. Also check a few big cities' contractor registration rules (Houston, Dallas, Austin) on their own official sites.

**💭 Why this matters for your site:** Texas shows that "Do I need a license in Texas?" has a **three-part answer** (no for general contracting; yes for three trades; maybe locally). This is a perfect page for a verified tool (#2).

---

## 4. Where I got the data (so you can check it yourself)

| What                                                 | Official link                                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| CSLB guide to becoming licensed (May 2025 ed.)       | cslb.ca.gov/Resources/GuidesAndPublications/GetLicensedToBuild_ENG0525_ADA.pdf        |
| CSLB applicant FAQ                                   | www2.cslb.ca.gov/About_us/Public_Info_FAQ.aspx                                        |
| CSLB fees                                            | www2.cslb.ca.gov/About_Us/Library/Fees.aspx                                           |
| CSLB bond requirements                               | www2.cslb.ca.gov/contractors/maintain_license/bond_information/bond_requirements.aspx |
| CSLB bond basics                                     | www2.cslb.ca.gov/Contractors/Bond_Basics.aspx                                         |
| CSLB reciprocity requirements                        | cslb.ca.gov/Contractors/Applicants/Reciprocity/Reciprocity_Requirements.aspx          |
| Florida construction licensing (DBPR)                | www2.myfloridalicense.com/construction-industry/                                      |
| NASCLA participating agencies                        | nascla.org/page/ParticipatingAgencies                                                 |
| BLS wages by state                                   | bls.gov/oes (annual May data)                                                         |
| CareerOneStop License Finder (find the right agency) | careeronestop.org                                                                     |

---

## 5. How we work together on research (so you get authentic data)

I can read official pages and PDFs, pull out the facts, and write them into the data file with a source for each one. You and a reviewer make sure they are right and keep them current.

**The loop for each state:**

1. **You tell me the state** (and the trades).
2. **I find the agencies** (using CareerOneStop and the state's own site) and read the official pages, forms, fee schedules and laws.
3. **I produce a draft data file** like `california.yaml`, with a source link and a confidence flag on every fact, and a list of what I couldn't confirm.
4. **You open the links for the 5–8 riskiest facts** (fees, thresholds, bonds, experience, exams, reciprocity) and compare. I'll tell you exactly which.
5. **A reviewer** (licensed contractor or construction attorney) signs off on the legal-type facts.
6. **We publish with a "last verified" date**, and recheck on a schedule.

**Limits you should know:**

- I read pages as they are _today_; they can change, and some official sites block automated reading. If so, you download the PDF and upload it here for me to extract.
- I can't call boards or confirm anything by phone. That's your or your reviewer's job for unclear points.
- I may misread a table. That's why you check the riskiest facts.
- Where I couldn't verify something, I leave it blank and flag it. I won't guess.

**Data quality rules for the site (enforced in code, see Section 7):** every fact must have a source link and a "verified on" date, or it won't show on the site.

---

## 6. The phase-by-phase plan

**Assumptions (💭):** one person at 15–25 hours a week, me for research and code, and a part-time expert reviewer. If you have less time, double the weeks.

**Who does what:** **You** = decisions, verification, outreach. **Claude** = research, data drafts, code, calculators, content drafts. **Reviewer** = expert sign-off on legal-type facts.

### Overview

| Phase                              | Weeks    | Goal                                                        | Gate to pass before moving on                              |
| ---------------------------------- | -------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| **0. Learn, validate, pilot data** | 1–2      | Understand the field; prove the idea; finish 3 pilot states | Validation passes; 3 pilot states drafted; go/no-go        |
| **1. Foundation**                  | 3–4      | Brand, domain, accounts, repo, hosting                      | Site "hello world" live on staging; analytics works        |
| **2. Data engine**                 | 3–6      | Data schema, validation, 8–10 states                        | Build fails on unsourced facts; 8–10 states at "confirmed" |
| **3. Design**                      | 4–6      | Wireframes, templates, design system                        | You approve homepage, state page, tool page                |
| **4. Build core**                  | 6–10     | State pages, trade pages, tools #1–5                        | Core pages pass speed and accuracy checks                  |
| **5. Content and expansion**       | 8–16     | 40–60 pages, tools #6–7, difficulty map                     | Reviewer sign-off; quality gate passed                     |
| **6. Pre-launch and launch**       | 14–16    | Legal pages, SEO, monitoring, soft launch                   | Launch checklist complete                                  |
| **7. Growth and monetization**     | Month 5+ | Links, newsletter, AdSense, affiliates                      | Metrics review at months 6 and 9                           |

### Phase 0: Learn, validate, pilot data (weeks 1–2)

**Day-by-day:**

| Day   | You                                                                                         | Claude                                                                                     |
| ----- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1     | Read Section 1. Read CSLB's guide (50 pages, plain English)                                 | Answer your questions on any term; build a glossary page draft                             |
| 2     | Register for the next CSLB workshop (first Friday of the month). Reach out to 5 contractors | Write your outreach message and interview notes template                                   |
| 3–4   | Run 2–3 interviews. Start the keyword list (Section 2 phrases)                              | Build the seed keyword list (300+ phrases) and a SERP-check sheet                          |
| 5–6   | Check Google results for the top 60 phrases. Note weak/wrong answers                        | Compare 3 competitor pages per pilot state against the official facts and list every error |
| 7     | Finish interviews                                                                           | Complete **Florida** data: read the DBPR forms, fee tables and Florida Statutes ch. 489    |
| 8–9   | Verify the 8 riskiest Florida facts                                                         | Complete **Texas** data: read TDLR and TSBPE pages and a few city rules                    |
| 10    | Verify Texas riskiest facts; find reviewer candidates                                       | Draft the reviewer brief and a one-page "what we check" sheet                              |
| 11–12 | Verify California's 8 riskiest facts (Section 3.1 list)                                     | Fix any errors you find in the data files                                                  |
| 13    | Review results: demand, competition, data quality, time per state                           | Prepare the go / narrow / switch recommendation                                            |
| 14    | **Decide**                                                                                  | Shortlist brand names; check domain availability                                           |

**Time-per-state test:** time how long Florida and Texas take you to verify. California took one focused research session on my side plus your spot-check. If a state takes more than about 2 days of _your_ time, plan for fewer states at launch. 💭

**Phase 0 exit criteria (all must be yes):**

- [ ] At least 3 tools show real demand in keyword data
- [ ] You found wrong or conflicting facts on competitor pages for the pilot states
- [ ] 3 pilot states drafted with sources, and your spot checks found no major errors in the high-risk facts
- [ ] At least one reviewer candidate is willing to talk
- [ ] You talked to at least 3 contractors and they said the tools would be useful

### Phase 1: Foundation (weeks 3–4)

- Choose a **brand name** (not keywords) and check trademark, domain and social handles.
- Register the domain. Create accounts: GitHub, Cloudflare, Google (Search Console, Analytics), Bing Webmaster Tools, an email service.
- Create the **repository** (Section 7 structure) and deploy a blank site to staging.
- Write the **editorial standards, methodology and corrections policy** (Claude drafts; you edit to match how you really work).
- Decide the expert-review arrangement and budget.

**Gate:** the staging site loads over HTTPS; analytics receives a test visit.

### Phase 2: Data engine (weeks 3–6, overlapping)

- Turn the data dictionary into a **schema** with required fields (value, source URL, verified date, confidence).
- Add **build-time checks**: the site build fails if a fact has no source or date; "confirm" facts show as "Needs confirmation", never as a number.
- Convert the pilot states to data files.
- Add states in batches of 3–4 using the research loop. Target 8–10 states, chosen by contractor population and mix of rule types (strong licensing, trade-only, no state license).
- Set up the **change log** (Git history plus a public "What changed" page).

**Gate:** 8–10 states at confirmed status; two people (you plus reviewer) have each checked the riskiest facts.

### Phase 3: Design (weeks 4–6)

- Wireframe 6 templates: homepage, state page, trade page, tool page, research page, comparison page.
- Design system: one font family, a restrained color palette, large readable tables, mobile first.
- Trust elements baked in: source box, verified date, reviewer credit, "report an error" button.
- Reserve ad slots (even before ads) so layouts don't jump later.

**Gate:** you approve homepage, state page and tool page designs on a phone-size mockup.

### Phase 4: Build the core (weeks 6–10)

- Build templates and the data-driven pages for the pilot states.
- Build **tools #1–5** (Section 2).
- Each calculator gets automated tests with known answers. For example, a markup of 25% on $1,000 cost gives a $1,250 price and a 20% margin; the test should check exactly this.
- Add site search, sitemap, structured data, speed optimization.

**Gate:** pages pass speed checks (target main content in under about 2.5 seconds on mobile 💭); calculators match hand calculations.

### Phase 5: Content and expansion (weeks 8–16)

- Reach **40–60 pages**: state hubs, trade roll-ups, startup-cost guides, 3–5 contractor stories from your interviews, glossary.
- Build tools #6, #7 (Path Finder) and #11 (Difficulty Map) as data allows.
- Weekly rhythm: research 2 days, write 2 days, QA 1 day.
- Apply the **page quality gate** (every page has a unique element, sources, a next step, and a reviewer if legal-type).

**Gate:** reviewer sign-off on all legal-type pages; no page without sources.

### Phase 6: Pre-launch and launch (weeks 14–16)

- Legal pages: About (honest about who runs the site), Privacy, Terms, "not legal advice", affiliate and ad disclosures, cookie consent.
- Final checks: mobile testing, speed, broken links, sitemap, analytics, backups.
- Soft launch: submit the sitemap, publish the "How we verify our data" page, share with the contractors you interviewed.
- Apply for **AdSense** once there are ~25–40 solid pages and the trust pages are live.

### Phase 7: Growth and monetization (month 5+)

- Email associations, trade schools and apprenticeship programs offering your dataset.
- Publish the first research piece (Licensing Difficulty Map and ranking).
- Add affiliate partners you've actually read the terms of.
- Monthly updates, quarterly re-verification of top pages.
- **Checkpoints:** month 6 and month 9 reviews (see the earlier guide).

---

## 7. Best tech stack (my recommendation)

### The choice: Astro + data files in Git + Cloudflare

| Layer                           | Pick                                                                                                | Why                                                                                                                                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**                   | **Astro** (open source, MIT licensed)                                                               | Built for content-driven sites: static HTML by default, small interactive "islands" only where needed (your calculators). Cloudflare acquired the Astro team in January 2026, and Astro stays open source and works on any host ✅ |
| **Language**                    | TypeScript                                                                                          | Catches mistakes in calculators and data                                                                                                                                                                                           |
| **Data**                        | YAML/JSON files, one per state (like `california.yaml`)                                             | Human-readable; every change is tracked in Git                                                                                                                                                                                     |
| **Data validation**             | Astro content collections with a schema (Zod)                                                       | **The build fails if a fact has no source link or date.** This enforces authenticity in code                                                                                                                                       |
| **Calculators**                 | Small TypeScript/Preact components                                                                  | Fast, testable, and light                                                                                                                                                                                                          |
| **Search**                      | Pagefind (static site search)                                                                       | Works without a server                                                                                                                                                                                                             |
| **Hosting and CDN**             | **Cloudflare** (static hosting plus DNS plus CDN)                                                   | Fast worldwide and has a free tier. Check Cloudflare's current docs for plan limits and how Pages vs Workers static hosting works                                                                                                  |
| **Source control and deploy**   | GitHub plus automatic builds                                                                        | Free tier; every update is reviewable                                                                                                                                                                                              |
| **Automated checks (CI)**       | GitHub Actions: data validation, calculator tests, link checker, Lighthouse speed test              | Catches errors before they go live                                                                                                                                                                                                 |
| **Analytics**                   | Google Search Console, GA4, Bing Webmaster Tools                                                    | Standard                                                                                                                                                                                                                           |
| **Newsletter**                  | MailerLite, Beehiiv or Buttondown (check pricing)                                                   | List building from day one                                                                                                                                                                                                         |
| **Forms and "report an error"** | A simple form service or a Cloudflare Worker                                                        | No server to manage                                                                                                                                                                                                                |
| **Ads**                         | AdSense script plus an `ads.txt` file in the public folder, plus a consent tool for EEA/UK visitors | Static sites work fine with AdSense                                                                                                                                                                                                |
| **Images and fonts**            | Astro's built-in image tools; self-hosted fonts                                                     | Speed                                                                                                                                                                                                                              |

### Why this stack, honestly

**Strengths:**

1. **Authenticity is enforced by the build**, not by memory. A fact without a source can't be published.
2. **Speed.** Static pages with almost no JavaScript tend to score well on Core Web Vitals.
3. **Pages come from data.** One YAML file per state powers the state page, the Path Finder, the threshold checker and the Difficulty Map, so a correction fixes everything.
4. **Git history is your audit trail**, and doubles as your public change log.
5. **Low running cost** (domain plus optional tools). 💭
6. **I can write most of the code**, tests and data files for you.

**Trade-offs:**

- You'll need to be comfortable with files, a code editor and Git basics. 💭 I'll give you step-by-step instructions and a short "how to update a fact" guide.
- It's less friendly for non-technical editors than WordPress.
- Some plugins you'd get free in WordPress (forms, SEO) are things we assemble ourselves.

### The alternative: WordPress

Choose WordPress (with a fast theme, custom fields for state data, and a table plugin) **if** you don't want to touch code at all. Trade-offs: slower by default, plugin upkeep, and no built-in "fail the build without a source" enforcement. I'd still recommend the same data discipline: a master spreadsheet with source and date columns.

### Suggested project structure

```
/data
  /states/california.yaml    <- one file per state (verified facts + sources)
  /states/florida.yaml
  /trades.yaml               <- trade names and mappings
  /vendors.yaml              <- dated vendor prices for cost calculators
  /bls-wages.json            <- imported from BLS, with release date
/src
  /pages                     <- home, /licensing/[state], /trades/[trade], /tools/...
  /components                <- SourceBox, VerifiedBadge, FactTable, Calculator...
  /lib/calculators           <- pure functions (markup, hourly rate, startup costs)
  /content/config.ts         <- schema: every fact needs source + verified date
/tests                       <- calculator tests with known answers
/public                      <- ads.txt, robots.txt
/.github/workflows           <- automated checks on every update
```

### The one rule the code enforces (plain version)

Each fact in a data file looks like this:

```yaml
bond_usd:
  value: 25000
  source_url: https://www2.cslb.ca.gov/contractors/maintain_license/bond_information/bond_requirements.aspx
  verified_on: 2026-10-09
  confidence: primary # primary | confirm
```

The site build **stops** if:

- a `value` has no `source_url` or `verified_on`,
- `confidence` is `confirm` but the page tries to show it as a number (it shows "Needs confirmation" instead),
- a fact is older than your set limit (for example 180 days), which raises a "stale" warning for you.

### Rough costs (💭 my estimates, check current prices)

| Item                     | Estimate                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------- |
| Domain                   | About $10–$20 per year                                                             |
| Hosting, CDN, repository | Free tiers should cover early traffic; verify limits                               |
| Newsletter tool          | Free to low cost at the start                                                      |
| SEO tools                | Free: Search Console, Keyword Planner, Ahrefs Webmaster Tools. Paid tools optional |
| Expert review            | The main variable cost. Agree a fixed fee per batch of states                      |
| Your time                | The biggest cost                                                                   |

---

## 8. Your next 7 days

1. **Day 1:** Read Section 1, then CSLB's guide (link in Section 4). Open `california.yaml` and follow three facts to their source pages.
2. **Day 2:** Register for the next CSLB workshop. Send outreach to 5 contractors.
3. **Day 3–4:** Run the keyword test (Section 2 phrases). Tell me what you find and I'll help interpret it.
4. **Day 5:** Tell me which state to research next (I suggest **Florida** and **Texas**, to finish the pilot). Open the Florida and Texas official pages from Section 3 and note anything that looks different from what I wrote.
5. **Day 6:** Verify California's riskiest facts (Section 3.1 list) and tell me any differences.
6. **Day 7:** Decide: go, narrow, or switch. If go, I'll scaffold the Astro project with the schema, checks and the first three calculators.

---

## 9. What I verified, and what I didn't

- ✅ **Read on official pages today:** CSLB's licensing guide (May 2025 edition), CSLB's applicant FAQ, fee page, bond requirements and bond basics, Florida DBPR's construction-industry page, NASCLA's participating-agency page, and the CSLB reciprocity page.
- 📊 **Secondary:** Texas and Florida fees and details; PSI exam fee; the tool-visits study; Astro news (confirmed by multiple news sources).
- ⚠️ **Not verified yet:** Florida fees, experience wording, exam vendor and work limit; all Texas fees and city rules; California items flagged in Section 3.1.
- **Everything here should be spot-checked and expert-reviewed before it appears on a public site.**
