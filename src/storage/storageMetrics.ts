import {openDatabase} from './database';
import {emptyUsage,payloadBytes,type ContentUsage} from './storageSizes';
export {formatBytes,payloadBytes,emptyUsage,type ContentUsage} from './storageSizes';
export type LibraryUsage={documents:Record<string,ContentUsage>;videos:Record<string,ContentUsage>;total:number};
export async function libraryUsage():Promise<LibraryUsage>{
 const db=await openDatabase();const result:LibraryUsage={documents:{},videos:{},total:0};const docs=new Map<string,{name:string;size:number}>(),caches:{documentId?:string;id:string;name:string;size:number;bytes:number}[]=[];
 const doc=(id:string)=>result.documents[id]??(result.documents[id]=emptyUsage());const video=(id:string)=>result.videos[id]??(result.videos[id]=emptyUsage());
 try{
  // Cursor reads bound retained memory to one record, including legacy databases.
  for(const storeName of ['documents','snapshots','runs','reports','videoDrafts','pdfs'])await new Promise<void>((resolve,reject)=>{const tx=db.transaction(storeName,'readonly'),cursor=tx.objectStore(storeName).openCursor();cursor.onsuccess=()=>{const row=cursor.result;if(!row)return;const item=row.value;const bytes=payloadBytes(item);result.total+=bytes;
   if(storeName==='documents'){docs.set(item.id,{name:item.name,size:item.original?.size??0});const usage=doc(item.id);usage.original+=item.original?.size??0;usage.draft+=Math.max(0,bytes-(item.original?.size??0));usage.total+=bytes}
   if(storeName==='snapshots'){const usage=doc(item.documentId);usage.text+=bytes;usage.total+=bytes}
   if(storeName==='runs'){const usage=doc(item.documentId);usage.research+=bytes;usage.total+=bytes}
   if(storeName==='reports'){const usage=doc(item.documentId);if(item.tool==='animatedHistogram'){const own=video(item.id);own.video+=item.visual?.size??0;own.reports+=Math.max(0,bytes-(item.visual?.size??0));own.total+=bytes;usage.video+=item.visual?.size??0;usage.reports+=Math.max(0,bytes-(item.visual?.size??0))}else usage.reports+=bytes;usage.total+=bytes}
   if(storeName==='videoDrafts'){const usage=doc(item.documentId),own=video(item.reportId);const thumbnail=item.thumbnail?.blob?.size??0,audio=item.soundtrack?.blob?.size??0;for(const u of [usage,own]){u.thumbnail+=thumbnail;u.audio+=audio;u.draft+=Math.max(0,bytes-thumbnail-audio);u.total+=bytes}}
   if(storeName==='pdfs')caches.push({id:item.id,documentId:item.documentId,name:item.name,size:item.file?.size??0,bytes});
   row.continue()};tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(tx.error)});
  for(const cache of caches){let id=cache.documentId??`file-${cache.id}`;if(!docs.has(id)){const candidates=[...docs].filter(([,d])=>d.name===cache.name&&d.size===cache.size);if(candidates.length===1)id=candidates[0][0];else continue}const usage=doc(id);usage.pdfCache+=cache.bytes;usage.total+=cache.bytes}
  return result;
 }finally{db.close()}
}
