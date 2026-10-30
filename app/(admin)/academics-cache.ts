import { updateTag } from "next/cache";

/**
 * Entities the public /academics pages read (lib/academics/live.ts fetches them
 * with the "academics" cache tag and a 60s revalidate). Expiring the tag on an
 * admin write makes the change show up on the next public page load instead of
 * up to a minute later.
 */
const ACADEMICS_SLUGS = new Set([
  "class-routine",
  "exam-routine",
  "exam",
  "semester",
  "time-slot",
  "course",
  "department",
  "teacher",
  "batch",
  "section",
  "building",
  "room",
]);

/**
 * Other public pages that cache an entity under their own tag (see
 * lib/api/about.ts, lib/api/management.ts), so an admin save shows up
 * immediately rather than after the 5-minute revalidate.
 */
const PUBLIC_PAGE_TAGS: Record<string, string> = {
  about: "about-university",
  management: "management",
  "management-type": "management",
  iqac: "iqac",
  "iqac-committee": "iqac",
  gallery: "iqac",
  "iqac-gallery": "iqac",
  "iqac-documents": "iqac",
  events: "events",
  "iqac-activities": "events",
  popup: "popup",
  teacher: "teacher",
  faculty: "faculties",
  department: "faculties",
  "research-centres": "research",
  "research-areas": "research",
  "research-publications": "research",
  partners: "research",
  mous: "research",
  "pcj-volumes": "research",
  "pcj-articles": "research",
};

/** Call only from a Server Action — updateTag is Server-Action-only. */
export function expireAcademicsCache(slug: string): void {
  if (ACADEMICS_SLUGS.has(slug)) updateTag("academics");
  const tag = PUBLIC_PAGE_TAGS[slug];
  if (tag) updateTag(tag);
}
