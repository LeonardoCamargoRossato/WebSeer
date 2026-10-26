import {archiveCorpus} from '../storage/archive';
import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import type {ActiveCorpus, CorpusDocument, CorpusSourceType} from '../types/corpus';

type CorpusContextValue = {
  storageError:string|null;
  activeCorpus: ActiveCorpus | null;
  setActiveCorpus: (corpus: ActiveCorpus | null) => void;
  setTextCorpus: (name: string, text: string, sourceType?: Exclude<CorpusSourceType, 'pdf'>) => void;
  setPdfCorpus: (name: string, pages: string[]) => void;
  clearCorpus: () => void;
};

const CorpusContext = createContext<CorpusContextValue | null>(null);

function makeId(){
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `corpus-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function CorpusProvider({children}:{children:ReactNode}){
  const [activeCorpus,setActiveCorpus] = useState<ActiveCorpus | null>(null);
  const [storageError,setStorageError]=useState<string|null>(null);
  useEffect(()=>{let live=true;if(activeCorpus&&!activeCorpus.archive){setStorageError(null);archiveCorpus(activeCorpus).then(archive=>{if(live)setActiveCorpus(current=>current?.id===activeCorpus.id?{...current,archive,sourceFile:undefined}:current)}).catch(()=>{if(live)setStorageError('Não foi possível salvar o documento no IndexedDB. / Could not save the document in IndexedDB.')})}return()=>{live=false}},[activeCorpus]);

  const setTextCorpus = (name:string,text:string,sourceType:Exclude<CorpusSourceType,'pdf'>='text') => {
    const normalized = text.replace(/\r\n/g,'\n').replace(/[ \t]+/g,' ').trim();
    const documents:CorpusDocument[] = normalized ? [{id:makeId(),title:name,text:normalized}] : [];
    setActiveCorpus(normalized ? {
      id:makeId(), name, sourceType, rawText:normalized, documents, createdAt:new Date().toISOString()
    } : null);
  };

  const setPdfCorpus = (name:string,pages:string[]) => {
    const cleanPages = pages.map(p=>p.replace(/\s+/g,' ').trim());
    const documents:CorpusDocument[] = cleanPages.map((text,index)=>({
      id:makeId(), title:`${name} — page ${index+1}`, text, pageNumber:index+1
    }));
    setActiveCorpus({
      id:makeId(), name, sourceType:'pdf', rawText:cleanPages.join('\n\n'), documents,
      pageCount:pages.length, createdAt:new Date().toISOString()
    });
  };

  const value = useMemo<CorpusContextValue>(()=>({
    storageError,activeCorpus,setActiveCorpus,setTextCorpus,setPdfCorpus,clearCorpus:()=>setActiveCorpus(null)
  }),[activeCorpus,storageError]);

  return <CorpusContext.Provider value={value}>{children}</CorpusContext.Provider>;
}

export function useCorpus(){
  const value=useContext(CorpusContext);
  if(!value) throw new Error('useCorpus must be used inside CorpusProvider');
  return value;
}
