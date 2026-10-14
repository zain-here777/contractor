import { ok, type CalcResult } from "./types.ts";
import { requireFiniteNumber } from "./validate.ts";

export type MaterialWasteResult = {
  orderQuantity: number;
  wasteAmount: number;
};

/** order quantity = net quantity × (1 + waste fraction) */
export function calculateMaterialWaste(
  netQuantity: number,
  wasteFraction: number,
): CalcResult<MaterialWasteResult> {
  const netCheck = requireFiniteNumber(netQuantity, "Net quantity needed");
  if (!netCheck.ok) {
    return netCheck;
  }
  if (netCheck.value === 0) {
    return { ok: false, error: "Net quantity must be greater than zero." };
  }

  const wasteCheck = requireFiniteNumber(wasteFraction, "Waste");
  if (!wasteCheck.ok) {
    return wasteCheck;
  }
  const orderQuantity = netCheck.value * (1 + wasteCheck.value);
  const wasteAmount = orderQuantity - netCheck.value;

  if (!Number.isFinite(orderQuantity)) {
    return {
      ok: false,
      error: "Could not calculate order quantity with the numbers provided.",
    };
  }

  return ok({ orderQuantity, wasteAmount });
}
