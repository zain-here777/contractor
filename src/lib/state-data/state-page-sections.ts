import type { StatePageSectionDef } from "./types";

/** Key fact sections shown on each state licensing page (T4). */
export const STATE_PAGE_SECTIONS: StatePageSectionDef[] = [
  {
    key: "license_required",
    title: "When a license is needed",
    intro:
      "Dollar thresholds and work types that require a contractor license.",
    anchorId: "license-required",
  },
  {
    key: "qualifier_requirements",
    title: "Experience and qualifier requirements",
    intro: "Who can qualify a license and what experience the board expects.",
    anchorId: "qualifier-requirements",
  },
  {
    key: "exams",
    title: "Exams",
    intro: "Required exams, timing, and how the board administers them.",
    anchorId: "exams",
  },
  {
    key: "fees_usd",
    title: "Fees (USD)",
    intro:
      "Application, licensing, and renewal fees from official sources (U.S. dollars).",
    anchorId: "fees",
  },
  {
    key: "bonds_and_insurance",
    title: "Bonds and insurance",
    intro: "Bond and insurance amounts before a license can be active.",
    anchorId: "bonds-and-insurance",
  },
  {
    key: "workers_compensation",
    title: "Workers' compensation",
    intro:
      "When workers' comp coverage or an exemption certificate is required.",
    anchorId: "workers-compensation",
  },
  {
    key: "license_term",
    title: "License term",
    intro: "How long an initial license lasts and renewal periods.",
    anchorId: "license-term",
  },
  {
    key: "reciprocity",
    title: "Reciprocity",
    intro: "How this state treats licenses from other states.",
    anchorId: "reciprocity",
  },
];
