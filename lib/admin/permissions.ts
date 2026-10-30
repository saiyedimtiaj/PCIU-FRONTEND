/**
 * Admin module → backend permission resource.
 *
 * The API enforces a role × resource matrix (`/permissions` rows of
 * `{ role, resource, view, create, edit, delete }`) and answers 403
 * "Permission not configured" for a role with no row for a resource. This
 * file is the frontend's copy of which resource guards which admin module,
 * so the dashboard can hide what a role can't use instead of letting every
 * click end in a 403.
 *
 * Each module lists candidate resources, most specific first. Modules added
 * after the backend's permission seed (management types, IQAC documents, …)
 * may not have a resource of their own yet; they fall back to their parent
 * resource until the backend adds one — the first candidate that actually
 * exists in the matrix wins (see `resolveResource`).
 */

export const PERMISSION_ACTIONS = ["view", "create", "edit", "delete"] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MODERATOR"] as const;

export const MODULE_RESOURCES: Record<string, readonly string[]> = {
  // Academics
  department: ["DEPARTMENT"],
  faculty: ["FACULTY"],
  program: ["PROGRAM"],
  course: ["COURSE"],
  "lab-facilite": ["LAB_FACILITY"],

  // People
  teacher: ["TEACHER"],
  education: ["EDUCATION"],
  experience: ["EXPERIENCE"],
  membership: ["MEMBERSHIP"],
  awards: ["AWARD"],
  "teacher-publication": ["TEACHER_PUBLICATION", "TEACHER"],
  user: ["USER"],

  // Scheduling
  semester: ["SEMESTER"],
  exam: ["EXAM"],
  batch: ["BATCH"],
  section: ["SECTION"],
  building: ["BUILDING"],
  room: ["ROOM"],
  "time-slot": ["TIME_SLOT"],
  "class-routine": ["CLASS_ROUTINE"],
  "exam-routine": ["EXAM_ROUTINE"],

  // Content
  pages: ["PAGE"],
  about: ["ABOUT", "PAGE"],
  "hero-slides": ["HERO_SLIDE"],
  "news-articles": ["NEWS_ARTICLE"],
  events: ["EVENT"],
  activities: ["ACTIVITY"],
  notices: ["NOTICE"],
  gallery: ["GALLERY"],
  menus: ["MENU"],

  // Research
  "research-centres": ["RESEARCH_CENTRE"],
  "research-areas": ["RESEARCH_AREA"],
  "research-publications": ["RESEARCH_PUBLICATION"],
  seminar: ["SEMINAR"],
  partners: ["PARTNER"],
  mous: ["MOU"],

  // Journal
  "pcj-volumes": ["PCJ_VOLUME"],
  "pcj-articles": ["PCJ_ARTICLE"],

  // Admission
  "admission-advertisements": ["ADMISSION_ADVERTISEMENT"],
  "admission-schedules": ["ADMISSION_SCHEDULE"],
  "admission-test-results": ["ADMISSION_TEST_RESULT"],
  "fee-structures": ["FEE_STRUCTURE"],
  "mba-eligibility-tiers": ["MBA_ELIGIBILITY_TIER"],
  faqs: ["FAQ"],

  // IQAC
  iqac: ["IQAC"],
  "iqac-committee": ["IQAC_COMMITTEE"],
  "iqac-sections": ["IQAC_SECTION", "IQAC"],
  "iqac-documents": ["IQAC_DOCUMENT", "IQAC"],
  // These two are `/events` and `/galleries` rows, so the API guards them
  // with the same resources as the plain Events / Gallery modules.
  "iqac-activities": ["EVENT"],
  "iqac-gallery": ["GALLERY"],
  management: ["MANAGEMENT"],
  "management-type": ["MANAGEMENT_TYPE", "MANAGEMENT"],

  // System
  contact: ["CONTACT"],
  setting: ["SETTING"],
  popup: ["POPUP"],
};

/** The 48 resources the backend seeded the matrix with. */
export const SEEDED_RESOURCES = [
  "ACTIVITY", "ADMISSION_ADVERTISEMENT", "ADMISSION_SCHEDULE", "ADMISSION_TEST_RESULT",
  "AWARD", "BATCH", "BUILDING", "CLASS_ROUTINE", "CONTACT", "COURSE", "DEPARTMENT",
  "EDUCATION", "EVENT", "EXAM", "EXAM_ROUTINE", "EXPERIENCE", "FACULTY", "FAQ",
  "FEE_STRUCTURE", "GALLERY", "HERO_SLIDE", "IQAC", "IQAC_COMMITTEE", "LAB_FACILITY",
  "MANAGEMENT", "MBA_ELIGIBILITY_TIER", "MEMBERSHIP", "MENU", "MOU", "NEWS_ARTICLE",
  "NOTICE", "PAGE", "PARTNER", "PCJ_ARTICLE", "PCJ_VOLUME", "POPUP", "PROGRAM",
  "RESEARCH_AREA", "RESEARCH_CENTRE", "RESEARCH_PUBLICATION", "ROOM", "SECTION",
  "SEMESTER", "SEMINAR", "SETTING", "TEACHER", "TIME_SLOT", "USER",
] as const;

export interface PermissionRow {
  id: number;
  role: string;
  resource: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

/** Every resource the matrix knows about: the seed plus anything the API added since. */
export function knownResources(rows: PermissionRow[]): string[] {
  return Array.from(new Set<string>([...SEEDED_RESOURCES, ...rows.map((r) => r.resource)])).sort();
}

/**
 * The resource guarding a module: its first candidate the matrix actually
 * has. `null` for a module with no mapping at all — the UI then leaves it
 * to the API to decide.
 */
export function resolveResource(slug: string, known: ReadonlySet<string>): string | null {
  const candidates = MODULE_RESOURCES[slug];
  if (!candidates) return null;
  return candidates.find((c) => known.has(c)) ?? candidates[candidates.length - 1];
}

/** Admin modules (by slug) each resource covers, for labelling the matrix. */
export function modulesByResource(known: ReadonlySet<string>): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const slug of Object.keys(MODULE_RESOURCES)) {
    const resource = resolveResource(slug, known);
    if (!resource) continue;
    out.set(resource, [...(out.get(resource) ?? []), slug]);
  }
  return out;
}

export interface Access {
  role: string | null;
  /** The matrix rows, or `null` when this session isn't allowed to read them. */
  rows: PermissionRow[] | null;
}

/**
 * Whether `access.role` may do `action` on module `slug`.
 *
 * - The matrix couldn't be read (e.g. the API won't show it to this role):
 *   allow, and let the API's own check be the gate — better than locking an
 *   admin out of the whole dashboard on a guess.
 * - The module has no mapped resource: allow (same reasoning).
 * - The role has no row for the resource: deny — the API answers that case
 *   with 403 "Permission not configured".
 */
export function can(access: Access | undefined, slug: string, action: PermissionAction): boolean {
  if (!access?.rows || !access.role) return true;
  const known = new Set(knownResources(access.rows));
  const resource = resolveResource(slug, known);
  if (!resource) return true;
  const row = access.rows.find((r) => r.role === access.role && r.resource === resource);
  return !!row?.[action];
}
