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
