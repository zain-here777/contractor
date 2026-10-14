/**
 * Phosphor Duotone SVG paths (@phosphor-icons/core, MIT).
 * Imported at build time only for icons used on the site.
 */
import arrowRightRaw from "@phosphor-icons/core/assets/duotone/arrow-right-duotone.svg?raw";
import calculatorRaw from "@phosphor-icons/core/assets/duotone/calculator-duotone.svg?raw";
import checkCircleRaw from "@phosphor-icons/core/assets/duotone/check-circle-duotone.svg?raw";
import clipboardRaw from "@phosphor-icons/core/assets/duotone/clipboard-duotone.svg?raw";
import mapPinRaw from "@phosphor-icons/core/assets/duotone/map-pin-duotone.svg?raw";
import magnifyingGlassRaw from "@phosphor-icons/core/assets/duotone/magnifying-glass-duotone.svg?raw";
import moonRaw from "@phosphor-icons/core/assets/duotone/moon-duotone.svg?raw";
import shieldRaw from "@phosphor-icons/core/assets/duotone/shield-duotone.svg?raw";
import sunRaw from "@phosphor-icons/core/assets/duotone/sun-duotone.svg?raw";
import toolboxRaw from "@phosphor-icons/core/assets/duotone/toolbox-duotone.svg?raw";
import wrenchRaw from "@phosphor-icons/core/assets/duotone/wrench-duotone.svg?raw";

export type IconName =
  | "arrow-right"
  | "calculator"
  | "check-circle"
  | "clipboard"
  | "map-pin"
  | "moon"
  | "search"
  | "shield"
  | "sun"
  | "tools"
  | "wrench";

function phosphorDuotoneInner(svg: string): string {
  const open = svg.indexOf(">");
  const close = svg.lastIndexOf("</svg>");
  if (open === -1 || close === -1 || close <= open) {
    return "";
  }
  return svg.slice(open + 1, close);
}

export const phosphorDuotonePaths: Record<IconName, string> = {
  "arrow-right": phosphorDuotoneInner(arrowRightRaw),
  calculator: phosphorDuotoneInner(calculatorRaw),
  "check-circle": phosphorDuotoneInner(checkCircleRaw),
  clipboard: phosphorDuotoneInner(clipboardRaw),
  "map-pin": phosphorDuotoneInner(mapPinRaw),
  moon: phosphorDuotoneInner(moonRaw),
  search: phosphorDuotoneInner(magnifyingGlassRaw),
  shield: phosphorDuotoneInner(shieldRaw),
  sun: phosphorDuotoneInner(sunRaw),
  tools: phosphorDuotoneInner(toolboxRaw),
  wrench: phosphorDuotoneInner(wrenchRaw),
};
