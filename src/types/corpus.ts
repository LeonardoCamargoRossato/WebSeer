import type {DocumentMetadata} from '../utils/pdfExtractor';
export type CorpusSourceType = 'text' | 'txt' | 'pdf' | 'md' | 'docx';

export interface CorpusDocument {
  id: string;
  title: string;
  text: string;
  pageNumber?: number;
}

export interface ActiveCorpus {
  archive?: {documentId:string;snapshotId:string};
  sourceFile?: Blob;
  id: string;
  name: string;
  sourceType: CorpusSourceType;
  rawText: string;
  documents: CorpusDocument[];
  metadata?: DocumentMetadata;
  pageCount?: number;
  createdAt: string;
}
