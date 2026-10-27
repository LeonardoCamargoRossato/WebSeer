export function announceChange(){if(typeof window!=='undefined')window.dispatchEvent(new Event('webseer-archive-change'));if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel('webseer-archive');channel.postMessage('changed');channel.close()}}
export const DB_VERSION=4;
export function openDatabase():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open('webseer',DB_VERSION);
  request.onupgradeneeded=()=>{const db=request.result;for(const name of ['pdfs','documents','snapshots','runs','reports','videoDrafts','publishingSchedules','publishingQueue'])if(!db.objectStoreNames.contains(name))db.createObjectStore(name,{keyPath:'id'})};
  request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db)};
  request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(new Error('Close other WebSeer tabs to update browser storage.'));
 });
}
export async function operation<T>(name:string,mode:IDBTransactionMode,action:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>{
 const db=await openDatabase();return new Promise((resolve,reject)=>{
  const tx=db.transaction(name,mode);let request:IDBRequest<T>;try{request=action(tx.objectStore(name))}catch(error){tx.abort();db.close();reject(error);return}
  tx.oncomplete=()=>{db.close();if(mode==='readwrite')announceChange();resolve(request.result)};
  tx.onerror=tx.onabort=()=>{db.close();reject(tx.error??new Error('Browser storage failed'))};
 });
}
