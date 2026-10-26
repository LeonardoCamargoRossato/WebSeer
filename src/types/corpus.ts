export type CorpusSourceType = 'text' | 'txt' | 'pdf';

export interface CorpusDocument {
  id: string;
  title: string;
  text: string;
  pageNumber?: number;
}

export interface ActiveCorpus {
  id: string;
  name: string;
  sourceType: CorpusSourceType;
  rawText: string;
  documents: CorpusDocument[];
  pageCount?: number;
  createdAt: string;
}
