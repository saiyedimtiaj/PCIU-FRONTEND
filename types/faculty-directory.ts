export interface FacultyEducationEntry {
  degree: string;
  institution: string;
}

export interface FacultyProfile {
  id: string;
  name: string;
  designation: string;
  faculty: string;
  department: string;
  imageUrl: string | null;
  education: FacultyEducationEntry[];
  teachingAreas: string[];
}
