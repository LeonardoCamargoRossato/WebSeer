import {AUTHOR_BYLINE,PORTFOLIO_URL,EXPORT_ATTRIBUTION} from '../config/author.ts';
const NS='http://www.w3.org/2000/svg';
const MARKER='data-webseer-attribution';
const PNG_KEY='WebSeerAttribution';
const encoder=new TextEncoder();
const decode=new TextDecoder();

/** Freeze chart styling and add a separate, clickable attribution footer. */
export function svgWithAttribution(svg:SVGSVGElement):Blob{
 const clone=svg.cloneNode(true) as SVGSVGElement;
 if(!clone.querySelector(`g[${MARKER}]`)){
  if(svg.isConnected){const source=[svg,...svg.querySelectorAll('*')],dest=[clone,...clone.querySelectorAll('*')];const properties=['fill','fill-opacity','stroke','stroke-width','stroke-opacity','opacity','font-family','font-size','font-weight','text-anchor','dominant-baseline','stroke-dasharray','stroke-linecap','stroke-linejoin'];source.forEach((node,index)=>{const style=getComputedStyle(node);for(const property of properties)(dest[index] as SVGElement).style.setProperty(property,style.getPropertyValue(property))})}
  const parts=(svg.getAttribute('viewBox')??'').trim().split(/[ ,]+/).map(Number);const x=parts.length===4?parts[0]:0,y=parts.length===4?parts[1]:0,w=(parts.length===4?parts[2]:0)||Number(svg.getAttribute('width'))||1100,h=(parts.length===4?parts[3]:0)||Number(svg.getAttribute('height'))||700;const footer=64;
  clone.setAttribute('viewBox',`${x} ${y} ${w} ${h+footer}`);clone.setAttribute('width',String(w));clone.setAttribute('height',String(h+footer));
  const group=document.createElementNS(NS,'g');group.setAttribute(MARKER,'true');const background=document.createElementNS(NS,'rect');for(const [key,value]of Object.entries({x,y:y+h,width:w,height:footer,fill:'#fff'}))background.setAttribute(key,String(value));group.append(background);
  const line=document.createElementNS(NS,'path');line.setAttribute('d',`M${x},${y+h+1}h${w}`);line.setAttribute('stroke','#dce3ee');group.append(line);
  const link=document.createElementNS(NS,'a');link.setAttribute('href',PORTFOLIO_URL);link.setAttribute('target','_blank');link.setAttribute('rel','noopener noreferrer');
  for(const [content,baseline,size,weight]of [[AUTHOR_BYLINE,y+h+25,14,650],[PORTFOLIO_URL,y+h+46,Math.min(10,Math.max(6,(w-40)/(PORTFOLIO_URL.length*.58))),400]] as const){const text=document.createElementNS(NS,'text');for(const [key,value]of Object.entries({x:x+20,y:baseline,fill:'#254d90','font-family':'Arial, sans-serif','font-size':size,'font-weight':weight,'text-anchor':'start'}))text.setAttribute(key,String(value));text.textContent=content;link.append(text)}
  group.append(link);clone.append(group);
 }
 clone.setAttribute('xmlns',NS);
 return new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'});
}
function chunks(bytes:Uint8Array){const result:{type:string;start:number;length:number}[]=[];const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);for(let start=8;start+12<=bytes.length;){const length=view.getUint32(start);if(start+12+length>bytes.length)break;result.push({type:decode.decode(bytes.subarray(start+4,start+8)),start,length});start+=length+12}return result}
async function pngMarked(blob:Blob){const bytes=new Uint8Array(await blob.arrayBuffer());return chunks(bytes).some(chunk=>chunk.type==='tEXt'&&decode.decode(bytes.subarray(chunk.start+8,chunk.start+8+chunk.length)).startsWith(`${PNG_KEY}\0`))}
function crc32(bytes:Uint8Array){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^(crc&1?0xedb88320:0)}return(crc^0xffffffff)>>>0}
async function markPng(blob:Blob){const bytes=new Uint8Array(await blob.arrayBuffer()),end=chunks(bytes).find(chunk=>chunk.type==='IEND');if(!end)throw new Error('Invalid generated PNG');const data=encoder.encode(`${PNG_KEY}\0${JSON.stringify(EXPORT_ATTRIBUTION)}`),chunk=new Uint8Array(data.length+12),view=new DataView(chunk.buffer);view.setUint32(0,data.length);chunk.set(encoder.encode('tEXt'),4);chunk.set(data,8);view.setUint32(data.length+8,crc32(chunk.subarray(4,data.length+8)));return new Blob([bytes.subarray(0,end.start),chunk,bytes.subarray(end.start)],{type:'image/png'})}
/** Keep every original chart pixel and add footer space, instead of overlaying labels. */
export async function pngWithAttribution(source:HTMLCanvasElement|ImageBitmap):Promise<Blob>{
 const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height+68;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(source,0,0);ctx.strokeStyle='#dce3ee';ctx.beginPath();ctx.moveTo(0,source.height+.5);ctx.lineTo(canvas.width,source.height+.5);ctx.stroke();ctx.fillStyle='#254d90';ctx.font=`600 ${Math.min(15,Math.max(10,(canvas.width-30)/(AUTHOR_BYLINE.length*.62)))}px Arial, sans-serif`;ctx.fillText(AUTHOR_BYLINE,16,source.height+25);ctx.font=`${Math.min(11,Math.max(6,(canvas.width-30)/(PORTFOLIO_URL.length*.58)))}px Arial, sans-serif`;ctx.fillText(PORTFOLIO_URL,16,source.height+48);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Could not export chart')),'image/png'));return markPng(blob);
}
/** Apply branding to older generated PNG/SVG reports; never use on uploaded originals. */
export async function attributedImage(blob:Blob):Promise<Blob>{
 if(blob.type==='image/svg+xml'){const parsed=new DOMParser().parseFromString(await blob.text(),'image/svg+xml');if(parsed.querySelector('parsererror'))throw new Error('Could not read generated SVG');if(parsed.querySelector(`g[${MARKER}]`))return blob;return svgWithAttribution(parsed.documentElement as unknown as SVGSVGElement)}
 if(blob.type==='image/png'){if(await pngMarked(blob))return blob;const bitmap=await createImageBitmap(blob);try{return await pngWithAttribution(bitmap)}finally{bitmap.close()}}
 return blob;
}
