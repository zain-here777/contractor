import type { FactRow, FactConfidence } from "../format-fact";
import { humanizeFieldKey } from "./labels";
import type { StateSection } from "./types";

const SECTION_META_KEYS = new Set([
  "confidence",
  "source",
  "sources",
  "note",
  "notes",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFactRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && "confidence" in value;
}

function normalizeScalar(
  value: unknown,
): string | number | boolean | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return undefined;
}

function formatArray(value: unknown[]): string {
  return value
    .map((item) => {
      const scalar = normalizeScalar(item);
      if (scalar !== undefined) {
        return String(scalar);
      }
      return JSON.stringify(item);
    })
    .join("; ");
}

function formatPlainObject(value: Record<string, unknown>): string {
  return Object.entries(value)
    .map(([key, entry]) => `${humanizeFieldKey(key)}: ${String(entry)}`)
    .join("; ");
}

function fieldToRow(
  key: string,
  value: unknown,
  sectionConfidence: FactConfidence | undefined,
): FactRow {
  const label = humanizeFieldKey(key);

  if (isFactRecord(value)) {
    const confidence =
      (value.confidence as FactConfidence | undefined) ?? sectionConfidence;
    const rawValue = "value" in value ? value.value : undefined;
    const scalar = normalizeScalar(rawValue);
    return {
      fieldKey: key,
      label,
      value: scalar === undefined ? null : scalar,
      confidence,
    };
  }

  const scalar = normalizeScalar(value);
  if (scalar !== undefined) {
    return {
      fieldKey: key,
      label,
      value: scalar,
      confidence: sectionConfidence,
    };
  }

  if (Array.isArray(value)) {
    return {
      fieldKey: key,
      label,
      value: formatArray(value),
      confidence: sectionConfidence,
    };
  }

  if (isRecord(value)) {
    return {
      fieldKey: key,
      label,
      value: formatPlainObject(value),
      confidence: sectionConfidence,
    };
  }

  return {
    fieldKey: key,
    label,
    value: null,
    confidence: sectionConfidence ?? "confirm",
  };
}

/** One labeled field from a state YAML section (for summaries and at-a-glance panels). */
export function factRowForSectionField(
  section: StateSection | null | undefined,
  fieldKey: string,
  label: string,
): FactRow {
  if (!section) {
    return { label, value: null, confidence: "confirm" };
  }
  const row = fieldToRow(fieldKey, section[fieldKey], section.confidence);
  return { ...row, label };
}

export type SectionToFactRowsOptions = {
  omitKeys?: Set<string>;
};

export function sectionToFactRows(
  section: StateSection,
  options?: SectionToFactRowsOptions,
): FactRow[] {
  const sectionConfidence = section.confidence;
  const rows: FactRow[] = [];
  const omitKeys = options?.omitKeys;

  for (const [key, value] of Object.entries(section)) {
    if (SECTION_META_KEYS.has(key)) {
      continue;
    }
    if (omitKeys?.has(key)) {
      continue;
    }
    rows.push(fieldToRow(key, value, sectionConfidence));
  }

  return rows;
}
