import { publicFetch } from "@/lib/server-fetch";
import { getMediaUrl } from "@/lib/utils/media";
import { iconMap, type IconName } from "@/lib/icons";
import pageData from "@/content/research/page.json";
import journalData from "@/content/research/port-city-journal.json";
import type {
  JournalVolume,
  PcjApiArticle,
  PcjApiVolume,
  PortCityJournalContent,
} from "@/types/port-city-journal";
import type {
  ResearchApiArea,
  ResearchApiMou,
  ResearchApiPartner,
  ResearchApiPublication,
  ResearchArea,
  ResearchMou,
  ResearchPageContent,
  ResearchPartnership,
  ResearchPublication,
} from "@/types/research";

const content = pageData as ResearchPageContent;

const CACHE = { next: { revalidate: 60, tags: ["research"] } };

/**
 * GETs one public `/…/active` list. `null` means the API could not be
 * reached (or answered with an error) — distinct from an empty list, which
 * is a real answer and renders as "nothing here yet" rather than demo data.
 */
async function getActive<T>(path: string): Promise<T[] | null> {
  try {
    const res = await publicFetch.get(path, CACHE);
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: unknown };
    const data = body.data;
    if (Array.isArray(data)) return data as T[];
    // Paginated shape: { data: { items|data: [...] , pagination } }
    if (data && typeof data === "object") {
      const list = Object.values(data).find(Array.isArray);
      if (list) return list as T[];
    }
    return [];
  } catch {
    return null;
  }
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const byOrder = (a: { displayOrder?: number | null }, b: { displayOrder?: number | null }) =>
  (a.displayOrder ?? 0) - (b.displayOrder ?? 0);

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // Formatted on the server, so the client never re-formats and can't mismatch.
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });
}

function toArea(row: ResearchApiArea): ResearchArea | null {
  const title = text(row.title);
  if (!title) return null;
  const key = text(row.icon).toLowerCase();
  return {
    title,
    icon: key in iconMap ? (key as IconName) : "microscope",
    color: text(row.backgroundColor),
  };
}

function toPublication(row: ResearchApiPublication): ResearchPublication | null {
  const title = text(row.title);
  if (!title) return null;
  return {
    title,
    authors: text(row.authors),
    year: Number(row.year) || 0,
    type: text(row.type),
    venue: text(row.venue),
    department: text(row.department?.shortName) || text(row.department?.name),
    link: text(row.externalLink) || getMediaUrl(row.pdfFile),
  };
}

function toPartner(row: ResearchApiPartner): ResearchPartnership | null {
  const name = text(row.name);
  if (!name) return null;
  return {
    name,
    country: text(row.country),
    type: text(row.category),
    logo: getMediaUrl(row.logo),
    website: text(row.websiteUrl) || null,
  };
}

function toMou(row: ResearchApiMou, partners: Map<number, string>): ResearchMou | null {
  const partner =
    text(row.partner?.name) || (row.partnerId != null ? partners.get(row.partnerId) ?? "" : "");
  const scope = text(row.scopeOfCollaboration);
  if (!partner && !scope) return null;
  return {
    partner,
    date: formatDate(row.dateSigned),
    scope,
    document: getMediaUrl(row.documentPdf),
  };
}

const compact = <T>(list: (T | null)[]) => list.filter((item): item is T => item !== null);

/**
 * The /research page's tabs, live from the API. Each section falls back to
 * the static JSON only when its own request fails. Research centres have no
 * API route at all, so they always come from the JSON.
 */
export async function getResearchPage(): Promise<ResearchPageContent> {
  const [areas, publications, partners, mous] = await Promise.all([
    getActive<ResearchApiArea>("/research-areas/active"),
    getActive<ResearchApiPublication>("/research-publications/active"),
    getActive<ResearchApiPartner>("/partners/active"),
    getActive<ResearchApiMou>("/mous/active"),
  ]);

  const partnerNames = new Map((partners ?? []).map((p) => [p.id, text(p.name)]));

  return {
    centres: content.centres,
    areas: areas ? compact([...areas].sort(byOrder).map(toArea)) : content.areas,
    publications: publications
      ? compact(publications.map(toPublication)).sort((a, b) => b.year - a.year)
      : content.publications,
    partnerships: partners ? compact([...partners].sort(byOrder).map(toPartner)) : content.partnerships,
    mous: mous ? compact(mous.map((m) => toMou(m, partnerNames))) : content.mous,
  };
}

const journal = journalData as PortCityJournalContent;

function doiUrl(doi: string | null | undefined): string | null {
  const id = text(doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  return id ? `https://doi.org/${id}` : null;
}

/** `/pcj/*` has no `/active` route, so the list includes switched-off rows. */
const isActive = (row: { status?: boolean | null }) => row.status !== false;

function toVolumes(volumes: PcjApiVolume[], articles: PcjApiArticle[]): JournalVolume[] {
  return [...volumes]
    .sort(
      (a, b) =>
        (b.volumeNumber ?? 0) - (a.volumeNumber ?? 0) || (b.issueNumber ?? 0) - (a.issueNumber ?? 0)
    )
    .map((volume) => {
      // Articles are grouped under their department, the way the printed
      // journal groups them by subject.
      const sections = new Map<string, JournalVolume["sections"][number]>();
      for (const article of articles
        .filter((a) => a.volumeId === volume.id && text(a.title))
        .sort(byOrder)) {
        const name = text(article.department?.name) || "Articles";
        const section = sections.get(name) ?? { name, articles: [] };
        section.articles.push({
          title: text(article.title),
          authors: text(article.authors),
          page: text(article.pages),
          link: getMediaUrl(article.pdfUrl) || doiUrl(article.doi),
        });
        sections.set(name, section);
      }

      const year = volume.publicationDate ? new Date(volume.publicationDate).getFullYear() : NaN;
      return {
        id: `pcj-${volume.id}`,
        title: `Journal (Volume ${volume.volumeNumber ?? "?"}, Issue ${volume.issueNumber ?? "?"})`,
        year: Number.isNaN(year) ? undefined : String(year),
        intro: text(volume.description) || undefined,
        sections: [...sections.values()],
      };
    });
}

/**
 * The journal archive, live from the API once any volume exists there. Until
 * then the JSON's back-issue archive stays up, so the page never goes blank.
 */
export async function getJournalPage(): Promise<PortCityJournalContent> {
  const [volumes, articles] = await Promise.all([
    getActive<PcjApiVolume>("/pcj/volumes"),
    getActive<PcjApiArticle>("/pcj/articles"),
  ]);
  const live = volumes?.filter(isActive) ?? [];
  if (!live.length) return journal;
  return { ...journal, volumes: toVolumes(live, (articles ?? []).filter(isActive)) };
}
