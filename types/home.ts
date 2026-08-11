import type { IconName } from "@/lib/icons";

/** Hero */
export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

export interface HeroStat {
  icon: IconName;
  value: string;
  label: string;
}

export interface HeroContent {
  slides: HeroSlide[];
  stats: HeroStat[];
}

/** Notice marquee */
export type NoticeColor = "destructive" | "accent" | "secondary";

export interface Notice {
  type: string;
  icon: IconName;
  text: string;
  color: NoticeColor;
}

/** VC message */
export interface VCMessageContent {
  name: string;
  title: string;
  message: string;
  photo: string;
}

/** Program finder */
export interface Program {
  title: string;
  degree: string;
  level: "Undergraduate" | "Graduate";
  duration: string;
  faculty: string;
  description: string;
  href: string;
}

/** Faculties */
export interface Faculty {
  id: string;
  icon: IconName;
  name: string;
  description: string;
  departments: string[];
  bg: string;
}

/** Admissions */
export interface AdmissionCard {
  icon: IconName;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant: "highlight" | "accent";
}

export interface AdmissionsContent {
  badge: string;
  heading: string;
  subheading: string;
  cards: AdmissionCard[];
  tuitionNote: string;
  tuitionButtonText: string;
}

/** Research */
export interface ResearchStat {
  icon: IconName;
  value: string;
  label: string;
}

export interface ResearchHighlight {
  title: string;
  description: string;
  tags: string[];
}

export interface ResearchContent {
  image: string;
  stats: ResearchStat[];
  highlights: ResearchHighlight[];
}

/** Photo gallery */
export interface GalleryItem {
  src: string;
  title: string;
  category: string;
  story: string;
}

/** Campus life */
export interface CampusActivity {
  icon: IconName;
  title: string;
  description: string;
}

export interface CampusLifeContent {
  libraryImage: string;
  sportsImage: string;
  activities: CampusActivity[];
}

/** News & events */
export interface NewsItem {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  link: string;
}

export interface EventItem {
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
}

export interface NewsEventsContent {
  news: NewsItem[];
  events: EventItem[];
}
