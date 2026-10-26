import {createContext, useContext, useMemo, useState, type ReactNode} from 'react';
import type {ActiveCorpus, CorpusDocument, CorpusSourceType} from '../types/corpus';

type CorpusContextValue = {
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
    activeCorpus,setActiveCorpus,setTextCorpus,setPdfCorpus,clearCorpus:()=>setActiveCorpus(null)
  }),[activeCorpus]);

  return <CorpusContext.Provider value={value}>{children}</CorpusContext.Provider>;
}

export function useCorpus(){
  const value=useContext(CorpusContext);
  if(!value) throw new Error('useCorpus must be used inside CorpusProvider');
  return value;
}
