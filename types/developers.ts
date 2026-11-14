export interface Developer {
  name: string;
  role: string;
  studentId: string | null;
  about: string;
  /** Absolute URL or a path under public/. Falls back to initials. */
  image: string | null;
  /** GitHub username or profile URL. */
  github: string | null;
  linkedin: string | null;
  facebook: string | null;
  portfolio: string | null;
  /** What they built or worked on, one item per line. */
  contributions: string[];
}

export interface DevelopersPageContent {
  team: string;
  intro: string;
  developers: Developer[];
}

/** A row from `GET /developers`. */
export interface DeveloperApiRecord {
  id: number | string;
  name: string;
  role?: string | null;
  student_id?: string | number | null;
  about?: string | null;
  image?: string | null;
  github?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  portfolio?: string | null;
  /** JSON column: an array of strings, or its stringified form. */
  contributions?: string[] | string | null;
  display_order?: number | null;
  status?: boolean | number | null;
}
