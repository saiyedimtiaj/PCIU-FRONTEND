"use server";

import { api, ApiError } from "@/services/http";
import { getSession } from "@/app/(auth)/actions";
import { collectionPath, isConnected } from "@/services/endpoints";
import {
  MODULE_RESOURCES,
  SUPER_ADMIN,
  type Access,
  type PermissionRow,
} from "@/lib/admin/permissions";

export type { PermissionRow } from "@/lib/admin/permissions";

export type PermissionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function run<T>(fn: () => Promise<T>): Promise<PermissionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, error: error.message };
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function listPermissionsAction(): Promise<
  PermissionResult<PermissionRow[]>
> {
  return run(async () => {
    const rows = await api.get<PermissionRow[]>("/permissions");
    return Array.isArray(rows) ? rows : [];
  });
}

/** PATCH replaces the whole row, so every flag is sent each time. */
export async function updatePermissionAction(
  row: PermissionRow,
): Promise<PermissionResult<PermissionRow>> {
  return run(() =>
    api.patch<PermissionRow>(`/permissions/${row.id}`, {
      role: row.role,
      resource: row.resource,
      view: row.view,
      create: row.create,
      edit: row.edit,
      delete: row.delete,
    }),
  );
}

/**
 * Not every role has a row for every resource yet (MODERATOR only has 14
 * of the 48 resources SUPER_ADMIN/ADMIN have) — POST adds the missing
 * combination. Verified live: POST rejects an existing role+resource pair
 * with a 409 and a clear message, so no client-side duplicate check is
 * needed — the API's own error surfaces as-is.
 */
export async function createPermissionAction(
  values: Omit<PermissionRow, "id">,
): Promise<PermissionResult<PermissionRow>> {
  return run(() => api.post<PermissionRow>("/permissions", values));
}

/** DELETE /permissions/{id} — removes a role's row, so the role loses that resource. */
export async function deletePermissionAction(id: number): Promise<PermissionResult<null>> {
  return run(async () => {
    await api.delete(`/permissions/${id}`);
    return null;
  });
}

/**
 * The signed-in role's own rows — "getpermissionbyrole", GET
 * /permissions/{ROLE} (e.g. /permissions/ADMIN) — for a role that can't
 * read the whole matrix. Any failure just means falling back to probing.
 */
async function permissionsForRole(role: string): Promise<PermissionRow[] | null> {
  try {
    const rows = await api.get<unknown>(`/permissions/${encodeURIComponent(role)}`);
    const list = Array.isArray(rows)
      ? rows
      : rows && typeof rows === "object"
        ? Object.values(rows as Record<string, unknown>).find(Array.isArray)
        : null;
    return Array.isArray(list) ? (list as PermissionRow[]).filter((r) => r.role === role) : null;
  } catch {
    return null;
  }
}

/**
 * Module slugs whose list endpoint answers 403 for this session. Used only
 * when the role can't read `/permissions` itself: one request per distinct
 * endpoint (`limit=1` keeps each tiny), all in parallel, so the sidebar can
 * hide modules the role can't open instead of finding out on click.
 */
async function probeDeniedModules(): Promise<string[]> {
  const byPath = new Map<string, string[]>();
  for (const slug of Object.keys(MODULE_RESOURCES)) {
    if (!isConnected(slug)) continue;
    const path = collectionPath(slug);
    byPath.set(path, [...(byPath.get(path) ?? []), slug]);
  }

  const results = await Promise.all(
    [...byPath].map(async ([path, slugs]) => {
      try {
        await api.get(`${path}${path.includes("?") ? "&" : "?"}limit=1`);
        return [];
      } catch (error) {
        return error instanceof ApiError && error.status === 403 ? slugs : [];
      }
    }),
  );
  return results.flat();
}

/**
 * The signed-in admin's role plus what it may use. SUPER_ADMIN always has
 * full access. Other roles get the permission matrix when the API lets them
 * read it; otherwise the modules that answer 403 (see `can()` in
 * lib/admin/permissions.ts).
 */
export async function getMyAccessAction(): Promise<Access> {
  const user = await getSession();
  if (!user) return { role: null, rows: null };
  if (user.role === SUPER_ADMIN) return { role: user.role, rows: null, denied: [] };

  const result = await listPermissionsAction();
  if (result.ok) return { role: user.role, rows: result.data };

  const own = await permissionsForRole(user.role);
  if (own && own.length) return { role: user.role, rows: own };

  return { role: user.role, rows: null, denied: await probeDeniedModules() };
}
