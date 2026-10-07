import { publicFetch } from "@/lib/server-fetch";
import type {
  Exam,
  ExamRoutine,
  ClassRoutineItem,
  ClassTimeSlot,
  FreeRoom,
  TimeSlotOption,
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

/** A relation's id — from the flat `<key>Id` column, else the nested object. */
function idOf(record: Dict, key: string): number | undefined {
  return num(record[key + "Id"] ?? relation(record, key).id, NaN) || undefined;
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
// Same split for time slots and exams: /academic/admin/{time-slots,exams} reject any non-admin
// session (403 "Permission not configured" for a teacher, 401 with no cookie).
const PUBLIC_TIME_SLOTS_PATH = "/academic/time-slots";
const PUBLIC_EXAMS_PATH = "/academic/exams";
// Public free-room lookup — takes ?day=&timeSlotId= and returns rooms with no
// class routine scheduled in that slot. Lives under /home, not /academic,
// per the live API (verified: 200 with no auth header).
const PUBLIC_FREE_ROOMS_PATH = "/home/free-rooms";

// All of these endpoints are public, so they're fetched without the session
// cookie and kept in Next's data cache. Every visitor (and the 42-call free-room
// week fan-out) is then served from cache instead of waiting on the API —
// which matters because the Render free-tier backend cold-starts after idling.
const PUBLIC_REVALIDATE_SECONDS = 60;
const NETWORK_RETRY_ATTEMPTS = 2;
const NETWORK_RETRY_DELAY_MS = 1000;

async function publicGet(path: string): Promise<unknown> {
  let res: Response | undefined;
  let networkError: unknown;
  for (let attempt = 0; attempt <= NETWORK_RETRY_ATTEMPTS; attempt++) {
    try {
      res = await publicFetch.get(path, {
        next: { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["academics"] },
      });
      break;
    } catch (error) {
      networkError = error;
      if (attempt < NETWORK_RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, NETWORK_RETRY_DELAY_MS));
      }
    }
  }
  if (!res) throw networkError;

  const parsed = (await res.json()) as { success?: boolean; message?: string; data?: unknown };
  if (!res.ok || parsed?.success === false) {
    throw new Error(parsed?.message || `Request failed (${res.status})`);
  }
  return parsed?.data ?? parsed;
}

async function fetchList(path: string, label: string): Promise<Dict[]> {
  try {
    const data = await publicGet(path);
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
  const rows = await fetchList(PUBLIC_EXAMS_PATH, "exam");
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
      shift: typeof r.shift === "string" && r.shift ? r.shift : undefined,
      examName: nameOf(r, "exam") || undefined,
      courseId: idOf(r, "course"),
      batchId: idOf(r, "batch"),
      sectionId: idOf(r, "section"),
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
      teacherId: idOf(r, "teacher"),
      courseId: idOf(r, "course"),
      batchId: idOf(r, "batch"),
      sectionId: idOf(r, "section"),
      building: nameOf(r, "building"),
      room: nameOf(r, "room"),
      timeSlot: timeRangeOf(r, "timeSlot"),
      batch: nameOf(r, "batch"),
      section: nameOf(r, "section"),
      day: str(r.day),
      studentRange: str(r.studentRange),
      shift: typeof r.shift === "string" && r.shift ? r.shift : undefined,
    }));
}

const SLOT_LETTERS = "ABCDEFGHIJ";

export async function getLiveClassTimeSlots(): Promise<ClassTimeSlot[]> {
  const rows = await fetchList(PUBLIC_TIME_SLOTS_PATH, "time-slot");
  const sorted = rows
    .filter((r) => isActive(r) && str(r.type) === "CLASS")
    .map((r) => ({ time: timeRange(r), startTime: str(r.startTime) }))
    .filter((s) => s.time)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return sorted.map((s, i) => ({ time: s.time, slot: SLOT_LETTERS[i] ?? String(i + 1) }));
}

/**
 * Same CLASS time slots as getLiveClassTimeSlots, but keeps each slot's real
 * numeric id (instead of replacing it with a display letter like A/B/C) —
 * the Free Rooms search needs the actual timeSlotId to send as a query param.
 */
export async function getClassTimeSlotOptions(): Promise<TimeSlotOption[]> {
  const rows = await fetchList(PUBLIC_TIME_SLOTS_PATH, "time-slot");
  return rows
    .filter((r) => isActive(r) && str(r.type) === "CLASS")
    .map((r) => ({ id: num(r.id), time: timeRange(r), startTime: str(r.startTime) }))
    .filter((s) => s.time)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map(({ id, time }) => ({ id, time }));
}

export interface FreeRoomQuery {
  day: string;
  timeSlotId: number;
}

export async function getFreeRooms(query: FreeRoomQuery): Promise<FreeRoom[]> {
  const params = new URLSearchParams({
    day: query.day,
    timeSlotId: String(query.timeSlotId),
  });
  try {
    const data = await publicGet(`${PUBLIC_FREE_ROOMS_PATH}?${params.toString()}`);
    const rows = toArray(data);
    return rows.map((r) => ({
      id: num(r.id),
      name: str(r.name),
      buildingId: num(r.buildingId),
      buildingName: nameOf(r, "building"),
    }));
  } catch (error) {
    console.error("[academics] failed to load free rooms", error);
    return [];
  }
}

/**
 * Free rooms for every (day, time slot) pair, fetched in parallel on the
 * server. `rooms[dayIndex][slotIndex]`, in the order of `days` and `timeSlots`.
 * Done server-side in one pass because client-invoked Server Actions run one
 * at a time — a per-cell action fan-out from the browser is fully serialized.
 */
export async function getFreeRoomsWeek(
  days: string[],
  timeSlots: TimeSlotOption[],
): Promise<FreeRoom[][][]> {
  return Promise.all(
    days.map((day) =>
      Promise.all(timeSlots.map((s) => getFreeRooms({ day, timeSlotId: s.id }))),
    ),
  );
}