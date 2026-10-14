import { getSectionSources } from "../state-data/load-states";
import { fail, ok, type CalcResult } from "../calculators/types";
import type { LicenseCheckConfig } from "./types";
import type { FactConfidence } from "../format-fact";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatDateField(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return null;
}

export function licenseCheckConfigFromState(
  stateSlug: string,
  stateDocument: Record<string, unknown>,
): CalcResult<LicenseCheckConfig> {
  const stateName =
    typeof stateDocument.state === "string" ? stateDocument.state : stateSlug;
  const verifiedOn =
    typeof stateDocument.verified_on === "string"
      ? stateDocument.verified_on
      : null;
  const licenseRequired = stateDocument.license_required;

  if (!isRecord(licenseRequired)) {
    return fail("This state file has no license_required section.");
  }

  const confidence = licenseRequired.confidence as FactConfidence | undefined;
  if (confidence !== "primary") {
    return fail(
      "License threshold data is not verified (confidence is not primary).",
    );
  }

  const thresholdUsd = licenseRequired.threshold_usd;
  if (typeof thresholdUsd !== "number" || !Number.isFinite(thresholdUsd)) {
    return fail(
      "License threshold is missing or needs confirmation in the data file.",
    );
  }

  const thresholdMeaning =
    typeof licenseRequired.threshold_meaning === "string"
      ? licenseRequired.threshold_meaning
      : "Needs confirmation";

  const effectiveDate = formatDateField(licenseRequired.effective_date);
  if (!effectiveDate) {
    return fail(
      "Effective date for the license threshold is missing in the data file.",
    );
  }

  const regardlessIf = Array.isArray(
    licenseRequired.license_required_regardless_if,
  )
    ? licenseRequired.license_required_regardless_if.filter(
        (item): item is string => typeof item === "string",
      )
    : [];

  const sources = getSectionSources(licenseRequired);
  if (sources.length === 0) {
    return fail("No source URLs found for license_required in the data file.");
  }

  if (!verifiedOn) {
    return fail("State file is missing verified_on.");
  }

  return ok({
    stateSlug,
    stateName,
    thresholdUsd,
    thresholdMeaning,
    effectiveDate,
    regardlessIf,
    sources,
    verifiedOn,
    confidence,
  });
}
