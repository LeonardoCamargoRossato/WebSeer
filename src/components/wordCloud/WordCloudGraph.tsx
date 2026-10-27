import {pngWithAttribution} from '../../reports/exportAttribution';
import {download} from '../../reports/reportUtils';
import {useEffect,useMemo,useRef,useState} from 'react';
import WordCloud from 'wordcloud';
import VisualizationToolbar from '../common/VisualizationToolbar';
import type {WordFrequency} from '../../features/frequency/frequencyTypes';

export type CloudPalette='blue'|'warm'|'cool'|'frequency'|'mono'|'rainbow'|'pastel'|'webseer'|'custom';
export type CloudShape='square'|'circle'|'ellipse';
export type CloudRotation='horizontal'|'mixed'|'random';

type Props={
  data:WordFrequency[];
  palette:CloudPalette;
  customColor:string;
  background:string;
  shape:CloudShape;
  rotation:CloudRotation;
  fontFamily:string;
  scale:number;
  sizeContrast:number;
  wordSpacing:number;
};

const palettes:Record<Exclude<CloudPalette,'custom'|'frequency'>,string[]>={
  blue:['#315fba','#547fca','#6d94d8','#8daee1','#203f7e'],
  warm:['#e6865d','#d85f49','#efad73','#bf7155','#9c4c38'],
  cool:['#315fba','#547fca','#5a8f9e','#6d7ec4','#3c6f89'],
  mono:['#172033','#344157','#5b6678','#7c8798','#9aa4b2'],
  rainbow:['#315fba','#e6865d','#7b61a8','#4b9a76','#d2a43f','#ca5f8b'],
  pastel:['#9fb8e8','#efb39b','#b8d9c5','#c7b8e2','#efd69f'],
  webseer:['#315fba','#547fca','#e6865d','#68758a','#7b61a8']
};

function hexToRgb(hex:string){
  const clean=hex.replace('#','');
  const value=parseInt(clean,16);
  return {r:(value>>16)&255,g:(value>>8)&255,b:value&255};
}

function mixColor(a:string,b:string,t:number){
  const ca=hexToRgb(a),cb=hexToRgb(b),p=Math.max(0,Math.min(1,t));
  const r=Math.round(ca.r+(cb.r-ca.r)*p),g=Math.round(ca.g+(cb.g-ca.g)*p),bl=Math.round(ca.b+(cb.b-ca.b)*p);
  return `rgb(${r}, ${g}, ${bl})`;
}

const frequencyStops=['#2563eb','#06b6d4','#facc15','#f97316','#dc2626'];

function frequencyColor(normalized:number){
  const n=Math.max(0,Math.min(1,normalized));
  const scaled=n*(frequencyStops.length-1);
  const index=Math.min(frequencyStops.length-2,Math.floor(scaled));
  return mixColor(frequencyStops[index],frequencyStops[index+1],scaled-index);
}

export default function WordCloudGraph({data,palette,customColor,background,shape,rotation,fontFamily,scale,sizeContrast,wordSpacing}:Props){
  const shellRef=useRef<HTMLDivElement|null>(null);
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const viewportRef=useRef<HTMLDivElement|null>(null);
  const [zoom,setZoom]=useState(100);const [exportError,setExportError]=useState('');
  const [offset,setOffset]=useState({x:0,y:0});
  const drag=useRef<{x:number;y:number;ox:number;oy:number}|null>(null);

  const colors=useMemo(()=>palette==='custom'?[customColor]:palette==='frequency'?[]:palettes[palette],[palette,customColor]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const rect=canvas.getBoundingClientRect();
    const ratio=Math.max(1,window.devicePixelRatio||1);
    canvas.width=Math.max(900,Math.round(rect.width*ratio));
    canvas.height=Math.max(580,Math.round(rect.height*ratio));
    if(!data.length){
      const ctx=canvas.getContext('2d');
      ctx?.clearRect(0,0,canvas.width,canvas.height);
      return;
    }
    const counts=data.map(d=>d.count);
    const min=Math.min(...counts),max=Math.max(...counts);
    const normalize=(value:number)=>max===min?1:(value-min)/(max-min);
    canvas.dataset.rendering='true';
    const done=()=>{canvas.dataset.rendering='false'};
    canvas.addEventListener('wordcloudstop',done,{once:true});
    canvas.addEventListener('wordcloudabort',done,{once:true});
    WordCloud(canvas,{
      list:data.map(d=>[d.word,d.count]),
      gridSize:Math.max(1,Math.round(wordSpacing*ratio)),
      weightFactor:(w:number)=>{
        const normalized=normalize(w);
        const emphasized=Math.pow(normalized,sizeContrast);
        return (14+emphasized*52)*scale*ratio;
      },
      fontFamily,
      backgroundColor:background,
      color:(_word:string,weight:number)=>palette==='frequency'
        ? frequencyColor(normalize(weight))
        : colors[Math.abs(Math.floor(weight))%Math.max(1,colors.length)],
      rotateRatio:rotation==='horizontal'?0:rotation==='mixed'?.38:.72,
      minRotation:rotation==='horizontal'?0:-Math.PI/2,
      maxRotation:rotation==='horizontal'?0:Math.PI/2,
      rotationSteps:rotation==='mixed'?2:6,
      shape:shape==='square'?'square':'circle',
      ellipticity:shape==='ellipse'?.62:1,
      drawOutOfBound:false,
      shrinkToFit:true
    });
    return()=>{canvas.removeEventListener('wordcloudstop',done);canvas.removeEventListener('wordcloudabort',done);canvas.dataset.rendering='false'};
  },[data,colors,background,shape,rotation,fontFamily,scale,sizeContrast,wordSpacing,palette]);

  const fit=()=>{setZoom(100);setOffset({x:0,y:0})};
  const exportPng=async()=>{const canvas=canvasRef.current;if(!canvas)return;setExportError('');try{download(await pngWithAttribution(canvas),'web-seer-word-cloud.png')}catch(error){setExportError(`Não foi possível exportar a imagem. / Could not export image. ${error instanceof Error?error.message:String(error)}`)}};

  return <div className="vizShell" ref={shellRef}>
    {exportError&&<p className="notice errorNotice" role="alert">{exportError}</p>}<VisualizationToolbar zoom={zoom} onZoomOut={()=>setZoom(z=>Math.max(40,z-10))} onZoomIn={()=>setZoom(z=>Math.min(300,z+10))} onFit={fit} onExport={exportPng} targetRef={shellRef}/>
    <div
      ref={viewportRef}
      className={`viz wordCloudViz ${drag.current?'isDragging':''}`}
      onWheel={e=>{e.preventDefault();setZoom(z=>Math.max(40,Math.min(300,z+(e.deltaY<0?10:-10))))}}
      onPointerDown={e=>{if((e.target as HTMLElement).closest('.graphToolbar'))return;drag.current={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y};(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);e.currentTarget.classList.add('isDragging')}}
      onPointerMove={e=>{if(!drag.current)return;setOffset({x:drag.current.ox+e.clientX-drag.current.x,y:drag.current.oy+e.clientY-drag.current.y})}}
      onPointerUp={e=>{drag.current=null;e.currentTarget.classList.remove('isDragging')}}
    >
      <canvas ref={canvasRef} style={{transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom/100})`,background}}/>
    </div>
  </div>;
}
