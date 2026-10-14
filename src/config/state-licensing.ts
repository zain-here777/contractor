import {
  indexableStates,
  stateExpertReviewed,
  stateSourceAttribution,
} from "./site";

export { indexableStates, stateExpertReviewed, stateSourceAttribution };

export function isStateExpertReviewed(stateSlug: string): boolean {
  return stateExpertReviewed[stateSlug] === true;
}

export function stateSourceAttributionLine(stateSlug: string): string {
  return stateSourceAttribution[stateSlug] ?? "Sourced from official pages.";
}

/** Production indexable deploy (strict finalize path), not staging preview builds. */
export function isProductionIndexableBuild(): boolean {
  const flag = process.env.STRICT_PRODUCTION;
  return flag === "1" || flag === "true" || flag === "yes";
}

export function shouldIndexStateLicensingPage(stateSlug: string): boolean {
  if (!isProductionIndexableBuild()) {
    return true;
  }
  return (indexableStates as readonly string[]).includes(stateSlug);
}

export function shouldNoindexStateLicensingPage(stateSlug: string): boolean {
  if (!isProductionIndexableBuild()) {
    return false;
  }
  return !shouldIndexStateLicensingPage(stateSlug);
}
