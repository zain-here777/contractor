import type { RelatedToolLink } from "./types";

const TOOL_LINKS: RelatedToolLink[] = [
  {
    href: "/tools/do-i-need-a-license/",
    label: "Do I need a license? (California)",
  },
  {
    href: "/tools/simple-calculator/",
    label: "Simple calculator",
  },
  {
    href: "/tools/markup-margin-calculator/",
    label: "Markup vs margin calculator",
  },
  {
    href: "/tools/job-profit-calculator/",
    label: "Job profit calculator",
  },
  { href: "/tools/hourly-rate-calculator/", label: "Hourly rate calculator" },
  { href: "/tools/daily-rate-calculator/", label: "Daily rate calculator" },
  { href: "/tools/break-even-calculator/", label: "Break-even calculator" },
  {
    href: "/tools/overhead-rate-calculator/",
    label: "Overhead rate calculator",
  },
  {
    href: "/tools/material-waste-calculator/",
    label: "Material waste calculator",
  },
];

export function relatedToolsExcept(currentPath: string): RelatedToolLink[] {
  return TOOL_LINKS.filter((link) => link.href !== currentPath);
}
