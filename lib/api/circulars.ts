import { publicFetch } from "@/lib/server-fetch";
import { getMediaUrl } from "@/lib/utils/media";
import { resolveUploadUrl } from "@/lib/upload-url";
import type {
  Circular,
  CircularApiRecord,
  CircularFilterOption,
  CircularPagination,
} from "@/types/circulars";

/**
 * The only `type` values `GET /circulars?type=` accepts — anything else is a
 * 400 ("valid types are JOB or TENDER"). Types seen in the data are merged in
 * for display, but only these are ever sent as a filter.
 */
export const CIRCULAR_TYPES = ["JOB", "TENDER"] as const;

/**
 * Query params the endpoint actually honours (verified against the live API).
 * It ignores `search`/`limit`, so text search is done client-side.
 */
export interface CircularQuery {
  page?: number;
  type?: string;
  departmentId?: number;
}

export type CircularsResult =
  | { ok: true; circulars: CircularApiRecord[]; pagination: CircularPagination }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toCount(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

function normalizePagination(
  raw: unknown,
  itemCount: number,
  requestedPage: number,
): CircularPagination {
  const p = isRecord(raw) ? raw : {};
  const currentPage = toCount(p.currentPage, requestedPage) || 1;
  const totalPages = toCount(p.totalPages, 1);

  return {
    totalCirculars: toCount(p.totalCirculars, itemCount),
    totalPages,
    currentPage,
    limit: toCount(p.limit, itemCount),
    hasNextPage:
      typeof p.hasNextPage === "boolean" ? p.hasNextPage : currentPage < totalPages,
    hasPreviousPage:
      typeof p.hasPreviousPage === "boolean" ? p.hasPreviousPage : currentPage > 1,
  };
}

export async function getCirculars(
  query: CircularQuery = {},
): Promise<CircularsResult> {
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) {
    return { ok: false, message: "The circulars service is not configured." };
  }

  const page = query.page && query.page > 1 ? query.page : 1;
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query.type) params.set("type", query.type);
  if (query.departmentId) params.set("departmentId", String(query.departmentId));
  const qs = params.toString();

  try {
    const response = await publicFetch.get(`/circulars${qs ? `?${qs}` : ""}`, {
      // Circulars change often (new postings, deadlines) — keep the cache short.
      next: { revalidate: 60, tags: ["public-circulars"] },
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok || !isRecord(payload) || payload.success === false) {
      const message =
        isRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : `Request failed (${response.status})`;
      throw new Error(message);
    }

    const data = isRecord(payload.data) ? payload.data : {};
    const circulars = Array.isArray(data.circulars)
      ? (data.circulars.filter(isRecord) as CircularApiRecord[])
      : [];

    return {
      ok: true,
      circulars,
      pagination: normalizePagination(data.pagination, circulars.length, page),
    };
  } catch (error) {
    console.error("[Circulars] Failed to load circulars.", error);
    return {
      ok: false,
      message: "We couldn't load circulars right now. Please try again shortly.",
    };
  }
}

/* ------------------------------------------------------------------------ */
/* Mapping: API record -> display-ready Circular                            */
/* ------------------------------------------------------------------------ */

const DAY_MS = 86_400_000;

