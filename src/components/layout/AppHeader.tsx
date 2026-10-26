import {AUTHOR_NAME,PORTFOLIO_URL} from '../../config/author';
import StorageOptions from './StorageOptions';
import {useState} from 'react';
import {useI18n} from '../../i18n';
export type Page='home'|'corpus'|'dashboard'|'compare'|'wordTree'|'phraseNet'|'frequencies'|'wordCloud'|'history'|'examples'|'animatedHistogram';
export default function AppHeader({page,setPage}:{page:Page;setPage:(p:Page)=>void}){
 const {t,locale,setLocale}=useI18n();const en=locale==='en-US';const [open,setOpen]=useState(false),[tools,setTools]=useState(false);
 const analyses:[Page,string][]=[['dashboard',en?'Data dashboard':'Dashboard de dados'],['compare',t.nav.compare],['wordTree',t.nav.wordTree],['phraseNet',t.nav.phraseNet],['frequencies',t.nav.frequencies],['wordCloud',t.nav.wordCloud],['animatedHistogram',en?'Animated Histogram':'Histograma animado']];
 const go=(next:Page)=>{setPage(next);setOpen(false);setTools(false)};
 return <header className="appHeader"><div className="headerInner"><div className="brandIdentity"><button className="brand" onClick={()=>go('home')}><strong>{t.brand.name}</strong><span>{t.brand.tagline}</span></button><a className="brandAuthor" href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">@</span>{AUTHOR_NAME}</a></div><button className="menuToggle" aria-label="Menu" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>☰</button><div className={`headerRight ${open?'open':''}`}><nav>
 <button className={page==='home'?'active':''} onClick={()=>go('home')}>{t.nav.home}</button>
 <button className={page==='corpus'?'active':''} onClick={()=>go('corpus')}>{en?'Document Corpus':'Corpus do Documento'}</button>
 <div className="analysisMenu"><button className={analyses.some(([key])=>key===page)?'active':''} aria-expanded={tools} onClick={()=>setTools(v=>!v)}>{en?'Analysis Tools':'Ferramentas de Análise'} ▾</button>{tools&&<div className="analysisPopover">{analyses.map(([key,label])=><button key={key} onClick={()=>go(key)}>{label}</button>)}</div>}</div>
 <button className={page==='history'?'active':''} onClick={()=>go('history')}>{t.nav.history}</button><button className={page==='examples'?'active':''} onClick={()=>go('examples')}>{en?'Application Examples':'Exemplos de Aplicação'}</button>
 </nav><StorageOptions/><select className="localeSelect" aria-label="Language" value={locale} onChange={e=>setLocale(e.target.value as typeof locale)}><option value="pt-BR">PT-BR</option><option value="en-US">EN-US</option></select></div></div></header>;
}
