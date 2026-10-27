import type {MediaAttachment} from './videoDraft';
export async function readThumbnail(file:File):Promise<MediaAttachment>{
 if(file.size>2*1024*1024)throw new Error('Miniatura: máximo 2 MB. / Thumbnail: maximum 2 MB.');
 const header=new Uint8Array(await file.slice(0,8).arrayBuffer());const png=header[0]===137&&header[1]===80&&header[2]===78&&header[3]===71&&header[4]===13&&header[5]===10&&header[6]===26&&header[7]===10;const jpeg=header[0]===255&&header[1]===216&&header[2]===255;
 if(!png&&!jpeg)throw new Error('Use uma imagem PNG ou JPEG válida. / Use a valid PNG or JPEG image.');
 const type=png?'image/png':'image/jpeg';const blob=file.slice(0,file.size,type);const image=await createImageBitmap(blob);
 const result:MediaAttachment={name:file.name,type,size:file.size,blob,width:image.width,height:image.height,addedAt:new Date().toISOString()};image.close();return result;
}
export async function readSoundtrack(file:File):Promise<MediaAttachment>{
 if(!file.size||file.size>25*1024*1024)throw new Error('Áudio: arquivo vazio ou acima de 25 MB. / Audio: empty file or above 25 MB.');
 const ext=file.name.split('.').pop()?.toLowerCase()??'';const types:Record<string,string>={mp3:'audio/mpeg',wav:'audio/wav',m4a:'audio/mp4',aac:'audio/aac',ogg:'audio/ogg',oga:'audio/ogg'};
 if(!types[ext])throw new Error('Use MP3, WAV, M4A, AAC ou OGG. / Use MP3, WAV, M4A, AAC or OGG.');
 const blob=file.slice(0,file.size,types[ext]);const url=URL.createObjectURL(blob);const audio=new Audio();audio.preload='metadata';
 try{
  const duration=await new Promise<number>((resolve,reject)=>{const timer=setTimeout(()=>{cleanup();reject(new Error('Tempo esgotado ao ler áudio. / Audio metadata timed out.'))},15000);const cleanup=()=>{clearTimeout(timer);audio.onloadedmetadata=null;audio.onerror=null};audio.onloadedmetadata=()=>{cleanup();Number.isFinite(audio.duration)&&audio.duration>0?resolve(audio.duration):reject(new Error('Duração de áudio inválida. / Invalid audio duration.'))};audio.onerror=()=>{cleanup();reject(new Error('O navegador não conseguiu ler este áudio. / Browser could not decode this audio.'))};audio.src=url});
  return{name:file.name,type:types[ext],size:file.size,blob,duration,addedAt:new Date().toISOString()};
 }finally{audio.pause();audio.removeAttribute('src');audio.load();URL.revokeObjectURL(url)}
}
