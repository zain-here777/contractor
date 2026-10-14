import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { parse as parseYaml } from "yaml";

/** Top-level keys that are not fact sections (no section-level confidence/source required). */
const METADATA_KEYS = new Set([
  "state",
  "state_code",
  "agency",
  "verified_on",
  "not_yet_collected",
  "changelog",
]);

const VALID_CONFIDENCE = new Set(["primary", "confirm"]);

/** Section-level keys that are not nested fact leaves (e.g. a free-text note on the section). */
const SECTION_LEVEL_META = new Set(["note", "notes"]);

export type ValidationMessage = {
  file: string;
  section: string;
  problem: string;
};

export type ValidationResult = {
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFactRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && "confidence" in value;
}

function parseIsoDate(dateStr: string): Date | null {
  if (!ISO_DATE.test(dateStr)) {
    return null;
  }
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

/** Calendar "today" for comparing ISO date-only fields (no timezone on verified_on). */
function todayCalendar(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isValidHttpsUrl(url: unknown): boolean {
  if (typeof url !== "string" || url.trim() === "") {
    return false;
  }
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function collectSourceUrls(section: Record<string, unknown>): string[] {
  const urls: string[] = [];
  if (typeof section.source === "string") {
    urls.push(section.source);
  }
  if (Array.isArray(section.sources)) {
    for (const item of section.sources) {
      if (typeof item === "string") {
        urls.push(item);
      }
    }
  }
  return urls;
}

function pushError(
  errors: ValidationMessage[],
  file: string,
  section: string,
  problem: string,
): void {
  errors.push({ file, section, problem });
}

function pushWarning(
  warnings: ValidationMessage[],
  file: string,
  section: string,
  problem: string,
): void {
  warnings.push({ file, section, problem });
}

function validateConfidenceField(
  errors: ValidationMessage[],
  file: string,
  section: string,
  confidence: unknown,
): void {
  if (confidence === undefined || confidence === null) {
    pushError(errors, file, section, "missing confidence");
    return;
  }
  if (typeof confidence !== "string" || !VALID_CONFIDENCE.has(confidence)) {
    pushError(
      errors,
      file,
      section,
      'confidence must be "primary" or "confirm"',
    );
  }
}

function validateSourceFields(
  errors: ValidationMessage[],
  file: string,
  section: string,
  record: Record<string, unknown>,
  requireAtLeastOne: boolean,
): void {
  const urls = collectSourceUrls(record);
  if (requireAtLeastOne && urls.length === 0) {
    pushError(errors, file, section, "section has facts but no source URL");
    return;
  }
  for (const url of urls) {
    if (!isValidHttpsUrl(url)) {
      pushError(
        errors,
        file,
        section,
        `source is not a valid https URL: ${url}`,
      );
    }
  }
}

/** Section whose direct children are all fact records (no section-level confidence). */
function isDirectNestedFactContainer(
  section: Record<string, unknown>,
): boolean {
  let hasFactChild = false;
  for (const [key, child] of Object.entries(section)) {
    if (SECTION_LEVEL_META.has(key)) {
      continue;
    }
    if (!isFactRecord(child)) {
      return false;
    }
    hasFactChild = true;
  }
  return hasFactChild;
}

function collectDirectNestedFactSources(
  section: Record<string, unknown>,
): string[] {
  const urls: string[] = [];
  for (const [key, child] of Object.entries(section)) {
    if (SECTION_LEVEL_META.has(key)) {
      continue;
    }
    if (isFactRecord(child)) {
      urls.push(...collectSourceUrls(child));
    }
  }
  return urls;
}

function validateNestedFactRecords(
  errors: ValidationMessage[],
  file: string,
  section: string,
  value: unknown,
  depth: number,
): void {
  if (depth > 12 || !isRecord(value)) {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "confidence" || key === "source" || key === "sources") {
      continue;
    }
    if (isFactRecord(child)) {
      const path = `${section}.${key}`;
      validateConfidenceField(errors, file, path, child.confidence);
      validateSourceFields(errors, file, path, child, false);
    } else if (isRecord(child)) {
      validateNestedFactRecords(
        errors,
        file,
        `${section}.${key}`,
        child,
        depth + 1,
      );
    }
  }
}

function validateTopLevelVerifiedOn(
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
  file: string,
  root: Record<string, unknown>,
): void {
  const section = "(file)";
  const verifiedOn = root.verified_on;
  if (verifiedOn === undefined || verifiedOn === null) {
    pushError(errors, file, section, "missing verified_on");
    return;
  }
  if (typeof verifiedOn !== "string") {
    pushError(
      errors,
      file,
      section,
      "verified_on must be an ISO date string (YYYY-MM-DD)",
    );
    return;
  }
  const parsed = parseIsoDate(verifiedOn);
  if (!parsed) {
    pushError(errors, file, section, `invalid verified_on date: ${verifiedOn}`);
    return;
  }
  const today = todayCalendar();
  if (parsed.getTime() > today.getTime()) {
    pushError(
      errors,
      file,
      section,
      `verified_on is in the future: ${verifiedOn}`,
    );
    return;
  }
  const ageMs = today.getTime() - parsed.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays > 180) {
    pushWarning(
      warnings,
      file,
      section,
      `verified_on is older than 180 days (${verifiedOn})`,
    );
  }
}

function validateStateFileName(file: string): ValidationMessage | null {
  const name = basename(file);
  if (!/^[a-z]+(-[a-z]+)*\.yaml$/.test(name)) {
    return {
      file: name,
      section: "(file)",
      problem:
        "state file name must be lowercase hyphenated (data/states/<state-name>.yaml)",
    };
  }
  return null;
}

export function validateStateDocument(
  fileLabel: string,
  document: unknown,
): ValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];

  const nameError = validateStateFileName(fileLabel);
  if (nameError) {
    errors.push(nameError);
    return { errors, warnings };
  }

  if (!isRecord(document)) {
    pushError(errors, fileLabel, "(file)", "root must be a YAML mapping");
    return { errors, warnings };
  }

  validateTopLevelVerifiedOn(errors, warnings, fileLabel, document);

  for (const [key, value] of Object.entries(document)) {
    if (METADATA_KEYS.has(key) || !isRecord(value)) {
      continue;
    }
    const nestedFactContainer =
      (value.confidence === undefined || value.confidence === null) &&
      isDirectNestedFactContainer(value);

    if (nestedFactContainer) {
      const nestedUrls = collectDirectNestedFactSources(value);
      if (nestedUrls.length === 0) {
        pushError(
          errors,
          fileLabel,
          key,
          "section has facts but no source URL",
        );
      } else {
        for (const url of nestedUrls) {
          if (!isValidHttpsUrl(url)) {
            pushError(
              errors,
              fileLabel,
              key,
              `source is not a valid https URL: ${url}`,
            );
          }
        }
      }
    } else {
      validateConfidenceField(errors, fileLabel, key, value.confidence);
      validateSourceFields(errors, fileLabel, key, value, true);
    }
    validateNestedFactRecords(errors, fileLabel, key, value, 0);
  }

  return { errors, warnings };
}

