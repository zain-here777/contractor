import { evaluateLicenseCheck } from "../../lib/license-check/evaluate.ts";
import type { LicenseCheckConfig } from "../../lib/license-check/types.ts";
import {
  EXTERNAL_LINK_REL,
  EXTERNAL_LINK_TARGET,
} from "../../lib/links/external-url.ts";
import { formatSourceLinkLabel } from "../../lib/state-data/source-labels.ts";
import {
  bindExampleFill,
  bindResetToolForm,
  bindSubmitToolForm,
  getFormNumber,
  renderResultPanel,
} from "./tool-form-client.ts";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function radioYes(form: HTMLFormElement, name: string): boolean {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  return checked instanceof HTMLInputElement && checked.value === "yes";
}

function runLicenseCheck(
  form: HTMLFormElement,
  result: HTMLElement,
  config: LicenseCheckConfig,
): void {
  const calc = evaluateLicenseCheck(
    {
      jobValueUsd: getFormNumber(form, "jobValueUsd") ?? NaN,
      needsPermit: radioYes(form, "needsPermit"),
      hiresWorkers: radioYes(form, "hiresWorkers"),
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
    .map((reason) => `<li>${escapeHtml(reason)}</li>`)
    .join("");

  const outcomeType =
    calc.value.outcome === "license_required" ? "warn" : "success";

  const sharedTail = `<p><strong>Important:</strong> ${escapeHtml(calc.value.splittingNote)}</p>
        <p class="source-box__verified">Last verified: ${escapeHtml(config.verifiedOn)}</p>
        <p><strong>Official sources:</strong></p>
        <ul class="source-box__list">${sourceLinks}</ul>`;

  renderResultPanel(result, {
    type: outcomeType,
    html: `<p class="tool-outcome-headline">${escapeHtml(calc.value.headline)}</p>
        <ul>${reasons}</ul>
        <p><strong>Effective date (threshold):</strong> ${escapeHtml(config.effectiveDate)}</p>
        ${sharedTail}`,
  });
}

export function initLicenseRequiredChecker(config: LicenseCheckConfig): void {
  const form = document.getElementById("license-required-form");
  const result = document.getElementById("license-required-result");

  if (!(form instanceof HTMLFormElement) || !(result instanceof HTMLElement)) {
    return;
  }

  bindSubmitToolForm(form, result, (formEl, panel) =>
    runLicenseCheck(formEl, panel, config),
  );
  bindResetToolForm(form, result, form.querySelector("[data-tool-reset]"));
  bindExampleFill(form, form.querySelector("[data-tool-example]"), {
    jobValueUsd: "900",
    needsPermit: "no",
    hiresWorkers: "no",
  });
}
