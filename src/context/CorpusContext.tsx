import {archiveCorpus,getSnapshot} from '../storage/archive';
import {createContext,useCallback,useContext,useMemo,useRef,useState,type ReactNode} from 'react';
import type {ActiveCorpus,CorpusDocument,CorpusSourceType} from '../types/corpus';

export type AvailableCorpus=Pick<ActiveCorpus,'id'|'name'|'sourceType'|'pageCount'|'createdAt'|'archive'>;
type CorpusContextValue={storageError:string|null;loadError:string|null;loadingTool:string|null;loadedFor:string|null;availableCorpus:AvailableCorpus|null;activeCorpus:ActiveCorpus|null;setActiveCorpus:(corpus:ActiveCorpus|null)=>void;loadForTool:(tool:string)=>Promise<void>;releaseTool:()=>void;setTextCorpus:(name:string,text:string,sourceType?:Exclude<CorpusSourceType,'pdf'>)=>void;setPdfCorpus:(name:string,pages:string[])=>void;clearCorpus:()=>void};
const CorpusContext=createContext<CorpusContextValue|null>(null);
const selectionKey='webseer.selectedCorpus';
function summary(corpus:ActiveCorpus):AvailableCorpus{return{id:corpus.id,name:corpus.name,sourceType:corpus.sourceType,pageCount:corpus.pageCount,createdAt:corpus.createdAt,archive:corpus.archive}}
function remembered():AvailableCorpus|null{try{const value=JSON.parse(localStorage.getItem(selectionKey)||'null');return value&&typeof value.id==='string'&&typeof value.name==='string'&&typeof value.archive?.snapshotId==='string'&&typeof value.archive?.documentId==='string'?value:null}catch{return null}}
function remember(value:AvailableCorpus|null){try{if(value?.archive)localStorage.setItem(selectionKey,JSON.stringify(value));else localStorage.removeItem(selectionKey)}catch{/* A selection preference is optional. */}}
function makeId(){return crypto.randomUUID()}

export function CorpusProvider({children}:{children:ReactNode}){
 const [availableCorpus,setAvailable]=useState<AvailableCorpus|null>(remembered),[activeCorpus,setLoaded]=useState<ActiveCorpus|null>(null),[storageError,setStorageError]=useState<string|null>(null),[loadError,setLoadError]=useState<string|null>(null),[loadingTool,setLoadingTool]=useState<string|null>(null),[loadedFor,setLoadedFor]=useState<string|null>(null);
 const available=useRef(availableCorpus),fallback=useRef<ActiveCorpus|null>(null),preparing=useRef<Promise<AvailableCorpus|null>|null>(null),generation=useRef(0),request=useRef(0);
 const releaseTool=useCallback(()=>{request.current++;setLoaded(null);setLoadedFor(null);setLoadingTool(null);setLoadError(null)},[]);
 const setActiveCorpus=useCallback((corpus:ActiveCorpus|null)=>{
  const version=++generation.current;releaseTool();setStorageError(null);fallback.current=corpus;const descriptor=corpus?summary(corpus):null;available.current=descriptor;setAvailable(descriptor);remember(descriptor);
  if(!corpus){preparing.current=null;return}
  // Conversion prepares a cache entry; it does not mount or calculate an analysis.
  const task=(async()=>{try{const refs=await archiveCorpus(corpus);const ready={...summary(corpus),archive:refs};if(generation.current===version){available.current=ready;setAvailable(ready);fallback.current=null;remember(ready)}return ready}catch{if(generation.current===version)setStorageError('Não foi possível salvar o documento no IndexedDB. O texto fica disponível nesta sessão. / Could not save to IndexedDB. Text remains available in this session.');return descriptor}})();
  preparing.current=task;
 },[releaseTool]);
 const loadForTool=useCallback(async(tool:string)=>{
  const ticket=++request.current,version=generation.current;setLoaded(null);setLoadedFor(null);setLoadingTool(tool);setLoadError(null);
  try{
   if(preparing.current)await preparing.current;
   if(ticket!==request.current||version!==generation.current)return;
   const descriptor=available.current;if(!descriptor)return;
   let corpus:ActiveCorpus|undefined;
   if(descriptor.archive){try{const saved=await getSnapshot(descriptor.archive.snapshotId);corpus=saved?.corpus}catch(error){if(!fallback.current)throw error}}
   corpus??=fallback.current??undefined;
   if(!corpus)throw new Error('O texto salvo não foi encontrado. Abra o documento no Corpus e prepare-o novamente. / Saved text was not found. Reopen and prepare it in Document Corpus.');
   if(ticket===request.current&&version===generation.current){setLoaded(corpus);setLoadedFor(tool)}
  }catch(error){if(ticket===request.current)setLoadError(error instanceof Error?error.message:String(error))}finally{if(ticket===request.current)setLoadingTool(null)}
 },[]);
 const setTextCorpus=useCallback((name:string,text:string,sourceType:Exclude<CorpusSourceType,'pdf'>='text')=>{
  const normalized=text.replace(/\r\n/g,'\n').replace(/[ \t]+/g,' ').trim();const documents:CorpusDocument[]=normalized?[{id:makeId(),title:name,text:normalized}]:[];
  setActiveCorpus(normalized?{id:makeId(),name,sourceType,rawText:normalized,documents,createdAt:new Date().toISOString()}:null);
 },[setActiveCorpus]);
 const setPdfCorpus=useCallback((name:string,pages:string[])=>{const clean=pages.map(page=>page.replace(/\s+/g,' ').trim());setActiveCorpus({id:makeId(),name,sourceType:'pdf',rawText:clean.join('\n\n'),documents:clean.map((text,index)=>({id:makeId(),title:`${name} — page ${index+1}`,text,pageNumber:index+1})),pageCount:clean.length,createdAt:new Date().toISOString()})},[setActiveCorpus]);
 const clearCorpus=useCallback(()=>setActiveCorpus(null),[setActiveCorpus]);
 const value=useMemo(()=>({storageError,loadError,loadingTool,loadedFor,availableCorpus,activeCorpus,setActiveCorpus,loadForTool,releaseTool,setTextCorpus,setPdfCorpus,clearCorpus}),[storageError,loadError,loadingTool,loadedFor,availableCorpus,activeCorpus,setActiveCorpus,loadForTool,releaseTool,setTextCorpus,setPdfCorpus,clearCorpus]);
 return <CorpusContext.Provider value={value}>{children}</CorpusContext.Provider>;
}
export function useCorpus(){const value=useContext(CorpusContext);if(!value)throw new Error('useCorpus must be used inside CorpusProvider');return value}
