import {useEffect,useState} from 'react';
import {libraryUsage,type LibraryUsage} from '../../storage/storageMetrics';
export function useLibraryUsage(){
 const [usage,setUsage]=useState<LibraryUsage>(),[estimate,setEstimate]=useState<StorageEstimate>(),[error,setError]=useState(false);
 useEffect(()=>{let live=true,running=false,again=false;let timer:ReturnType<typeof setTimeout>|undefined;
 const load=async()=>{if(running){again=true;return}running=true;try{const [data,browser]=await Promise.allSettled([libraryUsage(),navigator.storage?.estimate?.()]);if(live){if(data.status==='fulfilled')setUsage(data.value);if(browser.status==='fulfilled')setEstimate(browser.value);setError(data.status==='rejected'||browser.status==='rejected')}}catch{if(live)setError(true)}finally{running=false;if(live&&again){again=false;timer=setTimeout(()=>void load(),250)}}};
 const update=()=>{clearTimeout(timer);timer=setTimeout(()=>void load(),250)};void load();window.addEventListener('webseer-archive-change',update);window.addEventListener('focus',update);const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('webseer-archive'):undefined;if(channel)channel.onmessage=update;return()=>{live=false;clearTimeout(timer);window.removeEventListener('webseer-archive-change',update);window.removeEventListener('focus',update);channel?.close()}
 },[]);
 return{usage,estimate,error};
}
export function useLibraryLayout(key:string){const [layout,setValue]=useState<'details'|'cards'>(()=>{try{return localStorage.getItem(key)==='cards'?'cards':'details'}catch{return'details'}});const setLayout=(value:'details'|'cards')=>{setValue(value);try{localStorage.setItem(key,value)}catch{/* Preferences are optional. */}};return[layout,setLayout] as const}
