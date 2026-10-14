import {
  factNeedsConfirmation,
  formatFactValue,
  type FactRow,
} from "../format-fact";
import { humanizeFieldKey } from "./labels";
import type { StateDocument, StatePageSectionDef, StateSection } from "./types";

export const TEXAS_TRADE_SECTION_KEYS = new Set([
  "electricians_experience_and_fees",
  "plumbers_journeyman",
  "plumbers_tradesman_limited",
]);

const SECTION_META = new Set([
  "confidence",
  "source",
  "sources",
  "note",
  "notes",
  "fee_note",
  "application_fee_note",
]);

export function isTexasPartialDraft(slug: string): boolean {
  return slug === "texas";
}

export const TEXAS_PAGE_SECTIONS: StatePageSectionDef[] = [
  {
    key: "licensing_structure",
    title: "Statewide general contractor license",
    intro:
      "Whether Texas issues a single statewide general-contractor license (trade rules differ by agency).",
    anchorId: "licensing-structure",
  },
  {
    key: "agencies_by_trade",
    title: "Agencies by trade",
    intro: "Which state agency oversees each trade we track.",
    anchorId: "agencies-by-trade",
  },
  {
    key: "electricians_experience_and_fees",
    title: "Electricians (individual licenses)",
    intro:
      "Journeyman and master electrician experience and application fees from TDLR.",
    anchorId: "electricians-experience-and-fees",
  },
  {
    key: "electricians_exam_and_renewal",
    title: "Electricians: exams, renewal and contractor license",
    intro: "Not yet confirmed from official TDLR pages.",
    anchorId: "electricians-exam-and-renewal",
  },
  {
    key: "plumbers_journeyman",
    title: "Plumbers: journeyman",
    intro: "Journeyman plumber eligibility, scope and fees from TSBPE.",
    anchorId: "plumbers-journeyman",
  },
  {
    key: "plumbers_tradesman_limited",
    title: "Plumbers: tradesman limited",
    intro: "Tradesman plumber-limited eligibility, scope and fees from TSBPE.",
    anchorId: "plumbers-tradesman-limited",
  },
  {
    key: "plumbers_not_yet_confirmed",
    title: "Plumbers: not yet confirmed",
    intro:
      "Master plumber, apprentice and business rules still being researched.",
    anchorId: "plumbers-not-yet-confirmed",
  },
  {
    key: "license_required",
    title: "When a license is needed",
    intro: "State-level thresholds and exemptions—not yet confirmed for Texas.",
    anchorId: "license-required",
  },
  {
    key: "local_rules",
    title: "Local city and county rules",
    intro: "Municipal registration and permits—not collected yet.",
    anchorId: "local-rules",
  },
  {
    key: "penalties_unlicensed",
    title: "Penalties for unlicensed work",
    intro: "Not yet collected from official sources.",
    anchorId: "penalties-unlicensed",
  },
  {
    key: "bonds_and_insurance",
    title: "Bonds and insurance",
    intro: "Trade-specific requirements—not yet collected.",
    anchorId: "bonds-and-insurance",
  },
  {
    key: "workers_compensation",
    title: "Workers' compensation",
    intro: "Not yet collected from official sources.",
    anchorId: "workers-compensation",
  },
  {
    key: "reciprocity",
    title: "Reciprocity",
    intro: "Not yet collected from official sources.",
    anchorId: "reciprocity",
  },
];

export function resolveTexasPageSections(
  stateData: StateDocument,
): StatePageSectionDef[] {
  return TEXAS_PAGE_SECTIONS.filter((def) => {
    const value = stateData[def.key];
    return typeof value === "object" && value !== null && !Array.isArray(value);
  });
}

function isFactRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "confidence" in value
  );
}

const FEE_FIELD_PATTERN =
  /fee|_usd$|^exam$|^initial_license$|^renewal$|^late_renewal/;

export function displayTexasTradeCell(row: FactRow): string {
  if (factNeedsConfirmation(row)) {
    return "Needs confirmation";
  }
  if (
    typeof row.value === "number" &&
    row.fieldKey &&
    FEE_FIELD_PATTERN.test(row.fieldKey)
  ) {
    return `$${row.value.toLocaleString("en-US")}`;
  }
  return formatFactValue(row);
}

export type TexasTradeGroup = {
  groupLabel: string;
  rows: FactRow[];
};

/** Readable groups for electrician/plumber trade YAML blocks. */
export function buildTexasTradeGroups(
  section: StateSection,
): TexasTradeGroup[] {
  const sectionConfidence = section.confidence ?? "confirm";
  const groups: TexasTradeGroup[] = [];

  for (const [key, value] of Object.entries(section)) {
    if (SECTION_META.has(key)) {
      continue;
    }
    if (key === "fees_usd" && isRecord(value)) {
      const feeRows: FactRow[] = [];
      for (const [feeKey, feeVal] of Object.entries(value)) {
        if (typeof feeVal === "number") {
          feeRows.push({
            fieldKey: feeKey,
            label: humanizeFieldKey(feeKey),
            value: feeVal,
            confidence: sectionConfidence,
          });
        }
      }
      if (feeRows.length > 0) {
        groups.push({ groupLabel: "Fees (USD)", rows: feeRows });
      }
      continue;
    }
    if (isRecord(value) && !isFactRecord(value)) {
      const rows: FactRow[] = [];
      for (const [fieldKey, fieldVal] of Object.entries(value)) {
        if (SECTION_META.has(fieldKey)) {
          continue;
        }
        if (
          typeof fieldVal === "number" ||
          typeof fieldVal === "string" ||
          Array.isArray(fieldVal)
        ) {
          const scalar = Array.isArray(fieldVal)
            ? fieldVal.map(String).join("; ")
            : fieldVal;
          rows.push({
            fieldKey,
            label: humanizeFieldKey(fieldKey),
            value: scalar,
            confidence: sectionConfidence,
          });
        }
      }
      if (rows.length > 0) {
        groups.push({ groupLabel: humanizeFieldKey(key), rows });
      }
      continue;
    }
    if (typeof value === "string") {
      groups.push({
        groupLabel: humanizeFieldKey(key),
        rows: [
          {
            fieldKey: key,
            label: humanizeFieldKey(key),
            value,
            confidence: sectionConfidence,
          },
        ],
      });
    }
  }

  return groups;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Strip confirm leaf values so draft text never appears in HTML. */
export function sanitizeRowsForPublicDisplay(rows: FactRow[]): FactRow[] {
  return rows.map((row) => {
    if (row.confidence === "confirm") {
      return { ...row, value: null };
    }
    return row;
  });
}

export function texasSectionShowsFeesAsOf(sectionKey: string): boolean {
  return TEXAS_TRADE_SECTION_KEYS.has(sectionKey);
}
