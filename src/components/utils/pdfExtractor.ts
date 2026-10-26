import * as pdfjs from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export type PdfExtractionProgress = {page:number; totalPages:number; percent:number};
export type PdfExtractionResult = {pages:string[]; pageCount:number; rawText:string};

export async function extractPdfText(file:File,onProgress?:(progress:PdfExtractionProgress)=>void):Promise<PdfExtractionResult>{
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({data:bytes}).promise;
  const pages:string[]=[];

  for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const parts = content.items
      .map(item=>'str' in item ? item.str : '')
      .filter(Boolean);
    const text = parts.join(' ').replace(/\s+/g,' ').trim();
    pages.push(text);
    onProgress?.({
      page:pageNumber,
      totalPages:pdf.numPages,
      percent:Math.round((pageNumber/pdf.numPages)*100)
    });
    // Give React/the browser a chance to paint progress on very large PDFs.
    if(pageNumber % 8 === 0) await new Promise<void>(resolve=>setTimeout(resolve,0));
  }

  return {pages,pageCount:pdf.numPages,rawText:pages.join('\n\n')};
}
