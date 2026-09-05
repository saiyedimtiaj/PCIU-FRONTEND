import {
  fromIsoYear,
  toIsoDate,
  nextOrder,
  ORDER_FIELD,
} from "@/services/teacher-profile";
import { resolveUploadUrl } from "@/lib/upload-url";
import type {
  TeacherProfileRecord,
  TeacherSubRecord,
  TeacherSubResource,
} from "@/types/teacher-profile";

/**
 * The shape bridge between the faculty portal's UI (FacultyProfileProvider,
 * FacultySectionList, FacultyProfileForm — all pre-dating this API
 * integration) and the API's `/teachers/profile/*` records. Kept separate
 * from the Server Actions file so the field-by-field mapping is
 * unit-inspectable on its own.
 */

/** The five sections the faculty UI already knows about — note this is
 * singular "experience" (matching RowSectionKey in FacultyProfileProvider)
 * while the API's path segment is plural "experiences". */
export type FacultySection = "education" | "publications" | "experience" | "awards" | "memberships";

export const SECTION_TO_RESOURCE: Record<FacultySection, TeacherSubResource> = {
  education: "education",
  publications: "publications",
  experience: "experiences",
  awards: "awards",
  memberships: "memberships",
};

/** A UI-facing row: every value is a plain string (matching how
 * FacultySectionList's modal form already works) plus a stable string id. */
export type SectionRow = { id: string } & Record<string, string>;

function idOf(record: TeacherSubRecord): string {
  return String((record as { id: number | string }).id ?? "");
}

export function decodeRow(section: FacultySection, record: TeacherSubRecord): SectionRow {
  const r = record as unknown as Record<string, unknown>;

  switch (section) {
    case "education":
      return {
        id: idOf(record),
        degree: String(r.degree ?? ""),
        institution: String(r.institution ?? ""),
        year: fromIsoYear(r.educationYear as string | undefined),
      };
    case "experience":
      return {
        id: idOf(record),
        title: String(r.title ?? ""),
        organization: String(r.organization ?? ""),
        period: String(r.period ?? ""),
      };
    case "awards":
      return {
        id: idOf(record),
        title: String(r.title ?? ""),
        year: fromIsoYear(r.awardDate as string | undefined),
        description: String(r.description ?? ""),
      };
    case "memberships":
      return {
        id: idOf(record),
        name: String(r.name ?? ""),
        role: String(r.role ?? ""),
      };
    case "publications":
      return {
        id: idOf(record),
        title: String(r.title ?? ""),
        venue: String(r.venue ?? ""),
        year: r.year != null ? String(r.year) : "",
        authors: String(r.authors ?? ""),
      };
  }
}

/**
 * Builds the create/update payload for a section row. `existingOrder` is
 * the row's current order-field value on an edit (echoed back unchanged
 * so a PATCH can't null it out); pass the section's already-fetched rows
 * on a create so the next order value can be computed without an extra
 * request.
 */
export function encodeRow(
  section: FacultySection,
  values: Record<string, string>,
  order: { existing: number } | { rowsForNextOrder: TeacherSubRecord[] },
): Record<string, unknown> {
  const resource = SECTION_TO_RESOURCE[section];
  const orderField = ORDER_FIELD[resource];
  const orderValue = orderField
    ? "existing" in order
      ? order.existing
      : nextOrder(order.rowsForNextOrder, orderField)
    : undefined;

  switch (section) {
    case "education":
      return {
        degree: values.degree,
        institution: values.institution,
        educationYear: toIsoDate(values.year ?? ""),
        ...(orderField ? { [orderField]: orderValue } : {}),
      };
    case "experience":
      return {
        title: values.title,
        organization: values.organization,
        period: values.period,
        ...(orderField ? { [orderField]: orderValue } : {}),
      };
    case "awards":
      return {
        title: values.title,
        awardDate: toIsoDate(values.year ?? ""),
        description: values.description,
        ...(orderField ? { [orderField]: orderValue } : {}),
      };
    case "memberships":
      return {
        name: values.name,
        role: values.role,
        ...(orderField ? { [orderField]: orderValue } : {}),
      };
    case "publications":
      return {
        title: values.title,
        venue: values.venue,
        year: values.year ? Number(values.year) : undefined,
        authors: values.authors,
      };
  }
}

/** Sorts decoded rows for display — by the section's order field where one
 * exists (education/experience/awards/memberships), or by year descending
 * for publications, which the API has no order field for. */
export function sortRows(
  section: FacultySection,
  rows: SectionRow[],
  records: TeacherSubRecord[],
): SectionRow[] {
  const resource = SECTION_TO_RESOURCE[section];
  const orderField = ORDER_FIELD[resource];
  const byId = new Map(records.map((r) => [idOf(r), r as unknown as Record<string, unknown>]));

  return [...rows].sort((a, b) => {
    if (orderField) {
      const av = Number(byId.get(a.id)?.[orderField] ?? 0);
      const bv = Number(byId.get(b.id)?.[orderField] ?? 0);
      return av - bv;
    }
    return Number(b.year || 0) - Number(a.year || 0);
  });
}

/** UI-facing profile shape — a subset/relabelling of TeacherProfileRecord
 * that FacultyDashboard / FacultyProfileForm read from. */
export interface FacultyPortalProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  faculty: string;
  email: string;
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
  counts: {
    education: number;
    publications: number;
    experience: number;
    awards: number;
    memberships: number;
  };
}

export function decodeProfile(record: TeacherProfileRecord): FacultyPortalProfile {
  const teachingAreas = (record.teachingAreas ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    id: String(record.id),
    name: record.name ?? record.user?.name ?? "",
    designation: record.designation ?? "",
    department: record.department?.name ?? "",
    faculty: record.department?.faculty?.name ?? "",
    email: record.user?.email ?? "",
    office: record.office ?? "",
    imageUrl: resolveUploadUrl(record.imageUrl),
    shortBio: record.shortBio ?? "",
    bio: record.bio ?? "",
    teachingAreas,
    googleScholarUrl: record.googleScholarUrl ?? "",
    researchgateUrl: record.researchgateUrl ?? "",
    linkedinUrl: record.linkedinUrl ?? "",
    facebookUrl: record.facebookUrl ?? "",
    twitterUrl: record.twitterUrl ?? "",
    websiteUrl: record.websiteUrl ?? "",
    counts: {
      education: record.education?.length ?? 0,
      publications: record.publications?.length ?? 0,
      experience: record.experiences?.length ?? 0,
      awards: record.awards?.length ?? 0,
      memberships: record.memberships?.length ?? 0,
    },
  };
}

/**
 * Builds the PATCH /teachers/profile/me payload. A whitelist, not a
 * blacklist — email/department/faculty/slug are admin-controlled and have
 * no field on this endpoint, so anything not named here is dropped rather
 * than trusted to be harmless.
 */
export function encodeProfile(
  values: Partial<FacultyPortalProfile> & { image?: File },
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: values.name,
    office: values.office,
    designation: values.designation,
    shortBio: values.shortBio,
    bio: values.bio,
    googleScholarUrl: values.googleScholarUrl,
    researchgateUrl: values.researchgateUrl,
    linkedinUrl: values.linkedinUrl,
    facebookUrl: values.facebookUrl,
    twitterUrl: values.twitterUrl,
    websiteUrl: values.websiteUrl,
  };

  if (values.teachingAreas) {
    payload.teachingAreas = values.teachingAreas.filter(Boolean).join(", ");
  }
  if (values.image instanceof File) {
    payload.image = values.image;
  }

  return payload;
}
