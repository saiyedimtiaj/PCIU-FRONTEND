import type { IconName } from "@/lib/icons";

export interface AboutHeroContent {
  image: string;
  badge: string;
  title: string;
  titleAccent: string;
  subtitle: string;
}

export interface QuickFact {
  icon: IconName;
  value: string;
  label: string;
}

export interface AboutMainContent {
  heading: string;
  paragraphs: string[];
  pullquote: string;
  quickFacts: QuickFact[];
  campusImage: string;
  campusCaption: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaHref: string;
}

export interface FoundationCard {
  key: "vision" | "mission" | "strategy" | "values";
  icon: IconName;
  title: string;
  description: string;
  values?: string[];
}

export interface FoundationContent {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  cards: FoundationCard[];
}

export interface CampusBannerContent {
  image: string;
  quotePrefix: string;
  quoteAccent: string;
  quoteSuffix: string;
}

/**
 * Shape of `GET /about` — a single record holding every section of the
 * About the University page. `quickFacts[].icon` is a PascalCase lucide
 * name ("GraduationCap"), not an `IconName` key; `description` separates
 * paragraphs with blank lines.
 */
export interface AboutUniversity {
  bannerImage: string;
  badge: string;
  title: string;
  subtitle: string;
  heading: string;
  description: string;
  highlightQuote: string;
  quickFacts: { icon: string; label: string; value: string }[];
  campusImage: string;
  campusLocation: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  visionTitle: string;
  vision: string;
  missionTitle: string;
  mission: string;
  strategyTitle: string;
  strategy: string;
  valuesTitle: string;
  valuesDescription: string;
  valuesPoints: string[];
  bottomBannerImage: string;
  bottomBannerText: string;
}
