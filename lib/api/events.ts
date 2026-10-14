import { resolveUploadUrl } from "@/lib/upload-url";
import type { HomeEvent } from "@/types/home";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

function isEvent(value: unknown): value is HomeEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<HomeEvent>;
  return (
    typeof event.title === "string" &&
    typeof event.slug === "string" &&
    typeof event.startDateTime === "string"
  );
}

function extractEvents(payload: unknown): HomeEvent[] {
  if (Array.isArray(payload)) return payload.filter(isEvent);
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  const data = record.data;
  if (Array.isArray(data)) return data.filter(isEvent);
  if (data && typeof data === "object") {
    const arrays = Object.values(data).filter(Array.isArray);
    if (arrays.length === 1) return arrays[0].filter(isEvent);
    if (isEvent(data)) return [data];
  }
  return isEvent(payload) ? [payload] : [];
}

function normalizeEvent(event: HomeEvent): HomeEvent {
  const gallery = Array.isArray(event.multipleImage) ? event.multipleImage : [];

  return {
    ...event,
    coverImageUrl: resolveUploadUrl(event.coverImageUrl),
    multipleImage: gallery
      .filter(
        (image): image is string => typeof image === "string" && Boolean(image),
      )
      .map(resolveUploadUrl),
  };
}

const MAX_EVENT_PAGES = 20;

function hasNextPage(payload: unknown): boolean {
  const data = (payload as { data?: { pagination?: { hasNextPage?: unknown } } } | null)?.data;
  return data?.pagination?.hasNextPage === true;
}

export async function getEvents(): Promise<{
  events: HomeEvent[];
  error: boolean;
}> {
  if (!API_BASE_URL) return { events: [], error: true };

  try {
    // `/home/events` is the homepage feed — capped at a handful of upcoming
    // events, so anything else (an IQAC activity, a past event) never
    // appeared on /events, /events/[slug] or the IQAC page. `/events/active`
    // is the full public list, paginated at 20.
    const payloads: unknown[] = [];
    for (let page = 1; page <= MAX_EVENT_PAGES; page++) {
      const response = await fetch(`${API_BASE_URL}/events/active?page=${page}`, {
        next: { revalidate: 300, tags: ["events"] },
      });
      if (!response.ok) return { events: [], error: true };

      const payload: unknown = await response.json();
      if (
        payload &&
        typeof payload === "object" &&
        "success" in payload &&
        payload.success === false
      ) {
        return { events: [], error: true };
      }
      payloads.push(payload);
      if (!hasNextPage(payload)) break;
    }

    const events = payloads
      .flatMap(extractEvents)
      .filter(
        (event) =>
          event.isActive === true &&
          (event.deletedAt === null || event.deletedAt === undefined),
      )
      .map(normalizeEvent);

    return { events, error: false };
  } catch {
    return { events: [], error: true };
  }
}

export async function getLatestPublishedEvents(): Promise<{
  events: HomeEvent[];
  error: boolean;
}> {
  const result = await getEvents();
  const events = result.events
    .sort((a, b) => {
      const aPublished = new Date(a.createdAt ?? "").getTime();
      const bPublished = new Date(b.createdAt ?? "").getTime();
      const aDate = Number.isFinite(aPublished)
        ? aPublished
        : new Date(a.startDateTime).getTime();
      const bDate = Number.isFinite(bPublished)
        ? bPublished
        : new Date(b.startDateTime).getTime();
      return bDate - aDate;
    })
    .slice(0, 4);

  return { events, error: result.error };
}

export async function getEventBySlug(slug: string): Promise<HomeEvent | null> {
  const { events } = await getEvents();
  return events.find((event) => event.slug === slug) ?? null;
}
