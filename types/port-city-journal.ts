export interface JournalArticle {
  title: string;
  authors: string;
  /** A start page from the JSON archive, or a range like "23-45" from the API. */
  page: number | string;
  link?: string | null;
}

export interface JournalVolumeSection {
  name: string;
  articles: JournalArticle[];
}

export interface JournalVolume {
  id: string;
  title: string;
  year?: string;
  intro?: string;
  sections: JournalVolumeSection[];
}

export interface PortCityJournalContent {
  intro: string;
  contactEmail: string;
  contactPhone: string;
  volumes: JournalVolume[];
}

/** Rows as the API returns them. */
export interface PcjApiVolume {
  id: number;
  volumeNumber?: number | null;
  issueNumber?: number | null;
  publicationDate?: string | null;
  description?: string | null;
  status?: boolean | null;
}

export interface PcjApiArticle {
  id: number;
  volumeId?: number | null;
  title?: string | null;
  authors?: string | null;
  pages?: string | null;
  doi?: string | null;
  pdfUrl?: string | null;
  displayOrder?: number | null;
  status?: boolean | null;
  department?: { name?: string | null } | null;
}
