import type { IconName } from "@/lib/icons";

/**--------------- Hero section ------------------ */

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

/** Generic API response envelope */
export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

/** Hero slider (from /home/sliders API) */
export interface HeroSliderItem {
  id: number;
  heading: string;
  subheading: string | null;
  image: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

/**--------------- Hero section ------------------ */

/** Notice marquee */
// export type NoticeColor = "destructive" | "accent" | "secondary";

// export interface Notice {
//   type: string;
//   icon: IconName;
//   text: string;
//   color: NoticeColor;
// }

/** Home notices (from /home/notices API) */
export interface NoticeItem {
  id: number;
  title: string;
  badgeLabel: string | null;
  badgeColor: string | null;
  icon: IconName | null;
  category: string | null;
  noticeDate: string;
  isActive: boolean;
  isHome: boolean;
  sortOrder: number;
}

/** Home notices (from /home/notices API) */




/** VC message */
// export interface VCMessageContent {
//   name: string;
//   title: string;
//   message: string;
//   photo: string;
// }


/** Vice Chancellor (from /home/vc API) */
export interface VCInfo {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  office: string | null;
  designation: string | null;
  shortBio: string | null;
  googleScholarUrl: string | null;
  researchgateUrl: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
}
/** Vice Chancellor (from /home/vc API) */




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

/** Faculty (from /home/faculties API) */
export interface FacultyDepartment {
  id: number;
  name: string;
  shortName: string | null;
  slug: string;
}
export interface FacultyDean {
  id: number;
  name: string;
  designation: string | null;
  imageUrl: string | null;
}

export interface FacultyItem {
  id: number;
  name: string;
  slug: string;
  about: string | null;
  dean: FacultyDean | null;
  departments: FacultyDepartment[];
}
/** Faculty (from /home/faculties API) */


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



