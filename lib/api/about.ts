import { publicFetch } from "@/lib/server-fetch";
import { getMediaUrl } from "@/lib/utils/media";
import heroData from "@/content/about/hero.json";
import mainContentData from "@/content/about/main-content.json";
import foundationData from "@/content/about/foundation.json";
import campusBannerData from "@/content/about/campus-banner.json";
import type {
  AboutHeroContent,
  AboutMainContent,
  AboutUniversity,
  CampusBannerContent,
  FoundationContent,
} from "@/types/about";

/**
 * The static JSON the page shipped with, reshaped into the API record so
 * the page still renders if `/about` is down or not seeded yet.
 */
function fallbackAbout(): AboutUniversity {
  const hero = heroData as AboutHeroContent;
  const main = mainContentData as AboutMainContent;
  const foundation = foundationData as FoundationContent;
  const banner = campusBannerData as CampusBannerContent;
  const card = (key: string) => foundation.cards.find((c) => c.key === key);

  return {
    bannerImage: hero.image,
    badge: hero.badge,
    title: `${hero.title} ${hero.titleAccent}`,
    subtitle: hero.subtitle,
    heading: main.heading,
    description: main.paragraphs.join("\n\n"),
    highlightQuote: main.pullquote,
    quickFacts: main.quickFacts,
    campusImage: main.campusImage,
    campusLocation: main.campusCaption.replace(/^📍\s*/u, ""),
    ctaTitle: main.ctaTitle,
    ctaSubtitle: main.ctaDescription,
    ctaButtonText: main.ctaButtonText,
    ctaButtonLink: main.ctaHref,
    visionTitle: card("vision")?.title ?? "",
    vision: card("vision")?.description ?? "",
    missionTitle: card("mission")?.title ?? "",
    mission: card("mission")?.description ?? "",
    strategyTitle: card("strategy")?.title ?? "",
    strategy: card("strategy")?.description ?? "",
    valuesTitle: card("values")?.title ?? "",
    valuesDescription: card("values")?.description ?? "",
    valuesPoints: card("values")?.values ?? [],
    bottomBannerImage: banner.image,
    bottomBannerText: `${banner.quotePrefix} ${banner.quoteAccent} ${banner.quoteSuffix}`,
  };
}

/** `quickFacts`/`valuesPoints` are sent as JSON strings on create, so accept either form back. */
function parseArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function getAboutUniversity(): Promise<AboutUniversity> {
  const fallback = fallbackAbout();

  try {
    const res = await publicFetch.get("/about", {
      next: { revalidate: 300, tags: ["about-university"] },
    });
    if (!res.ok) throw new Error(`About request failed (${res.status})`);

    const payload = await res.json();
    const data = payload?.data as Partial<AboutUniversity> | null | undefined;
    if (!payload?.success || !data) {
      throw new Error("About API returned no data");
    }

    // Field-by-field so one blank column doesn't blank a whole section.
    const pick = <K extends keyof AboutUniversity>(key: K) =>
      (data[key] || fallback[key]) as AboutUniversity[K];
    const quickFacts = parseArray<AboutUniversity["quickFacts"][number]>(
      data.quickFacts,
    );
    const valuesPoints = parseArray<string>(data.valuesPoints);

    return {
      ...fallback,
      ...Object.fromEntries(
        (Object.keys(fallback) as (keyof AboutUniversity)[]).map((key) => [
          key,
          pick(key),
        ]),
      ),
      quickFacts: quickFacts.length ? quickFacts : fallback.quickFacts,
      valuesPoints: valuesPoints.length ? valuesPoints : fallback.valuesPoints,
      bannerImage: getMediaUrl(data.bannerImage) ?? fallback.bannerImage,
      campusImage: getMediaUrl(data.campusImage) ?? fallback.campusImage,
      bottomBannerImage:
        getMediaUrl(data.bottomBannerImage) ?? fallback.bottomBannerImage,
    } as AboutUniversity;
  } catch (error) {
    console.error("[About] Falling back to static content:", error);
    return fallback;
  }
}
