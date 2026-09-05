"use server";

import { ApiError } from "@/services/http";
import {
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  type EntityRecord,
} from "@/services/entity";
import { isConnected } from "@/services/endpoints";
import { getEntitySchema } from "@/lib/admin/entities";

/**
 * Server Actions are the transport for the admin dashboard's TanStack
 * Query hooks.
 *
 * The session cookie is httpOnly and lives on our own domain while the API
 * is a separate origin, so a browser fetch can never authenticate against
 * it (a Bearer token is rejected with 401). Every authenticated call
 * therefore has to originate on the server; Query still owns caching,
 * invalidation and loading state on the client.
 */

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

function fieldNamesFor(slug: string): string[] {
  const schema = getEntitySchema(slug);
  if (!schema) return [];
  return schema.sections.flatMap((s) => s.fields.map((f) => f.name));
}

function immutableFieldsFor(slug: string): string[] {
  const schema = getEntitySchema(slug);
  if (!schema) return [];
  return schema.sections.flatMap((s) =>
    s.fields.filter((f) => f.immutableOnEdit).map((f) => f.name),
  );
}

function listFieldsFor(slug: string): string[] {
  const schema = getEntitySchema(slug);
  if (!schema) return [];
  return schema.sections.flatMap((s) =>
    s.fields.filter((f) => f.type === "json-list").map((f) => f.name),
  );
}

/**
 * `relation` fields, so the API's numeric FK ids can be coerced to strings
 * on the way in — the combobox matches a selection against `option.value`
 * (always a string, from `useRelationOptions`), so a numeric id from the
 * API compares unequal to every option and the field shows the raw id
 * instead of resolving to its label.
 */
function relationFieldsFor(slug: string): string[] {
  const schema = getEntitySchema(slug);
  if (!schema) return [];
  return schema.sections.flatMap((s) =>
    s.fields.filter((f) => f.type === "relation").map((f) => f.name),
  );
}

/**
 * `time` fields — the API stores these as a full ISO datetime anchored to
 * the epoch date ("1970-01-01T09:00:00.000Z"); a native
 * `<input type="time">` requires a plain "HH:MM" and silently renders
 * blank on anything else, so the value is trimmed down on the way in.
 */
function timeFieldsFor(slug: string): string[] {
  const schema = getEntitySchema(slug);
  if (!schema) return [];
  return schema.sections.flatMap((s) =>
    s.fields.filter((f) => f.type === "time").map((f) => f.name),
  );
}

/**
 * Errors must not escape a Server Action as exceptions — Next replaces
 * them with an opaque digest in production, which would hide the API's
 * message. Return them instead so the UI can show what went wrong.
 */
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

function guard(slug: string): string | null {
  if (!getEntitySchema(slug)) return `Unknown entity "${slug}"`;
  if (!isConnected(slug)) return `"${slug}" is not connected to the backend yet`;
  return null;
}

export async function listEntityAction(
  slug: string,
  params?: Record<string, string | number | undefined>,
): Promise<ActionResult<EntityRecord[]>> {
  const problem = guard(slug);
  if (problem) return { ok: false, error: problem };
  return run(() =>
    listEntities(
      slug,
      fieldNamesFor(slug),
      params,
      listFieldsFor(slug),
      relationFieldsFor(slug),
      timeFieldsFor(slug),
    ),
  );
}

export async function getEntityAction(
  slug: string,
  id: string,
): Promise<ActionResult<EntityRecord | null>> {
  const problem = guard(slug);
  if (problem) return { ok: false, error: problem };
  return run(() =>
    getEntity(
      slug,
      id,
      fieldNamesFor(slug),
      listFieldsFor(slug),
      relationFieldsFor(slug),
      timeFieldsFor(slug),
    ),
  );
}

export async function createEntityAction(
  slug: string,
  values: Record<string, unknown>,
): Promise<ActionResult<EntityRecord>> {
  const problem = guard(slug);
  if (problem) return { ok: false, error: problem };
  return run(() => createEntity(slug, values, fieldNamesFor(slug)));
}

export async function updateEntityAction(
  slug: string,
  id: string,
  values: Record<string, unknown>,
): Promise<ActionResult<EntityRecord>> {
  const problem = guard(slug);
  if (problem) return { ok: false, error: problem };
  return run(() =>
    updateEntity(slug, id, values, fieldNamesFor(slug), immutableFieldsFor(slug)),
  );
}

export async function deleteEntityAction(
  slug: string,
  id: string,
): Promise<ActionResult<null>> {
  const problem = guard(slug);
  if (problem) return { ok: false, error: problem };
  return run(async () => {
    await deleteEntity(slug, id);
    return null;
  });
}
