import {operation,openDatabase} from './database';
import type {DocumentMetadata,PdfReadOptions} from '../utils/pdfExtractor';
export type StoredPdf = {documentId?:string;id:string; name:string; file:Blob; pages:string[]; savedAt:string; metadata?:DocumentMetadata; options?:PdfReadOptions};
export const savePdf=(pdf:StoredPdf)=>operation('pdfs','readwrite',store=>store.put(pdf));
export const listPdfs=()=>operation('pdfs','readonly',store=>store.getAll()) as Promise<StoredPdf[]>;
export const deletePdf=(id:string)=>operation('pdfs','readwrite',store=>store.delete(id));
export type StoredPdfSummary=Omit<StoredPdf,'pages'>;
/** Lists don't retain extracted text from every PDF in memory. */
export async function listPdfSummaries():Promise<StoredPdfSummary[]>{const db=await openDatabase();return new Promise((resolve,reject)=>{const items:StoredPdfSummary[]=[];const tx=db.transaction('pdfs','readonly'),cursor=tx.objectStore('pdfs').openCursor();cursor.onsuccess=()=>{const row=cursor.result;if(!row)return;const {pages:_,...summary}=row.value as StoredPdf;items.push(summary);row.continue()};tx.oncomplete=()=>{db.close();resolve(items)};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error)}})}
export const getPdf=(id:string)=>operation<StoredPdf|undefined>('pdfs','readonly',store=>store.get(id));
