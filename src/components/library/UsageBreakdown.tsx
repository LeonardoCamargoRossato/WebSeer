import {useEffect,useId,useRef,useState,type CSSProperties} from 'react';
import {createPortal} from 'react-dom';
import {useI18n} from '../../i18n';
import InfoButton from '../../info-buttons/InfoButton';
import {formatBytes,type ContentUsage} from '../../storage/storageMetrics';

const categories=[
 {key:'original',pt:'Original',en:'Original',color:'#1e40af'},
 {key:'text',pt:'Textos e revisões',en:'Text and revisions',color:'#047857'},
 {key:'research',pt:'Pesquisas',en:'Research',color:'#a16207'},
 {key:'reports',pt:'Relatórios/dados',en:'Reports/data',color:'#6d28d9'},
 {key:'video',pt:'Vídeo/GIF',en:'Video/GIF',color:'#be123c'},
 {key:'thumbnail',pt:'Capas',en:'Thumbnails',color:'#0e7490'},
 {key:'audio',pt:'Áudios',en:'Audio',color:'#c2410c'},
 {key:'pdfCache',pt:'Cópia para reconversão PDF',en:'PDF reconversion cache',color:'#4338ca'},
 {key:'draft',pt:'Metadados/rascunhos',en:'Metadata/drafts',color:'#475569'},
] as const;

export default function UsageBreakdown({usage,compact=false}:{usage?:ContentUsage;compact?:boolean}){
 const {locale}=useI18n();const en=locale==='en-US',tr=(pt:string,eng:string)=>en?eng:pt;
 const [open,setOpen]=useState(false);const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);const id=useId();
 useEffect(()=>{if(open)dialog.current?.showModal()},[open]);
 const close=()=>{setOpen(false);requestAnimationFrame(()=>trigger.current?.focus())};
 const total=categories.reduce((sum,item)=>sum+(usage?.[item.key]??0),0);let angle=-Math.PI/2;
 return <div className={`usageBreakdown ${compact?'compact':''}`}>
  <button ref={trigger} className="storageBreakdownTrigger" disabled={!usage} aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}><span className="storageChartGlyph" aria-hidden="true">◕</span><strong>{tr('Armazenado localmente (estimativa)','Local content (estimate)')}: {formatBytes(usage?.total,locale)}</strong><span className="storageBreakdownArrow" aria-hidden="true">↗</span></button>
  <InfoButton group="history" topic="itemStorage"/>
  {open&&usage&&createPortal(<dialog ref={dialog} className="storageBreakdownDialog" aria-labelledby={id} onCancel={close} onClose={close} onClick={event=>{if(event.target===event.currentTarget)close()}}>
   <header className="storageDialogHeading"><div><span className="eyebrow">{tr('ARMAZENAMENTO LOCAL','LOCAL STORAGE')}</span><h2 id={id}>{tr('Distribuição do armazenamento','Storage distribution')}</h2></div><button autoFocus aria-label={tr('Fechar distribuição do armazenamento','Close storage distribution')} onClick={close}>×</button></header>
   <p className="storageDialogDescription">{tr('Veja como os arquivos e dados deste item ocupam espaço neste navegador.','See how this item’s files and data use space in this browser.')}</p>
   <div className="storagePiePanel"><svg className="storagePie" viewBox="0 0 240 240" role="img" aria-label={tr('Gráfico de pizza da distribuição do armazenamento local','Pie chart of local storage distribution')}><title>{tr('Distribuição do armazenamento local','Local storage distribution')}</title>{total===0?<circle cx="120" cy="120" r="110" fill="#dce3ee"/>:categories.filter(item=>usage[item.key]>0).map(item=>{
    const value=usage[item.key],fraction=value/total,start=angle;angle+=fraction*Math.PI*2;const x1=120+110*Math.cos(start),y1=120+110*Math.sin(start),x2=120+110*Math.cos(angle),y2=120+110*Math.sin(angle);const label=`${en?item.en:item.pt}: ${formatBytes(value,locale)} (${(fraction*100).toLocaleString(locale,{maximumFractionDigits:1})}%)`;
    return fraction>=1?<circle key={item.key} cx="120" cy="120" r="110" fill={item.color}><title>{label}</title></circle>:<path key={item.key} d={`M120,120 L${x1},${y1} A110,110 0 ${fraction>.5?1:0},1 ${x2},${y2} Z`} fill={item.color} stroke="#fff" strokeWidth="1"><title>{label}</title></path>
   })}</svg><div className="storagePieTotal"><span>{tr('Total local estimado','Estimated local total')}</span><strong>{formatBytes(usage.total,locale)}</strong><small>{tr('Arquivos e dados deste item','This item’s files and data')}</small></div></div>
   <ul className="usageParts storageLegend" aria-label={tr('Detalhamento por categoria','Breakdown by category')}>{categories.map(item=><li key={item.key} style={{'--category-color':item.color} as CSSProperties}><span className="storageLegendLabel"><i aria-hidden="true"/>{en?item.en:item.pt}:</span><strong>{formatBytes(usage[item.key],locale)}</strong><small>{total?`${(usage[item.key]/total*100).toLocaleString(locale,{maximumFractionDigits:1})}%`:'0%'}</small></li>)}</ul>
   <p className="storageEstimateNote">{tr('Estimativa dos conteúdos locais, incluindo itens na lixeira. Pode diferir do uso físico informado pelo navegador; não representa a cota disponível.','Estimate of local content, including trashed items. May differ from physical browser usage; this is not the available quota.')} <InfoButton group="history" topic="itemStorage"/></p>
  </dialog>,document.body)}
 </div>;
}
