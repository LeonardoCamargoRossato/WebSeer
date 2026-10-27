import {useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {useI18n} from '../i18n';
import {infos} from './index';
/** Explicit catalog references keep help independent of translated UI labels. */
export default function InfoButton({group,topic='overview',label}:{group:string;topic?:string;label?:string}){
 const {locale}=useI18n();const language=locale==='en-US'?1:0;const info=infos[group]?.[topic];const [open,setOpen]=useState(false);const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLSpanElement>(null);const id=useId();
 useEffect(()=>{if(open)dialog.current?.showModal()},[open]);
 if(!info)return null;
 const close=()=>{dialog.current?.close();setOpen(false);requestAnimationFrame(()=>trigger.current?.focus())};
 return <><span ref={trigger} role="button" tabIndex={0} className="helpInfoButton" title={info.body[language]} aria-label={label??`${language?'Information: ':'Informações: '}${info.title[language]}`} aria-haspopup="dialog" aria-expanded={open} onClick={e=>{e.preventDefault();e.stopPropagation();setOpen(true)}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setOpen(true)}}}><span className="helpInfoGlyph" aria-hidden="true"/></span>{open&&createPortal(<dialog ref={dialog} className="helpInfoDialog" aria-labelledby={id} onCancel={close} onClose={close} onClick={e=>{e.stopPropagation();if(e.target===e.currentTarget)close()}}><div><h2 id={id}>{info.title[language]}</h2><button autoFocus onClick={close} aria-label={language?'Close information':'Fechar informação'}>×</button></div><p>{info.body[language]}</p>{group==='animated-histogram/video-studio'&&<a href="https://support.google.com/youtube/" target="_blank" rel="noopener noreferrer">{language?'YouTube Help':'Ajuda do YouTube'} ↗</a>}</dialog>,document.body)}</>;
}
