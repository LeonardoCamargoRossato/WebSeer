import type {ActiveCorpus} from '../../types/corpus';
import type {TokenizerOptions} from './wordTreeTypes';
import {tokenizeForWordTree} from './searchWordTree';

export function findWordTreeContexts(corpus:ActiveCorpus,sequenceTokens:string[],options:TokenizerOptions,limit=20){
  if(!sequenceTokens.length) return [];
  const target=(options.caseSensitive?sequenceTokens:sequenceTokens.map(x=>x.toLocaleLowerCase())).join(' ');
  const results:string[]=[];

  for(const document of corpus.documents){
    const chunks=document.text
      .split(/(?<=[.!?])\s+|\n{2,}/)
      .map(s=>s.trim())
      .filter(Boolean);
    for(const chunk of chunks){
      const normalized=tokenizeForWordTree(chunk,options).join(' ');
      if(normalized.includes(target)){
        results.push(chunk);
        if(results.length>=limit) return results;
      }
    }
  }
  return results;
}
