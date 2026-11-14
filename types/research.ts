import type { IconName } from "@/lib/icons";

export interface ResearchCentre {
  name: string;
  lead: string;
  description: string;
  focus: string[];
}

export interface ResearchArea {
  title: string;
  icon: IconName;
  /** A Tailwind gradient (`from-… to-…`) or a CSS color like `#1d4ed8`. */
  color: string;
}

export interface ResearchPublication {
  title: string;
  authors: string;
  year: number;
  type: string;
  venue: string;
  department: string;
  /** External link, or the uploaded PDF when there is none. */
  link?: string | null;
}

export interface ResearchPartnership {
  name: string;
  country: string;
  type: string;
  logo?: string | null;
  website?: string | null;
}

export interface ResearchMou {
  partner: string;
  date: string;
  scope: string;
  document?: string | null;
}

export interface ResearchPageContent {
  centres: ResearchCentre[];
  areas: ResearchArea[];
  publications: ResearchPublication[];
  partnerships: ResearchPartnership[];
  mous: ResearchMou[];
}

export const RESEARCH_SECTION_IDS = [
  "centres",
  "areas",
  "publications",
  "partnerships",
  "mous",
] as const;

export type ResearchSectionId = (typeof RESEARCH_SECTION_IDS)[number];

/** Rows as the API returns them (camelCase, joined relations inline). */
export interface ResearchApiCentre {
  id: number;
  name?: string | null;
  description?: string | null;
  tags?: unknown;
  coordinatorName?: string | null;
  displayOrder?: number | null;
  department?: { name?: string | null; shortName?: string | null } | null;
}

export interface ResearchApiArea {
  id: number;
  title?: string | null;
  icon?: string | null;
  backgroundColor?: string | null;
  displayOrder?: number | null;
}

export interface ResearchApiPublication {
  id: number;
  title?: string | null;
  authors?: string | null;
  venue?: string | null;
  year?: number | string | null;
  type?: string | null;
  externalLink?: string | null;
  pdfFile?: string | null;
  department?: { name?: string | null; shortName?: string | null } | null;
}

export interface ResearchApiPartner {
  id: number;
  name?: string | null;
  country?: string | null;
  category?: string | null;
  logo?: string | null;
  websiteUrl?: string | null;
  displayOrder?: number | null;
}

export interface ResearchApiMou {
  id: number;
  partnerId?: number | null;
  partner?: { name?: string | null } | null;
  dateSigned?: string | null;
  scopeOfCollaboration?: string | null;
  documentPdf?: string | null;
}
