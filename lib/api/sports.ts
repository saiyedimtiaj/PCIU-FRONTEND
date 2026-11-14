import { cache } from "react";
import { publicFetch } from "@/lib/server-fetch";
import { resolveUploadUrl } from "@/lib/upload-url";
import type { SportsTeam } from "@/types/sports";

type Dict = Record<string, unknown>;

// Revalidated every 5 minutes; tagged so an admin write can expire it with
// updateTag("sports-teams") once a teams entity exists in the dashboard.
const CACHE = { next: { revalidate: 300, tags: ["sports-teams"] } };

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** An upload path served through this app's /api/uploads proxy, or null. */
const media = (value: unknown) => resolveUploadUrl(text(value)) || null;

/** "TABLE_TENNIS" → "Table Tennis". */
function toSportLabel(sport: string): string {
  return sport
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function toTeam(row: Dict): SportsTeam | null {
  const name = text(row.name);
  const id = Number(row.id);
  if (!name || !Number.isFinite(id)) return null;
  const sport = text(row.sport).toUpperCase();
  return {
    id,
    name,
    slug: text(row.slug),
    type: text(row.type) || null,
    sport,
    sportLabel: sport ? toSportLabel(sport) : "Sports",
    logo: media(row.logo),
    banner: media(row.banner),
    description: text(row.description),
  };
}

const order = (row: Dict) => {
  const n = Number(row.sortOrder ?? row.sortorder);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
};

/**
 * Active teams in admin `sortOrder` (ties broken by name). `null` when the API
 * is unreachable or returns an invalid body, so the page can tell "error" from
 * "no teams yet". React `cache` dedupes calls within one request.
 */
export const getSportsTeams = cache(async (): Promise<SportsTeam[] | null> => {
  try {
    const res = await publicFetch.get("/pciuteams", CACHE);
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: unknown } | null;
    if (!body || !Array.isArray(body.data)) return null;
    return (body.data as unknown[])
      .filter((r): r is Dict => !!r && typeof r === "object")
      .filter((r) => r.isActive === true)
      .sort((a, b) => order(a) - order(b) || text(a.name).localeCompare(text(b.name)))
      .map(toTeam)
      .filter((t): t is SportsTeam => t !== null);
  } catch (error) {
    console.error("[Sports] Failed to load teams:", error);
    return null;
  }
});
