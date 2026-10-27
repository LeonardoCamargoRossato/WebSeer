import {useEffect,useRef,useState} from 'react';
import InfoButton from '../../info-buttons/InfoButton';
import './pageNarration.css';

type Playback='idle'|'playing'|'paused'|'finished'|'error';
/** Bound utterances keep long guides responsive and avoid browsers truncating long speech. */
export function narrationChunks(paragraphs:string[],limit=220){
 const chunks:string[]=[];
 for(const paragraph of paragraphs){let rest=paragraph.replace(/\s+/g,' ').trim();while(rest){if(rest.length<=limit){chunks.push(rest);break}let end=rest.lastIndexOf(' ',limit);const sentence=Math.max(rest.lastIndexOf('. ',limit),rest.lastIndexOf('? ',limit),rest.lastIndexOf('! ',limit));if(sentence>limit/3)end=sentence+1;if(end<1)end=limit;chunks.push(rest.slice(0,end).trim());rest=rest.slice(end).trim()}}
 return chunks;
}
export default function PageNarration({paragraphs,locale,pageKey}:{paragraphs:string[];locale:'pt-BR'|'en-US';pageKey:string}){
 const en=locale==='en-US',tr=(pt:string,eng:string)=>en?eng:pt;
 const [supported,setSupported]=useState<boolean|null>(null),[voices,setVoices]=useState<SpeechSynthesisVoice[]>([]),[state,setState]=useState<Playback>('idle'),[index,setIndex]=useState(0),[error,setError]=useState('');
 const generation=useRef(0),utterance=useRef<SpeechSynthesisUtterance>(),alive=useRef(true);
 // A signature avoids restarting playback during unrelated renders (for example storage updates).
 const signature=paragraphs.join('\n\n'),chunks=narrationChunks(paragraphs);
 const preferred=voices.find(voice=>voice.lang.toLowerCase()===locale.toLowerCase()&&voice.localService)??voices.find(voice=>voice.lang.toLowerCase()===locale.toLowerCase())??voices.find(voice=>voice.lang.toLowerCase().split('-')[0]===locale.split('-')[0]);
 useEffect(()=>{alive.current=true;const available=typeof window.speechSynthesis?.speak==='function'&&typeof window.speechSynthesis?.getVoices==='function'&&typeof window.speechSynthesis?.cancel==='function'&&typeof window.SpeechSynthesisUtterance==='function';setSupported(available);if(!available)return()=>{alive.current=false};const synth=window.speechSynthesis,update=()=>setVoices(synth.getVoices());update();synth.addEventListener('voiceschanged',update);return()=>{alive.current=false;generation.current++;synth.cancel();utterance.current=undefined;synth.removeEventListener('voiceschanged',update)}},[]);
 useEffect(()=>{generation.current++;window.speechSynthesis?.cancel?.();utterance.current=undefined;setState('idle');setIndex(0);setError('');return()=>{generation.current++;window.speechSynthesis?.cancel?.();utterance.current=undefined}},[locale,pageKey,signature]);
 const stop=()=>{generation.current++;window.speechSynthesis.cancel();utterance.current=undefined;setState('idle');setIndex(0);setError('')};
 const start=()=>{
  if(!supported||!chunks.length)return;const synth=window.speechSynthesis;generation.current++;const current=generation.current;synth.cancel();setError('');setIndex(0);setState('playing');
  const fail=(code:string)=>{if(!alive.current||current!==generation.current)return;generation.current++;synth.cancel();utterance.current=undefined;setState('error');setError(code==='not-allowed'?tr('O navegador bloqueou a narração. Clique em tentar novamente e confira as permissões de áudio.','The browser blocked narration. Click retry and check audio permissions.'):code==='language-unavailable'||code==='voice-unavailable'?tr('A voz deste idioma não está disponível. Habilite uma voz de português no navegador ou no sistema e tente novamente.','A voice for this language is unavailable. Enable an English voice in the browser or operating system and retry.'):tr('Não foi possível reproduzir a narração. Confira as vozes e o áudio do navegador e tente novamente.','Could not play narration. Check browser voices and audio, then retry.'))};
  const next=(position:number)=>{if(!alive.current||current!==generation.current)return;if(position>=chunks.length){utterance.current=undefined;setState('finished');return}setIndex(position);const speech=new SpeechSynthesisUtterance(chunks[position]);speech.lang=locale;if(preferred)speech.voice=preferred;speech.rate=1;speech.onend=()=>next(position+1);speech.onerror=event=>fail(event.error);utterance.current=speech;try{synth.speak(speech)}catch{fail('synthesis-failed')}};
  next(0);
 };
 const pause=()=>{try{window.speechSynthesis.pause();setState('paused')}catch{setError(tr('Não foi possível pausar. Use Parar e tente novamente.','Could not pause. Use Stop and retry.'))}};
 const resume=()=>{try{window.speechSynthesis.resume();setState('playing')}catch{setError(tr('Não foi possível retomar. Use Parar e tente novamente.','Could not resume. Use Stop and retry.'))}};
 const busy=state==='playing'||state==='paused';
 return <section className="pageNarration" aria-label={tr('Narração da página','Page narration')}>
  <div className="narrationControls">{state==='playing'?<button onClick={pause}><span aria-hidden="true">Ⅱ</span>{tr('Pausar narração','Pause narration')}</button>:state==='paused'?<button onClick={resume}><span aria-hidden="true">▶</span>{tr('Retomar narração','Resume narration')}</button>:<button className="narrationPlay" disabled={supported!==true||!chunks.length} onClick={start}><span className="narrationEar" aria-hidden="true">👂</span>{state==='error'?tr('Tentar narração novamente','Retry narration'):state==='finished'?tr('Escutar novamente','Listen again'):tr('Escutar narração da página','Listen to page narration')}</button>}{busy&&<button onClick={stop}><span aria-hidden="true">■</span>{tr('Parar narração','Stop narration')}</button>}<InfoButton group="examples" topic="narration"/></div>
  <p className="narrationStatus" role="status">{supported===false?tr('A narração não está disponível neste navegador. Você pode continuar pela leitura do texto.','Narration is unavailable in this browser. You can continue reading the text.'):state==='playing'?tr(`Lendo trecho ${index+1} de ${chunks.length}.`,`Reading section ${index+1} of ${chunks.length}.`):state==='paused'?tr('Narração pausada.','Narration paused.'):state==='finished'?tr('Narração concluída.','Narration complete.'):tr('Ouça este conteúdo com a voz do navegador.','Listen to this content using the browser voice.')}</p>
  {supported&&<small className="narrationVoice">{preferred?`${tr('Voz','Voice')}: ${preferred.name}`:tr('A voz em português depende das opções disponíveis no navegador e no sistema.','The English voice depends on browser and system options.')}</small>}{error&&<p className="narrationError" role="alert">{error}</p>}
 </section>;
}
