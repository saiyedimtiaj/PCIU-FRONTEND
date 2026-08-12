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

export interface DepartmentQuickLink {
  label: string;
  url: string;
}

export interface DepartmentFacultyMember {
  name: string;
  designation: string;
  specialization: string;
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
  notices: DepartmentNotice[];
  contact: DepartmentContact;
  quickLinks: DepartmentQuickLink[];
  facultyMembers: DepartmentFacultyMember[];
  researchAreas: DepartmentResearchArea[];
  industryPartners?: string[];
  achievements: DepartmentAchievement[];
  facultyQueryParam: string;
}
