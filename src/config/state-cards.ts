export type StateCardStatus = "available" | "partial-draft";

export interface StateCardMeta {
  name: string;
  summary: string;
  status: StateCardStatus;
  imageSrc: string;
  imageAlt: string;
}

const stateCards: Record<string, StateCardMeta> = {
  california: {
    name: "California",
    summary:
      "General contractor licensing overview with official sources on each section.",
    status: "available",
    imageSrc: "/images/states/california.svg",
    imageAlt: "Map of California from U.S. Census state boundaries",
  },
  florida: {
    name: "Florida",
    summary:
      "Partial draft—structure and qualifier rules from official DBPR and Florida Statutes sources.",
    status: "partial-draft",
    imageSrc: "/images/states/florida.svg",
    imageAlt: "Map of Florida from U.S. Census state boundaries",
  },
  texas: {
    name: "Texas",
    summary:
      "Partial draft—electrician and plumber licensing from official TDLR and TSBPE pages.",
    status: "partial-draft",
    imageSrc: "/images/states/texas.svg",
    imageAlt: "Map of Texas from U.S. Census state boundaries",
  },
};

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getStateCardMeta(slug: string): StateCardMeta {
  const known = stateCards[slug];
  if (known) {
    return known;
  }
  return {
    name: slugToTitle(slug),
    summary: "Licensing guide from official sources where confirmed.",
    status: "partial-draft",
    imageSrc: "/images/states/default.svg",
    imageAlt: `Illustrated map placeholder for ${slugToTitle(slug)}`,
  };
}

export function stateCardStatusLabel(status: StateCardStatus): string {
  return status === "available" ? "Available" : "Partial draft";
}
