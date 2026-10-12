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
      .map((notice) => ({
        ...notice,
        title: normalizeString(notice.title) || "Untitled notice",
        category: normalizeString(notice.category) || "General",
        department: notice.department ?? null,
        page: notice.page ?? null,
      }));

    return notices.sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));
  } catch (error) {
    console.error("[Notices] Failed to load public notices.", error);
    return [];
  }
}
