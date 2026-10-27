import {AUTHOR_BYLINE,PORTFOLIO_URL} from '../../config/author.ts';
import type {PageCounts} from './countPages';
import {videoDimensions,type VideoOrientation} from './videoFormats.ts';
export const WIDTH=960,HEIGHT=540;
const colors=['#315fba','#dc8157','#6e59a5','#298775','#c89b36','#b7587c','#5a99b0','#697384'];
function fitText(ctx:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D,text:string,width:number){
 const fits=(value:string)=>typeof ctx.measureText==='function'?ctx.measureText(value).width<=width:value.length*9<=width;
 if(fits(text))return text;let shortened=text;while(shortened.length&&!fits(shortened+'…'))shortened=shortened.slice(0,-1);return shortened+'…';
}
export function drawFrame(ctx:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D,terms:string[],rows:PageCounts[],index:number,progress=1,title='WebSeer',english=false,positions?:number[],orientation:VideoOrientation='horizontal'){
 if(orientation==='vertical'){drawVerticalFrame(ctx,terms,rows,index,progress,title,english,positions);return}
 const row=rows[index],prev=index?rows[index-1].cumulative:terms.map(()=>0);const values=terms.map((_,i)=>prev[i]+(row.cumulative[i]-prev[i])*progress);
 const order=(v:number[])=>terms.map((_,i)=>i).sort((a,b)=>v[b]-v[a]||a-b);const before=order(prev),after=order(row.cumulative);const eased=progress*progress*(3-2*progress);
 const totalMax=Math.max(1,...rows[rows.length-1].cumulative);const left=155,right=855,top=130,rowHeight=Math.min(40,312/terms.length);
 ctx.fillStyle='#f6f8fb';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.fillStyle='#172033';ctx.font='bold 23px sans-serif';ctx.fillText(title.slice(0,58),32,44);ctx.font='14px sans-serif';ctx.fillStyle='#718099';ctx.fillText(english?'Cumulative word counts · physical document pages':'Contagem acumulada · páginas físicas do documento',32,72);
 ctx.textAlign='right';ctx.font='bold 22px sans-serif';ctx.fillStyle='#315fba';ctx.fillText(`${english?'Page':'Página'} ${row.page}`,WIDTH-32,44);ctx.textAlign='left';
 ctx.font='12px sans-serif';for(let i=0;i<=4;i++){const x=left+(right-left)*i/4;ctx.strokeStyle='#dce3ee';ctx.beginPath();ctx.moveTo(x,top-15);ctx.lineTo(x,top+rowHeight*terms.length);ctx.stroke();ctx.fillStyle='#718099';ctx.fillText(String(Math.round(totalMax*i/4)),x-5,top+rowHeight*terms.length+22)}
 terms.forEach((term,i)=>{const position=positions?.[i]??before.indexOf(i)+(after.indexOf(i)-before.indexOf(i))*eased;const y=top+position*rowHeight;ctx.fillStyle='#20324c';ctx.textAlign='right';ctx.font='bold 16px sans-serif';ctx.fillText(term,left-14,y+22);ctx.textAlign='left';ctx.fillStyle=colors[i];const width=(right-left)*values[i]/totalMax;if(width>0){ctx.beginPath();ctx.roundRect(left,y+4,width,rowHeight-10,Math.min(10,width/2,(rowHeight-10)/2));ctx.fill();}ctx.fillStyle='#20324c';ctx.font='14px sans-serif';ctx.fillText(String(Math.round(values[i])),left+(right-left)*values[i]/totalMax+8,y+22)});
 ctx.fillStyle='#315fba';ctx.fillRect(32,490,(WIDTH-64)*((index+progress)/rows.length),3);ctx.font='11px sans-serif';ctx.fillStyle='#718099';ctx.fillText(AUTHOR_BYLINE,32,516);ctx.font='9px sans-serif';ctx.fillText(PORTFOLIO_URL,32,534);ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText(english?'Cumulative occurrences':'Ocorrências acumuladas',WIDTH-32,518);ctx.textAlign='left';
}

