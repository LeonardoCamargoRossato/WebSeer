import * as pdfjs from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {reconstructPdfText,removeRepeatedMargins} from './pdfText';
pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl;
export type PdfExtractionProgress={page:number;totalPages:number;percent:number};
export type PdfReadOptions={mode:'layout'|'literal';removeMargins:boolean};
export type DocumentMetadata={author?:string;title?:string;keywords?:string;outline?:string[];tagged?:boolean;converter?:string;emptyPages?:number[];version?:number};
export type PdfExtractionResult={pages:string[];pageCount:number;rawText:string;metadata:DocumentMetadata};
export const EXTRACTION_VERSION=2;
export async function extractPdfText(file:File,onProgress?:(progress:PdfExtractionProgress)=>void,options:PdfReadOptions={mode:'layout',removeMargins:false}):Promise<PdfExtractionResult>{
 const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())});
 try{
  const pdf=await task.promise;let pages:string[]=[];const emptyPages:number[]=[];
  for(let n=1;n<=pdf.numPages;n++){
   try{
    const page=await pdf.getPage(n);const content=await page.getTextContent();
    const text=reconstructPdfText(content.items.filter(item=>'str' in item),options.mode);
    pages.push(text);if(!text.trim())emptyPages.push(n);page.cleanup();
   }catch(error){throw new Error(`PDF page ${n}: ${error instanceof Error?error.message:String(error)}`)}
   onProgress?.({page:n,totalPages:pdf.numPages,percent:Math.round(n/pdf.numPages*100)});
   if(n%4===0)await new Promise<void>(resolve=>setTimeout(resolve,0));
  }
  if(options.removeMargins)pages=removeRepeatedMargins(pages);
  const metadata:DocumentMetadata={converter:`PDF.js / ${options.mode}`,emptyPages,version:EXTRACTION_VERSION};
  try{const {info}=await pdf.getMetadata();const data=info as Record<string,unknown>;for(const [key,field]of [['Author','author'],['Title','title'],['Keywords','keywords']] as const)if(typeof data[key]==='string')metadata[field]=data[key];metadata.tagged=Boolean((data.MarkInfo as {Marked?:boolean}|undefined)?.Marked)}catch{/* Optional metadata must not block conversion. */}
  try{const outline=await pdf.getOutline();const titles:string[]=[];const walk=(nodes:NonNullable<typeof outline>)=>{for(const node of nodes){titles.push(node.title);walk(node.items)}};if(outline)walk(outline);metadata.outline=titles}catch{/* Optional bookmarks. */}
  return{pages,pageCount:pages.length,rawText:pages.join('\n\n'),metadata};
 }finally{await task.destroy()}
}
