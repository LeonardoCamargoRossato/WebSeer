import * as pdfjs from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {reconstructPdfText,removeRepeatedMargins} from './pdfText';
pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl;
export type PdfExtractionProgress={page:number;totalPages:number;percent:number};
export type PdfReadOptions={mode:'layout'|'literal';removeMargins:boolean};
export type DocumentMetadata={author?:string;title?:string;keywords?:string;outline?:string[];tagged?:boolean;converter?:string;emptyPages?:number[];version?:number};
export type PdfExtractionResult={pages:string[];pageCount:number;rawText:string;metadata:DocumentMetadata};
export const EXTRACTION_VERSION=2;
let extractionQueue:Promise<unknown>=Promise.resolve();
export function extractPdfText(file:File,onProgress?:(progress:PdfExtractionProgress)=>void,options:PdfReadOptions={mode:'layout',removeMargins:false},signal?:AbortSignal):Promise<PdfExtractionResult>{
 const run=extractionQueue.catch(()=>{}).then(()=>extractSequential(file,onProgress,options,signal));extractionQueue=run.then(()=>undefined,()=>undefined);return run;
}
async function extractSequential(file:File,onProgress:((progress:PdfExtractionProgress)=>void)|undefined,options:PdfReadOptions,signal?:AbortSignal):Promise<PdfExtractionResult>{
 const check=()=>{if(signal?.aborted)throw new DOMException('Conversão cancelada / Conversion canceled','AbortError')};check();
 const bytes=new Uint8Array(await file.arrayBuffer());check();
 const task=pdfjs.getDocument({data:bytes,disableFontFace:true});let destroying:Promise<void>|undefined;const destroy=()=>destroying??(destroying=task.destroy());const abort=()=>{void destroy().catch(()=>{})};signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
 try{
  const pdf=await task.promise;let pages:string[]=[];const emptyPages:number[]=[];
  for(let n=1;n<=pdf.numPages;n++){
   check();const page=await pdf.getPage(n);
   try{
    const content=await page.getTextContent();check();
    const text=reconstructPdfText(content.items.filter(item=>'str' in item),options.mode);
    pages.push(text);if(!text.trim())emptyPages.push(n);
   }catch(error){throw new Error(`PDF page ${n}: ${error instanceof Error?error.message:String(error)}`)}finally{page.cleanup()}
   onProgress?.({page:n,totalPages:pdf.numPages,percent:Math.round(n/pdf.numPages*100)});
   await new Promise<void>(resolve=>setTimeout(resolve,0));
  }
  if(options.removeMargins)pages=removeRepeatedMargins(pages);
  const metadata:DocumentMetadata={converter:`PDF.js / ${options.mode}`,emptyPages,version:EXTRACTION_VERSION};
  try{const {info}=await pdf.getMetadata();const data=info as Record<string,unknown>;for(const [key,field]of [['Author','author'],['Title','title'],['Keywords','keywords']] as const)if(typeof data[key]==='string')metadata[field]=data[key];metadata.tagged=Boolean((data.MarkInfo as {Marked?:boolean}|undefined)?.Marked)}catch{/* Optional metadata must not block conversion. */}
  try{const outline=await pdf.getOutline();const titles:string[]=[];const walk=(nodes:NonNullable<typeof outline>)=>{for(const node of nodes){titles.push(node.title);walk(node.items)}};if(outline)walk(outline);metadata.outline=titles}catch{/* Optional bookmarks. */}
  check();return{pages,pageCount:pages.length,rawText:pages.join('\n\n'),metadata};
 }finally{signal?.removeEventListener('abort',abort);await destroy()}
}
