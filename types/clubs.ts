export interface ClubSocialLink {
  title: string;
  url: string;
}

/** A club as the public pages render it. */
export interface Club {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  bannerImage: string | null;
  website: string | null;
  department: string | null;
  socialLinks: ClubSocialLink[];
}

export interface ClubActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  /** Pre-formatted on the server ("20 Sep 2026"), never re-formatted client-side. */
  date: string;
  coverImage: string | null;
  url: string | null;
}

export interface ClubDetail {
  club: Club;
  activities: ClubActivity[];
}
