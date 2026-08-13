import type { FacultyProfile as DirectoryProfile } from "@/types/faculty-directory";

// ---------------------------------------------------------------------------
// Deterministic expansion of the thin directory profile (name, designation,
// department, faculty, one education entry, teaching areas) into the full
// editable shape the faculty workspace needs (contact info, bio, social
// links, publications, experience, awards, memberships, conferences).
// Seeded the same way as components/admin/list/sample-data.ts: no
// Math.random()/Date.now() at render time, so server and client render
// identically — this data backs a client form, but the Overview tab's
// stats/sparklines read from it too and must stay hydration-safe.
// ---------------------------------------------------------------------------

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function next() {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandom(...parts: (string | number)[]): number {
  return mulberry32(hashString(parts.join("::")))();
}

function pick<T>(items: readonly T[], ...seedParts: (string | number)[]): T {
  const idx = Math.floor(seededRandom(...seedParts) * items.length);
  return items[Math.min(idx, items.length - 1)];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

export interface PublicationEntry {
  title: string;
  journal: string;
  year: string;
  authors: string;
}

// Standardized on {title, organization, period} — the old faculty
// dashboard wrote {position, organization, duration}, which the public
// profile page never read (it looked for title/period), so "duration"
// silently never rendered. See the plan doc for the full bug writeup.
export interface ExperienceEntry {
  title: string;
  organization: string;
  period: string;
}

export interface AwardEntry {
  title: string;
  year: string;
  description: string;
}

export interface MembershipEntry {
  name: string;
  role: string;
}

export interface FacultyWorkspaceProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  faculty: string;
  email: string;
  phone: string;
  office: string;
  imageUrl: string;
  shortBio: string;
  bio: string;
  teachingAreas: string[];
  googleScholarUrl: string;
  researchgateUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  education: EducationEntry[];
  publications: PublicationEntry[];
  experience: ExperienceEntry[];
  awards: AwardEntry[];
  memberships: MembershipEntry[];
  conferences: string[];
}

const JOURNALS = [
  "Port City Journal",
  "IEEE Access",
  "Journal of Applied Sciences",
  "Asian Journal of Management",
  "International Review of Education",
];

const ORGANIZATIONS = [
  "Port City International University",
  "University of Chittagong",
  "BRAC University",
  "North South University",
  "Chittagong University of Engineering & Technology",
];

const AWARD_TITLES = [
  "Best Researcher Award",
  "Excellence in Teaching Award",
  "Dean's Award for Academic Merit",
  "Outstanding Faculty Recognition",
];

const MEMBERSHIP_ORGS = [
  "IEEE",
  "Bangladesh Computer Society",
  "American Marketing Association",
  "Association of Commonwealth Universities",
];

const CONFERENCES = [
  "International Conference on Computer and Information Technology",
  "Asia Pacific Conference on Higher Education",
  "South Asian Symposium on Applied Research",
];

const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];

/**
 * Expands a thin `content/faculty-directory/profiles.json` entry into the
 * full profile shape the workspace editor works with. Everything beyond
 * what the directory JSON already has is seeded from the profile id, so
 * the "sample" data is stable across renders and rebuilds.
 */
export function buildWorkspaceProfile(directory: DirectoryProfile): FacultyWorkspaceProfile {
  const id = directory.id;
  const slug = slugify(directory.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.)\s*/gi, ""));

  const educationCount = 1 + Math.floor(seededRandom(id, "edu-count") * 2);
  const education: EducationEntry[] = directory.education.length > 0
    ? directory.education.map((e, i) => ({
        degree: e.degree,
        institution: e.institution,
        year: pick(YEARS, id, "edu-year", i),
      }))
    : Array.from({ length: educationCount }, (_, i) => ({
        degree: pick(["PhD", "MSc", "MBA", "MA"], id, "edu-degree", i),
        institution: pick(ORGANIZATIONS, id, "edu-institution", i),
        year: pick(YEARS, id, "edu-year", i),
      }));

  const publicationCount = Math.floor(seededRandom(id, "pub-count") * 4);
  const publications: PublicationEntry[] = Array.from({ length: publicationCount }, (_, i) => ({
    title: `${pick(directory.teachingAreas.length > 0 ? directory.teachingAreas : ["Applied Research"], id, "pub-title", i)}: A Study`,
    journal: pick(JOURNALS, id, "pub-journal", i),
    year: pick(YEARS, id, "pub-year", i),
    authors: directory.name,
  }));

  const experienceCount = 1 + Math.floor(seededRandom(id, "exp-count") * 3);
  const experience: ExperienceEntry[] = Array.from({ length: experienceCount }, (_, i) => ({
    title: i === 0 ? directory.designation : pick(["Lecturer", "Assistant Professor", "Research Fellow"], id, "exp-title", i),
    organization: i === 0 ? "Port City International University" : pick(ORGANIZATIONS, id, "exp-org", i),
    period: i === 0 ? `${pick(YEARS, id, "exp-start", i)} – Present` : `${pick(YEARS, id, "exp-start", i)} – ${pick(YEARS, id, "exp-end", i)}`,
  }));

  const awardCount = Math.floor(seededRandom(id, "award-count") * 3);
  const awards: AwardEntry[] = Array.from({ length: awardCount }, (_, i) => ({
    title: pick(AWARD_TITLES, id, "award-title", i),
    year: pick(YEARS, id, "award-year", i),
    description: "Recognized for outstanding contribution to the department.",
  }));

  const membershipCount = Math.floor(seededRandom(id, "membership-count") * 3);
  const memberships: MembershipEntry[] = Array.from({ length: membershipCount }, (_, i) => ({
    name: pick(MEMBERSHIP_ORGS, id, "membership-org", i),
    role: pick(["Member", "Senior Member", "Fellow"], id, "membership-role", i),
  }));

  const conferenceCount = Math.floor(seededRandom(id, "conf-count") * 3);
  const conferences: string[] = Array.from({ length: conferenceCount }, (_, i) =>
    pick(CONFERENCES, id, "conf", i)
  );

  return {
    id,
    name: directory.name,
    designation: directory.designation,
    department: directory.department,
    faculty: directory.faculty,
    email: `${slug}@portcity.edu.bd`,
    phone: `+8801${String(hashString(id)).padStart(9, "0").slice(0, 9)}`,
    office: `Room ${100 + (hashString(id) % 400)}, Academic Building`,
    imageUrl: directory.imageUrl ?? "",
    shortBio: `${directory.designation} in the Department of ${directory.department}, specializing in ${directory.teachingAreas[0] ?? "their field"}.`,
    bio: `${directory.name} is a ${directory.designation.toLowerCase()} at Port City International University, with a research focus on ${directory.teachingAreas.join(" and ") || "their discipline"}.`,
    teachingAreas: directory.teachingAreas,
    googleScholarUrl: "",
    researchgateUrl: "",
    linkedinUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    education,
    publications,
    experience,
    awards,
    memberships,
    conferences,
  };
}
