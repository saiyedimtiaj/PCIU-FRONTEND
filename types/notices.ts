export type NoticeCategory =
  | "All"
  | "Academic"
  | "Admission"
  | "Examination"
  | "Administrative"
  | "Event"
  | "Scholarship";

export interface Notice {
  id: number;
  title: string;
  category: Exclude<NoticeCategory, "All">;
  date: string;
  dateLabel: string;
  fileUrl: string;
  isNew: boolean;
  fileSize: string;
}

export interface NoticesPageContent {
  categories: NoticeCategory[];
  notices: Notice[];
}
