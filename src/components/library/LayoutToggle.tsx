import {useI18n} from '../../i18n';
export default function LayoutToggle({layout,onChange}:{layout:'details'|'cards';onChange:(value:'details'|'cards')=>void}){
 const {locale}=useI18n();const en=locale==='en-US';const next=layout==='details'?'cards':'details';const label=next==='cards'?(en?'Show cards':'Mostrar cards'):(en?'Show detailed list':'Mostrar lista detalhada');
 return <button className="layoutToggle" onClick={()=>onChange(next)} aria-label={label} title={label}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{layout==='details'?<><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h1M3 12h1M3 18h1" strokeWidth="3"/></>:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}</svg></button>
}
