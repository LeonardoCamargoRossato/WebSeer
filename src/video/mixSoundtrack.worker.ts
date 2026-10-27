/// <reference lib="webworker" />
import {Input,BlobSource,ALL_FORMATS,Output,Mp4OutputFormat,BufferTarget,EncodedPacketSink,EncodedVideoPacketSource,AudioSampleSource,AudioSample,canEncodeAudio} from 'mediabunny';
import {registerAacEncoder} from '@mediabunny/aac-encoder';
self.onmessage=async(event:MessageEvent<{video:Blob;planes:Float32Array[];sampleRate:number}>)=>{
 const {video,planes,sampleRate}=event.data;const input=new Input({source:new BlobSource(video),formats:ALL_FORMATS});let output:Output|undefined;
 try{
  const track=await input.getPrimaryVideoTrack();if(!track?.codec)throw new Error('Faixa de vídeo não encontrada. / Video track not found.');
  const config=await track.getDecoderConfig(),duration=await track.computeDuration();if(!config||!Number.isFinite(duration)||duration<=0||!planes[0]?.length)throw new Error('Duração ou áudio inválido. / Invalid duration or audio.');
  if(!await canEncodeAudio('aac'))registerAacEncoder();
  const target=new BufferTarget();output=new Output({format:new Mp4OutputFormat({fastStart:'in-memory'}),target});
  const picture=new EncodedVideoPacketSource(track.codec),audio=new AudioSampleSource({codec:'aac',bitrate:128000});
  output.addVideoTrack(picture,{decoderConfig:config});output.addAudioTrack(audio);await output.start();
  // Video packets are copied verbatim: no quality loss or expensive video re-encoding.
  await Promise.all([(async()=>{for await(const packet of new EncodedPacketSink(track).packets()){await picture.add(packet,{decoderConfig:config})}picture.close()})(),(async()=>{
   const frames=Math.ceil(duration*sampleRate),channels=planes.length,length=planes[0].length;
   for(let offset=0;offset<frames;offset+=4096){const count=Math.min(4096,frames-offset),data=new Float32Array(count*channels);for(let c=0;c<channels;c++)for(let i=0;i<count;i++)data[c*count+i]=planes[c][(offset+i)%length];
    const sample=new AudioSample({data,format:'f32-planar',numberOfChannels:channels,sampleRate,timestamp:offset/sampleRate});try{await audio.add(sample)}finally{sample.close()}
    if(offset%(4096*8)===0){self.postMessage({progress:Math.round(offset/frames*95)});await new Promise(resolve=>setTimeout(resolve,0))}
   }audio.close()
  })()]);
  await output.finalize();self.postMessage({blob:new Blob([target.buffer!],{type:'video/mp4'})});
 }catch(error){if(output&&output.state!=='finalized'&&output.state!=='canceled')await output.cancel().catch(()=>{});self.postMessage({error:error instanceof Error?error.message:String(error)})}finally{input.dispose()}
};
