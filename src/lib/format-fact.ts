export type FactConfidence = "primary" | "confirm";

export type FactRow = {
  /** YAML field key (for display rules on partial-draft states). */
  fieldKey?: string;
  label: string;
  value?: string | number | boolean | null;
  confidence?: FactConfidence;
};

export function factNeedsConfirmation(row: FactRow): boolean {
  return (
    row.confidence === "confirm" ||
    row.value === null ||
    row.value === undefined
  );
}

export function formatFactValue(row: FactRow): string {
  if (factNeedsConfirmation(row)) {
    return "Needs confirmation";
  }
  if (typeof row.value === "boolean") {
    return row.value ? "Yes" : "No";
  }
  return String(row.value);
}
