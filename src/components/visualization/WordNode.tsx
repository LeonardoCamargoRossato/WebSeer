import type {MouseEventHandler} from 'react';

export type WordNodeVariant=
  | 'root'
  | 'forward'
  | 'backward'
  | 'neutral'
  | 'left'
  | 'right'
  | 'shared';

export type WordNodeMetrics={x:number;y:number;width:number;height:number};

export function measureWordNode(word:string,fontSize:number):{width:number;height:number}{
  return {
    width:Math.max(58,word.length*fontSize*.58+28),
    height:Math.max(34,fontSize+16)
  };
}

export default function WordNode({word,frequency,x,y,fontSize,variant='neutral',selected=false,onClick,onMouseEnter,onMouseLeave}:{
  word:string;frequency?:number;x:number;y:number;fontSize:number;variant?:WordNodeVariant;selected?:boolean;
  onClick?:MouseEventHandler<SVGGElement>;onMouseEnter?:MouseEventHandler<SVGGElement>;onMouseLeave?:MouseEventHandler<SVGGElement>;
}){
  const {width,height}=measureWordNode(word,fontSize);
  return <g className={`wordNode wordNode--${variant} ${selected?'is-selected':''}`} transform={`translate(${x},${y})`} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <rect x={-width/2} y={-height/2} width={width} height={height} rx={12}/>
    <text textAnchor="middle" dominantBaseline="central" style={{fontSize,fontWeight:variant==='root'?700:560}}>{word}</text>
    {frequency!==undefined&&variant!=='root'&&<text className="wordNodeFreq" x={width/2-7} y={-height/2+9} textAnchor="end">{frequency}</text>}
  </g>;
}
