"use server";

import { publicFetch } from "@/lib/server-fetch";
import { getActiveAdmissionCycle, isCycleOpen } from "@/lib/api/admission-apply";
import {
  bachelorApplicationSchema,
  isRowFilled,
  masterApplicationSchema,
  type BachelorApplicationValues,
  type MasterApplicationValues,
} from "./schema";

export interface SubmitApplicationResult {
  ok: boolean;
  referenceId?: string;
  error?: string;
}

/**
 * Public application endpoint. The API collection spells it
 * "admisssionapplication" (three s's), but that prefix 404s "Route not
 * found" on the live API while "/admissionapplication/*" exists — the
 * collection URL is a typo.
 */
const APPLICATION_PATH = "/admissionapplication";

type Body = Record<string, string | number>;

/** 01XXXXXXXXX / 8801XXXXXXXXX / +8801XXXXXXXXX → +8801XXXXXXXXX */
function normalizeMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  return `+88${digits.slice(-11)}`;
}

function baseBody(
  cycleId: number,
  values: BachelorApplicationValues | MasterApplicationValues,
): Body {
  return {
    admissionCycleId: cycleId,
    programId: Number(values.programId),
    name: values.name.trim(),
    fatherName: values.fatherName.trim(),
    motherName: values.motherName.trim(),
    mobileNumber: normalizeMobile(values.mobileNumber),
    dateOfBirth: values.dateOfBirth,
    email: values.email.trim(),
    sscBoardName: values.ssc.board,
    sscGroupName: values.ssc.group.trim(),
    sscPassingYear: Number(values.ssc.passingYear),
    sscRollNumber: values.ssc.rollNumber.trim(),
    sscRegistrationNumber: values.ssc.registrationNumber.trim(),
    hscBoardName: values.hsc.board,
    hscGroupName: values.hsc.group.trim(),
    hscPassingYear: Number(values.hsc.passingYear),
    hscRollNumber: values.hsc.rollNumber.trim(),
    hscRegistrationNumber: values.hsc.registrationNumber.trim(),
  };
}

function degreeBody(
  prefix: "bachelor" | "master",
  row: { degreeName?: string; university?: string; subject?: string; passingYear?: string; gpa?: string },
): Body {
  return {
    [`${prefix}DegreeName`]: (row.degreeName ?? "").trim(),
    [`${prefix}University`]: (row.university ?? "").trim(),
    [`${prefix}Subject`]: (row.subject ?? "").trim(),
    [`${prefix}PassingYear`]: Number(row.passingYear),
    [`${prefix}Gpa`]: Number(row.gpa),
  };
}

/** The API's own message, including field-level validation errors if it sent any. */
function apiErrorMessage(json: unknown, status: number): string {
  const body = json as { message?: unknown; errors?: unknown } | null;
  const message = typeof body?.message === "string" ? body.message : "";
  const details = Array.isArray(body?.errors)
    ? body.errors
        .map((e) => (typeof e === "string" ? e : (e as { message?: unknown })?.message))
        .filter((m): m is string => typeof m === "string" && m.length > 0)
    : [];
  const text = [message, ...details].filter(Boolean).join(" — ");
  return text || `The application could not be submitted (error ${status}). Please try again.`;
}

/** A human-facing reference for the created application. */
function referenceFrom(data: unknown): string {
  const row = (data ?? {}) as Record<string, unknown>;
  for (const key of ["applicationNumber", "applicationId", "trackingNumber", "referenceNumber", "referenceId"]) {
    const value = row[key];
    if (typeof value === "string" && value) return value;
  }
  return typeof row.id === "number" || typeof row.id === "string" ? `PCIU-APP-${row.id}` : "Submitted";
}

async function submit(body: Body): Promise<SubmitApplicationResult> {
  try {
    const res = await publicFetch.post(APPLICATION_PATH, { body: JSON.stringify(body), cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok || (json && (json as { success?: boolean }).success === false)) {
      return { ok: false, error: apiErrorMessage(json, res.status) };
    }
    return { ok: true, referenceId: referenceFrom((json as { data?: unknown } | null)?.data) };
  } catch {
    return { ok: false, error: "Could not reach the admission server. Please check your connection and try again." };
  }
}

/** The open cycle, checked on the server — never trusted from the browser. */
async function openCycleId(): Promise<number | null> {
  const cycle = await getActiveAdmissionCycle();
  return isCycleOpen(cycle) ? cycle!.id : null;
}

const CLOSED = "Online applications are closed right now. Please check the admission schedule.";
const INVALID = "The application has invalid fields. Please review and try again.";

export async function submitBachelorApplication(
  values: BachelorApplicationValues,
): Promise<SubmitApplicationResult> {
  const parsed = bachelorApplicationSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: INVALID };

  const cycleId = await openCycleId();
  if (!cycleId) return { ok: false, error: CLOSED };

  return submit(baseBody(cycleId, parsed.data));
}

export async function submitMasterApplication(
  values: MasterApplicationValues,
): Promise<SubmitApplicationResult> {
  const parsed = masterApplicationSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: INVALID };

  const cycleId = await openCycleId();
  if (!cycleId) return { ok: false, error: CLOSED };

  const { bachelor, master } = parsed.data;
  return submit({
    ...baseBody(cycleId, parsed.data),
    ...degreeBody("bachelor", bachelor),
    // The master's section is optional — only sent when filled in.
    ...(isRowFilled(master) ? degreeBody("master", master) : {}),
  });
}
