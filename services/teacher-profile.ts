import { api } from "./http";
import { buildFormData, buildJsonBody } from "./form-data";
import { toApi } from "./case";
import type {
  TeacherProfileRecord,
  TeacherSubResource,
  TeacherSubRecord,
} from "@/types/teacher-profile";

/**
 * Transport for the teacher's own profile and its five sub-resource
 * collections (`/teachers/profile/*`). Deliberately NOT built on
 * services/endpoints.ts + services/entity.ts: those model
 * `/{resource}` + `/{resource}/{id}` for the 49 *admin* entities, each
 * backed by an `EntitySchema` (zod + LucideIcon + form sections) that
 * these resources have no equivalent of. The teacher endpoints are also
 * session-scoped — the server derives the teacher from the auth cookie,
 * so there's no id anywhere in the collection path — which the generic
 * `collectionPath(slug)`/`itemPath(slug, id)` helpers don't model at all.
 * Forcing these through that machinery would mean inventing five fake
 * admin entity schemas purely to satisfy `guard(slug)`.
 *
 * What IS reused: `api`/`ApiError` (services/http.ts), `toApi`
 * (services/case.ts), and `buildFormData`/`buildJsonBody`
 * (services/form-data.ts) — the genuinely shared primitives.
 */

type Dict = Record<string, unknown>;

const PROFILE_PATH = "/teachers/profile/me";

const SUB_RESOURCE_PATH: Record<TeacherSubResource, string> = {
  education: "/teachers/profile/education",
  experiences: "/teachers/profile/experiences",
  memberships: "/teachers/profile/memberships",
  awards: "/teachers/profile/awards",
  publications: "/teachers/profile/publications",
};

/** Only publications and the profile itself are multipart — every other
 * sub-resource is plain JSON. */
const MULTIPART_RESOURCES: ReadonlySet<TeacherSubResource> = new Set([
  "publications",
]);

/** The auto-assigned display-order field per resource, or none for
 * publications (which sort by year instead — see sortRows in
 * app/(faculty)/profile-mapping.ts). */
export const ORDER_FIELD: Partial<Record<TeacherSubResource, string>> = {
  education: "eduOrder",
  experiences: "exOrder",
  awards: "awOrder",
  memberships: "membershipOrder",
};

export async function getMyProfile(): Promise<TeacherProfileRecord> {
  return api.get<TeacherProfileRecord>(PROFILE_PATH);
}

/** Always multipart per the API spec, even when no file is attached —
 * buildFormData already skips a zero-size File, so "no new image picked"
 * naturally omits the field rather than sending an empty one. */
export async function updateMyProfile(
  values: Dict,
): Promise<TeacherProfileRecord> {
  const payload = toApi<Dict>(values);
  return api.patch<TeacherProfileRecord>(PROFILE_PATH, buildFormData(payload));
}

export async function listSubResource(
  resource: TeacherSubResource,
): Promise<TeacherSubRecord[]> {
  const data = await api.get<unknown>(SUB_RESOURCE_PATH[resource]);
  return Array.isArray(data) ? (data as TeacherSubRecord[]) : [];
}

function encodeSubResourceValues(resource: TeacherSubResource, values: Dict): FormData | Dict {
  const payload = toApi<Dict>(values);
  return MULTIPART_RESOURCES.has(resource)
    ? buildFormData(payload)
    : buildJsonBody(payload);
}

export async function createSubResource(
  resource: TeacherSubResource,
  values: Dict,
): Promise<TeacherSubRecord> {
  const body = encodeSubResourceValues(resource, values);
  return api.post<TeacherSubRecord>(SUB_RESOURCE_PATH[resource], body);
}

export async function updateSubResource(
  resource: TeacherSubResource,
  id: number | string,
  values: Dict,
): Promise<TeacherSubRecord> {
  const body = encodeSubResourceValues(resource, values);
  return api.patch<TeacherSubRecord>(`${SUB_RESOURCE_PATH[resource]}/${id}`, body);
}

export async function deleteSubResource(
  resource: TeacherSubResource,
  id: number | string,
): Promise<void> {
  await api.delete<null>(`${SUB_RESOURCE_PATH[resource]}/${id}`);
}

/**
 * "2020" | "2020-05-01" | a full ISO datetime -> a full ISO datetime the
 * API accepts. A bare 4-digit year is expanded to Jan 1st. Returns
 * undefined for anything unparseable so the field is omitted rather than
 * sent malformed.
 */
export function toIsoDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (/^\d{4}$/.test(trimmed)) return `${trimmed}-01-01T00:00:00.000Z`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return `${trimmed}T00:00:00.000Z`;
  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) return trimmed;
  return undefined;
}

/**
 * Full ISO datetime -> a bare 4-digit year for display. Pure string
 * slicing, never `new Date()` — the same reasoning services/entity.ts's
 * `toInputTime` documents: parsing a UTC midnight timestamp with a local
 * `Date` can flip the year across a timezone boundary and would make the
 * dashboard's stats hydration-unsafe (server and client could disagree).
 */
export function fromIsoYear(value: string | null | undefined): string {
  if (!value) return "";
  const match = value.match(/^(\d{4})/);
  return match ? match[1] : "";
}

/**
 * Assigns the next display-order value for a create — one past the
 * current maximum, or 0 for an empty collection. Callers pass the rows
 * they already fetched (createSubResource itself makes no extra request);
 * an update should instead echo the row's existing order value back
 * unchanged, never recompute it.
 */
export function nextOrder(rows: TeacherSubRecord[], field: string): number {
  let max = -1;
  for (const row of rows) {
    const value = (row as unknown as Dict)[field];
    if (typeof value === "number" && value > max) max = value;
  }
  return max + 1;
}
