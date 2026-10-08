"use server";

import {
  bachelorApplicationSchema,
  masterApplicationSchema,
  type BachelorApplicationValues,
  type MasterApplicationValues,
} from "./schema";

export interface SubmitApplicationResult {
  ok: boolean;
  referenceId?: string;
  error?: string;
}

function generateReferenceId(level: "BAC" | "MAS"): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PCIU-${level}-${stamp}-${random}`;
}

export async function submitBachelorApplication(
  values: BachelorApplicationValues,
): Promise<SubmitApplicationResult> {
  const parsed = bachelorApplicationSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "The application has invalid fields. Please review and try again." };
  }

  // TODO: no public admission-application submission endpoint exists on
  // the backend yet (verified: /admission/apply, /admission/application
  // all 404; only the admin-gated /admission/admin/application exists).
  // Once the backend team confirms a real route, replace this block with
  // a serverFetch/publicFetch POST of `parsed.data` and return its result
  // instead of a locally generated reference id.
  console.log("[admission:apply] Bachelor application received:", parsed.data);

  return { ok: true, referenceId: generateReferenceId("BAC") };
}

export async function submitMasterApplication(
  values: MasterApplicationValues,
): Promise<SubmitApplicationResult> {
  const parsed = masterApplicationSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "The application has invalid fields. Please review and try again." };
  }

  // TODO: same as submitBachelorApplication — wire to the real endpoint
  // once it exists.
  console.log("[admission:apply] Master application received:", parsed.data);

  return { ok: true, referenceId: generateReferenceId("MAS") };
}
