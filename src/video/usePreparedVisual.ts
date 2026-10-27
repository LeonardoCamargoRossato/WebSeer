import {useEffect,useState} from 'react';
import type {Report} from '../storage/archive';
import {operation} from '../storage/database';
import type {VideoDraft} from './videoDraft';
import {preparedVideo} from './mixSoundtrack';
/** Saved report previews use the same prepared file as downloads and uploads. */
export function usePreparedVisual(report:Report){
 const [visual,setVisual]=useState(report.visual);
 useEffect(()=>{let live=true;setVisual(report.visual);if(report.tool==='animatedHistogram')void operation<VideoDraft|undefined>('videoDrafts','readonly',store=>store.get(report.id)).then(draft=>{if(live)setVisual(preparedVideo(report,draft))}).catch(()=>{/* Original preview remains available. */});return()=>{live=false}},[report]);
 return visual;
}
