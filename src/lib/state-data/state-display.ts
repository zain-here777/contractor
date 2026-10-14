import type { FactRow } from "../format-fact";
import type { StateDocument, StatePageSectionDef, StateSection } from "./types";
import { STATE_PAGE_SECTIONS } from "./state-page-sections";
import {
  isTexasPartialDraft,
  resolveTexasPageSections,
  TEXAS_TRADE_SECTION_KEYS,
} from "./texas-display";

const METADATA_KEYS = new Set([
  "state",
  "state_code",
  "agency",
  "verified_on",
  "not_yet_collected",
  "changelog",
]);

const FLORIDA_EXTRA_SECTIONS: StatePageSectionDef[] = [
  {
    key: "license_types",
    title: "License types",
    intro:
      "How certified and registered contractor licenses differ in Florida.",
    anchorId: "license-types",
  },
  {
    key: "official_forms",
    title: "Official forms",
    intro: "DBPR form numbers listed on the construction industry page.",
    anchorId: "official-forms",
  },
];

const FLORIDA_HIDDEN_SECTION_KEYS = new Set([
  "known_conflicts_on_secondary_sites",
]);

/** Only these fields render as primary facts on the Florida partial-draft page. */
const FLORIDA_PRIMARY_FIELD_KEYS: Record<string, Set<string>> = {
  license_types: new Set(["certified", "registered"]),
  official_forms: new Set(["items"]),
  qualifier_requirements: new Set(["min_age", "experience_options"]),
};

export function isFloridaPartialDraft(slug: string): boolean {
  return slug === "florida";
}

export function isPartialDraftState(slug: string): boolean {
  return slug === "florida" || slug === "texas";
}

export { isTexasPartialDraft, TEXAS_TRADE_SECTION_KEYS };

export function sectionExistsInDocument(
  stateData: StateDocument,
  key: string,
): boolean {
  const value = stateData[key];
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Section keys to render on the public state page (order preserved). */
export function resolveStatePageSections(
  slug: string,
  stateData: StateDocument,
): StatePageSectionDef[] {
  if (slug === "texas") {
    return resolveTexasPageSections(stateData);
  }
  const defs =
    slug === "florida"
      ? [...FLORIDA_EXTRA_SECTIONS, ...STATE_PAGE_SECTIONS]
      : [...STATE_PAGE_SECTIONS];

  return defs.filter((def) => {
    if (slug === "florida" && FLORIDA_HIDDEN_SECTION_KEYS.has(def.key)) {
      return false;
    }
    return sectionExistsInDocument(stateData, def.key);
  });
}

/** Rows for confirm-only fee leaves: show "Needs confirmation" without publishing draft note text. */
export function getFloridaFeeNestedOmitKeys(): Set<string> {
  return new Set(["statutory_maximums_seen", "rule_notice_values_seen"]);
}

export function applyFloridaFactRowRules(
  sectionKey: string,
  rows: FactRow[],
  options?: { omitKeys?: Set<string> },
): FactRow[] {
  const omitKeys = options?.omitKeys;
  const primaryFields = FLORIDA_PRIMARY_FIELD_KEYS[sectionKey];

  return rows
    .filter((row) => !omitKeys?.has(row.fieldKey ?? ""))
    .map((row) => {
      if (primaryFields) {
        if (row.fieldKey && primaryFields.has(row.fieldKey)) {
          return row;
        }
        return { ...row, confidence: "confirm" as const };
      }
      return row;
    });
}

const CONFIRM_SECTION_NOTE =
  "This topic is not confirmed from official sources yet. Use the source links below and check the agency directly.";

export function noteContainsUnpublishedDollarAmounts(note: string): boolean {
  return /\$[\d,]/.test(note);
}

export function floridaSectionNote(
  section: StateSection,
  sectionKey: string,
): string | undefined {
  const raw = typeof section.note === "string" ? section.note : undefined;
  if (sectionKey === "fees_usd") {
    return undefined;
  }
  const confidence = section.confidence ?? "confirm";
  if (confidence === "confirm") {
    return CONFIRM_SECTION_NOTE;
  }
  if (raw && noteContainsUnpublishedDollarAmounts(raw)) {
    return undefined;
  }
  return raw;
}

/** Section note safe for public HTML on any state page. */
export function resolvePublicSectionNote(
  section: StateSection,
  sectionKey: string,
  stateSlug: string,
): string | undefined {
  if (isTexasPartialDraft(stateSlug)) {
    const confidence = section.confidence ?? "confirm";
    if (confidence === "confirm") {
      return CONFIRM_SECTION_NOTE;
    }
    if (TEXAS_TRADE_SECTION_KEYS.has(sectionKey)) {
      const raw = typeof section.note === "string" ? section.note : undefined;
      if (raw && !noteContainsUnpublishedDollarAmounts(raw)) {
        return raw;
      }
      return undefined;
    }
    return undefined;
  }
  if (isFloridaPartialDraft(stateSlug)) {
    return floridaSectionNote(section, sectionKey);
  }
  const raw = typeof section.note === "string" ? section.note : undefined;
  if (!raw) {
    return undefined;
  }
  if (noteContainsUnpublishedDollarAmounts(raw)) {
    return undefined;
  }
  const confidence = section.confidence ?? "confirm";
  if (confidence === "confirm") {
    return CONFIRM_SECTION_NOTE;
  }
  return raw;
}

export function floridaFeeSectionOmitKeys(
  sectionKey: string,
): Set<string> | undefined {
  if (sectionKey === "fees_usd") {
    return getFloridaFeeNestedOmitKeys();
  }
  return undefined;
}

/** Keys present in YAML that are fact sections but not in the page section list. */
export function listUnknownSectionKeys(stateData: StateDocument): string[] {
  return Object.keys(stateData).filter(
    (key) => !METADATA_KEYS.has(key) && sectionExistsInDocument(stateData, key),
  );
}
