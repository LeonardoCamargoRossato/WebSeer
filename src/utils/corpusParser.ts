export type TreeNode={name:string;frequency:number;children:TreeNode[]}
const clean=(s:string)=>s.replace(/[“”"'.,!?;:()\[\]{}]/g,' ').replace(/\s+/g,' ').trim()
export function tokens(text:string, caseSensitive=false){ const t=clean(text); return t.split(' ').filter(Boolean).map(x=>caseSensitive?x:x.toLowerCase()) }
export function buildWordTree(text:string, query:string, depth:number, reverse=false, caseSensitive=false):TreeNode{
  const ts=tokens(text,caseSensitive), q=caseSensitive?query:query.toLowerCase(), root:TreeNode={name:query,frequency:0,children:[]}
  const paths:string[][]=[]
  ts.forEach((tok,i)=>{ if(tok===q){ root.frequency++; const p:string[]=[]; for(let d=1;d<=depth;d++){ const idx=reverse?i-d:i+d; if(idx>=0&&idx<ts.length)p.push(ts[idx]); } if(p.length)paths.push(p) }})
  const add=(node:TreeNode,path:string[],idx=0)=>{ if(idx>=path.length)return; let c=node.children.find(x=>x.name===path[idx]); if(!c){c={name:path[idx],frequency:0,children:[]};node.children.push(c)} c.frequency++;add(c,path,idx+1)}
  paths.forEach(p=>add(root,p));
  const sort=(n:TreeNode)=>{n.children.sort((a,b)=>b.frequency-a.frequency);n.children.forEach(sort)};sort(root);return root
}
export function contexts(text:string, sequence:string){ const sentences=text.split(/(?<=[.!?])\s+/); const q=sequence.toLowerCase(); return sentences.filter(s=>s.toLowerCase().includes(q)).slice(0,12) }
