# Data dictionary (what each state file should contain)

Each state file should cover the following topics. If a fact is unknown, keep the key and set `value: null` with `confidence: confirm`.

| Topic                       | Examples                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| agency                      | name, website, phone, license lookup URL                                                 |
| license_required            | dollar threshold, what the threshold means, exceptions (permit, workers), effective date |
| penalties_unlicensed        | criminal/civil penalties                                                                 |
| qualifier_requirements      | age, ID, residency, experience, education credit, how experience is verified             |
| exams                       | which exams, vendor, time, languages, retake rules, time limit, validity, waivers        |
| fees_usd                    | application, license, renewal, extra classification, fingerprint                         |
| bonds_and_insurance         | license bond amount, other bonds, liability insurance, entity-specific extras            |
| workers_compensation        | when required, exemptions, trades always required                                        |
| other_issuance_requirements | fingerprints, background check, other exams                                              |
| license_term                | initial term, renewal term                                                               |
| process_and_timing          | official processing page, known timelines                                                |
| classifications             | license types and examples                                                               |
| reciprocity                 | accepts other states? conditions, NASCLA, list of states                                 |
| not_yet_collected           | list of topics still to research                                                         |
| changelog                   | date, change, who                                                                        |

## Rules

- Section-level `confidence` (`primary` | `confirm`) and at least one `source`/`sources` URL are required for sections that contain facts.
- `primary` = read on an official page or publication. `confirm` = unclear or from non-official sites.
- `verified_on` = ISO date at the top of each file.
- Never put numbers in a file without a source.
- Field names use snake_case. Money amounts are plain numbers in USD with `_usd` or inside `fees_usd`.

## Reference example

See `data/states/california.yaml`.
