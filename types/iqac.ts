export interface IqacCommitteeMember {
  name: string;
  designation: string;
  role: string;
  department: string;
  email: string;
}

export interface IqacActivity {
  title: string;
  date: string;
  type: string;
  description: string;
}

export interface IqacGalleryItem {
  category: string;
  title: string;
}

export interface IqacDocument {
  name: string;
  type: string;
  size: string;
}

export interface IqacQuickLink {
  name: string;
  url: string;
}

export interface IqacNotice {
  title: string;
  date: string;
  color: "accent" | "secondary" | "highlight";
}

export interface IqacPageContent {
  about: string[];
  vision: string;
  mission: string;
  objectives: string[];
  directorMessage: {
    paragraphs: string[];
    name: string;
    designation: string;
    email: string;
  };
  committeeMembers: IqacCommitteeMember[];
  activities: IqacActivity[];
  gallery: IqacGalleryItem[];
  documents: IqacDocument[];
  quickLinks: IqacQuickLink[];
  notices: IqacNotice[];
  contact: {
    address: string;
    phone: string;
    email: string;
  };
}

/** The teacher row the API joins onto `director` / a committee member. */
export interface IqacApiTeacher {
  id: number;
  name: string;
  slug?: string | null;
  imageUrl?: string | null;
  designation?: string | null;
  email?: string | null;
  department?: { name?: string | null } | null;
  user?: { email?: string | null } | null;
}

/** `GET /iqac/committee` row (also embedded as `GET /iqac`'s `committeeMembers`). */
export interface IqacApiCommitteeMember {
  id: number;
  teacherId: number;
  designation: string;
  status: boolean;
  iqacOrder: number;
  teacher?: IqacApiTeacher | null;
}

/** `GET /iqac` — the one IQAC row the backend keeps. */
export interface IqacApiRecord {
  id: number;
  directorId: number | null;
  title: string | null;
  subtitle: string | null;
  about: string | null;
  mission: string | null;
  vision: string | null;
  directorMessage: string | null;
  objectives: string[] | string | null;
  quickLinks?: { title?: string | null; url?: string | null }[] | string | null;
  director: IqacApiTeacher | null;
  committeeMembers?: IqacApiCommitteeMember[];
}

export interface IqacPerson {
  name: string;
  designation: string;
  department: string;
  email: string;
  image: string | null;
  href: string | null;
}

/** What the public page renders: live API fields merged over the static JSON. */
export interface IqacPageData {
  title: string;
  subtitle: string;
  /** Rich-text HTML when the admin used the editor, else plain paragraphs. */
  aboutHtml: string | null;
  about: string[];
  vision: string;
  mission: string;
  objectives: string[];
  director: IqacPerson | null;
  directorMessageHtml: string | null;
  directorMessage: string[];
  committee: (IqacPerson & { role: string })[];
  quickLinks: IqacQuickLink[];
}

/** An IQAC activity as rendered — an Event whose category starts with "IQAC". */
export interface IqacActivityItem {
  title: string;
  date: string;
  type: string;
  description: string;
  image: string | null;
  href: string | null;
}

/** An IQAC gallery photo — a Gallery item whose type starts with "iqac". */
export interface IqacGalleryPhoto {
  category: string;
  title: string;
  image: string;
}
