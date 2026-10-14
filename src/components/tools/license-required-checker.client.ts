import { evaluateLicenseCheck } from "../../lib/license-check/evaluate.ts";
import type { LicenseCheckConfig } from "../../lib/license-check/types.ts";
import {
  EXTERNAL_LINK_REL,
  EXTERNAL_LINK_TARGET,
} from "../../lib/links/external-url.ts";
import { formatSourceLinkLabel } from "../../lib/state-data/source-labels.ts";
import { getFormNumber, renderResultPanel } from "./tool-form-client.ts";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function yesNo(value: string): boolean {
  return value === "yes";
}

export function initLicenseRequiredChecker(config: LicenseCheckConfig): void {
  const form = document.getElementById("license-required-form");
  const result = document.getElementById("license-required-result");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (
      !(form instanceof HTMLFormElement) ||
      !(result instanceof HTMLElement)
    ) {
      return;
    }

    const needsPermitField = form.elements.namedItem("needsPermit");
    const hiresWorkersField = form.elements.namedItem("hiresWorkers");
    if (!(needsPermitField instanceof HTMLSelectElement)) {
      return;
    }
    if (!(hiresWorkersField instanceof HTMLSelectElement)) {
      return;
    }

    const calc = evaluateLicenseCheck(
      {
        jobValueUsd: getFormNumber(form, "jobValueUsd") ?? NaN,
        needsPermit: yesNo(needsPermitField.value),
        hiresWorkers: yesNo(hiresWorkersField.value),
      },
      config,
    );

    if (!calc.ok) {
      renderResultPanel(result, {
        type: "error",
        message: calc.error,
      });
      return;
    }

    const sourceLinks = config.sources
      .map((url) => {
        const label = escapeHtml(formatSourceLinkLabel(url));
        const href = escapeHtml(url);
        return `<li><a class="source-box__link" href="${href}" target="${EXTERNAL_LINK_TARGET}" rel="${EXTERNAL_LINK_REL}" title="${href}">${label}<span class="sr-only"> (opens in new tab)</span></a></li>`;
      })
      .join("");

    const reasons = calc.value.reasons
      .map((reason) => `<li>${reason}</li>`)
      .join("");

    renderResultPanel(result, {
      type: calc.value.outcome === "license_required" ? "error" : "result",
      html: `<p><strong>${calc.value.headline}</strong></p>
        <ul>${reasons}</ul>
        <p><strong>Effective date (threshold):</strong> ${config.effectiveDate}</p>
        <p><strong>Important:</strong> ${calc.value.splittingNote}</p>
        <p class="source-box__verified">Last verified: ${config.verifiedOn}</p>
        <p><strong>Official sources:</strong></p>
        <ul class="source-box__list">${sourceLinks}</ul>`,
    });
  });
}
