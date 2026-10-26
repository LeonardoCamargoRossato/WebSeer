export type PdfFragment={str:string;transform:number[];width:number;height:number;hasEOL?:boolean;dir?:string};
/** Preserve explicit whitespace; infer missing separators only from adjacent geometry.
 * PDF content order is retained: sorting globally by y would mix columns. */
export function reconstructPdfText(items:PdfFragment[],mode:'layout'|'literal'='layout'){
 let text='',previous:PdfFragment|undefined;
 for(const item of items){
  if(item.str){
   if(mode==='layout'&&previous&&!/\s$/.test(text)&&!/^\s/.test(item.str)){
    const [a,b,,,x,y]=item.transform;const angle=Math.atan2(b,a);
    const dx=x-(previous.transform[4]+Math.cos(angle)*previous.width);
    const dy=y-(previous.transform[5]+Math.sin(angle)*previous.width);
    const along=dx*Math.cos(angle)+dy*Math.sin(angle);
    const across=Math.abs(-dx*Math.sin(angle)+dy*Math.cos(angle));
    const em=Math.max(1,item.height,previous.height);
    if(across>em*.55)text+='\n';
    else if(along>em*.18||along< -em)text+=' ';
   }
   text+=item.str;previous=item;
  }
  if(item.hasEOL){text+='\n';previous=undefined}
 }
 return text.normalize('NFC').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
export function removeRepeatedMargins(pages:string[]){
 if(pages.length<3)return pages;
 const key=(s:string)=>s.trim().replace(/\d+/g,'#');
 const counts=new Map<string,number>();
 for(const page of pages){const lines=page.split('\n');for(const s of new Set([...lines.slice(0,2),...lines.slice(-2)].map(key).filter(Boolean)))counts.set(s,(counts.get(s)||0)+1)}
 return pages.map(page=>{const lines=page.split('\n');return lines.filter((s,i)=>!((i<2||i>=lines.length-2)&&(counts.get(key(s))||0)>=Math.ceil(pages.length*.7))).join('\n')});
}
