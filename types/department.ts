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
  message: string[];
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
  name: string;
  duration: string;
  credits: string;
  description: string;
  concentrations: string[];
}

export interface DepartmentNotice {
  title: string;
  date: string;
  type: string;
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
  slug: string;
  chairmanHeading: string;
  facilitiesHeading: string | null;
  hero: DepartmentHero;
  stats?: DepartmentStat[];
  chairman: DepartmentChairman;
  overview: DepartmentOverview;
  facilities: DepartmentFacility[];
  programs: DepartmentProgram[];
  tuitionFees: DepartmentTuitionFee[];
  courses: DepartmentCourse[];
  notices: DepartmentNotice[];
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
  quickLink: {
    url: string;
    title: string;
  }[];
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
    message?: string[];
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
  name?: string;
  title?: string;
  date?: string;
  createdAt?: string;
  type?: string;
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
