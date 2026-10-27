import {useState,type CSSProperties,type PointerEvent,type KeyboardEvent} from 'react';
import {formatBytes} from '../../storage/storageMetrics';

type Category={key:string;label:string;color:string;value:number};
export default function StorageDistribution({categories,total,locale}:{categories:Category[];total:number;locale:string}){
 const en=locale==='en-US',tr=(pt:string,eng:string)=>en?eng:pt;
 const [active,setActive]=useState<string|null>(null);
 const amount=categories.reduce((sum,item)=>sum+item.value,0);
 const percent=(value:number)=>`${(amount?value/amount*100:0).toLocaleString(locale,{maximumFractionDigits:1})}%`;
 let angle=-Math.PI/2;
 const slices=categories.filter(item=>item.value>0).map(item=>{const start=angle,fraction=item.value/amount;angle+=fraction*Math.PI*2;return{...item,start,end:angle,mid:(start+angle)/2,fraction}});
 const selected=categories.find(item=>item.key===active);
 // Keep large callouts apart; small categories remain available through hover/focus/touch.
 const callouts=slices.filter(item=>item.fraction>=.12&&item.fraction<.32).map(item=>({...item,side:Math.cos(item.mid)<0?-1:1,y:175+Math.sin(item.mid)*139}));
 for(const side of [-1,1]){const rows=callouts.filter(item=>item.side===side).sort((a,b)=>a.y-b.y);for(let i=0;i<rows.length;i++)rows[i].y=Math.max(45,rows[i].y,i?rows[i-1].y+46:45);for(let i=rows.length-1;i>=0;i--)rows[i].y=Math.min(305,rows[i].y,i<rows.length-1?rows[i+1].y-46:305)}
 const activate=(key:string)=>setActive(key);
 const label=(item:Category)=>`${item.label}: ${formatBytes(item.value,locale)} / ${percent(item.value)}`;
 return <>
  <div className={`storagePiePanel interactiveStoragePie ${selected?'hasSelection':''}`}>
   <svg className="storagePie" viewBox="0 0 520 350" role="group" aria-label={tr('Gráfico de pizza da distribuição do armazenamento local','Pie chart of local storage distribution')} onPointerLeave={event=>{if(event.pointerType==='mouse')setActive(null)}}>
    {amount===0&&<circle cx="260" cy="175" r="112" fill="#dce3ee"/>}
    {slices.map(item=>{const x1=260+112*Math.cos(item.start),y1=175+112*Math.sin(item.start),x2=260+112*Math.cos(item.end),y2=175+112*Math.sin(item.end);const events={onPointerEnter:(event:PointerEvent)=>{if(event.pointerType==='mouse')activate(item.key)},onFocus:()=>activate(item.key),onBlur:()=>setActive(null),onClick:()=>activate(item.key),onKeyDown:(event:KeyboardEvent)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate(item.key)}}};const props={fill:item.color,tabIndex:0,role:'button','aria-label':label(item),'aria-pressed':active===item.key,'data-category':item.key,className:`storageSlice ${active===item.key?'isActive':''}`,opacity:active&&active!==item.key?0.55:1,transform:active===item.key?`translate(${Math.cos(item.mid)*5},${Math.sin(item.mid)*5})`:undefined,...events};
     return item.fraction>=1?<circle key={item.key} cx="260" cy="175" r="112" {...props}/>:<path key={item.key} d={`M260,175 L${x1},${y1} A112,112 0 ${item.fraction>.5?1:0},1 ${x2},${y2} Z`} stroke="#fff" strokeWidth="1.5" {...props}/>;
    })}
    <g className="storagePieLabels" aria-hidden="true" pointerEvents="none">{slices.filter(item=>item.fraction>=.32).map(item=>{const x=260+Math.cos(item.mid)*61,y=175+Math.sin(item.mid)*61;return <text key={item.key} x={x} y={y-4} textAnchor="middle" fill="#fff"><tspan x={x} className="pieInsideSize">{formatBytes(item.value,locale)}</tspan><tspan x={x} dy="22" className="pieInsidePercent">{percent(item.value)}</tspan></text>})}{callouts.map(item=>{const edgeX=260+Math.cos(item.mid)*117,edgeY=175+Math.sin(item.mid)*117,labelX=item.side<0?104:416;return <g key={item.key}><polyline points={`${edgeX},${edgeY} ${260+Math.cos(item.mid)*135},${item.y} ${labelX+(item.side<0?8:-8)},${item.y}`} fill="none" stroke={item.color} strokeWidth="1.6"/><circle cx={edgeX} cy={edgeY} r="3" fill={item.color}/><text x={labelX} y={item.y-4} textAnchor={item.side<0?'end':'start'} fill={item.color}><tspan x={labelX} className="pieCalloutSize">{formatBytes(item.value,locale)}</tspan><tspan x={labelX} dy="20" className="pieCalloutPercent">{percent(item.value)}</tspan></text></g>})}</g>
   </svg>
   <div className={`storagePieTotal storageHoverCard ${selected?'active':''}`} style={selected?{'--category-color':selected.color} as CSSProperties:undefined} role={selected?'status':undefined} aria-live="polite" aria-atomic="true">{selected?<><span className="storageHoverCategory">{selected.label}</span><strong className="storageHoverSize">{formatBytes(selected.value,locale)}</strong><span className="storageHoverPercent">/ {percent(selected.value)}</span><small>{tr('do total local estimado','of the estimated local total')}</small></>:<><span>{tr('Total local estimado','Estimated local total')}</span><strong>{formatBytes(total,locale)}</strong><small>{tr('Passe o mouse, toque ou use Tab para destacar uma categoria.','Hover, tap or use Tab to highlight a category.')}</small></>}</div>
  </div>
  <ul className="usageParts storageLegend interactiveStorageLegend" aria-label={tr('Detalhamento por categoria','Breakdown by category')}>{categories.map(item=><li key={item.key} style={{'--category-color':item.color} as CSSProperties} role="button" tabIndex={0} aria-label={label(item)} aria-pressed={active===item.key} className={active===item.key?'isActive':''} onPointerEnter={event=>{if(event.pointerType==='mouse')activate(item.key)}} onPointerLeave={event=>{if(event.pointerType==='mouse')setActive(null)}} onFocus={()=>activate(item.key)} onBlur={()=>setActive(null)} onClick={()=>activate(item.key)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate(item.key)}}}><span className="storageLegendLabel"><i aria-hidden="true"/>{item.label}:</span><strong>{formatBytes(item.value,locale)}</strong><small>{percent(item.value)}</small></li>)}</ul>
 </>;
}
