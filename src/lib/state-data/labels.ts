export function humanizeFieldKey(key: string): string {
  const withUnits = key.replace(/_usd\b/g, " (USD)");
  const words = withUnits.split("_").filter(Boolean);
  return words
    .map((word) => {
      if (word === "(USD)") {
        return word;
      }
      if (/^[A-Z]{2,3}$/.test(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(" (USD)", " (USD)");
}
