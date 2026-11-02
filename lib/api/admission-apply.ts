import { publicFetch } from "@/lib/server-fetch";
import type { ActiveAdmissionCycle } from "@/types/admission-apply";

/** The active admission cycle, or null when none is open (or the API is down). */
export async function getActiveAdmissionCycle(): Promise<ActiveAdmissionCycle | null> {
  try {
    // Revalidated each minute: opening or closing a cycle shows up quickly,
    // and the apply pages stay cacheable instead of rendering per request.
    const res = await publicFetch.get("/admissioncycle/active", { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: unknown };
    const data = json.data as Partial<ActiveAdmissionCycle> | null | undefined;
    if (!json.success || !data || typeof data.id !== "number") return null;
    return {
      id: data.id,
      semester: typeof data.semester === "string" ? data.semester : "",
      isActive: data.isActive !== false,
      applicationStart: data.applicationStart ?? null,
      applicationEnd: data.applicationEnd ?? null,
    };
  } catch (error) {
    console.error("[Admission] Active cycle request failed:", error);
    return null;
  }
}

/**
 * Whether the cycle accepts applications right now. The end date is stored
 * as midnight UTC ("2026-12-12T00:00:00.000Z"), so the whole end day counts.
 */
export function isCycleOpen(cycle: ActiveAdmissionCycle | null, now = new Date()): boolean {
  if (!cycle || !cycle.isActive) return false;
  const start = cycle.applicationStart ? new Date(cycle.applicationStart) : null;
  const end = cycle.applicationEnd ? new Date(cycle.applicationEnd) : null;
  if (start && now < start) return false;
  if (end && now.getTime() > end.getTime() + 24 * 60 * 60 * 1000) return false;
  return true;
}
