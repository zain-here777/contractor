import {
  factNeedsConfirmation,
  formatFactValue,
  type FactConfidence,
  type FactRow,
} from "../format-fact";
import { factRowForSectionField } from "./section-rows";
import type { StateDocument, StateSection } from "./types";

export type AtAGlanceItem = {
  label: string;
  display: string;
};

type GlanceFieldDef = {
  sectionKey: string;
  fieldKey: string;
  label: string;
  format?: (row: FactRow) => string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatUsd(row: FactRow): string {
  if (factNeedsConfirmation(row)) {
    return "Needs confirmation";
  }
  if (typeof row.value === "number") {
    return `$${row.value.toLocaleString("en-US")}`;
  }
  return formatFactValue(row);
}

function formatThreshold(row: FactRow): string {
  if (factNeedsConfirmation(row)) {
    return "Needs confirmation";
  }
  if (typeof row.value === "number") {
    return `$${row.value.toLocaleString("en-US")} combined labor and materials`;
  }
  return formatFactValue(row);
}

const GLANCE_FIELDS: GlanceFieldDef[] = [
  {
    sectionKey: "license_required",
    fieldKey: "threshold_usd",
    label: "License required when",
    format: formatThreshold,
  },
  {
    sectionKey: "qualifier_requirements",
    fieldKey: "experience",
    label: "Qualifier experience",
  },
  {
    sectionKey: "fees_usd",
    fieldKey: "application_fee",
    label: "Application fee (USD)",
    format: formatUsd,
  },
  {
    sectionKey: "bonds_and_insurance",
    fieldKey: "contractor_bond_usd",
    label: "Contractor bond (USD)",
    format: formatUsd,
  },
  {
    sectionKey: "license_term",
    fieldKey: "initial",
    label: "Initial license term",
  },
];

function rowForDef(state: StateDocument, def: GlanceFieldDef): FactRow {
  const section = state[def.sectionKey];
  if (!isRecord(section)) {
    return { label: def.label, value: null, confidence: "confirm" };
  }
  return factRowForSectionField(
    section as StateSection,
    def.fieldKey,
    def.label,
  );
}

function displayForRow(row: FactRow, def: GlanceFieldDef): string {
  if (def.format) {
    return def.format(row);
  }
  return formatFactValue(row);
}

const FLORIDA_GLANCE_FIELDS: GlanceFieldDef[] = [
  {
    sectionKey: "license_types",
    fieldKey: "certified",
    label: "Certified license",
  },
  {
    sectionKey: "license_types",
    fieldKey: "registered",
    label: "Registered license",
  },
  {
    sectionKey: "qualifier_requirements",
    fieldKey: "min_age",
    label: "Minimum qualifier age",
  },
  {
    sectionKey: "qualifier_requirements",
    fieldKey: "experience_options",
    label: "Experience options",
  },
];

function buildGlanceFromDefs(
  state: StateDocument,
  defs: GlanceFieldDef[],
): AtAGlanceItem[] {
  return defs.map((def) => {
    const row = rowForDef(state, def);
    const display =
      row.confidence === "primary" && !factNeedsConfirmation(row)
        ? displayForRow(row, def)
        : "Needs confirmation";
    return {
      label: def.label,
      display,
    };
  });
}

/** Key facts for the state page grid. Only primary fields render as values; others show "Needs confirmation". */
function buildTexasAtAGlanceItems(state: StateDocument): AtAGlanceItem[] {
  const electricians = state.electricians_experience_and_fees;
  const journeymanE =
    isRecord(electricians) && isRecord(electricians.journeyman)
      ? String(electricians.journeyman.experience_to_apply_and_test ?? "")
      : "";
  const masterE =
    isRecord(electricians) && isRecord(electricians.master)
      ? String(electricians.master.experience ?? "")
      : "";
  const plumbers = state.plumbers_journeyman;
  let plumberHours = "";
  if (isRecord(plumbers) && Array.isArray(plumbers.eligibility_to_take_exam)) {
    const line = plumbers.eligibility_to_take_exam.find((item) =>
      String(item).includes("8,000"),
    );
    plumberHours = line ? String(line) : "";
  }

  return [
    {
      label: "Journeyman electrician hours",
      display: journeymanE.includes("7,000")
        ? "7,000 hours to apply for the exam (8,000 for license)"
        : "Needs confirmation",
    },
    {
      label: "Master electrician experience",
      display: masterE.includes("12,000") ? masterE : "Needs confirmation",
    },
    {
      label: "Journeyman plumber hours",
      display: plumberHours || "Needs confirmation",
    },
    {
      label: "Statewide general-contractor license",
      display: "Needs confirmation",
    },
  ];
}

export function buildAtAGlanceItems(
  state: StateDocument,
  slug?: string,
): AtAGlanceItem[] {
  if (slug === "florida") {
    return buildGlanceFromDefs(state, FLORIDA_GLANCE_FIELDS);
  }
  if (slug === "texas") {
    return buildTexasAtAGlanceItems(state);
  }
  return GLANCE_FIELDS.map((def) => {
    const row = rowForDef(state, def);
    return {
      label: def.label,
      display: displayForRow(row, def),
    };
  });
}

/** Page-level badge: primary only when every at-a-glance value is confirmed from primary data. */
export function statePageVerifiedConfidence(
  state: StateDocument,
): FactConfidence {
  for (const def of GLANCE_FIELDS) {
    const row = rowForDef(state, def);
    if (factNeedsConfirmation(row)) {
      return "confirm";
    }
  }
  return "primary";
}
