import type { IconName } from "@/lib/icons";

export interface DepartmentLink {
  name: string;
  href?: string;
}

interface FacultyMeta {
  departments: DepartmentLink[];
  icon: IconName;
}

export const FACULTY_META: Record<number, FacultyMeta> = {
  5: {
    // Faculty of Science & Engineering
    departments: [
      { name: "CSE"},
      { name: "EEE" },
      { name: "Civil" },
      { name: "Textile"},
      { name: "Fashion" },
    ],
    icon: "cpu",
  },
  7: {
    // Faculty of Humanities, Social Science & Law
    departments: [
      { name: "English" },
      { name: "Journalism & Media Studies" },
      { name: "Law" },
    ],
    icon: "gavel",
  },
  6: {
    // Faculty of Business Studies
    departments: [{ name: "Business Administration" }],
    icon: "trending-up",
  },
};

const DEFAULT_ICON: IconName = "graduation-cap";

export function getFacultyMeta(facultyId: number): FacultyMeta {
  return FACULTY_META[facultyId] ?? { departments: [], icon: DEFAULT_ICON };
}