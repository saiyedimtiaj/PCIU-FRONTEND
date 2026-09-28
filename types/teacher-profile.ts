/** Session-scoped teacher records — GET /teachers/profile/me returns the
 * teacher, and each sub-resource collection nested within it. */

export interface TeacherEducationRecord {
  id: number;
  degree: string;
  institution: string;
  educationYear: string;
  eduOrder: number;
}

export interface TeacherExperienceRecord {
  id: number;
  title: string;
  organization: string;
  period: string;
  exOrder: number;
}

export interface TeacherMembershipRecord {
  id: number;
  name: string;
  role: string;
  membershipOrder: number;
}

export interface TeacherAwardRecord {
  id: number;
  title: string;
  awardDate: string;
  description: string;
  awOrder: number;
}

export interface TeacherPublicationRecord {
  id: number;
  title: string;
  authors: string | null;
  venue: string | null;
  year: number | null;
  type: string | null;
  externalLink: string | null;
  abstract: string | null;
  pdfFile: string | null;
  status: boolean;
}

export interface TeacherProfileRecord {
  id: number;
  userId?: number;
  departmentId?: number | null;
  name: string;
  slug: string;
  imageUrl: string | null;
  office: string | null;
  designation: string | null;
  shortBio: string | null;
  teachingAreas: string | null;
  bio: string | null;
  isStudyLeave?: boolean;
  leavePeriod?: string | null;
  googleScholarUrl: string | null;
  researchgateUrl: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  isVc?: boolean;
  isManagement?: boolean;
  isActive?: boolean;
  isAdjunctFaculty?: boolean;
  seniorityOrder?: number;
  department?: {
    id: number;
    name: string;
    faculty?: { id: number; name: string } | null;
  } | null;
  user?: { id: number; name: string; email: string; role: string };
  education?: TeacherEducationRecord[];
  experiences?: TeacherExperienceRecord[];
  memberships?: TeacherMembershipRecord[];
  awards?: TeacherAwardRecord[];
  publications?: TeacherPublicationRecord[];
}

/** The five self-service sub-resource collections. Path segments as the
 * API exposes them — note "experiences" is plural while every UI section
 * key elsewhere in this codebase (FacultyProfileProvider's RowSectionKey)
 * uses the singular "experience". */
export type TeacherSubResource =
  | "education"
  | "experiences"
  | "memberships"
  | "awards"
  | "publications";

/** A decoded row from any sub-resource collection, always carrying a
 * string `id` — matching the `__id` convention in services/entity.ts so
 * the row can key a DataTable and address an edit/delete by identity
 * rather than array position. */
export type TeacherSubRecord =
  | TeacherEducationRecord
  | TeacherExperienceRecord
  | TeacherMembershipRecord
  | TeacherAwardRecord
  | TeacherPublicationRecord;
