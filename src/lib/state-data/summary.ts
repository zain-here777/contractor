import type { StateDocument } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatDate(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return null;
}

/** Plain-English bullets built only from section-level primary fields in the YAML. */
export function buildVerifiedSummary(state: StateDocument): string[] {
  const bullets: string[] = [];
  const agency = state.agency;
  if (isRecord(agency) && typeof agency.name === "string") {
    bullets.push(
      `${agency.name} oversees contractor licensing in ${state.state ?? "this state"}.`,
    );
  }

  const licenseRequired = state.license_required;
  if (isRecord(licenseRequired) && licenseRequired.confidence === "primary") {
    if (typeof licenseRequired.threshold_usd === "number") {
      const effective = formatDate(licenseRequired.effective_date);
      const effectiveText = effective ? ` (effective ${effective})` : "";
      bullets.push(
        `A license is required when labor and materials combined reach $${licenseRequired.threshold_usd} or more${effectiveText}.`,
      );
    }
    if (typeof licenseRequired.threshold_meaning === "string") {
      bullets.push(licenseRequired.threshold_meaning);
    }
    if (Array.isArray(licenseRequired.license_required_regardless_if)) {
      const items = licenseRequired.license_required_regardless_if.filter(
        (item): item is string => typeof item === "string",
      );
      if (items.length > 0) {
        bullets.push(`A license is still required if: ${items.join("; ")}.`);
      }
    }
  }

  const qualifier = state.qualifier_requirements;
  if (isRecord(qualifier) && qualifier.confidence === "primary") {
    if (typeof qualifier.experience === "string") {
      bullets.push(`Experience: ${qualifier.experience}`);
    }
  }

  const reciprocity = state.reciprocity;
  if (isRecord(reciprocity) && reciprocity.confidence === "primary") {
    if (typeof reciprocity.summary === "string") {
      bullets.push(reciprocity.summary);
    }
  }

  return bullets;
}
