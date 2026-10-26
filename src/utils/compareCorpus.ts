import type {Suggestion} from '../types/suggestion';
export const words=(text:string)=>text.normalize('NFC').toLocaleLowerCase().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)??[];
export function corpusContains(text:string,query:string){const ts=words(text),q=words(query);return q.length>0&&ts.some((_,i)=>q.every((w,j)=>ts[i+j]===w))}
/** Count immediate continuations of an exact token sequence within each document. */
export function compareCorpus(documents:{text:string}[],query:string):Suggestion[]{
 const q=words(query);if(!q.length)return[];const counts=new Map<string,number>();let total=0;
 for(const doc of documents){const ts=words(doc.text);for(let i=0;i<=ts.length-q.length;i++)if(q.every((w,j)=>ts[i+j]===w)&&ts[i+q.length]){const next=ts[i+q.length];counts.set(next,(counts.get(next)||0)+1);total++}}
 return [...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([text,frequency],i)=>({text,frequency,rank:i+1,score:frequency/Math.max(1,total),source:'Corpus'}));
}
