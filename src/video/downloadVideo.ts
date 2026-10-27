import {preparedVideo} from './mixSoundtrack';
import type {Report} from '../storage/archive';
import {operation} from '../storage/database';
import {download} from '../reports/reportUtils';
import {automaticSuggestions,type VideoDraft} from './videoDraft';
export function videoFilename(title:string,type:string){
 const cleaned=title.normalize('NFC').replace(/[<>:"/\\|?*\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().replace(/[. ]+$/,'');
 let safe='';for(const character of cleaned||'Histograma animado'){if(new TextEncoder().encode(safe+character).length>200)break;safe+=character}
 return `WebSeer - ${safe}.${type==='video/mp4'?'mp4':'gif'}`;
}
export async function downloadVideo(report:Report,documentName:string){
 if(!report.visual)return;
 let draft:VideoDraft|undefined;
 try{draft=await operation<VideoDraft|undefined>('videoDrafts','readonly',s=>s.get(report.id))}catch{/* A download remains available if browser storage is unavailable. */}
 download(preparedVideo(report,draft)!,videoFilename(draft?.title||automaticSuggestions(report,documentName).title,report.visual.type));
}
