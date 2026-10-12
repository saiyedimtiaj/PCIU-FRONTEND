import { publicFetch } from "@/lib/server-fetch";
import type {
  Exam,
  ExamRoutine,
  ClassRoutineItem,
  ClassTimeSlot,
  FreeRoom,
  Semester,
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
    // Paginated lists nest the rows under a resource-named key next to the
    // page info — e.g. { routines: [...], pagination: {...} }.
    const arrays = Object.values(data as Dict).filter(Array.isArray);
    if (arrays.length === 1) return arrays[0] as Dict[];
  }
  return [];
}

function hasNextPage(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const pagination = (data as Dict).pagination;
  return !!pagination && typeof pagination === "object" && (pagination as Dict).hasNextPage === true;
}

function withPage(path: string, page: number): string {
  return `${path}${path.includes("?") ? "&" : "?"}page=${page}`;
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
const PUBLIC_SEMESTERS_PATH = "/academic/semesters";
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

// The routine lists are paginated at a fixed 30 rows (a `limit` param is
// ignored), so every page is walked. Capped so a misbehaving API can't loop forever.
const MAX_PAGES = 50;

async function fetchList(path: string, label: string): Promise<Dict[]> {
  try {
    const rows: Dict[] = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const data = await publicGet(page === 1 ? path : withPage(path, page));
      rows.push(...toArray(data));
      if (!hasNextPage(data)) break;
    }
    return rows;
  } catch (error) {
    console.error("[academics] failed to load \"" + label + "\" from the API", error);
    return [];
  }
}

/** Today's date in Bangladesh (UTC+6) as YYYY-MM-DD. A plain UTC date
 *  lags behind until 6 AM local, so an exam would flip status 6 hours late. */
function todayInDhaka(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());
}

function deriveExamStatus(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "Scheduled";
  const today = todayInDhaka();
  if (today < startDate) return "Upcoming";
  if (today > endDate) return "Completed";
  return "Ongoing";
}

const SEASON_ORDER: Record<string, number> = { spring: 1, summer: 2, fall: 3, autumn: 3 };

/** Orders "Spring 2026" < "Summer 2026" < "Fall 2026"; unparseable titles sort last. */
function semesterSortKey(title: string): number {
  const match = title.match(/(spring|summer|fall|autumn)\s*-?\s*(\d{4})/i);
  if (!match) return -1;
  return Number(match[2]) * 10 + SEASON_ORDER[match[1].toLowerCase()];
}

/** Active semesters, newest first — whatever the admin has created, nothing hardcoded. */
export async function getLiveSemesters(): Promise<Semester[]> {
  const rows = await fetchList(PUBLIC_SEMESTERS_PATH, "semester");
  return rows
    .filter(isActive)
    .map((r) => ({ id: num(r.id), title: str(r.title).trim() }))
    .filter((s) => s.id && s.title)
    .sort((a, b) => semesterSortKey(b.title) - semesterSortKey(a.title) || b.id - a.id);
}

/**
 * The semester running today, by PCIU's trimester calendar (Spring Jan–Apr,
 * Summer May–Aug, Fall Sep–Dec) in Bangladesh time. Falls back to the newest
 * semester when none is titled for the current term. Computed on the server so
 * the client's first render matches (no hydration mismatch on the default).
 */
export function getCurrentSemesterId(semesters: Semester[]): number | undefined {
  const [year, month] = todayInDhaka().split("-").map(Number);
  const season = month <= 4 ? "spring" : month <= 8 ? "summer" : "fall";
  const currentKey = year * 10 + SEASON_ORDER[season];
  return (semesters.find((s) => semesterSortKey(s.title) === currentKey) ?? semesters[0])?.id;
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
        semesterId: idOf(r, "semester"),
        name: str(r.name),
        routeFile: typeof r.routeFile === "string" && r.routeFile ? r.routeFile : null,
        startDate,
        endDate,
        status: deriveExamStatus(startDate, endDate),
      };
    })
    .sort(
      (a, b) =>
        statusRank(a.status) - statusRank(b.status) ||
        // Completed exams: most recent first. Everything else: soonest first.
        (a.status === "Completed"
          ? b.endDate.localeCompare(a.endDate)
          : a.startDate.localeCompare(b.startDate)),
    );
}

/** Card order on the exam schedule: what's running, then what's next, then past exams. */
const STATUS_ORDER = ["Ongoing", "Upcoming", "Scheduled", "Completed"];

function statusRank(status: string): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? STATUS_ORDER.length : idx;
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
      semesterId: idOf(r, "semester"),
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