import type {PageCounts} from './countPages';
export const WIDTH=960,HEIGHT=540;
const colors=['#315fba','#dc8157','#6e59a5','#298775','#c89b36','#b7587c','#5a99b0','#697384'];
export function drawFrame(ctx:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D,terms:string[],rows:PageCounts[],index:number,progress=1,title='WebSeer',english=false){
 const row=rows[index],prev=index?rows[index-1].cumulative:terms.map(()=>0);const values=terms.map((_,i)=>prev[i]+(row.cumulative[i]-prev[i])*progress);
 const order=(v:number[])=>terms.map((_,i)=>i).sort((a,b)=>v[b]-v[a]||a-b);const before=order(prev),after=order(row.cumulative);const eased=progress*progress*(3-2*progress);
 const totalMax=Math.max(1,...rows[rows.length-1].cumulative);const left=155,right=855,top=130,rowHeight=Math.min(45,340/terms.length);
 ctx.fillStyle='#f6f8fb';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.fillStyle='#172033';ctx.font='bold 23px sans-serif';ctx.fillText(title.slice(0,58),32,44);ctx.font='14px sans-serif';ctx.fillStyle='#718099';ctx.fillText(english?'Cumulative word counts · physical document pages':'Contagem acumulada · páginas físicas do documento',32,72);
 ctx.textAlign='right';ctx.font='bold 22px sans-serif';ctx.fillStyle='#315fba';ctx.fillText(`${english?'Page':'Página'} ${row.page}`,WIDTH-32,44);ctx.textAlign='left';
 ctx.font='12px sans-serif';for(let i=0;i<=4;i++){const x=left+(right-left)*i/4;ctx.strokeStyle='#dce3ee';ctx.beginPath();ctx.moveTo(x,top-15);ctx.lineTo(x,top+rowHeight*terms.length);ctx.stroke();ctx.fillStyle='#718099';ctx.fillText(String(Math.round(totalMax*i/4)),x-5,top+rowHeight*terms.length+22)}
 terms.forEach((term,i)=>{const position=before.indexOf(i)+(after.indexOf(i)-before.indexOf(i))*eased;const y=top+position*rowHeight;ctx.fillStyle='#20324c';ctx.textAlign='right';ctx.font='bold 16px sans-serif';ctx.fillText(term,left-14,y+22);ctx.textAlign='left';ctx.fillStyle=colors[i];ctx.fillRect(left,y+4,(right-left)*values[i]/totalMax,rowHeight-10);ctx.fillStyle='#20324c';ctx.font='14px sans-serif';ctx.fillText(String(Math.round(values[i])),left+(right-left)*values[i]/totalMax+8,y+22)});
 ctx.fillStyle='#315fba';ctx.fillRect(32,488,(WIDTH-64)*((index+progress)/rows.length),3);ctx.font='11px sans-serif';ctx.fillStyle='#718099';ctx.fillText('Leonardo Camargo Rossato | LCR · WebSeer',32,518);ctx.textAlign='right';ctx.fillText(english?'Cumulative occurrences':'Ocorrências acumuladas',WIDTH-32,518);ctx.textAlign='left';
}
