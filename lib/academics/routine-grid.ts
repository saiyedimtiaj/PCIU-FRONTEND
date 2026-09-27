import type { ClassRoutineItem, ClassTimeSlot } from "@/types/academics";
import { timeRangeSortKey } from "./time-sort";

/**
 * Shared Day/Date × time-slot grid logic behind ClassScheduleGrid,
 * ExamScheduleGrid, and their PDF export (downloadRoutineGridPdf) — kept in
 * one place so the on-screen grid and the downloaded file can never drift
 * out of sync with each other.
 */

export const CLASS_DAYS = [
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
] as const;

export function courseLabel(r: { courseCode: string; courseName: string }): string {
  return r.courseCode && r.courseName
    ? `${r.courseCode} – ${r.courseName}`
    : r.courseCode || r.courseName;
}

export function buildClassGridColumns(
  routines: ClassRoutineItem[],
  timeSlots: ClassTimeSlot[],
): string[] {
  if (timeSlots.length > 0) {
    return Array.from(new Set(timeSlots.map((s) => s.time))).filter(Boolean);
  }
  return Array.from(new Set(routines.map((r) => r.timeSlot)))
    .filter(Boolean)
    .sort((a, b) => timeRangeSortKey(a) - timeRangeSortKey(b));
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Formats a "YYYY-MM-DD" string as "04 Sep 2026" without constructing a
 *  `Date` — avoids the server/client timezone hydration mismatches this
 *  codebase has hit before with runtime date formatting. */
export function formatIsoDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return iso;
  const [, year, month, day] = match;
  const label = MONTHS[Number(month) - 1];
  return label ? `${day} ${label} ${year}` : iso;
}

/** Multi-line PDF cell text for one class — course, teacher, room. */
export function classCellText(item: ClassRoutineItem): string {
  const lines = [courseLabel(item)];
  if (item.teacher) lines.push(item.teacher);
  const room = [item.room, item.building].filter(Boolean).join(", ");
  if (room) lines.push(`Room: ${room}`);
  return lines.join("\n");
}

