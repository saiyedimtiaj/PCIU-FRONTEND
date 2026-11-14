export type NoticeCategory =
  | "All"
  | "Academic"
  | "Admission"
  | "Examination"
  | "Administrative"
  | "Event"
  | "Scholarship"
  | "General";

export interface NoticeDepartment {
  id?: number | null;
  name?: string | null;
  shortName?: string | null;
  slug?: string | null;
}

export interface NoticePage {
  id?: number | null;
  title?: string | null;
  path?: string | null;
}

export interface NoticeApiRecord {
  id: number;
  departmentId?: number | null;
  pageId?: number | null;
  title?: string | null;
  badgeLabel?: string | null;
  badgeColor?: string | null;
  icon?: string | null;
  category?: string | null;
  pdfUrl?: string | null;
  noticeDate?: string | null;
  isActive?: boolean;
  isHome?: boolean;
  sortOrder?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  department?: NoticeDepartment | null;
  page?: NoticePage | null;
}

export interface Notice {
  id: number;
  title: string;
  category: string;
  departmentName: string;
  departmentShortName: string;
  date: string;
  dateLabel: string;
  fileUrl: string;
  isNew: boolean;
  fileSize: string;
  pdfUrl?: string | null;
  badgeLabel?: string | null;
  badgeColor?: string | null;
  noticeDate?: string | null;
  createdAt?: string | null;
}

export interface NoticesPageContent {
  categories: NoticeCategory[];
  notices: Notice[];
}
