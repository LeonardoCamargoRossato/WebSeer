import type {DocumentMetadata,PdfReadOptions} from '../utils/pdfExtractor';
export type StoredPdf = {id:string; name:string; file:Blob; pages:string[]; savedAt:string; metadata?:DocumentMetadata; options?:PdfReadOptions};
function openDatabase():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open('webseer',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('pdfs',{keyPath:'id'});
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('Database upgrade blocked'));
  });
}
async function operation<T>(mode:IDBTransactionMode, action:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>{
 const db=await openDatabase();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('pdfs',mode);
  const request=action(tx.objectStore('pdfs'));
  tx.oncomplete=()=>{db.close();resolve(request.result)};
  tx.onerror=tx.onabort=()=>{db.close();reject(tx.error ?? new Error('Storage operation failed'))};
 });
}
export const savePdf=(pdf:StoredPdf)=>operation('readwrite',store=>store.put(pdf));
export const listPdfs=()=>operation('readonly',store=>store.getAll()) as Promise<StoredPdf[]>;
export const deletePdf=(id:string)=>operation('readwrite',store=>store.delete(id));
