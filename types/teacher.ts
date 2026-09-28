export interface TeacherEducation {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

export interface TeacherExperience {
  id: number;
  title: string;
  organization: string;
  period: string;
}

export interface TeacherMembership {
  id: number;
  organization: string;
  role: string;
}

export interface TeacherAward {
  id: number;
  title: string;
  year: string;
  description?: string;
}

export interface TeacherPublication {
  id: number;
  departmentId: number;
  teacherId: number;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: string;
  externalLink?: string;
  abstract?: string;
  pdfFile?: string;
  status: boolean;
}

export interface TeacherDetails {
  id: number;
  userId: number;
  departmentId: number;
  name: string;
  slug: string;
  imageUrl?: string;
  office?: string;
  designation: string;
  shortBio?: string;
  teachingAreas?: string;
  bio?: string;
  isStudyLeave: boolean;
  leavePeriod?: string;
  googleScholarUrl?: string;
  researchgateUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  isVc: boolean;
  isManagement: boolean;
  isActive: boolean;
  isAdjunctFaculty: boolean;
  seniorityOrder: number;
  department: {
    id: number;
    name: string;
    shortName: string;
    slug: string;
    faculty: {
      id: number;
      name: string;
    };
  };
  education: TeacherEducation[];
  experiences: TeacherExperience[];
  memberships: TeacherMembership[];
  awards: TeacherAward[];
  publications: TeacherPublication[];
}
