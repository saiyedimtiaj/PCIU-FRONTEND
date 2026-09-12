import { GraduationCap, BookOpen, Briefcase, Award, Users, type LucideIcon } from "lucide-react";
import type { RowSectionKey } from "./FacultyProfileProvider";

export interface SectionFieldDescriptor {
  name: string;
  label: string;
  placeholder?: string;
  /** Grid span within the modal form's 2-column layout. Defaults to 1. */
  colSpan?: 1 | 2;
  /** Renders a Textarea instead of a single-line Input. */
  multiline?: boolean;
}

export interface FacultySectionConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  itemLabel: string;
  pluralLabel: string;
  fields: SectionFieldDescriptor[];
}

// Centralized so server page.tsx files (both /faculty-portal/* and
// /admin/faculty/[id]/*) only ever pass the `section` KEY STRING into
// FacultySectionList — never a LucideIcon or a fields array containing
// functions — across the server/client boundary. Passing a component
// reference that way fails the Next.js build (confirmed: "Functions cannot
// be passed directly to Client Components"), the same class of bug
// AGENTS.md documents for EntitySchema/LucideIcon.
export const FACULTY_SECTION_CONFIG: Record<RowSectionKey, FacultySectionConfig> = {
  education: {
    title: "Education",
    description: "Academic qualifications.",
    icon: GraduationCap,
    itemLabel: "Education",
    pluralLabel: "Education Entries",
    fields: [
      { name: "degree", label: "Degree", placeholder: "Ph.D. in Management" },
      { name: "institution", label: "Institution", placeholder: "University Name", colSpan: 2 },
      { name: "year", label: "Year", placeholder: "2020" },
    ],
  },
  publications: {
    title: "Publications",
    description: "Research papers and articles.",
    icon: BookOpen,
    itemLabel: "Publication",
    pluralLabel: "Publications",
    fields: [
      { name: "title", label: "Title", placeholder: "Research paper title", colSpan: 2 },
      { name: "venue", label: "Journal / Publisher", placeholder: "Journal name" },
      { name: "year", label: "Year", placeholder: "2023" },
      { name: "authors", label: "Authors", placeholder: "Author 1, Author 2, ...", colSpan: 2 },
    ],
  },
  experience: {
    title: "Experience",
    description: "Professional experience.",
    icon: Briefcase,
    itemLabel: "Experience",
    pluralLabel: "Experience Entries",
    fields: [
      { name: "title", label: "Title / Role", placeholder: "Professor" },
      { name: "organization", label: "Organization", placeholder: "University Name", colSpan: 2 },
      { name: "period", label: "Period", placeholder: "2018 – Present" },
    ],
  },
  awards: {
    title: "Awards & Honors",
    description: "Recognition received.",
    icon: Award,
    itemLabel: "Award",
    pluralLabel: "Awards",
    fields: [
      { name: "title", label: "Award Title", placeholder: "Best Researcher Award", colSpan: 2 },
      { name: "year", label: "Year", placeholder: "2024" },
      { name: "description", label: "Description", placeholder: "Brief description", colSpan: 2, multiline: true },
    ],
  },
  memberships: {
    title: "Professional Memberships",
    description: "Organizations you belong to.",
    icon: Users,
    itemLabel: "Membership",
    pluralLabel: "Memberships",
    fields: [
      { name: "name", label: "Organization", placeholder: "IEEE", colSpan: 2 },
      { name: "role", label: "Role", placeholder: "Member" },
    ],
  },
};
