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

export async function getEvents(): Promise<{
  events: HomeEvent[];
  error: boolean;
}> {
  if (!API_BASE_URL) return { events: [], error: true };

  try {
    const response = await fetch(`${API_BASE_URL}/home/events`, {
      next: { revalidate: 300 },
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

    const events = extractEvents(payload)
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
