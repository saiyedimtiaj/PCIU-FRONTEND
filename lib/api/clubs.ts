import { cache } from "react";
import { publicFetch } from "@/lib/server-fetch";
import { resolveUploadUrl } from "@/lib/upload-url";
import type { Club, ClubActivity, ClubDepartment, ClubDetail, ClubSocialLink } from "@/types/clubs";

type Dict = Record<string, unknown>;

// Tagged "clubs" so an admin save refreshes these pages immediately
// (app/(admin)/academics-cache.ts); otherwise revalidated every 5 minutes.
const CACHE = { next: { revalidate: 300, tags: ["clubs"] } };

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** An upload path served through this app's /api/uploads proxy, or null. */
const media = (value: unknown) => resolveUploadUrl(text(value)) || null;

/** `socialMedia` is a JSON column: a JSON string, an array, or `{ platform: url }`. */
function toSocialLinks(value: unknown): ClubSocialLink[] {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (Array.isArray(parsed)) {
    return parsed.flatMap((item) => {
      const row = (item ?? {}) as Dict;
      const title = text(row.title ?? row.platform ?? row.name);
      const url = text(row.url ?? row.link);
      return title && url ? [{ title, url }] : [];
    });
  }
  if (parsed && typeof parsed === "object") {
    return Object.entries(parsed as Dict).flatMap(([title, url]) =>
      typeof url === "string" && url ? [{ title, url }] : [],
    );
  }
  return [];
}

function toDepartment(value: unknown): ClubDepartment | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Dict;
  const name = text(row.name);
  const shortName = text(row.shortName) || null;
  if (!name && !shortName) return null;
  return { name: name || (shortName as string), shortName };
}

function toClub(row: Dict): Club | null {
  const name = text(row.name);
  const slug = text(row.slug);
  if (!name || !slug) return null;
  return {
    id: Number(row.id),
    name,
    slug,
    description: text(row.description),
    logo: media(row.logo),
    bannerImage: media(row.bannerImage),
    website: text(row.website) || null,
    department: toDepartment(row.department),
    socialLinks: toSocialLinks(row.socialMedia ?? row.socialmedia),
  };
}

/** "2026-09-20T09:00:00.000Z" → "20 Sep 2026", formatted once on the server. */
function formatDate(value: unknown): string {
  const iso = text(value);
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });
}

function toActivity(row: Dict): ClubActivity | null {
  const title = text(row.title);
  if (!title || row.isActive === false) return null;
  return {
    id: Number(row.id),
    type: text(row.type),
    title,
    description: text(row.description),
    location: text(row.location) || null,
    date: formatDate(row.activityDate),
    coverImage: media(row.coverImageUrl),
    url: text(row.url) || null,
  };
}

const bySortOrder = (a: Dict, b: Dict) =>
  (Number(a.sortorder ?? a.sortOrder) || 0) - (Number(b.sortorder ?? b.sortOrder) || 0);

/** Active clubs in admin sort order. `null` when the API is unreachable. */
export async function getClubs(): Promise<Club[] | null> {
  try {
    const res = await publicFetch.get("/clubs", CACHE);
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: unknown };
    const rows = Array.isArray(body.data) ? (body.data as Dict[]) : [];
    return rows
      .filter((r) => r.isActive !== false)
      .sort(bySortOrder)
      .map(toClub)
      .filter((c): c is Club => c !== null);
  } catch (error) {
    console.error("[Clubs] Failed to load clubs:", error);
    return null;
  }
}

/**
 * One club and its active activities in `sortOrder`, or null if it doesn't
 * exist / is inactive. React `cache` lets `generateMetadata` and the page
 * share one call per request.
 */
export const getClub = cache(async (slug: string): Promise<ClubDetail | null> => {
  try {
    const res = await publicFetch.get(`/clubs/${encodeURIComponent(slug)}`, CACHE);
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: { club?: Dict; activities?: unknown } };
    const raw = body.data?.club;
    if (!raw || raw.isActive === false) return null;
    const club = toClub(raw);
    if (!club) return null;
    const activities = Array.isArray(body.data?.activities)
      ? [...(body.data.activities as Dict[])]
          .sort(bySortOrder)
          .map(toActivity)
          .filter((a): a is ClubActivity => a !== null)
      : [];
    return { club, activities };
  } catch (error) {
    console.error(`[Clubs] Failed to load club "${slug}":`, error);
    return null;
  }
});
