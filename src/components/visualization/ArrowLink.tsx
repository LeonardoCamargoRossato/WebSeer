import type {WordNodeMetrics} from './WordNode';

export type ArrowLinkProps={
  source:WordNodeMetrics;
  target:WordNodeMetrics;
  direction?:'forward'|'backward';
  weight?:number;
  active?:boolean;
  className?:string;
  opacity?:number;
};

export function ArrowDefs(){
  return <defs>
    <marker
      id="wordtree-arrowhead"
      viewBox="0 0 8 8"
      markerWidth="8"
      markerHeight="8"
      refX="7"
      refY="4"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L8,4 L0,8 Z" fill="context-stroke"/>
    </marker>
  </defs>;
}

export default function ArrowLink({source,target,direction='forward',weight=1,active=true,className='',opacity}:ArrowLinkProps){
  // Forward: parent -> child. Backward semantic direction: left child -> parent closer to keyword.
  const from=direction==='forward'?source:target;
  const to=direction==='forward'?target:source;
  const movingRight=to.x>=from.x;
  const x1=from.x+(movingRight?from.width/2:-from.width/2);
  const x2=to.x+(movingRight?-to.width/2:to.width/2);
  const dx=Math.abs(x2-x1);
  const c1=x1+(movingRight?1:-1)*dx*.46;
  const c2=x2-(movingRight?1:-1)*dx*.46;
  return <path
    className={`wordArrow ${className}`.trim()}
    d={`M ${x1} ${from.y} C ${c1} ${from.y}, ${c2} ${to.y}, ${x2} ${to.y}`}
    markerEnd="url(#wordtree-arrowhead)"
    style={{strokeWidth:weight,opacity:opacity ?? (active?.78:.11)}}
  />;
}
