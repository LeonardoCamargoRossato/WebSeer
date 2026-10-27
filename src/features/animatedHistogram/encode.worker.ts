/// <reference lib="webworker" />
import {advanceRank,type RankMotion} from './rankMotion';
import {GIFEncoder,quantize,applyPalette} from 'gifenc';
import {Muxer,ArrayBufferTarget} from 'mp4-muxer';
import {drawFrame,WIDTH,HEIGHT} from './drawFrame';
import type {PageCounts} from './countPages';
self.onmessage=async(event:MessageEvent<{terms:string[];rows:PageCounts[];fps:number;framesPerPage:number;format:'gif'|'mp4';title:string;english:boolean;rankSeconds?:number}>)=>{
 const {terms,rows,fps,framesPerPage,format,title,english,rankSeconds=1}=event.data;
 let encoder:VideoEncoder|undefined;
 try{
  if(!rows.length)throw new Error('No pages to animate');
  const canvas=new OffscreenCanvas(WIDTH,HEIGHT),ctx=canvas.getContext('2d',{willReadFrequently:format==='gif'})!;
  const gif=format==='gif'?GIFEncoder():undefined;
  const muxer=format==='mp4'?new Muxer({target:new ArrayBufferTarget(),video:{codec:'avc',width:WIDTH,height:HEIGHT},fastStart:'in-memory',firstTimestampBehavior:'offset'}):undefined;
  let encodingError:Error|undefined;
  if(muxer){const config:VideoEncoderConfig={codec:'avc1.42001f',width:WIDTH,height:HEIGHT,bitrate:1800000,framerate:fps,avc:{format:'avc'}};const supported=await VideoEncoder.isConfigSupported(config);if(!supported.supported)throw new Error('MP4 encoder unavailable. Choose GIF.');encoder=new VideoEncoder({output:(chunk,meta)=>muxer.addVideoChunk(chunk,meta),error:error=>{encodingError=error}});encoder.configure(config)}
  const total=rows.length*framesPerPage+Math.ceil((rankSeconds+.25)*fps);let frameIndex=0;let palette:number[][]|undefined;let motion:RankMotion|undefined;
  // Palette sampled from all bars, so colors remain stable across frames.
  drawFrame(ctx,terms,rows,rows.length-1,1,title,english);
  if(gif)palette=quantize(ctx.getImageData(0,0,WIDTH,HEIGHT).data,128);
  for(let n=0;n<total;n++){
   const last=n>=rows.length*framesPerPage;const page=last?rows.length-1:Math.floor(n/framesPerPage);const fraction=last?1:(n%framesPerPage+1)/framesPerPage;
   const previous=page?rows[page-1].cumulative:terms.map(()=>0);const values=terms.map((_,i)=>previous[i]+(rows[page].cumulative[i]-previous[i])*fraction);const frame=advanceRank(motion,values,n/fps,rankSeconds);motion=frame.motion;drawFrame(ctx,terms,rows,page,fraction,title,english,frame.positions);
   if(gif){const pixels=ctx.getImageData(0,0,WIDTH,HEIGHT).data;gif.writeFrame(applyPalette(pixels,palette!),WIDTH,HEIGHT,{palette,delay:Math.round(1000/fps),repeat:0})}
   if(encoder){if(encodingError)throw encodingError;while(encoder.encodeQueueSize>6){if(encodingError)throw encodingError;await new Promise(resolve=>setTimeout(resolve,5))}const frame=new VideoFrame(canvas,{timestamp:Math.round(frameIndex*1000000/fps),duration:Math.round(1000000/fps)});encoder.encode(frame,{keyFrame:frameIndex%(fps*2)===0});frame.close()}
   frameIndex++;if(n%4===0){self.postMessage({progress:Math.round((n+1)/total*100)});await new Promise(resolve=>setTimeout(resolve,0))}
  }
  let blob:Blob;
  if(gif){gif.finish();blob=new Blob([new Uint8Array(gif.bytes()).buffer],{type:'image/gif'})}
  else{await encoder!.flush();if(encodingError)throw encodingError;muxer!.finalize();blob=new Blob([muxer!.target.buffer],{type:'video/mp4'})}
  self.postMessage({blob});
 }catch(error){self.postMessage({error:error instanceof Error?error.message:String(error)})}finally{if(encoder&&encoder.state!=='closed')encoder.close()}
};
