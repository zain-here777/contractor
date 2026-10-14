export type SiteTheme = "light" | "dark";

const STORAGE_KEY = "site-theme";

export function getStoredTheme(): SiteTheme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") {
      return value;
    }
  } catch {
    /* private mode or blocked storage */
  }
  return null;
}

export function resolveTheme(): SiteTheme {
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function applyTheme(theme: SiteTheme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function syncThemeToggleUi(): void {
  const dark = document.documentElement.dataset.theme === "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((control) => {
    control.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode",
    );
    control.setAttribute("aria-pressed", dark ? "true" : "false");
  });
}

export function toggleTheme(): SiteTheme {
  const next: SiteTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  syncThemeToggleUi();
  return next;
}

export function bindThemeToggle(): void {
  document.querySelectorAll("[data-theme-toggle]").forEach((control) => {
    control.addEventListener("click", () => {
      toggleTheme();
    });
  });
  syncThemeToggleUi();
}