export function validateStateFile(filePath: string): ValidationResult {
  const fileLabel = basename(filePath);
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch {
    return {
      errors: [
        {
          file: fileLabel,
          section: "(file)",
          problem: "could not read file",
        },
      ],
      warnings: [],
    };
  }
  let document: unknown;
  try {
    document = parseYaml(raw);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      errors: [
        {
          file: fileLabel,
          section: "(file)",
          problem: `invalid YAML: ${detail}`,
        },
      ],
      warnings: [],
    };
  }
  return validateStateDocument(fileLabel, document);
}

export function validateStatesDirectory(statesDir: string): ValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];

  let entries: string[];
  try {
    entries = readdirSync(statesDir).filter((name) => name.endsWith(".yaml"));
  } catch {
    return {
      errors: [
        {
          file: statesDir,
          section: "(directory)",
          problem: "could not read data/states directory",
        },
      ],
      warnings: [],
    };
  }

  if (entries.length === 0) {
    errors.push({
      file: statesDir,
      section: "(directory)",
      problem: "no state YAML files found",
    });
    return { errors, warnings };
  }

  for (const name of entries.sort()) {
    const result = validateStateFile(join(statesDir, name));
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return { errors, warnings };
}

export function formatValidationMessages(
  messages: ValidationMessage[],
): string[] {
  return messages.map((m) => `${m.file} → ${m.section}: ${m.problem}`);
}
