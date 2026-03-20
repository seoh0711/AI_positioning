export interface DualText {
  ko: string;
  en: string;
}

export interface EbookChapter {
  title: DualText;
  content: DualText;
  page_range: string;
}

export interface EbookContent {
  title: DualText;
  subtitle: DualText;
  chapters: EbookChapter[];
  total_pages: number;
  preview_note: DualText;
}
