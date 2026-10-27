import {svgWithAttribution} from '../../reports/exportAttribution';
import {useEffect,useMemo,useRef,useState} from 'react';
import * as d3 from 'd3';
import VisualizationToolbar from '../common/VisualizationToolbar';
import WordNode,{measureWordNode,type WordNodeMetrics} from '../visualization/WordNode';
import ArrowLink,{ArrowDefs} from '../visualization/ArrowLink';
import type {WordTreeNode,WordTreeResult} from '../../features/wordTree/wordTreeTypes';
import {fontSizeFromFrequency} from '../../features/wordTree/buildWordTree';

type Positioned={node:WordTreeNode;x:number;y:number;depth:number;parent?:Positioned;metrics:WordNodeMetrics;id:string};

function layoutSide(nodes:WordTreeNode[],side:'forward'|'backward',maxFrequency:number):Positioned[]{
  const result:Positioned[]=[]; let leaf=0;
  const xFor=(depth:number)=>600+(side==='forward'?1:-1)*depth*205;
  const visit=(node:WordTreeNode,depth:number,parent?:Positioned,path=''):Positioned=>{
    const id=`${side}:${path}/${node.word}`;
    const font=fontSizeFromFrequency(node.frequency,maxFrequency,13,34);
    const size=measureWordNode(node.word,font);
    const current:Positioned={node,depth,x:xFor(depth),y:0,parent,metrics:{x:xFor(depth),y:0,width:size.width,height:size.height},id};
    result.push(current);
    const children=node.children.map((child,index)=>visit(child,depth+1,current,`${path}/${node.word}-${index}`));
    current.y=children.length?children.reduce((sum,c)=>sum+c.y,0)/children.length:86+(leaf++)*52;
    current.metrics.y=current.y; return current;
  };
  nodes.forEach((n,index)=>visit(n,1,undefined,`${index}`));
  if(result.length){
    const min=Math.min(...result.map(n=>n.y)),max=Math.max(...result.map(n=>n.y)),shift=325-(min+max)/2;
    result.forEach(n=>{n.y+=shift;n.metrics.y=n.y});
  }
  return result;
}

export default function WordTreeGraph({result,onSelect}:{result:WordTreeResult;onSelect:(tokens:string[])=>void}){
  const [zoom,setZoom]=useState(100),[hover,setHover]=useState<string|null>(null),[selected,setSelected]=useState('root');
  const shellRef=useRef<HTMLDivElement|null>(null),svgRef=useRef<SVGSVGElement|null>(null),rootGroupRef=useRef<SVGGElement|null>(null);
  const zoomRef=useRef<d3.ZoomBehavior<SVGSVGElement,unknown>|null>(null);
  const W=1200,H=650;
  const maxFrequency=Math.max(1,result.keywordFrequency,...result.forward.map(n=>n.frequency),...result.backward.map(n=>n.frequency));
  const rootFont=42,rootSize=measureWordNode(result.keyword,rootFont),root:WordNodeMetrics={x:600,y:325,width:rootSize.width,height:rootSize.height};
  const forward=useMemo(()=>layoutSide(result.forward,'forward',maxFrequency),[result.forward,maxFrequency]);
  const backward=useMemo(()=>layoutSide(result.backward,'backward',maxFrequency),[result.backward,maxFrequency]);
  const all=[...backward,...forward];

  useEffect(()=>{
    const svg=d3.select(svgRef.current!),group=d3.select(rootGroupRef.current!);
    const behavior=d3.zoom<SVGSVGElement,unknown>().scaleExtent([.3,5]).on('zoom',e=>{
      group.attr('transform',e.transform.toString()); setZoom(e.transform.k*100);
    });
    zoomRef.current=behavior; svg.call(behavior).on('dblclick.zoom',null);
    return()=>{svg.on('.zoom',null)};
  },[]);

  const parentMetrics=(item:Positioned)=>item.parent?.metrics??root;
  const isActive=(item:Positioned)=>!hover||item.id===hover||item.id.startsWith(hover)||hover.startsWith(item.id);
  const click=(item:Positioned)=>{setSelected(item.id);onSelect(item.node.pathTokens)};
  const zoomBy=(factor:number)=>{if(svgRef.current&&zoomRef.current)d3.select(svgRef.current!).transition().duration(160).call(zoomRef.current.scaleBy,factor)};
  const fit=()=>{
    const svg=svgRef.current,group=rootGroupRef.current,behavior=zoomRef.current;if(!svg||!group||!behavior)return;
    const box=group.getBBox();if(!box.width||!box.height)return;
    const k=Math.min((W-50)/box.width,(H-50)/box.height,1.4);
    const tr=d3.zoomIdentity.translate(W/2,H/2).scale(k).translate(-(box.x+box.width/2),-(box.y+box.height/2));
    d3.select(svg).transition().duration(220).call(behavior.transform,tr);
  };
  const exportSvg=()=>{
    const svg=svgRef.current;if(!svg)return;const blob=svgWithAttribution(svg);
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='web-seer-word-tree.svg';a.click();URL.revokeObjectURL(url);
  };

  return <div className="vizShell" ref={shellRef}>
    <VisualizationToolbar zoom={zoom} onZoomOut={()=>zoomBy(.85)} onZoomIn={()=>zoomBy(1.18)} onFit={fit} onExport={exportSvg} targetRef={shellRef}/>
    <div className="viz wordTreeCanvas"><svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="panZoomSvg"><ArrowDefs/><g ref={rootGroupRef}>
      {all.map(item=><ArrowLink key={`link-${item.id}`} source={parentMetrics(item)} target={item.metrics} direction={item.node.direction} weight={.9+Math.cbrt(item.node.frequency/maxFrequency)*2.5} active={isActive(item)}/>)}
      <WordNode word={result.keyword} frequency={result.keywordFrequency} x={root.x} y={root.y} fontSize={rootFont} variant="root" selected={selected==='root'} onClick={()=>{setSelected('root');onSelect([result.keyword])}}/>
      {all.map(item=><WordNode key={item.id} word={item.node.word} frequency={item.node.frequency} x={item.x} y={item.y} fontSize={fontSizeFromFrequency(item.node.frequency,maxFrequency,13,34)} variant={item.node.direction} selected={selected===item.id} onMouseEnter={()=>setHover(item.id)} onMouseLeave={()=>setHover(null)} onClick={()=>click(item)}/>)}
    </g></svg></div>
  </div>;
}
