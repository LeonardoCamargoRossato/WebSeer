/** Counts advance on their own clock; rank changes use a separate, continuous motion. */
export type RankMotion={from:number[];targets:number[];startedAt:number;duration:number};
export function rankPositions(values:number[]){const order=values.map((_,i)=>i).sort((a,b)=>values[b]-values[a]||a-b);return values.map((_,i)=>order.indexOf(i))}
export function sampleRank(motion:RankMotion,time:number){const fraction=Math.min(1,Math.max(0,(time-motion.startedAt)/motion.duration));const eased=fraction*fraction*(3-2*fraction);return motion.from.map((p,i)=>p+(motion.targets[i]-p)*eased)}
export function advanceRank(motion:RankMotion|undefined,values:number[],time:number,duration=1):{motion:RankMotion;positions:number[]}{
 const targets=rankPositions(values);
 if(!motion){const initial=values.map((_,i)=>i);motion={from:initial,targets:initial,startedAt:time,duration:Math.max(.1,duration)}}
 const positions=sampleRank(motion,time);
 if(targets.some((target,i)=>target!==motion!.targets[i]))motion={from:positions,targets,startedAt:time,duration:Math.max(.1,duration)};
 return{motion,positions};
}
