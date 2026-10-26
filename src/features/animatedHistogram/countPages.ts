import {words} from '../../utils/compareCorpus.ts';
import {STOPWORDS} from '../frequency/stopwords.ts';
import type {CorpusDocument} from '../../types/corpus';
export type PageCounts={page:number;counts:number[];cumulative:number[]};
export function normalizeTerm(value:string){const ts=words(value.trim());return ts.length===1&&/^\p{L}[\p{L}'’-]*$/u.test(value.trim().normalize('NFC'))?ts[0]:''}
export function countPages(documents:CorpusDocument[],terms:string[]):PageCounts[]{
 const keys=terms.map(normalizeTerm);if(keys.some(k=>!k)||new Set(keys).size!==keys.length||terms.length<2||terms.length>8)throw new Error('Select 2–8 distinct single words.');
 const totals=terms.map(()=>0);const index=new Map(keys.map((key,i)=>[key,i]));
 return documents.map((doc,i)=>{const counts=terms.map(()=>0);for(const word of words(doc.text)){const j=index.get(word);if(j!==undefined)counts[j]++}counts.forEach((n,j)=>totals[j]+=n);return{page:doc.pageNumber??i+1,counts,cumulative:[...totals]}});
}
export function suggestions(text:string,significant=false){const counts=new Map<string,number>();for(const word of words(text)){if(!/^\p{L}+/u.test(word)||significant&&(STOPWORDS.pt.has(word)||STOPWORDS.en.has(word)||word.length<3))continue;counts.set(word,(counts.get(word)||0)+1)}return [...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([word,count])=>({word,count}))}
/** Candidate proper names, not named-entity recognition. Favor repeated mixed-case names,
 * including sentence-initial names; require contextual evidence for single occurrences. */
export function nameSuggestions(text:string){const candidates=new Map<string,{word:string;count:number;context:boolean}>();const stop=new Set([...STOPWORDS.pt,...STOPWORDS.en,'capítulo','chapter','gênesis','genesis','então','depois','quando','assim','porque','senhor','espírito','terra','céus','dia','disse']);
 const matches=[...text.matchAll(/\p{L}+(?:['’-]\p{L}+)*/gu)];
 matches.forEach((m,i)=>{const word=m[0],key=word.toLocaleLowerCase();if(!/^\p{Lu}\p{Ll}{2,}$/u.test(word)||stop.has(key))return;const prefix=text.slice(Math.max(0,m.index!-20),m.index);const context=i>0&&!/[.!?:;]\s*$/u.test(prefix)&&!/^\s*$/.test(prefix);const previous=candidates.get(key);candidates.set(key,{word:previous?.word??word,count:(previous?.count??0)+1,context:Boolean(previous?.context||context)})});
 return [...candidates.values()].filter(c=>c.count>=2||c.context).sort((a,b)=>b.count-a.count||a.word.localeCompare(b.word)).slice(0,30);
}
