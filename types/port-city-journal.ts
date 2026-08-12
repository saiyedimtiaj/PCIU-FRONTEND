export interface JournalArticle {
  title: string;
  authors: string;
  page: number;
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
