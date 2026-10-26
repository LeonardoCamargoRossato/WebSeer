import StorageOptions from './StorageOptions';
import {useState} from 'react';
import {useI18n} from '../../i18n';

export type Page='home'|'compare'|'wordTree'|'phraseNet'|'frequencies'|'wordCloud'|'corpus'|'history';

export default function AppHeader({page,setPage}:{page:Page;setPage:(p:Page)=>void}){
 const {t,locale,setLocale}=useI18n();
 const [open,setOpen]=useState(false);
 const nav:[Page,string][]=[
  ['home',t.nav.home],
  ['compare',t.nav.compare],
  ['wordTree',t.nav.wordTree],
  ['phraseNet',t.nav.phraseNet],
  ['frequencies',t.nav.frequencies],
  ['wordCloud',t.nav.wordCloud],
  ['corpus',t.nav.corpus],
  ['history',t.nav.history]
 ];
 return <header className="appHeader"><div className="headerInner">
  <button className="brand" onClick={()=>setPage('home')}><strong>{t.brand.name}</strong><span>{t.brand.tagline}</span></button>
  <button className="menuToggle" aria-label="Menu" onClick={()=>setOpen(v=>!v)}>☰</button>
  <div className={`headerRight ${open?'open':''}`}>
   <nav>{nav.map(([key,label])=><button className={page===key?'active':''} onClick={()=>{setPage(key);setOpen(false)}} key={key}>{label}</button>)}</nav>
   <StorageOptions/><select className="localeSelect" aria-label="Language" value={locale} onChange={e=>setLocale(e.target.value as typeof locale)}><option value="pt-BR">PT-BR</option><option value="en-US">EN-US</option></select>
  </div>
 </div></header>
}
