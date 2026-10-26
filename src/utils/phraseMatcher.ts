export interface Edge{source:string;target:string;count:number}
export function matchPhrases(text:string, relation:string):Edge[]{
 const rx=new RegExp(`([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\\s-]{0,45}?)\\s+${relation.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\\s-]{0,45}?)(?=[,.!?;]|$)`,'gi')
 const map=new Map<string,Edge>(); let m:RegExpExecArray|null
 while((m=rx.exec(text))){ const a=m[1].trim().split(/\s+/).slice(-2).join(' '); const b=m[2].trim().split(/\s+/).slice(0,2).join(' '); const k=`${a}|${b}`; const e=map.get(k)??{source:a,target:b,count:0};e.count++;map.set(k,e)}
 return [...map.values()]
}
