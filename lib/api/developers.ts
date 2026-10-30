import { publicFetch } from "@/lib/server-fetch";
import { getMediaUrl } from "@/lib/utils/media";
import pageData from "@/content/developers/page.json";
import type { Developer, DeveloperApiRecord, DevelopersPageContent } from "@/types/developers";

const content = pageData as DevelopersPageContent;

const CACHE = { next: { revalidate: 60, tags: ["developers"] } };

const text = (value: string | null | undefined) => value?.trim() || null;

/** `contributions` is a JSON column — accept an array or its stringified form. */
function parseList(value: unknown): string[] {
  let list: unknown = value;
  if (typeof value === "string") {
    try {
      list = JSON.parse(value);
    } catch {
      return [];
    }
  }
  return Array.isArray(list)
    ? list.filter((item): item is string => typeof item === "string" && item.trim() !== "")
    : [];
}

function toDeveloper(row: DeveloperApiRecord): Developer {
  return {
    name: row.name.trim(),
    role: text(row.role) ?? "Developer",
    studentId: row.student_id == null ? null : text(String(row.student_id)),
    about: text(row.about) ?? "",
    image: getMediaUrl(text(row.image)),
    github: text(row.github),
    linkedin: text(row.linkedin),
    facebook: text(row.facebook),
    portfolio: text(row.portfolio),
    contributions: parseList(row.contributions),
  };
}

/**
 * `GET /developers`, active rows in `display_order`. Falls back to the
 * static JSON when the endpoint is unreachable or hasn't been added to the
 * backend yet, so the page always has a team to show.
 */
export async function getDevelopers(): Promise<Developer[]> {
  try {
    const res = await publicFetch.get("/developers", CACHE);
    if (!res.ok) throw new Error(`/developers request failed (${res.status})`);
    const payload = await res.json();
    if (!payload?.success || !Array.isArray(payload.data)) {
      throw new Error("/developers returned an invalid response");
    }

    const rows = (payload.data as DeveloperApiRecord[])
      .filter((row) => row.name?.trim() && row.status !== false && row.status !== 0)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    return rows.length ? rows.map(toDeveloper) : content.developers;
  } catch {
    return content.developers;
  }
}
