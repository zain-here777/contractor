import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatValidationMessages,
  validateStatesDirectory,
} from "../src/lib/validate-state-data.ts";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const statesDir = join(root, "data", "states");

const { errors, warnings } = validateStatesDirectory(statesDir);

for (const line of formatValidationMessages(warnings)) {
  console.warn(`WARN: ${line}`);
}

if (errors.length > 0) {
  for (const line of formatValidationMessages(errors)) {
    console.error(`ERROR: ${line}`);
  }
  console.error(`\nData validation failed (${errors.length} error(s)).`);
  process.exit(1);
}

console.log(`Data validation passed (${warnings.length} warning(s)).`);
