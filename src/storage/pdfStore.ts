import {operation} from './database';
import type {DocumentMetadata,PdfReadOptions} from '../utils/pdfExtractor';
export type StoredPdf = {id:string; name:string; file:Blob; pages:string[]; savedAt:string; metadata?:DocumentMetadata; options?:PdfReadOptions};
export const savePdf=(pdf:StoredPdf)=>operation('pdfs','readwrite',store=>store.put(pdf));
export const listPdfs=()=>operation('pdfs','readonly',store=>store.getAll()) as Promise<StoredPdf[]>;
export const deletePdf=(id:string)=>operation('pdfs','readwrite',store=>store.delete(id));
