export interface VCEducationEntry {
  degree: string;
  field: string;
}

export interface VCMessagePageContent {
  photo: string;
  name: string;
  title: string;
  institution: string;
  education: VCEducationEntry[];
  paragraphs: string[];
}
