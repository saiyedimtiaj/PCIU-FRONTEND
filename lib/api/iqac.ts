import { publicFetch } from "@/lib/server-fetch";
import { getMediaUrl } from "@/lib/utils/media";
import { getEvents } from "@/lib/api/events";
import pageData from "@/content/iqac/page.json";
import type {
  IqacActivityItem,
  IqacApiCommitteeMember,
  IqacApiRecord,
  IqacApiTeacher,
  IqacGalleryPhoto,
  IqacPageContent,
  IqacPageData,
  IqacPerson,
} from "@/types/iqac";

const content = pageData as IqacPageContent;

const DEFAULT_TITLE = "Institutional Quality Assurance Cell";
const DEFAULT_SUBTITLE =
  "Ensuring excellence in teaching, learning, and research through systematic quality enhancement initiatives at PCIU.";

const CACHE = { next: { revalidate: 60, tags: ["iqac"] } };

/** The static JSON the page shipped with, used only if the API is unreachable. */
function fallbackPage(): IqacPageData {
  const person = (p: { name: string; designation: string; email: string }, department = "") => ({
    name: p.name,
    designation: p.designation,
    department,
    email: p.email,
    image: null,
    href: null,
  });

  return {
    title: DEFAULT_TITLE,
    subtitle: DEFAULT_SUBTITLE,
    aboutHtml: null,
    about: content.about,
    vision: content.vision,
    mission: content.mission,
    objectives: content.objectives,
    director: person(content.directorMessage),
    directorMessageHtml: null,
    directorMessage: content.directorMessage.paragraphs,
    committee: content.committeeMembers.map((m) => ({
      ...person(m, m.department),
      role: m.role,
    })),
  };
}

const HTML_TAG = /<\/?[a-z][\s\S]*>/i;

/** Rich-text columns hold HTML from the editor, or plain text sent straight to the API. */
function splitRich(value: string | null | undefined): { html: string | null; paragraphs: string[] } {
  const text = value?.trim();
  if (!text) return { html: null, paragraphs: [] };
  if (HTML_TAG.test(text)) {
    // The editor saves an empty document as "<p></p>"; treat that as blank.
    const visible = text.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    return visible ? { html: text, paragraphs: [] } : { html: null, paragraphs: [] };
  }
  return { html: null, paragraphs: text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) };
}

/** `objectives` is a JSON column — accept an array or its stringified form. */
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

function toPerson(teacher: IqacApiTeacher | null | undefined): IqacPerson | null {
  if (!teacher?.name) return null;
  return {
    name: teacher.name,
    designation: teacher.designation ?? "",
    department: teacher.department?.name ?? "",
    email: teacher.email ?? teacher.user?.email ?? "",
    image: getMediaUrl(teacher.imageUrl),
    href: `/faculty/${teacher.id}`,
  };
}

async function getJson<T>(path: string): Promise<T> {
  const res = await publicFetch.get(path, CACHE);
  if (!res.ok) throw new Error(`${path} request failed (${res.status})`);
  const payload = await res.json();
  if (!payload?.success) throw new Error(`${path} returned an invalid response`);
  return payload.data as T;
}

/**
 * `GET /iqac` (the one row the backend keeps, with `director` joined) plus
 * `GET /iqac/committee`. Text the admin hasn't filled in yet falls back to
 * the static JSON field by field; people (director, committee) only ever
 * come from the API once it's reachable, so no placeholder names leak onto
 * the live page.
 */
export async function getIqacPage(): Promise<IqacPageData> {
  const fallback = fallbackPage();

  try {
    const [record, committeeList] = await Promise.all([
      getJson<IqacApiRecord | null>("/iqac"),
      getJson<IqacApiCommitteeMember[]>("/iqac/committee").catch((error) => {
        console.error("[IQAC] Committee request failed:", error);
        return null;
      }),
    ]);
    if (!record) throw new Error("IQAC API returned no data");

    const about = splitRich(record.about);
    const message = splitRich(record.directorMessage);
    const objectives = parseList(record.objectives);
    const members = Array.isArray(committeeList)
      ? committeeList
      : (record.committeeMembers ?? []);

    const committee = members
      .filter((m) => m.status !== false)
      .sort((a, b) => (a.iqacOrder ?? 0) - (b.iqacOrder ?? 0))
      .flatMap((m) => {
        const person = toPerson(m.teacher);
        return person ? [{ ...person, role: m.designation }] : [];
      });

    const hasMessage = Boolean(message.html || message.paragraphs.length);

    return {
      title: record.title?.trim() || fallback.title,
      subtitle: record.subtitle?.trim() || fallback.subtitle,
      aboutHtml: about.html,
      about: about.html ? [] : about.paragraphs.length ? about.paragraphs : fallback.about,
      vision: record.vision?.trim() || fallback.vision,
      mission: record.mission?.trim() || fallback.mission,
      objectives: objectives.length ? objectives : fallback.objectives,
      director: toPerson(record.director),
      directorMessageHtml: message.html,
      directorMessage: hasMessage ? message.paragraphs : fallback.directorMessage,
      committee,
    };
  } catch (error) {
    console.error("[IQAC] Falling back to static content:", error);
    return fallback;
  }
}

/**
 * IQAC has no activity/gallery API of its own, so both reuse the admin's
 * existing Events and Gallery entities and pick out IQAC rows by a prefix:
 * an Event with Category "IQAC Workshop", or a Gallery item with Type
 * "iqac-workshop". Whatever follows the prefix becomes the tab/filter label,
 * so admins can add new kinds (e.g. "IQAC Conference") without a code change.
 */
const IQAC_PREFIX = /^iqac[\s:_-]+(.+)$/i;

function iqacKind(value: string | null | undefined): string | null {
  const match = value?.trim().match(IQAC_PREFIX);
  if (!match) return null;
  return match[1]
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function stripHtml(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Formatted here, on the server, so the client never formats a Date and
// can't hit a hydration mismatch from a different locale/timezone.
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Dhaka",
});

export async function getIqacActivities(): Promise<IqacActivityItem[]> {
  const { events, error } = await getEvents();
  if (error) {
    return content.activities.map((a) => ({ ...a, image: null, href: null }));
  }

  return events
    .flatMap((event) => {
      const type = iqacKind(event.category);
      if (!type) return [];
      const start = new Date(event.startDateTime);
      const item: IqacActivityItem = {
        title: event.title,
        date: Number.isNaN(start.getTime()) ? "" : DATE_FORMAT.format(start),
        type,
        description: stripHtml(event.description),
        image: event.coverImageUrl || null,
        href: `/events/${event.slug}`,
      };
      return [{ item, time: start.getTime() || 0 }];
    })
    .sort((a, b) => b.time - a.time)
    .map(({ item }) => item);
}

interface ApiGalleryItem {
  title: string;
  imageUrl: string | null;
  types: string | null;
  status: boolean;
}

export async function getIqacGallery(): Promise<IqacGalleryPhoto[]> {
  try {
    const items = await getJson<ApiGalleryItem[]>("/galleries/active");
    return (Array.isArray(items) ? items : []).flatMap((item) => {
      const category = iqacKind(item.types);
      const image = getMediaUrl(item.imageUrl);
      return category && image && item.status !== false
        ? [{ category, title: item.title, image }]
        : [];
    });
  } catch (error) {
    console.error("[IQAC] Gallery request failed:", error);
    return [];
  }
}
