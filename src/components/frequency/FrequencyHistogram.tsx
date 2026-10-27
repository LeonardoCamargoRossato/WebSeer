import {AUTHOR_BYLINE,PORTFOLIO_URL} from '../../config/author';
import {svgWithAttribution} from '../../reports/exportAttribution';
import {useEffect,useRef,useState} from 'react';
import * as d3 from 'd3';
import VisualizationToolbar from '../common/VisualizationToolbar';
import type {WordFrequency} from '../../features/frequency/frequencyTypes';
import {useI18n} from '../../i18n';

type Props={
  data:WordFrequency[];
  orientation:'horizontal'|'vertical';
  onOpenWordTree:(word:string)=>void;
};

export default function FrequencyHistogram({data,orientation,onOpenWordTree}:Props){
  const {t,locale}=useI18n();
  const shellRef=useRef<HTMLDivElement|null>(null);
  const svgRef=useRef<SVGSVGElement|null>(null);
  const rootRef=useRef<SVGGElement|null>(null);
  const zoomRef=useRef<d3.ZoomBehavior<SVGSVGElement,unknown>|null>(null);
  const [zoom,setZoom]=useState(100);
  const W=1200,H=700,pad={top:45,right:70,bottom:70,left:150};

  useEffect(()=>{
    const svg=d3.select(svgRef.current!);
    const root=d3.select(rootRef.current!);
    const zoomBehavior=d3.zoom<SVGSVGElement,unknown>().scaleExtent([.35,5]).on('zoom',event=>{
      root.attr('transform',event.transform.toString());
      setZoom(event.transform.k*100);
    });
    zoomRef.current=zoomBehavior;
    svg.call(zoomBehavior).on('dblclick.zoom',null);
    return()=>{svg.on('.zoom',null)};
  },[]);

  const fit=()=>{
    const svg=svgRef.current,root=rootRef.current,behavior=zoomRef.current;
    if(!svg||!root||!behavior)return;
    const box=root.getBBox();
    if(!box.width||!box.height)return;
    const k=Math.min((W-40)/box.width,(H-40)/box.height,1.8);
    const tr=d3.zoomIdentity.translate(W/2,H/2).scale(k).translate(-(box.x+box.width/2),-(box.y+box.height/2));
    d3.select(svg).transition().duration(220).call(behavior.transform,tr);
  };
  const zoomBy=(factor:number)=>{if(svgRef.current&&zoomRef.current)d3.select(svgRef.current!).transition().duration(160).call(zoomRef.current.scaleBy,factor)};

  const exportSvg=()=>{
    const svg=svgRef.current;if(!svg)return;
    const blob=svgWithAttribution(svg);
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='web-seer-frequencies.svg';a.click();URL.revokeObjectURL(url);
  };
  const exportCsv=()=>{
    const rows=[['word','frequency','percentage','created_by','portfolio_url'],...data.map(d=>[d.word,String(d.count),d.percentage.toFixed(6),AUTHOR_BYLINE,PORTFOLIO_URL])];
    const blob=new Blob([rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='web-seer-frequencies.csv';a.click();URL.revokeObjectURL(url);
  };

  const max=Math.max(1,...data.map(d=>d.count));
  const tooltip=(d:WordFrequency)=>`${d.word}\n${d.count.toLocaleString(locale)} ${t.frequencies.occurrences}\n${d.percentage.toLocaleString(locale,{maximumFractionDigits:2})}% ${t.frequencies.ofCorpus}`;

  return <div className="vizShell" ref={shellRef}>
    <VisualizationToolbar zoom={zoom} onZoomOut={()=>zoomBy(.85)} onZoomIn={()=>zoomBy(1.18)} onFit={fit} onExport={exportSvg} targetRef={shellRef}/>
    <button className="csvExportButton" onClick={exportCsv}>{t.frequencies.exportCsv}</button>
    <div className="viz frequencyViz">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="panZoomSvg">
        <g ref={rootRef}>
          {orientation==='horizontal'?(()=>{
            const x=d3.scaleLinear().domain([0,max]).range([0,W-pad.left-pad.right]);
            const band=d3.scaleBand().domain(data.map(d=>d.word)).range([pad.top,H-pad.bottom]).padding(.2);
            return <>
              {data.map(d=><g key={d.word} className="frequencyBarGroup" onClick={()=>onOpenWordTree(d.word)}>
                <title>{tooltip(d)}</title>
                <text x={pad.left-12} y={(band(d.word)??0)+band.bandwidth()/2} dy=".35em" textAnchor="end">{d.word}</text>
                <rect x={pad.left} y={band(d.word)} width={x(d.count)} height={band.bandwidth()} rx="5"/>
                <text x={pad.left+x(d.count)+8} y={(band(d.word)??0)+band.bandwidth()/2} dy=".35em">{d.count}</text>
              </g>)}
            </>;
          })():(()=>{
            const x=d3.scaleBand().domain(data.map(d=>d.word)).range([pad.left,W-pad.right]).padding(.2);
            const y=d3.scaleLinear().domain([0,max]).range([H-pad.bottom,pad.top]);
            return <>
              {data.map(d=><g key={d.word} className="frequencyBarGroup" onClick={()=>onOpenWordTree(d.word)}>
                <title>{tooltip(d)}</title>
                <rect x={x(d.word)} y={y(d.count)} width={x.bandwidth()} height={H-pad.bottom-y(d.count)} rx="5"/>
                <text transform={`translate(${(x(d.word)??0)+x.bandwidth()/2},${H-pad.bottom+12}) rotate(-45)`} textAnchor="end">{d.word}</text>
                <text x={(x(d.word)??0)+x.bandwidth()/2} y={y(d.count)-8} textAnchor="middle">{d.count}</text>
              </g>)}
            </>;
          })()}
        </g>
      </svg>
    </div>
  </div>;
}
