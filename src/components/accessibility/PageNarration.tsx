import {useEffect,useId,useRef,useState} from 'react';
import InfoButton from '../../info-buttons/InfoButton';
import './pageNarration.css';

type Playback='idle'|'playing'|'paused'|'finished'|'error';
type Locale='pt-BR'|'en-US';
const speeds=[.5,.75,1,1.25,1.5,1.75,2];
const voiceKey=(voice:SpeechSynthesisVoice)=>voice.voiceURI||`${voice.lang}|${voice.name}|${voice.localService?'local':'remote'}`;
const preferenceKey=(locale:Locale)=>`webseer.narration.voice.${locale}`;
function readPreference(key:string,fallback:string){try{return sessionStorage.getItem(key)??fallback}catch{return fallback}}
function savePreference(key:string,value:string){try{sessionStorage.setItem(key,value)}catch{/* Playback also works when session storage is unavailable. */}}
function preferredVoice(voices:SpeechSynthesisVoice[],locale:Locale){const code=locale.toLowerCase();return voices.find(voice=>voice.lang.toLowerCase()===code&&voice.localService)??voices.find(voice=>voice.lang.toLowerCase()===code)??voices.find(voice=>voice.lang.toLowerCase().split('-')[0]===code.split('-')[0])}

/** Bound utterances keep long guides responsive and avoid browsers truncating long speech. */
export function narrationChunks(paragraphs:string[],limit=220){
 const chunks:string[]=[];
 for(const paragraph of paragraphs){let rest=paragraph.replace(/\s+/g,' ').trim();while(rest){if(rest.length<=limit){chunks.push(rest);break}let end=rest.lastIndexOf(' ',limit);const sentence=Math.max(rest.lastIndexOf('. ',limit),rest.lastIndexOf('? ',limit),rest.lastIndexOf('! ',limit));if(sentence>limit/3)end=sentence+1;if(end<1)end=limit;chunks.push(rest.slice(0,end).trim());rest=rest.slice(end).trim()}}
 return chunks;
}
function SoundIcon(){return <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></svg>}
function GearIcon(){return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="m10 3-.7 2.4-2.1 1.2L4.8 6 3 9.2l1.7 1.8v2L3 14.8 4.8 18l2.4-.6 2.1 1.2L10 21h4l.7-2.4 2.1-1.2 2.4.6 1.8-3.2-1.7-1.8v-2L21 9.2 19.2 6l-2.4.6-2.1-1.2L14 3z"/><circle cx="12" cy="12" r="3"/></svg>}

