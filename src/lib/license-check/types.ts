import type { FactConfidence } from "../format-fact";

export type LicenseCheckConfig = {
  stateSlug: string;
  stateName: string;
  thresholdUsd: number;
  thresholdMeaning: string;
  effectiveDate: string;
  regardlessIf: string[];
  sources: string[];
  verifiedOn: string;
  confidence: FactConfidence;
};

export type LicenseCheckOutcome = "license_required" | "exemption_may_apply";

export type LicenseCheckResult = {
  outcome: LicenseCheckOutcome;
  headline: string;
  reasons: string[];
  splittingNote: string;
};
