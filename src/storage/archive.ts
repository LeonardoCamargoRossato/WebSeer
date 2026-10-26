import {announceChange,openDatabase,operation} from './database';
import type {ActiveCorpus} from '../types/corpus';
import {listPdfs} from './pdfStore';
export type Tool='dashboard'|'compare'|'wordTree'|'phraseNet'|'frequencies'|'wordCloud'|'animatedHistogram'|'general';
export type Inputs=Record<string,string|number|boolean|string[]>;
export type ArchiveDocument={id:string;name:string;sourceType:ActiveCorpus['sourceType'];original:Blob;originalName:string;createdAt:string;updatedAt:string;currentSnapshotId:string};
export type Snapshot={id:string;documentId:string;corpus:ActiveCorpus};
export type ResearchRun={id:string;documentId:string;snapshotId:string;tool:Exclude<Tool,'general'>;inputs:Inputs;createdAt:string};
export type Report={id:string;documentId:string;snapshotId:string;runId?:string;tool:Tool;version:number;createdAt:string;inputs:Inputs;data:unknown;visual?:Blob;visualName?:string;relatedReportIds?:string[];formatVersion:1};
export const getDocuments=()=>operation<ArchiveDocument[]>('documents','readonly',s=>s.getAll());
export const getSnapshot=(id:string)=>operation<Snapshot|undefined>('snapshots','readonly',s=>s.get(id));
export const getRuns=()=>operation<ResearchRun[]>('runs','readonly',s=>s.getAll());
export const getReports=()=>operation<Report[]>('reports','readonly',s=>s.getAll());
export const getDocument=(id:string)=>operation<ArchiveDocument|undefined>('documents','readonly',s=>s.get(id));
async function hash(blob:Blob){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())),x=>x.toString(16).padStart(2,'0')).join('')}
export async function archiveCorpus(corpus:ActiveCorpus){
 if(corpus.archive)return corpus.archive;
 const original=corpus.sourceFile??new Blob([corpus.rawText],{type:'text/plain;charset=utf-8'});
 const documentId=`${corpus.sourceFile?'file':'text'}-${await hash(original)}`;
 const {sourceFile:_,archive:__,...content}=corpus;
 // Document IDs and timestamps do not affect the extraction revision hash.
 const signature={text:corpus.rawText,pages:corpus.documents.map(d=>d.text),metadata:corpus.metadata};
 const snapshotId=`${documentId}-${await hash(new Blob([JSON.stringify(signature)]))}`;
 const refs={documentId,snapshotId};
 const db=await openDatabase();await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction(['documents','snapshots'],'readwrite'),docs=tx.objectStore('documents');const request=docs.get(documentId);let failure:unknown;
  request.onsuccess=()=>{try{const existing=request.result as ArchiveDocument|undefined;
   docs.put({id:documentId,name:corpus.name,sourceType:corpus.sourceType,original:existing?.original??original,originalName:existing?.originalName??(corpus.sourceFile?corpus.name:`${corpus.name}.txt`),createdAt:existing?.createdAt??corpus.createdAt,updatedAt:new Date().toISOString(),currentSnapshotId:snapshotId} satisfies ArchiveDocument);
   tx.objectStore('snapshots').put({id:snapshotId,documentId,corpus:{...content,archive:refs}} satisfies Snapshot);
  }catch(error){failure=error;tx.abort()}};
  tx.oncomplete=()=>{db.close();announceChange();resolve()};tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error)};
 });return refs;
}
export async function saveRun(corpus:ActiveCorpus,tool:ResearchRun['tool'],inputs:Inputs){const refs=await archiveCorpus(corpus);const run:ResearchRun={id:crypto.randomUUID(),...refs,tool,inputs:structuredClone(inputs),createdAt:new Date().toISOString()};await operation('runs','readwrite',s=>s.put(run));return run}
export async function saveReport(corpus:ActiveCorpus,tool:Tool,inputs:Inputs,data:unknown,visual?:Blob,runId?:string,relatedReportIds?:string[]){
 const refs=await archiveCorpus(corpus);const db=await openDatabase();
 // Count and insert within a single transaction so concurrent tabs cannot reuse a version.
 return new Promise<Report>((resolve,reject)=>{
  const tx=db.transaction('reports','readwrite'),store=tx.objectStore('reports'),request=store.getAll();let report:Report;let failure:unknown;
  request.onsuccess=()=>{try{const prior=request.result as Report[];report={id:crypto.randomUUID(),...refs,tool,version:Math.max(0,...prior.filter(r=>r.documentId===refs.documentId&&r.tool===tool).map(r=>r.version))+1,createdAt:new Date().toISOString(),inputs:structuredClone(inputs),data:structuredClone(data),visual,visualName:visual?`visualization.${visual.type==='image/png'?'png':visual.type==='image/gif'?'gif':visual.type==='video/mp4'?'mp4':'svg'}`:undefined,runId,relatedReportIds,formatVersion:1};store.add(report)}catch(error){failure=error;tx.abort()}};
  tx.oncomplete=()=>{db.close();announceChange();resolve(report)};tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error)};
 });
}
export async function migrateSavedPdfs(){
 const [pdfs,existing]=await Promise.all([listPdfs(),getDocuments()]);const known=new Set(existing.map(d=>d.id));
 for(const pdf of pdfs){const key=`file-${await hash(pdf.file)}`;if(known.has(key))continue;const corpus:ActiveCorpus={id:crypto.randomUUID(),name:pdf.name,sourceType:'pdf',sourceFile:pdf.file,rawText:pdf.pages.join('\n\n'),documents:pdf.pages.map((text,i)=>({id:crypto.randomUUID(),title:`${pdf.name} — ${i+1}`,text,pageNumber:i+1})),pageCount:pdf.pages.length,metadata:pdf.metadata,createdAt:pdf.savedAt};await archiveCorpus(corpus);known.add(key)}
}
