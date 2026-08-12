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
  color: string;
}

export interface ResearchPublication {
  title: string;
  authors: string;
  year: number;
  type: string;
  venue: string;
  department: string;
}

export interface ResearchPartnership {
  name: string;
  country: string;
  type: string;
}

export interface ResearchMou {
  partner: string;
  date: string;
  scope: string;
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
