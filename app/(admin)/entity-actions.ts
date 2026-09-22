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
    s.fields.filter((f) => f.type === "json-list" || f.type === "image-list").map((f) => f.name),
  );
}

function relationFieldsFor(slug: string): string[] {
  const schema = getEntitySchema(slug);
  if (!schema) return [];
  return schema.sections.flatMap((s) =>
    s.fields.filter((f) => f.type === "relation").map((f) => f.name),
  );
}

function timeFieldsFor(slug: string): string[] {
  const schema = getEntitySchema(slug);
  if (!schema) return [];
  return schema.sections.flatMap((s) =>
    s.fields.filter((f) => f.type === "time").map((f) => f.name),
  );
}


const STRING_FIELD_TYPES = new Set([
  "text", "email", "tel", "url", "password", "textarea", "richtext",
  "select", "enum", "radio", "date", "datetime", "time", "image", "file",
  "relation",
]);

function nullableStringFieldsFor(slug: string): string[] {
  const schema = getEntitySchema(slug);
  if (!schema) return [];
  return schema.sections.flatMap((s) =>
    s.fields.filter((f) => STRING_FIELD_TYPES.has(f.type)).map((f) => f.name),
  );
}


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
      nullableStringFieldsFor(slug),
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
      nullableStringFieldsFor(slug),
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
