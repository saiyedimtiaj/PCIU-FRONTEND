"use server";

import { api, ApiError } from "@/services/http";

export interface PermissionRow {
  id: number;
  role: string;
  resource: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

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
