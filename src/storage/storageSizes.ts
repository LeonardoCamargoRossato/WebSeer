export function utf8Length(text:string){let size=0;for(let i=0;i<text.length;i++){const code=text.charCodeAt(i);if(code<128)size++;else if(code<2048)size+=2;else if(code>=0xd800&&code<=0xdbff&&i+1<text.length&&text.charCodeAt(i+1)>=0xdc00&&text.charCodeAt(i+1)<=0xdfff){size+=4;i++}else size+=3}return size}
export type ContentUsage={original:number;text:number;research:number;reports:number;video:number;thumbnail:number;audio:number;draft:number;pdfCache:number;total:number};
export const emptyUsage=():ContentUsage=>({original:0,text:0,research:0,reports:0,video:0,thumbnail:0,audio:0,draft:0,pdfCache:0,total:0});
/** Logical payload estimate, not physical IndexedDB allocation or browser quota. */
export function payloadBytes(value:unknown,seen=new WeakSet<object>()):number{
 if(value==null)return 4;if(typeof value==='string')return utf8Length(value);if(typeof value==='number'||typeof value==='boolean')return String(value).length;
 if(value instanceof Blob)return value.size;
 if(typeof value!=='object')return 0;if(seen.has(value))return 0;seen.add(value);
 if(value instanceof ArrayBuffer)return value.byteLength;if(ArrayBuffer.isView(value))return value.byteLength;
 if(value instanceof Date)return value.toISOString().length;
 if(Array.isArray(value))return value.reduce((size,item)=>size+payloadBytes(item,seen),2);
 return Object.entries(value).reduce((size,[key,item])=>size+utf8Length(key)+payloadBytes(item,seen),2);
}
export const formatBytes=(bytes:number|undefined,locale='pt-BR')=>{if(bytes===undefined||!Number.isFinite(bytes))return'—';const units=['B','KB','MB','GB','TB'];const unit=Math.min(4,Math.floor(Math.log(Math.max(1,bytes))/Math.log(1024)));return`${(bytes/1024**unit).toLocaleString(locale,{maximumFractionDigits:unit?1:0})} ${units[unit]}`};
