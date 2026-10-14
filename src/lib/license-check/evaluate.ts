import { ok, type CalcResult } from "../calculators/types";
import { requireFiniteNumber } from "../calculators/validate";
import type { LicenseCheckConfig, LicenseCheckResult } from "./types";

export type LicenseCheckInput = {
  jobValueUsd: number;
  needsPermit: boolean;
  hiresWorkers: boolean;
};

/**
 * License required if a permit is needed OR workers are hired OR value >= threshold (from data).
 */
export function evaluateLicenseCheck(
  input: LicenseCheckInput,
  config: LicenseCheckConfig,
): CalcResult<LicenseCheckResult> {
  const valueCheck = requireFiniteNumber(input.jobValueUsd, "Total job value");
  if (!valueCheck.ok) {
    return valueCheck;
  }

  const reasons: string[] = [];
  const threshold = config.thresholdUsd;
  const jobValue = valueCheck.value;

  if (input.needsPermit) {
    const permitRule =
      config.regardlessIf.find((item) =>
        item.toLowerCase().includes("permit"),
      ) ?? "Work requires a building permit.";
    reasons.push(permitRule);
  }

  if (input.hiresWorkers) {
    const workersRule =
      config.regardlessIf.find((item) =>
        item.toLowerCase().includes("hiring workers"),
      ) ?? "Work requires hiring workers.";
    reasons.push(workersRule);
  }

  if (jobValue >= threshold) {
    reasons.push(
      `Total job value (labor and materials) is $${jobValue.toLocaleString("en-US")}, at or above the $${threshold.toLocaleString("en-US")} threshold (effective ${config.effectiveDate}).`,
    );
  }

  const splittingNote = config.thresholdMeaning;

  if (reasons.length > 0) {
    return ok({
      outcome: "license_required",
      headline: "License required",
      reasons,
      splittingNote,
    });
  }

  return ok({
    outcome: "exemption_may_apply",
    headline: "Minor work exemption may apply",
    reasons: [
      `Total job value is under $${threshold.toLocaleString("en-US")}, no building permit is required for this scenario, and you are not hiring workers. CSLB rules may still apply to your trade or location.`,
    ],
    splittingNote,
  });
}
