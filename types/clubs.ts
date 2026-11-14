export interface ClubSocialLink {
  title: string;
  url: string;
}

export interface ClubDepartment {
  name: string;
  /** "CSE" — null when the API has no short name. */
  shortName: string | null;
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
  department: ClubDepartment | null;
  socialLinks: ClubSocialLink[];
}

export interface ClubActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  location: string | null;
  /** Pre-formatted on the server ("20 Sep 2026"), never re-formatted client-side. */
  date: string;
  coverImage: string | null;
  url: string | null;
}

export interface ClubDetail {
  club: Club;
  activities: ClubActivity[];
}
