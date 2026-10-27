import {useEffect,useRef} from 'react';
import {useI18n} from '../../i18n';
import InfoButton from '../../info-buttons/InfoButton';
import StorageOptions from './StorageOptions';
import type {Page} from './AppHeader';

export default function SettingsMenu({page,onOpen,navigationOpen}:{page:Page;onOpen:()=>void;navigationOpen:boolean}){
 const {locale,setLocale}=useI18n();const en=locale==='en-US';
 const menu=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{if(menu.current)menu.current.open=false},[page]);
 useEffect(()=>{if(navigationOpen&&menu.current)menu.current.open=false},[navigationOpen]);
 useEffect(()=>{
  const outside=(event:PointerEvent)=>{const target=event.target;if(target instanceof Element&&!menu.current?.contains(target)&&!target.closest('.helpInfoDialog')&&menu.current)menu.current.open=false};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&menu.current?.open&&!document.querySelector('.helpInfoDialog[open]')){menu.current.open=false;menu.current.querySelector('summary')?.focus()}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)};
 },[]);
 return <details className="settingsMenu" ref={menu} onToggle={()=>{if(menu.current?.open)onOpen()}}>
  <summary className="settingsToggle" aria-label={en?'Settings':'Configurações'} title={en?'Settings':'Configurações'}><span aria-hidden="true">⚙︎</span></summary>
  <div className="settingsPopover">
   <h2>{en?'Settings':'Configurações'}</h2>
   <label className="settingsLanguage"><span>{en?'Language':'Idioma'} <InfoButton group="common" topic="language"/></span><select className="localeSelect" aria-label="Language" value={locale} onChange={event=>setLocale(event.target.value as typeof locale)}><option value="pt-BR">🇧🇷 Português (PT-BR)</option><option value="en-US">🇺🇸 English (US)</option></select></label>
   <StorageOptions/>
  </div>
 </details>;
}
