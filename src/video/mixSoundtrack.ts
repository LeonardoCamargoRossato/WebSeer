import type {MediaAttachment,VideoDraft} from './videoDraft';
import type {Report} from '../storage/archive';
export type RenderedVideo={blob:Blob;soundtrackAddedAt:string;createdAt:string};
export function preparedVideo(report:Report,draft?:VideoDraft){return draft?.soundtrack&&draft.renderedVideo?.soundtrackAddedAt===draft.soundtrack.addedAt?draft.renderedVideo.blob:report.visual}
export function needsSoundtrackRender(draft:VideoDraft){return Boolean(draft.soundtrack&&draft.renderedVideo?.soundtrackAddedAt!==draft.soundtrack.addedAt)}
export async function mixSoundtrack(video:Blob,soundtrack:MediaAttachment,onProgress:(value:number)=>void,signal?:AbortSignal):Promise<RenderedVideo>{
 if(video.type!=='video/mp4')throw new Error('A trilha exige um vídeo MP4. Gere MP4 no Histograma animado. / Soundtrack requires MP4.');
 const context=new AudioContext({sampleRate:48000});let worker:Worker|undefined;
 try{
  signal?.throwIfAborted();onProgress(0);const decoded=await context.decodeAudioData(await soundtrack.blob.arrayBuffer());signal?.throwIfAborted();
  const planes=Array.from({length:Math.min(2,decoded.numberOfChannels)},(_,channel)=>decoded.getChannelData(channel).slice());
  worker=new Worker(new URL('./mixSoundtrack.worker.ts',import.meta.url),{type:'module'});const task=worker;
  const blob=await new Promise<Blob>((resolve,reject)=>{const abort=()=>{task.terminate();reject(new DOMException('Preparação cancelada. / Preparation canceled.','AbortError'))};signal?.addEventListener('abort',abort,{once:true});const finish=()=>signal?.removeEventListener('abort',abort);task.onmessage=event=>{if(event.data.error){finish();reject(new Error(event.data.error))}else if(event.data.blob){finish();resolve(event.data.blob)}else onProgress(event.data.progress)};task.onerror=event=>{finish();reject(new Error(event.message||'Falha ao preparar áudio. / Audio preparation failed.'))};task.postMessage({video,planes,sampleRate:decoded.sampleRate},planes.map(p=>p.buffer))});
  onProgress(100);return{blob,soundtrackAddedAt:soundtrack.addedAt,createdAt:new Date().toISOString()};
 }finally{worker?.terminate();await context.close()}
}
