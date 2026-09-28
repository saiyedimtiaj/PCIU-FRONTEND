import type { IconName } from "@/lib/icons";

export interface FacultyOverviewDepartment {
  name: string;
  chairman?: string;
  programs: string[];
  /** Link to a future department detail page. Omit if that page doesn't exist yet. */
  href?: string;
}

export interface FacultyOverview {
  id: number;
  /** URL-friendly key used in ?faculty= until real API ids replace it. */
  slug: string;
  icon: IconName;
  name: string;
  shortName: string;
  dean: string;
  about: string;
  vision: string;
  mission: string;
  departments: FacultyOverviewDepartment[];
  highlights: string[];
}
