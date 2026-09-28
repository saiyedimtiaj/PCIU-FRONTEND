"use server";

import { ApiError } from "@/services/http";
import {
  getMyProfile,
  updateMyProfile,
  listSubResource,
  createSubResource,
  updateSubResource,
  deleteSubResource,
  ORDER_FIELD,
} from "@/services/teacher-profile";
import { getSession } from "@/app/(auth)/actions";
import {
  decodeProfile,
  encodeProfile,
  decodeRow,
  encodeRow,
  sortRows,
  SECTION_TO_RESOURCE,
  type FacultySection,
  type FacultyPortalProfile,
  type SectionRow,
} from "./profile-mapping";

/**
 * Server Actions are the transport for the faculty portal's TanStack
 * Query hooks — same reason as app/(admin)/entity-actions.ts: the session
 * cookie is httpOnly and lives on our domain while the API is a separate
 * origin, so a browser fetch can never authenticate against it.
 *
 * These mirror entity-actions.ts's ActionResult<T> + run() conventions
 * exactly, but are NOT built on that file's guard(slug)/getEntitySchema
 * machinery — these five resources are session-scoped (no id in the
 * path, no admin EntitySchema) and belong to a different transport
 * (services/teacher-profile.ts), so there is nothing to reuse there
 * beyond the shape of the result type.
 */

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, status: error.status };
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

/**
 * A layout redirect guards the pages, but Server Actions are independently
 * addressable POST endpoints — the redirect doesn't protect them. Every
 * action re-checks the session is a TEACHER before touching the API.
 */
async function guardTeacher(): Promise<string | null> {
  const session = await getSession();
  if (!session) return "Your session has expired. Please sign in again.";
  if (session.role !== "TEACHER") return "Only teachers can edit a faculty profile.";
  return null;
}

export async function getMyProfileAction(): Promise<ActionResult<FacultyPortalProfile>> {
  const problem = await guardTeacher();
  if (problem) return { ok: false, error: problem, status: 401 };
  return run(async () => decodeProfile(await getMyProfile()));
}

export async function updateMyProfileAction(
  values: Partial<FacultyPortalProfile> & { image?: File },
): Promise<ActionResult<FacultyPortalProfile>> {
  const problem = await guardTeacher();
  if (problem) return { ok: false, error: problem, status: 401 };
  return run(async () => decodeProfile(await updateMyProfile(encodeProfile(values))));
}

export async function listSectionAction(
  section: FacultySection,
): Promise<ActionResult<SectionRow[]>> {
  const problem = await guardTeacher();
  if (problem) return { ok: false, error: problem, status: 401 };
  return run(async () => {
    const resource = SECTION_TO_RESOURCE[section];
    const records = await listSubResource(resource);
    const rows = records.map((r) => decodeRow(section, r));
    return sortRows(section, rows, records);
  });
}

export async function createSectionAction(
  section: FacultySection,
  values: Record<string, string>,
): Promise<ActionResult<SectionRow>> {
  const problem = await guardTeacher();
  if (problem) return { ok: false, error: problem, status: 401 };
  return run(async () => {
    const resource = SECTION_TO_RESOURCE[section];
    const rowsForNextOrder = ORDER_FIELD[resource]
      ? await listSubResource(resource)
      : [];
    const payload = encodeRow(section, values, { rowsForNextOrder });
    const created = await createSubResource(resource, payload);
    return decodeRow(section, created);
  });
}

export async function updateSectionAction(
  section: FacultySection,
  id: string,
  values: Record<string, string>,
): Promise<ActionResult<SectionRow>> {
  const problem = await guardTeacher();
  if (problem) return { ok: false, error: problem, status: 401 };
  return run(async () => {
    const resource = SECTION_TO_RESOURCE[section];
    const orderField = ORDER_FIELD[resource];

    // Echo the row's existing order value back unchanged rather than
    // recomputing it — otherwise every edit would silently reshuffle the
    // list to the end (nextOrder would treat this row as brand new).
    let existing = 0;
    if (orderField) {
      const records = await listSubResource(resource);
      const match = records.find((r) => String((r as { id: number | string }).id) === id);
      const value = match ? (match as unknown as Record<string, unknown>)[orderField] : undefined;
      existing = typeof value === "number" ? value : 0;
    }

    const payload = encodeRow(section, values, { existing });
    const updated = await updateSubResource(resource, id, payload);
    return decodeRow(section, updated);
  });
}

export async function deleteSectionAction(
  section: FacultySection,
  id: string,
): Promise<ActionResult<null>> {
  const problem = await guardTeacher();
  if (problem) return { ok: false, error: problem, status: 401 };
  return run(async () => {
    await deleteSubResource(SECTION_TO_RESOURCE[section], id);
    return null;
  });
}
