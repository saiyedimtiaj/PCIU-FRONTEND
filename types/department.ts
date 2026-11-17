import type { IconName } from "@/lib/icons";

export interface DepartmentHero {
  badge: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface DepartmentStat {
  value: string;
  label: string;
}

export interface DepartmentChairman {
  name: string;
  designation: string;
  imageUrl?: string;
  bio: string;
}

export interface DepartmentOverview {
  content: string[];
  hasImage: boolean;
}

export interface DepartmentFacility {
  name: string;
  icon: IconName;
}

export interface DepartmentProgram {
  id: number;
  name: string;
  duration: string;
  credits: string;
  description: string;
  concentrations: string[];
}

export interface DepartmentNotice {
  id: number;
  title: string;
  date: string;
  category: string;
  badgeLabel?: string | null;
  pdfUrl?: string | null;
}

export interface DepartmentEvent {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category?: string | null;
  badgeLabel?: string | null;
  startDateTime: string;
  endDateTime?: string | null;
  allDay?: boolean;
  location?: string | null;
  coverImageUrl?: string | null;
}

export interface DepartmentContact {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export type DepartmentApiQuickLink =
  | string
  | { title?: string; label?: string; name?: string; url?: string };

export interface DepartmentQuickLink {
  label: string;
  url: string;
}

export interface DepartmentFacultyMember {
  id: number;
  slug: string;
  name: string;
  designation: string;
  specialization: string;
  imageUrl?: string;
}

export interface DepartmentResearchArea {
  title: string;
  author: string;
  description: string;
}

export interface DepartmentAchievement {
  value: string;
  label: string;
}

export interface DepartmentCourse {
  courseName: string;
  courseCode: string;
  credit?: string;
}

export interface DepartmentTuitionFee {
  program: string;
  credit: string;
  perCreditAmount: string;
  totalFees: number;
}

export interface DepartmentContent {
  id: number;
  slug: string;
  image?: string;
  chairmanHeading: string;
  facilitiesHeading: string | null;
  hero: DepartmentHero;
  stats?: DepartmentStat[];
  chairman: DepartmentChairman | null;
  overview: DepartmentOverview;
  facilities: DepartmentFacility[];
  programs: DepartmentProgram[];
  tuitionFees: DepartmentTuitionFee[];
  courses: DepartmentCourse[];
  notices: DepartmentNotice[];
  events: DepartmentEvent[];
  contact: DepartmentContact;
  quickLinks: DepartmentQuickLink[];
  facultyMembers: DepartmentFacultyMember[];
  researchAreas: DepartmentResearchArea[];
  industryPartners?: string[];
  achievements: DepartmentAchievement[];
  facultyQueryParam: string;
}

export interface ApiDepartmentResponse {
  id: number;
  facultyId: number;
  chairmanId: number | null;
  name: string;
  shortName: string;
  slug: string;
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  image: string;
  officeLocation: string;
  graduate: number;
  numberOfResearch: number;
  numberOfPartner: number;
  currentStudent: number;
  description: string;
  // The API's `quick_link` json column holds plain strings on some
  // deployments and `{ title, url }` objects on others — accept both.
  quickLink: DepartmentApiQuickLink[];
  status: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  faculty: {
    name: string;
    id: number;
  };
  chairman: {
    name: string;
    designation: string;
    bio: string;
    imageUrl?: string;
  } | null;
}

export interface ApiTeacher {
  id: number;
  slug?: string;
  name: string;
  designation?: string;
  teachingAreas?: string;
  imageUrl?: string;
}

export interface ApiEvent {
  id: number;
  departmentId?: number | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  category?: string | null;
  badgeLabel?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  allDay?: boolean;
  location?: string | null;
  coverImageUrl?: string | null;
  url?: string | null;
  isActive?: boolean;
  createdAt?: string | null;
}

export interface ApiDepartmentNotice {
  id: number;
  title?: string | null;
  badgeLabel?: string | null;
  badgeColor?: string | null;
  category?: string | null;
  pdfUrl?: string | null;
  noticeDate?: string | null;
  isActive?: boolean;
  isHome?: boolean;
  createdAt?: string | null;
  department?: {
    id?: number | null;
    name?: string | null;
    shortName?: string | null;
    slug?: string | null;
  } | null;
}

export interface ApiResearch {
  title?: string;
  name?: string;
  author?: string;
  researcher?: string;
  description?: string;
}

export interface ApiCourse {
  courseName?: string;
  name?: string;
  title?: string;
  courseCode?: string;
  code?: string;
  credit?: string | number;
}

export interface ApiTuitionFee {
  program?: string;
  departmentName?: string;
  credit?: string | number;
  perCreditAmount?: string | number;
  totalFees?: number;
}

export interface ApiProgram {
  id: number;
  title?: string;
  duration?: string | number;
  credit?: string | number;
  perCreditAmount?: string | number;
  programType?: string;
}

export interface ProgramDetail extends ApiProgram {
  department?: {
    id: number;
    name: string;
    shortName: string;
    slug: string;
    faculty?: {
      id: number;
      name: string;
      slug: string;
    };
  };
}
