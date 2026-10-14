/** Statute edition hint from an official source URL (no YAML notes). */
export function statuteEditionHintFromUrl(url: string): string | null {
  const florida = url.match(/flsenate\.gov\/Laws\/Statutes\/(\d{4})\//i);
  if (florida) {
    return `Florida Statutes, ${florida[1]} edition. Check for newer amendments.`;
  }
  const pathYear = url.match(/\/Statutes\/(\d{4})\//i);
  if (pathYear) {
    return `Statutes, ${pathYear[1]} edition. Check for newer amendments.`;
  }
  const chapterYear = url.match(/\/Laws\/Statutes\/(\d{4})\//i);
  if (chapterYear) {
    return `Statutes, ${chapterYear[1]} edition. Check for newer amendments.`;
  }
  return null;
}

export function statuteEditionHintFromSources(
  sources: string[],
): string | null {
  for (const url of sources) {
    const hint = statuteEditionHintFromUrl(url);
    if (hint) {
      return hint;
    }
  }
  return null;
}

function humanizePathToken(raw: string): string {
  const cleaned = raw
    .replace(/\.(pdf|aspx|htm|html|php)$/i, "")
    .replace(/_ENG\d+_ADA$/i, "")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  if (!cleaned) {
    return raw;
  }
  return cleaned
    .split(/\s+/)
    .map((word) => {
      if (word.length <= 3 && word === word.toUpperCase()) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function agencyShortName(hostname: string): string | null {
  const host = hostname.replace(/^www\d?\./i, "").replace(/^www\./i, "");
  if (host.includes("cslb.ca.gov")) {
    return "CSLB";
  }
  if (host.includes("myfloridalicense.com")) {
    return "Florida DBPR";
  }
  if (host.includes("flsenate.gov")) {
    return "Florida Legislature";
  }
  if (host.includes("tdlr.texas.gov")) {
    return "Texas TDLR";
  }
  if (host.includes("tsbpe.texas.gov")) {
    return "Texas TSBPE";
  }
  if (host.includes("flrules.org")) {
    return "Florida administrative rules";
  }
  return null;
}

function labelFromPath(path: string, hostname: string): string | null {
  const floridaStatute = path.match(/\/Laws\/Statutes\/(\d{4})\/([\d.]+)/i);
  if (floridaStatute) {
    const section = floridaStatute[2].replace(/^0+/, "");
    return `Florida Statutes § ${section} (${floridaStatute[1]})`;
  }
  const floridaChapter = path.match(/\/Laws\/Statutes\/(\d{4})\/Chapter(\d+)/i);
  if (floridaChapter) {
    return `Florida Statutes Chapter ${floridaChapter[2]} (${floridaChapter[1]})`;
  }

  const lower = path.toLowerCase();
  if (lower.includes("checklicense")) {
    return "Official license lookup";
  }
  if (lower.includes("processingtimes")) {
    return "License processing times";
  }
  if (lower.includes("reciprocity")) {
    return "Reciprocity requirements";
  }
  if (lower.includes("public_info_faq")) {
    return "Public FAQ";
  }
  if (lower.includes("/fees")) {
    return "Fee schedule";
  }
  if (lower.includes("bond_requirements")) {
    return "Contractor bond requirements";
  }
  if (lower.includes("bond_basics")) {
    return "Contractor bond basics";
  }
  if (lower.includes("construction-industry")) {
    return "Construction industry licensing";
  }
  if (lower.includes("journeyman-electrician")) {
    return "Journeyman electrician application";
  }
  if (lower.includes("master-electrician")) {
    return "Master electrician application";
  }
  if (lower.includes("license-types")) {
    return "License types";
  }
  if (lower.includes("notice_files")) {
    return "Administrative rule notice";
  }

  const filename = path.split("/").pop() ?? "";
  if (/\.pdf$/i.test(filename)) {
    const title = humanizePathToken(filename);
    return title.endsWith("(PDF)") ? title : `${title} (PDF)`;
  }

  const lastSegment = path.split("/").filter(Boolean).pop();
  if (lastSegment) {
    const agency = agencyShortName(hostname);
    const page = humanizePathToken(lastSegment);
    return agency ? `${agency}: ${page}` : page;
  }

  return null;
}

/** Readable label for official source links (href stays the full URL). */
export function formatSourceLinkLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const fromPath = labelFromPath(parsed.pathname, parsed.hostname);
    if (fromPath) {
      return fromPath;
    }
    const agency = agencyShortName(parsed.hostname);
    if (agency) {
      return `${agency} website`;
    }
    const host = parsed.hostname.replace(/^www\d?\./i, "").replace(/^www\./i, "");
    return host;
  } catch {
    return url;
  }
}

export function buildSourceBoxTitle(
  sectionTitle: string,
  sources: string[],
): string {
  const edition = statuteEditionHintFromSources(sources);
  if (edition) {
    return `Sources: ${sectionTitle} — ${edition}`;
  }
  return `Sources: ${sectionTitle}`;
}
