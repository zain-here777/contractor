/** True when a display string is an http(s) URL we should link. */
export function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const EXTERNAL_LINK_TARGET = "_blank";

export const EXTERNAL_LINK_REL = "noopener noreferrer";

export function isPdfUrl(url: string): boolean {
  try {
    return /\.pdf$/i.test(new URL(url).pathname);
  } catch {
    return /\.pdf$/i.test(url);
  }
}
