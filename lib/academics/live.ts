import { api } from "@/services/http";
import { collectionPath } from "@/services/endpoints";
import type {
  Exam,
  ExamRoutine,
  ClassRoutineItem,
  ClassTimeSlot,
} from "@/types/academics";

type Dict = Record<string, unknown>;

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isActive(record: Dict): boolean {
  return record.status !== false;
}

function relation(record: Dict, key: string): Dict {
  const value = record[key];
  return value && typeof value === "object" ? (value as Dict) : {};
}

function nameOf(record: Dict, key: string): string {
  return str(relation(record, key).name);
}

function departmentLabel(record: Dict): string {
  const dept = relation(record, "department");
  return str(dept.shortName) || str(dept.name);
}

function courseCode(record: Dict): string {
  return str(relation(record, "course").code);
}

function courseName(record: Dict): string {
  return str(relation(record, "course").name);
}

function formatTimeOfDay(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  const timePart = value.includes("T") ? value.split("T")[1] : value;
  const match = timePart?.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "";
  const hour24 = Number(match[1]);
  const minute = match[2];
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return hour12 + ":" + minute + " " + period;
}

function timeRange(slot: Dict): string {
  const start = formatTimeOfDay(slot.startTime);
  const end = formatTimeOfDay(slot.endTime);
  return start && end ? start + " \u2013 " + end : "";
}

function timeRangeOf(record: Dict, key: string): string {
  return timeRange(relation(record, key));
}

function isoDate(value: unknown): string {
  return str(value).split("T")[0] || str(value);
}

function toArray(data: unknown): Dict[] {
  if (Array.isArray(data)) return data as Dict[];
  if (data && typeof data === "object") {
    const rows = (data as Dict).data ?? (data as Dict).items;
    if (Array.isArray(rows)) return rows as Dict[];
  }
  return [];
}

/**
 * The admin CRUD entities "exam-routine" / "class-routine" (services/endpoints.ts)
 * point at /routines/exam and /routines/class, which require an authenticated
 * admin session (verified live: 401 "Authentication required" with no cookie).
 * The public listing for these same tables lives at a different, unauthenticated
 * path — verified live: 200 with no auth header. Keep these separate from
 * ENTITY_ENDPOINTS so the admin dashboard's auth-gated CRUD path is untouched.
 */
const PUBLIC_EXAM_ROUTINES_PATH = "/academic/exam-routines";
const PUBLIC_CLASS_ROUTINES_PATH = "/academic/class-routines";

async function fetchList(path: string, label: string): Promise<Dict[]> {
  try {
    const data = await api.get<unknown>(path);
    return toArray(data);
  } catch (error) {
    console.error("[academics] failed to load \"" + label + "\" from the API", error);
    return [];
  }
}

function deriveExamStatus(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "Scheduled";
  const today = new Date().toISOString().slice(0, 10);
  if (today < startDate) return "Upcoming";
  if (today > endDate) return "Completed";
  return "Ongoing";
}

export async function getLiveExams(): Promise<Exam[]> {
  const rows = await fetchList(collectionPath("exam"), "exam");
  return rows
    .filter(isActive)
    .map((r) => {
      const startDate = isoDate(r.startDate);
      const endDate = isoDate(r.endDate);
      return {
        id: num(r.id),
        name: str(r.name),
        routeFile: typeof r.routeFile === "string" && r.routeFile ? r.routeFile : null,
        startDate,
        endDate,
        status: deriveExamStatus(startDate, endDate),
      };
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export async function getLiveExamRoutines(): Promise<ExamRoutine[]> {
  const rows = await fetchList(PUBLIC_EXAM_ROUTINES_PATH, "exam-routine");
  return rows
    .filter(isActive)
    .map((r) => ({
      id: num(r.id),
      examId: num(r.examId),
      department: departmentLabel(r),
      courseName: courseName(r),
      courseCode: courseCode(r),
      building: nameOf(r, "building"),
      room: nameOf(r, "room"),
      timeSlot: timeRangeOf(r, "timeSlot"),
      batch: nameOf(r, "batch"),
      section: nameOf(r, "section"),
      date: isoDate(r.date),
      studentRange: str(r.studentRange),
    }));
}

export async function getLiveClassRoutines(): Promise<ClassRoutineItem[]> {
  const rows = await fetchList(PUBLIC_CLASS_ROUTINES_PATH, "class-routine");
  return rows
    .filter(isActive)
    .map((r) => ({
      id: num(r.id),
      department: departmentLabel(r),
      courseName: courseName(r),
      courseCode: courseCode(r),
      teacher: nameOf(r, "teacher"),
      building: nameOf(r, "building"),
      room: nameOf(r, "room"),
      timeSlot: timeRangeOf(r, "timeSlot"),
      batch: nameOf(r, "batch"),
      section: nameOf(r, "section"),
      day: str(r.day),
      studentRange: str(r.studentRange),
    }));
}

const SLOT_LETTERS = "ABCDEFGHIJ";

export async function getLiveClassTimeSlots(): Promise<ClassTimeSlot[]> {
  const rows = await fetchList(collectionPath("time-slot"), "time-slot");
  const sorted = rows
    .filter((r) => isActive(r) && str(r.type) === "CLASS")
    .map((r) => ({ time: timeRange(r), startTime: str(r.startTime) }))
    .filter((s) => s.time)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return sorted.map((s, i) => ({ time: s.time, slot: SLOT_LETTERS[i] ?? String(i + 1) }));
}
