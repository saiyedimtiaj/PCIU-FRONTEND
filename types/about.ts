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
