import type { FactConfidence } from "../format-fact";

export type StateSection = Record<string, unknown> & {
  confidence?: FactConfidence;
  source?: string;
  sources?: string[];
  note?: string;
};

export type StateDocument = Record<string, unknown> & {
  state?: string;
  state_code?: string;
  verified_on?: string;
  agency?: Record<string, unknown>;
};

export type StatePageSectionDef = {
  key: string;
  title: string;
  /** Plain-English line under the section heading (not a factual claim). */
  intro: string;
  /** Fragment id for in-page links (`#anchor-id`). */
  anchorId: string;
};