export default function PageNarration({paragraphs,locale,pageKey}:{paragraphs:string[];locale:Locale;pageKey:string}){
 const en=locale==='en-US',tr=(pt:string,eng:string)=>en?eng:pt;
 const [expanded,setExpanded]=useState(false),[settingsOpen,setSettingsOpen]=useState(false);
 const [supported,setSupported]=useState<boolean|null>(null),[voices,setVoices]=useState<SpeechSynthesisVoice[]>([]),[state,setState]=useState<Playback>('idle'),[index,setIndex]=useState(0),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [choice,setChoice]=useState(()=>readPreference(preferenceKey(locale),'auto'));
 const [rate,setRate]=useState(()=>{const saved=Number(readPreference('webseer.narration.rate','1'));return speeds.includes(saved)?saved:1});
 const generation=useRef(0),utterance=useRef<SpeechSynthesisUtterance>(),alive=useRef(true),playback=useRef<Playback>('idle'),position=useRef(0),needsRestart=useRef(false);
 const trigger=useRef<HTMLButtonElement>(null),panelId=useId(),settingsId=useId();
 const signature=paragraphs.join('\n\n'),chunks=narrationChunks(paragraphs);
 const uniqueVoices=voices.filter((voice,number,list)=>list.findIndex(item=>voiceKey(item)===voiceKey(voice))===number);
 const automatic=preferredVoice(uniqueVoices,locale),selected=uniqueVoices.find(voice=>voiceKey(voice)===choice)??automatic;
 const activeChoice=choice==='auto'||!uniqueVoices.some(voice=>voiceKey(voice)===choice)?'auto':choice;
 // Event callbacks and queued sections always read current settings. A generation fences out canceled speech callbacks.
 const config=useRef({chunks,locale,voice:selected,rate});config.current={chunks,locale,voice:selected,rate};
 const changeState=(value:Playback)=>{playback.current=value;setState(value)};
 const changePosition=(value:number)=>{position.current=value;setIndex(value)};
 const cancelSpeech=()=>{generation.current++;window.speechSynthesis?.cancel?.();utterance.current=undefined};
 useEffect(()=>{
  alive.current=true;const available=typeof window.speechSynthesis?.speak==='function'&&typeof window.speechSynthesis?.getVoices==='function'&&typeof window.speechSynthesis?.cancel==='function'&&typeof window.SpeechSynthesisUtterance==='function';setSupported(available);
  if(!available)return()=>{alive.current=false};
  const synth=window.speechSynthesis,update=()=>{if(alive.current)setVoices(synth.getVoices())};update();synth.addEventListener('voiceschanged',update);
  return()=>{alive.current=false;generation.current++;synth.cancel();utterance.current=undefined;synth.removeEventListener('voiceschanged',update)};
 },[]);
 useEffect(()=>{
  generation.current++;window.speechSynthesis?.cancel?.();utterance.current=undefined;needsRestart.current=false;playback.current='idle';position.current=0;
  setState('idle');setIndex(0);setExpanded(false);setSettingsOpen(false);setError('');setNotice('');setChoice(readPreference(preferenceKey(locale),'auto'));
  return()=>{generation.current++;window.speechSynthesis?.cancel?.();utterance.current=undefined};
 },[locale,pageKey,signature]);
 const playFrom=(start:number)=>{
  if(!supported||!config.current.chunks.length)return;
  const synth=window.speechSynthesis;cancelSpeech();const current=generation.current;needsRestart.current=false;setError('');changeState('playing');
  // Some engines keep their global paused flag after cancel(). Clear it before a fresh queue is submitted.
  if(synth.paused)try{synth.resume()}catch{/* speak reports a usable error if the engine cannot resume. */}
  const fail=(code:string)=>{
   if(!alive.current||current!==generation.current)return;cancelSpeech();changeState('error');
   setError(code==='not-allowed'?tr('O navegador bloqueou a narração. Clique em Ouvir narração e confira as permissões de áudio.','The browser blocked narration. Click Play narration and check audio permissions.'):code==='language-unavailable'||code==='voice-unavailable'?tr('A voz escolhida não está disponível. Escolha outra voz nas configurações e tente novamente.','The selected voice is unavailable. Choose another voice in settings and retry.'):tr('Não foi possível reproduzir a narração. Confira as vozes e o áudio do navegador e tente novamente.','Could not play narration. Check browser voices and audio, then retry.'));
  };
  const next=(number:number)=>{
   if(!alive.current||current!==generation.current)return;
   const settings=config.current;
   if(number>=settings.chunks.length){utterance.current=undefined;needsRestart.current=false;changeState('finished');return}
   changePosition(number);
   if(playback.current==='paused'){utterance.current=undefined;needsRestart.current=true;return}
   try{
    const speech=new SpeechSynthesisUtterance(settings.chunks[number]);speech.lang=settings.voice?.lang??settings.locale;if(settings.voice)speech.voice=settings.voice;speech.rate=settings.rate;
    speech.onend=()=>{if(utterance.current!==speech)return;utterance.current=undefined;next(number+1)};speech.onerror=event=>{if(utterance.current===speech)fail(event.error)};utterance.current=speech;synth.speak(speech);
   }catch{fail('synthesis-failed')}
  };
  next(Math.max(0,Math.min(start,config.current.chunks.length-1)));
 };
 const play=()=>{setNotice('');playFrom(playback.current==='finished'?0:position.current)};
 const pause=()=>{changeState('paused');try{window.speechSynthesis.pause()}catch{changeState('playing');setError(tr('Não foi possível pausar. Use Parar e tente novamente.','Could not pause. Use Stop and retry.'))}};
 const resume=()=>{setNotice('');if(needsRestart.current||!utterance.current){playFrom(position.current);return}try{window.speechSynthesis.resume();changeState('playing')}catch{setError(tr('Não foi possível retomar. Use Parar e tente novamente.','Could not resume. Use Stop and retry.'))}};
 const stop=()=>{cancelSpeech();needsRestart.current=false;changeState('idle');changePosition(0);setError('');setNotice(tr('Narração parada.','Narration stopped.'))};
 const close=()=>{stop();setExpanded(false);setSettingsOpen(false);requestAnimationFrame(()=>trigger.current?.focus())};
 const applyPlaybackChange=(message:string)=>{
  const previous=playback.current;setError('');setNotice(message);
  if(previous==='playing')playFrom(position.current);
  else if(previous==='paused'){cancelSpeech();needsRestart.current=true;changeState('paused')}
  else if(previous==='error'||previous==='finished')changeState('idle');
 };
 const changeSpeed=(value:number)=>{config.current={...config.current,rate:value};setRate(value);savePreference('webseer.narration.rate',String(value));applyPlaybackChange(tr('Velocidade aplicada; o trecho atual reinicia ao tocar.','Speed applied; the current section restarts on playback.'))};
 const changeVoice=(key:string)=>{const voice=key==='auto'?automatic:uniqueVoices.find(item=>voiceKey(item)===key)??automatic;config.current={...config.current,voice};setChoice(key);savePreference(preferenceKey(locale),key);applyPlaybackChange(tr('Voz aplicada; o trecho atual reinicia ao tocar.','Voice applied; the current section restarts on playback.'))};
 const changeSection=(value:number)=>{changePosition(value);applyPlaybackChange(tr(`Trecho ${value+1} selecionado.`,`Section ${value+1} selected.`))};
 const status=supported===false?tr('A narração não está disponível neste navegador. Você pode continuar pela leitura do texto.','Narration is unavailable in this browser. You can continue reading the text.'):supported===null?tr('Verificando suporte à narração…','Checking narration support…'):state==='playing'?tr(`Lendo trecho ${index+1} de ${chunks.length}.`,`Reading section ${index+1} of ${chunks.length}.`):state==='paused'?tr('Narração pausada. Clique em Retomar para continuar.','Narration paused. Click Resume to continue.'):state==='finished'?tr('Narração concluída.','Narration complete.'):tr(`Trecho ${Math.min(index+1,chunks.length)} de ${chunks.length}.`,`Section ${Math.min(index+1,chunks.length)} of ${chunks.length}.`);
 const sameLanguage=uniqueVoices.filter(voice=>voice.lang.toLowerCase().split('-')[0]===locale.split('-')[0]),otherLanguages=uniqueVoices.filter(voice=>!sameLanguage.includes(voice));
 const voiceOption=(voice:SpeechSynthesisVoice)=><option key={voiceKey(voice)} value={voiceKey(voice)}>{voice.name} · {voice.lang}{voice.localService?tr(' · dispositivo',' · device'):''}</option>;
 return <section className={`pageNarration ${expanded?'isOpen':''}`} aria-label={tr('Narração da página','Page narration')} onKeyDown={event=>{if(event.key==='Escape'&&expanded&&!document.querySelector('.helpInfoDialog[open]')){event.preventDefault();event.stopPropagation();close()}}}>
  <button ref={trigger} className="narrationToggle" aria-expanded={expanded} aria-controls={panelId} onClick={()=>{if(expanded)close();else{setExpanded(true);setNotice('');playFrom(position.current)}}}><SoundIcon/>{tr('Ouvir','Listen')}</button>
  {expanded&&<div id={panelId} className="narrationPlayer" role="region" aria-label={tr('Player de narração','Narration player')}>
   <div className="narrationToolbar"><div className="narrationPlayback">{state==='playing'?<button aria-label={tr('Pausar narração','Pause narration')} onClick={pause}><span aria-hidden="true">Ⅱ</span>{tr('Pausar','Pause')}</button>:state==='paused'?<button aria-label={tr('Retomar narração','Resume narration')} onClick={resume}><span aria-hidden="true">▶</span>{tr('Retomar','Resume')}</button>:<button aria-label={tr('Ouvir narração','Play narration')} disabled={supported!==true||!chunks.length} onClick={play}><SoundIcon/>{tr('Ouvir','Play')}</button>}<button aria-label={tr('Parar narração','Stop narration')} disabled={supported!==true||(state==='idle'&&index===0)} onClick={stop}><span aria-hidden="true">■</span>{tr('Parar','Stop')}</button></div>
    <label className="narrationSpeed"><span>{tr('Velocidade','Speed')}</span><select aria-label={tr('Velocidade da narração','Narration speed')} value={rate} onChange={event=>changeSpeed(Number(event.target.value))}>{speeds.map(value=><option key={value} value={value}>{value.toLocaleString(locale,{maximumFractionDigits:2})}×</option>)}</select></label>
    <button className="narrationIconButton" aria-label={tr('Configurações da narração','Narration settings')} title={tr('Configurações da narração','Narration settings')} aria-expanded={settingsOpen} aria-controls={settingsId} onClick={()=>setSettingsOpen(value=>!value)}><GearIcon/></button><button className="narrationIconButton narrationClose" aria-label={tr('Fechar player de narração','Close narration player')} title={tr('Fechar player de narração','Close narration player')} onClick={close}>×</button>
   </div>
   <p className="narrationStatus" role="status">{status}{notice&&<span className="narrationNotice"> {notice}</span>}</p>
   {settingsOpen&&<div className="narrationSettings" id={settingsId}><label><span>{tr('Voz','Voice')}</span><select aria-label={tr('Voz da narração','Narration voice')} value={activeChoice} disabled={supported!==true} onChange={event=>changeVoice(event.target.value)}><option value="auto">{tr('Automática para o idioma','Automatic for this language')}{automatic?` · ${automatic.name}`:''}</option>{sameLanguage.length>0&&<optgroup label={tr('Vozes deste idioma','Voices for this language')}>{sameLanguage.map(voiceOption)}</optgroup>}{otherLanguages.length>0&&<optgroup label={tr('Outros idiomas','Other languages')}>{otherLanguages.map(voiceOption)}</optgroup>}</select></label><label><span>{tr('Trecho / linha','Section / line')}</span><select aria-label={tr('Trecho da narração','Narration section')} value={index} disabled={!chunks.length} onChange={event=>changeSection(Number(event.target.value))}>{chunks.map((text,number)=><option value={number} key={number}>{number+1}. {text}</option>)}</select></label><p className="narrationCurrentText">{chunks.length?`${index+1}. ${chunks[index]??''}`:tr('Não há texto para narrar.','There is no text to narrate.')}</p><div className="narrationSettingsNote"><small>{selected?`${tr('Voz atual','Current voice')}: ${selected.name} · ${selected.lang}`:tr('As vozes dependem das opções disponíveis no navegador e no sistema.','Voices depend on browser and system options.')}</small><InfoButton group="examples" topic="narration"/></div></div>}
   {error&&<p className="narrationError" role="alert">{error}</p>}
  </div>}
 </section>;
}
