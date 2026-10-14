/** Site-wide brand and navigation. Replace TODO(user) values before launch. */

export const siteBrand = {
  /** Header title and og:site_name */
  name: "Contractor licensing & tools", // TODO(user): brand name
  organizationName: "TODO(user): organization name",
  operatorFooterLine: "TODO(user): site operator and contact details.",
} as const;

export type SiteNavLink = {
  href: string;
  label: string;
};

export const primaryNavLinks: SiteNavLink[] = [
  { href: "/licensing/", label: "Licensing" },
  { href: "/tools/", label: "Tools" },
  { href: "/about/", label: "About" },
  { href: "/search/", label: "Search" },
];

/** Highlight nav item when the current path is under that section. */
export function isNavLinkActive(pathname: string, href: string): boolean {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const target = href.endsWith("/") ? href : `${href}/`;
  if (target === "/") {
    return normalized === "/";
  }
  return normalized === target || normalized.startsWith(target);
}

export const footerNavColumns = {
  explore: {
    title: "Explore",
    links: [
      { href: "/licensing/", label: "Licensing" },
      { href: "/tools/", label: "Tools" },
      { href: "/search/", label: "Search" },
    ],
  },
  trust: {
    title: "Trust",
    links: [
      { href: "/methodology/", label: "Methodology" },
      { href: "/editorial-standards/", label: "Editorial standards" },
      { href: "/corrections/", label: "Corrections" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { href: "/privacy/", label: "Privacy" },
      { href: "/terms/", label: "Terms" },
      { href: "/contact/", label: "Contact" },
    ],
  },
} as const;

export const footerDisclaimer =
  "Information only. Not legal advice. Always confirm with the official licensing board.";

/** Static assets in `public/`. Replace before launch as needed. */
export const siteAssets = {
  faviconPath: "/favicon.svg",
  /** Some social platforms prefer 1200×630 PNG; swap when you have a final brand image. */
  defaultOgImagePath: "/og-default.svg",
  defaultOgImageAlt: "TODO(user): default social share image description",
} as const;

/** Routes under /dev/ are for local preview only. */
export function isDevOnlyPath(pathname: string): boolean {
  return pathname.startsWith("/dev/");
}

/** Slugs in the production sitemap and without extra page-level noindex after finalize. */
export const indexableStates = ["california"] as const;

/**
 * When true, state pages use legacy Verified badges.
 * When false, hero shows sourced / not-yet-expert-reviewed status (see stateSourceAttribution).
 */
export const stateExpertReviewed: Record<string, boolean> = {
  california: false,
  florida: false,
  texas: false,
};

/** First sentence of the hero status line when not expert-reviewed. */
export const stateSourceAttribution: Record<string, string> = {
  california: "Sourced from official CSLB pages.",
  florida: "Sourced from official DBPR and Florida Statutes pages.",
  texas: "Sourced from official pages.",
};
