import {useEffect,useMemo,useRef,useState} from 'react';
import * as d3 from 'd3';
import {scaleLinear} from 'd3';
import type {Suggestion} from '../../types/suggestion';
import VisualizationToolbar from '../common/VisualizationToolbar';
import WordNode,{measureWordNode,type WordNodeMetrics} from '../visualization/WordNode';
import ArrowLink,{ArrowDefs} from '../visualization/ArrowLink';

type Props={a:Suggestion[];b:Suggestion[];weightBy:'Frequency'|'Rank'|'Score';queryA:string;queryB:string};

export default function CompareGraph({a,b,weightBy,queryA,queryB}:Props){
 const [hover,setHover]=useState<string|null>(null);
 const [zoom,setZoom]=useState(100);
 const shellRef=useRef<HTMLDivElement|null>(null);
 const svgRef=useRef<SVGSVGElement|null>(null);
 const rootRef=useRef<SVGGElement|null>(null);
 const zoomRef=useRef<d3.ZoomBehavior<SVGSVGElement,unknown>|null>(null);
 const W=1200,H=760,leftX=225,rightX=975,centerX=600,rootY=78;

 useEffect(()=>{
   const svg=d3.select(svgRef.current),root=d3.select(rootRef.current);
   const behavior=d3.zoom<SVGSVGElement,unknown>().scaleExtent([.35,4]).on('zoom',e=>{
     root.attr('transform',e.transform.toString());
     setZoom(e.transform.k*100);
   });
   zoomRef.current=behavior;
   svg.call(behavior).on('dblclick.zoom',null);
   return()=>{svg.on('.zoom',null)};
 },[]);

 const key=(s:Suggestion)=>s.text.toLowerCase();
 const shared=useMemo(()=>new Set(a.map(key).filter(k=>b.some(x=>key(x)===k))),[a,b]);
 const val=(s:Suggestion)=>weightBy==='Rank'?1/(s.rank??1):weightBy==='Score'?s.score:(s.frequency??1);
 const max=Math.max(1,...a.map(val),...b.map(val));
 const sw=scaleLinear().domain([0,max]).range([1.3,5.5]);
 const fs=scaleLinear().domain([0,max]).range([14,22]);
 const uniqueA=a.filter(s=>!shared.has(key(s))), uniqueB=b.filter(s=>!shared.has(key(s)));
 const sharedItems=[...shared];
 const pos=(i:number,n:number)=>155+i*(520/Math.max(1,n-1));
 const metrics=(cx:number,cy:number,word:string,fontSize:number):WordNodeMetrics=>{const measured=measureWordNode(word,fontSize);return{x:cx,y:cy,width:measured.width,height:measured.height}};
 const leftRoot=metrics(leftX,rootY,queryA,18),rightRoot=metrics(rightX,rootY,qbSafe(queryB),18);
 const opacity=(term:string)=>hover ? (hover===term ? 1 : .12) : .74;

 const zoomBy=(factor:number)=>{if(svgRef.current&&zoomRef.current)d3.select(svgRef.current).transition().duration(160).call(zoomRef.current.scaleBy,factor)};
 const fit=()=>{
   const svg=svgRef.current,root=rootRef.current,behavior=zoomRef.current;
   if(!svg||!root||!behavior)return;
   const box=root.getBBox(); if(!box.width||!box.height)return;
   const k=Math.min((W-50)/box.width,(H-50)/box.height,1.5);
   const tr=d3.zoomIdentity.translate(W/2,H/2).scale(k).translate(-(box.x+box.width/2),-(box.y+box.height/2));
   d3.select(svg).transition().duration(220).call(behavior.transform,tr);
 };
 const exportSvg=()=>{
   const svg=svgRef.current;if(!svg)return;
   const blob=new Blob([svg.outerHTML],{type:'image/svg+xml'}); const u=URL.createObjectURL(blob);
   const el=document.createElement('a');el.href=u;el.download='web-seer-compare.svg';el.click();URL.revokeObjectURL(u);
 };

 return <div className="vizShell" ref={shellRef}>
  <VisualizationToolbar zoom={zoom} onZoomOut={()=>zoomBy(.85)} onZoomIn={()=>zoomBy(1.18)} onFit={fit} onExport={exportSvg} targetRef={shellRef}/>
  <div className="viz compareViz">
   <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="panZoomSvg"><ArrowDefs/><g ref={rootRef}>
    <WordNode x={leftX} y={rootY} word={queryA} fontSize={18} variant="left"/><WordNode x={rightX} y={rootY} word={queryB} fontSize={18} variant="right"/>
    {uniqueA.map((s,i)=>{const y=pos(i,uniqueA.length),term=key(s),font=fs(val(s)),dst=metrics(leftX,y,s.text,font);return <g key={'a'+s.text} onMouseEnter={()=>setHover(term)} onMouseLeave={()=>setHover(null)}><ArrowLink source={leftRoot} target={dst} className="warm" weight={sw(val(s))} opacity={opacity(term)}/><WordNode x={leftX} y={y} word={s.text} fontSize={font} variant="left" selected={hover===term}/></g>})}
    {uniqueB.map((s,i)=>{const y=pos(i,uniqueB.length),term=key(s),font=fs(val(s)),dst=metrics(rightX,y,s.text,font);return <g key={'b'+s.text} onMouseEnter={()=>setHover(term)} onMouseLeave={()=>setHover(null)}><ArrowLink source={rightRoot} target={dst} className="cool" weight={sw(val(s))} opacity={opacity(term)}/><WordNode x={rightX} y={y} word={s.text} fontSize={font} variant="right" selected={hover===term}/></g>})}
    {sharedItems.map((term,i)=>{const sa=a.find(x=>key(x)===term)!,sb=b.find(x=>key(x)===term)!,y=155+i*(520/Math.max(1,sharedItems.length-1)),font=Math.max(fs(val(sa)),fs(val(sb))),dst=metrics(centerX,y,term,font);return <g key={term} onMouseEnter={()=>setHover(term)} onMouseLeave={()=>setHover(null)}><ArrowLink source={leftRoot} target={dst} className="warm" weight={sw(val(sa))} opacity={opacity(term)}/><ArrowLink source={rightRoot} target={dst} className="cool" weight={sw(val(sb))} opacity={opacity(term)}/><WordNode x={centerX} y={y} word={term} fontSize={font} variant="shared" selected={hover===term}/></g>})}
   </g></svg>
  </div>
 </div>;
}
function qbSafe(value:string){return value||' '}