// Start/end dates are stored as date-only values at UTC midnight, so the
// calendar date is read in UTC; "today" is Bangladesh time, matching
// lib/academics/live.ts.
const dateLabelFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Calendar day as a UTC-midnight timestamp, for whole-day comparisons. */
function utcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function todayInDhaka(now: Date): number {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" })
    .format(now)
    .split("-")
    .map(Number);
  return Date.UTC(y, m - 1, d);
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function resolveStatus(
  enabled: boolean,
  start: Date | null,
  end: Date | null,
  today: number,
): Pick<Circular, "status" | "deadlineNote" | "progress" | "urgent"> {
  const none = { deadlineNote: null, progress: null, urgent: false };
  if (!enabled) return { status: "inactive", ...none };

  // The deadline day itself is still open; it expires the day after.
  if (end && today > utcDay(end)) {
    return { status: "expired", ...none, deadlineNote: "Closed" };
  }

  if (start && today < utcDay(start)) {
    const days = Math.round((utcDay(start) - today) / DAY_MS);
    return { status: "upcoming", ...none, deadlineNote: `Opens in ${plural(days, "day")}` };
  }

  if (end) {
    const days = Math.round((utcDay(end) - today) / DAY_MS);
    const span = start ? utcDay(end) - utcDay(start) + DAY_MS : 0;
    return {
      status: "active",
      deadlineNote: days === 0 ? "Closes today" : `${plural(days, "day")} left`,
      progress:
        start && span > 0
          ? Math.min(100, Math.max(0, Math.round(((today - utcDay(start)) / span) * 100)))
          : null,
      urgent: days <= 3,
    };
  }

  return { status: "active", ...none };
}

/** `/uploads/...` goes through this app's same-origin proxy (so `download` works); any other relative path is resolved against the asset base URL. */
function buildPdfUrl(value: unknown): string | null {
  const raw = normalizeString(value);
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;

  const path = `/${raw.replace(/^\/+/, "")}`;
  return path.startsWith("/uploads/") ? resolveUploadUrl(path) : getMediaUrl(path);
}

function fileNameFrom(url: string | null): string | null {
  if (!url) return null;
  const last = url.split(/[?#]/)[0].split("/").pop();
  if (!last) return null;
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

export function formatCircularType(type: string): string {
  if (!type) return "General";
  return type
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function toCircular(
  record: CircularApiRecord,
  index: number,
  now: Date = new Date(),
): Circular {
  const start = parseDate(record.startDate);
  const end = parseDate(record.endDate);
  const updated = parseDate(record.updatedAt);
  const type = normalizeString(record.type).toUpperCase();

  const dept = record.department;
  const deptName = normalizeString(dept?.name);
  const deptShort = normalizeString(dept?.shortName);
  const department =
    deptName || deptShort
      ? {
          id: typeof dept?.id === "number" ? dept.id : null,
          name: deptName || deptShort,
          shortName: deptShort,
        }
      : null;

  const pdfUrl = buildPdfUrl(record.pdf);

  return {
    // Negative fallback keys can't collide with real ids.
    id: typeof record.id === "number" ? record.id : -(index + 1),
    title: normalizeString(record.title) || "Untitled circular",
    description: normalizeString(record.description),
    type,
    typeLabel: formatCircularType(type),
    department,
    startDateLabel: start ? dateLabelFormat.format(start) : null,
    endDateLabel: end ? dateLabelFormat.format(end) : null,
    updatedAtLabel: updated ? dateLabelFormat.format(updated) : null,
    ...resolveStatus(record.status !== false, start, end, todayInDhaka(now)),
    pdfUrl,
    pdfFileName: fileNameFrom(pdfUrl),
  };
}

export function getCircularTypeOptions(
  records: CircularApiRecord[],
): CircularFilterOption[] {
  const known = new Set<string>(CIRCULAR_TYPES);
  for (const record of records) {
    const type = normalizeString(record.type).toUpperCase();
    if (CIRCULAR_TYPES.includes(type as (typeof CIRCULAR_TYPES)[number])) {
      known.add(type);
    }
  }
  return [...known].map((value) => ({ value, label: formatCircularType(value) }));
}

/** There's no public departments endpoint, so options come from the departments the circulars themselves reference. */
export function getCircularDepartmentOptions(
  records: CircularApiRecord[],
): CircularFilterOption[] {
  const byId = new Map<number, string>();
  for (const record of records) {
    const id = record.department?.id ?? record.departmentId;
    if (typeof id !== "number" || byId.has(id)) continue;
    const name = normalizeString(record.department?.name);
    const short = normalizeString(record.department?.shortName);
    if (!name && !short) continue;
    byId.set(id, name && short ? `${name} (${short})` : name || short);
  }
  return [...byId]
    .map(([id, label]) => ({ value: String(id), label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
