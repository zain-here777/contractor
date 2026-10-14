/** Display-only formatting (calculations stay unrounded in lib functions). */

export function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercentFromDecimal(rate: number): string {
  return `${(rate * 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export function parsePercentInputToDecimal(percent: number): number {
  return percent / 100;
}
