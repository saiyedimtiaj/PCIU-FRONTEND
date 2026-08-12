export interface JournalSidebarLink {
  label: string;
  href: string;
}

export interface JournalArchive {
  id: string;
  volumeName: string;
  year: number;
  pdfUrl: string;
}

export interface JournalAboutTab {
  title: string;
  subtitle: string;
  description: string;
  issn: string;
  issnNote?: string;
  chiefEditor?: { name: string; designation: string };
  associateEditors?: { name: string }[];
}

export interface JournalBoardMember {
  name: string;
  title?: string;
  dept?: string;
  role?: string;
}

export interface JournalBoardTab {
  members: JournalBoardMember[];
}

export interface JournalAuthorSection {
  heading: string;
  items?: string[];
  text?: string;
}

export interface JournalAuthorTab {
  sections: JournalAuthorSection[];
}

export interface JournalContactTab {
  officeName: string;
  journalName: string;
  university: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  website: string;
}

export interface PortCityNewsPageContent {
  sidebarLinks: JournalSidebarLink[];
  archives: JournalArchive[];
  tabs: {
    about: JournalAboutTab;
    advisory: JournalBoardTab;
    editorial: JournalBoardTab;
    author: JournalAuthorTab;
    contact: JournalContactTab;
  };
}

export type JournalTabId = keyof PortCityNewsPageContent["tabs"];
