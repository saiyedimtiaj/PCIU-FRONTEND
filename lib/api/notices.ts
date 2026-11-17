import { publicFetch } from "@/lib/server-fetch";
import type { NoticeApiRecord } from "@/types/notices";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toDateValue(value: string | null | undefined): Date | null {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getSortTimestamp(notice: NoticeApiRecord): number {
  const preferred = toDateValue(notice.noticeDate ?? undefined);
  if (preferred) {
    return preferred.getTime();
  }

  const fallback = toDateValue(notice.createdAt ?? undefined);
  return fallback ? fallback.getTime() : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractNoticeArray(payload: unknown): NoticeApiRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord) as unknown as NoticeApiRecord[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  const data = payload.data;
  if (Array.isArray(data)) {
    return data.filter(isRecord) as unknown as NoticeApiRecord[];
  }

  if (isRecord(data) && Array.isArray(data.notices)) {
    return data.notices.filter(isRecord) as unknown as NoticeApiRecord[];
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items.filter(isRecord) as unknown as NoticeApiRecord[];
  }

  if (Array.isArray(payload.notices)) {
    return payload.notices.filter(isRecord) as unknown as NoticeApiRecord[];
  }

  return [];
}

function extractNoticeRecord(payload: unknown): NoticeApiRecord | null {
  if (!isRecord(payload)) return null;

  const data = payload.data;
  const candidate =
    (isRecord(data) && isRecord(data.notice) ? data.notice : null) ??
    (isRecord(data) ? data : null) ??
    (isRecord(payload.notice) ? payload.notice : null);

  if (!candidate || typeof candidate.id !== "number") {
    return null;
  }

  return candidate as unknown as NoticeApiRecord;
}

function normalizeNotice(notice: NoticeApiRecord): NoticeApiRecord {
  return {
    ...notice,
    title: normalizeString(notice.title) || "Untitled notice",
    category: normalizeString(notice.category) || "General",
    department: notice.department ?? null,
    page: notice.page ?? null,
  };
}

export async function getPublicNotices(): Promise<NoticeApiRecord[]> {
  if (!API_BASE_URL) {
    return [];
  }

  try {
    const response = await publicFetch.get("/notices/public", {
      next: { revalidate: 300, tags: ["public-notices"] },
    });

    if (!response.ok) {
      throw new Error(`Public notices request failed (${response.status})`);
    }

    const payload: unknown = await response.json();
    const notices = extractNoticeArray(payload)
      .filter((notice) => notice.isActive !== false)
      .map(normalizeNotice);

    return notices.sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));
  } catch (error) {
    console.error("[Notices] Failed to load public notices.", error);
    return [];
  }
}

/**
 * A single public notice for `/notices/[id]`.
 *
 * Uses `GET /notices/public/:id` instead of scanning the list, so the detail
 * page stays cheap as the notice board grows. Returns `null` for unknown or
 * inactive notices so the route can render a 404.
 */
export async function getPublicNoticeById(
  id: number,
): Promise<NoticeApiRecord | null> {
  if (!API_BASE_URL || !Number.isInteger(id) || id <= 0) {
    return null;
  }

  try {
    const response = await publicFetch.get(`/notices/public/${id}`, {
      next: { revalidate: 300, tags: ["public-notices", `public-notice-${id}`] },
    });

    if (!response.ok) {
      return null;
    }

    const payload: unknown = await response.json();
    const notice = extractNoticeRecord(payload);

    if (!notice || notice.isActive === false) {
      return null;
    }

    return normalizeNotice(notice);
  } catch (error) {
    console.error(`[Notices] Failed to load public notice ${id}.`, error);
    return null;
  }
}
