"use server";

import { api, ApiError } from "@/services/http";
import {
  classBulkSchema,
  examBulkSchema,
  toClassBulkBody,
  toExamBulkBody,
} from "@/lib/admin/routine-bulk";
import type { ActionResult } from "./entity-actions";
import { expireAcademicsCache } from "./academics-cache";

/**
 * Bulk create for class/exam routines. Lives outside entity-actions.ts because
 * the bulk endpoints take a `{ routines: [...] }` array, not one EntitySchema
 * record. Input is re-validated here — a Server Action is a public POST
 * endpoint, so the client form's validation can't be trusted on its own.
 */
async function postBulk(path: string, body: unknown): Promise<ActionResult<{ count: number }>> {
  try {
    const data = await api.post<unknown>(path, body);
    const count = Array.isArray(data)
      ? data.length
      : typeof (data as { count?: unknown })?.count === "number"
        ? (data as { count: number }).count
        : (body as { routines: unknown[] }).routines.length;
    expireAcademicsCache("class-routine");
    return { ok: true, data: { count } };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, status: error.status };
    }
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong" };
  }
}

export async function bulkCreateClassRoutinesAction(
  values: unknown,
): Promise<ActionResult<{ count: number }>> {
  const parsed = classBulkSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid routine rows" };
  }
  return postBulk("/routines/class/bulk", toClassBulkBody(parsed.data));
}

export async function bulkCreateExamRoutinesAction(
  values: unknown,
): Promise<ActionResult<{ count: number }>> {
  const parsed = examBulkSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid routine rows" };
  }
  return postBulk("/routines/exam/bulk", toExamBulkBody(parsed.data));
}
