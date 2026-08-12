import type { IconName } from "@/lib/icons";

export interface LibraryInfoCard {
  icon: IconName;
  title: string;
  lines: string[];
}

export interface LibraryService {
  title: string;
  description: string;
}

export interface LibraryCommitteeMember {
  name: string;
  designation: string;
  email: string;
}

export interface LibraryResourceLink {
  name: string;
  url: string;
  description: string;
  icon?: IconName;
}

export interface LibraryPageContent {
  infoCards: LibraryInfoCard[];
  services: LibraryService[];
  committeeMembers: LibraryCommitteeMember[];
  eLibraryLinks: LibraryResourceLink[];
  journalLinks: LibraryResourceLink[];
}