/** Reflow the chart for portrait viewing instead of cropping or stretching a landscape frame. */
function drawVerticalFrame(ctx:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D,terms:string[],rows:PageCounts[],index:number,progress:number,title:string,english:boolean,positions?:number[]){
 const {width,height}=videoDimensions('vertical'),row=rows[index],previous=index?rows[index-1].cumulative:terms.map(()=>0);
 const values=terms.map((_,number)=>previous[number]+(row.cumulative[number]-previous[number])*progress);
 const order=(counts:number[])=>terms.map((_,number)=>number).sort((a,b)=>counts[b]-counts[a]||a-b),before=order(previous),after=order(row.cumulative),eased=progress*progress*(3-2*progress);
 const maximum=Math.max(1,...rows[rows.length-1].cumulative),left=152,right=414,top=270,rowHeight=Math.min(64,456/terms.length),axis=top+rowHeight*terms.length+29;
 ctx.fillStyle='#f6f8fb';ctx.fillRect(0,0,width,height);ctx.textAlign='left';ctx.fillStyle='#315fba';ctx.font='bold 12px sans-serif';ctx.fillText('WEBSEER · '+(english?'WORDS IN MOTION':'PALAVRAS EM MOVIMENTO'),32,86);
 ctx.fillStyle='#172033';ctx.font='bold 26px sans-serif';
 const titleWords=title.split(/\s+/);let line='',lineNumber=0;for(let wordIndex=0;wordIndex<titleWords.length;wordIndex++){const word=titleWords[wordIndex],candidate=line?`${line} ${word}`:word;if(line&&ctx.measureText&&ctx.measureText(candidate).width>436){ctx.fillText(fitText(ctx,line,436),32,130+lineNumber*34);lineNumber++;line=titleWords.slice(wordIndex).join(' ');break}else line=candidate}
 ctx.fillText(fitText(ctx,line,436),32,130+lineNumber*34);
 ctx.font='13px sans-serif';ctx.fillStyle='#718099';ctx.fillText(english?'Cumulative word occurrences':'Ocorrências acumuladas de palavras',32,203);
 ctx.font='bold 22px sans-serif';ctx.fillStyle='#315fba';ctx.fillText(`${english?'Page':'Página'} ${row.page}`,32,237);
 ctx.font='11px sans-serif';for(let tick=0;tick<=4;tick++){const x=left+(right-left)*tick/4;ctx.strokeStyle='#dce3ee';ctx.beginPath();ctx.moveTo(x,top-12);ctx.lineTo(x,axis-22);ctx.stroke();ctx.fillStyle='#718099';ctx.fillText(String(Math.round(maximum*tick/4)),x-4,axis)}
 terms.forEach((term,number)=>{const position=positions?.[number]??before.indexOf(number)+(after.indexOf(number)-before.indexOf(number))*eased,y=top+position*rowHeight;ctx.fillStyle='#20324c';ctx.textAlign='right';ctx.font='bold 17px sans-serif';ctx.fillText(fitText(ctx,term,118),left-12,y+27);ctx.textAlign='left';ctx.fillStyle=colors[number];const barWidth=(right-left)*values[number]/maximum;if(barWidth>0){ctx.beginPath();ctx.roundRect(left,y+5,barWidth,rowHeight-17,Math.min(10,barWidth/2,(rowHeight-17)/2));ctx.fill()}ctx.fillStyle='#20324c';ctx.font='bold 14px sans-serif';ctx.fillText(String(Math.round(values[number])),left+barWidth+8,y+27)});
 // Keep the graph above the progress/attribution area and leave the bottom 100 px free for platform overlays.
 ctx.fillStyle='#315fba';ctx.fillRect(32,800,436*((index+progress)/rows.length),3);ctx.font='bold 13px sans-serif';ctx.fillStyle='#526680';ctx.fillText(AUTHOR_BYLINE,32,831);ctx.font='8px sans-serif';ctx.fillText(PORTFOLIO_URL,32,851);
}
