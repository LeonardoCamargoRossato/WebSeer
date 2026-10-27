import {svgWithAttribution} from '../../reports/exportAttribution';
import {useEffect,useMemo,useRef,useState} from 'react';
import * as d3 from 'd3';
import type {Edge} from '../../utils/phraseMatcher';
import VisualizationToolbar from '../common/VisualizationToolbar';

type Node=d3.SimulationNodeDatum & {id:string;frequency:number;width:number;height:number;role:'source'|'target'|'shared'};
type Link=d3.SimulationLinkDatum<Node> & {count:number};

function edgePoint(a:Node,b:Node){
  const ax=a.x??0,ay=a.y??0,bx=b.x??0,by=b.y??0,dx=bx-ax,dy=by-ay;
  const s=Math.min((a.width/2)/Math.max(Math.abs(dx),.001),(a.height/2)/Math.max(Math.abs(dy),.001));
  return{x:ax+dx*s,y:ay+dy*s};
}

export default function PhraseNetGraph({edges,clusterStrength=55,maxNodes=40}:{edges:Edge[];clusterStrength?:number;maxNodes?:number}){
 const shellRef=useRef<HTMLDivElement|null>(null);
 const ref=useRef<SVGSVGElement|null>(null),rootRef=useRef<SVGGElement|null>(null),zoomRef=useRef<d3.ZoomBehavior<SVGSVGElement,unknown>|null>(null);
 const [zoom,setZoom]=useState(100);
 const W=1100,H=680;

 const filtered=useMemo(()=>{
   const totals=new Map<string,number>();
   edges.forEach(e=>{totals.set(e.source,(totals.get(e.source)||0)+e.count);totals.set(e.target,(totals.get(e.target)||0)+e.count)});
   const keep=new Set([...totals.entries()].sort((a,b)=>b[1]-a[1]).slice(0,maxNodes).map(x=>x[0]));
   return edges.filter(e=>keep.has(e.source)&&keep.has(e.target));
 },[edges,maxNodes]);

 useEffect(()=>{
   const svg=d3.select(ref.current!);svg.selectAll('*').remove();
   const sourceSet=new Set(filtered.map(e=>e.source)),targetSet=new Set(filtered.map(e=>e.target));
   const freq=new Map<string,number>();
   filtered.forEach(e=>{freq.set(e.source,(freq.get(e.source)||0)+e.count);freq.set(e.target,(freq.get(e.target)||0)+e.count)});
   const maxFreq=Math.max(1,...freq.values()),font=d3.scaleLinear().domain([1,maxFreq]).range([14,25]);
   const nodes:Node[]=[...freq].map(([id,frequency],i)=>{
     const f=font(frequency),role=sourceSet.has(id)&&targetSet.has(id)?'shared':sourceSet.has(id)?'source':'target';
     return{id,frequency,role,width:Math.max(58,id.length*f*.56+28),height:f+18,x:W/2+Math.cos(i)*35,y:H/2+Math.sin(i)*35};
   });
   const links:Link[]=filtered.map(e=>({source:e.source,target:e.target,count:e.count}));
   const defs=svg.append('defs');
   defs.append('marker').attr('id','phrase-arrow').attr('viewBox','0 0 10 10').attr('refX',8).attr('refY',5).attr('markerWidth',7).attr('markerHeight',7).attr('orient','auto-start-reverse')
     .append('path').attr('d','M 0 0 L 10 5 L 0 10 z').attr('class','arrowHead');

   const root=svg.append('g');rootRef.current=root.node();
   const zoomBehavior=d3.zoom<SVGSVGElement,unknown>().scaleExtent([.35,4]).on('zoom',e=>{root.attr('transform',e.transform);setZoom(e.transform.k*100)});
   zoomRef.current=zoomBehavior;svg.call(zoomBehavior).on('dblclick.zoom',null);

   const sim=d3.forceSimulation<Node>(nodes)
     .force('link',d3.forceLink<Node,Link>(links).id(d=>d.id).distance(125).strength(.72))
     .force('charge',d3.forceManyBody().strength(-300))
     .force('center',d3.forceCenter(W/2,H/2))
     .force('x',d3.forceX(W/2).strength(clusterStrength/900))
     .force('y',d3.forceY(H/2).strength(clusterStrength/900))
     .force('collide',d3.forceCollide<Node>().radius(d=>Math.max(d.width,d.height)*.62).iterations(3));

   const l=root.selectAll('line').data(links).join('line').attr('class','netLine arrowNet').attr('marker-end','url(#phrase-arrow)').attr('stroke-width',d=>1+Math.min(6,d.count*1.6));
   const n=root.selectAll<SVGGElement,Node>('g.node').data(nodes).join('g')
     .attr('class',d=>`node wordNodeD3 role-${d.role}`)
     .call(d3.drag<SVGGElement,Node>().on('start',(e,d)=>{if(!e.active)sim.alphaTarget(.25).restart();d.fx=d.x;d.fy=d.y})
       .on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y})
       .on('end',(e,d)=>{if(!e.active)sim.alphaTarget(0);d.fx=null;d.fy=null}));
   n.append('rect').attr('x',d=>-d.width/2).attr('y',d=>-d.height/2).attr('width',d=>d.width).attr('height',d=>d.height).attr('rx',12);
   n.append('text').attr('text-anchor','middle').attr('dy','.34em').style('font-size',d=>`${font(d.frequency)}px`).text(d=>d.id);
   n.on('mouseenter',(_,d)=>{n.classed('dim',x=>x.id!==d.id).classed('active',x=>x.id===d.id);l.classed('dim',x=>(x.source as Node).id!==d.id&&(x.target as Node).id!==d.id)})
     .on('mouseleave',()=>{n.classed('dim',false).classed('active',false);l.classed('dim',false)});

   sim.on('tick',()=>{
     l.attr('x1',d=>edgePoint(d.source as Node,d.target as Node).x).attr('y1',d=>edgePoint(d.source as Node,d.target as Node).y)
      .attr('x2',d=>edgePoint(d.target as Node,d.source as Node).x).attr('y2',d=>edgePoint(d.target as Node,d.source as Node).y);
     n.attr('transform',d=>`translate(${d.x},${d.y})`);
   });
   return()=>{sim.stop();svg.on('.zoom',null)};
 },[filtered,clusterStrength]);

 const changeZoom=(factor:number)=>{if(ref.current&&zoomRef.current)d3.select(ref.current!).transition().duration(180).call(zoomRef.current.scaleBy,factor)};
 const fit=()=>{
   const svg=ref.current,root=rootRef.current,behavior=zoomRef.current;if(!svg||!root||!behavior)return;
   const box=root.getBBox();if(!box.width||!box.height)return;
   const k=Math.min((W-50)/box.width,(H-50)/box.height,1.5);
   const tr=d3.zoomIdentity.translate(W/2,H/2).scale(k).translate(-(box.x+box.width/2),-(box.y+box.height/2));
   d3.select(svg).transition().duration(220).call(behavior.transform,tr);
 };
 const exportSvg=()=>{if(!ref.current)return;const blob=svgWithAttribution(ref.current);const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='web-seer-phrase-net.svg';a.click();URL.revokeObjectURL(url)};

 return <div className="vizShell" ref={shellRef}>
   <VisualizationToolbar zoom={zoom} onZoomOut={()=>changeZoom(.85)} onZoomIn={()=>changeZoom(1.18)} onFit={fit} onExport={exportSvg} targetRef={shellRef}/>
   <div className="viz netViz"><svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="panZoomSvg"/></div>
 </div>;
}
