/** Blobs are immutable: simultaneous consumers can share one full-file hash. */
const pending=new WeakMap<Blob,Promise<string>>();
export function hashBlob(blob:Blob){let digest=pending.get(blob);if(!digest){digest=blob.arrayBuffer().then(bytes=>crypto.subtle.digest('SHA-256',bytes)).then(result=>Array.from(new Uint8Array(result),byte=>byte.toString(16).padStart(2,'0')).join(''));pending.set(blob,digest);digest.catch(()=>pending.delete(blob))}return digest}
