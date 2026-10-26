import type {CorpusDocument} from '../../types/corpus';
import type {NGramFrequency, TokenizerOptions, WordTreeDirection} from './wordTreeTypes';

export function tokenizeForWordTree(text:string,options:TokenizerOptions):string[]{
  let value = text.normalize('NFKC').replace(/[\u2018\u2019]/g,"'");
  if(options.ignorePunctuation){
    value = value.replace(/[^\p{L}\p{N}'-]+/gu,' ');
  } else {
    value = value.replace(/\s+/g,' ');
  }
  const tokens=value.trim().split(/\s+/).filter(Boolean);
  return options.caseSensitive ? tokens : tokens.map(token=>token.toLocaleLowerCase());
}

export function normalizeKeyword(keyword:string,options:TokenizerOptions){
  const tokens=tokenizeForWordTree(keyword,options);
  return tokens[0] ?? '';
}

/**
 * TypeScript port of the search concept in willcrichton/wordtree.
 * It counts N-grams (2..maxN) where the keyword is at the beginning
 * (forward) or at the end (backward).
 */
export function searchWordTree(
  documents:CorpusDocument[],
  keywordInput:string,
  maxN:number,
  direction:WordTreeDirection,
  options:TokenizerOptions
):{keyword:string;keywordFrequency:number;ngrams:NGramFrequency[]} {
  const keyword=normalizeKeyword(keywordInput,options);
  if(!keyword) return {keyword:'',keywordFrequency:0,ngrams:[]};

  const counts=new Map<string,{tokens:string[];frequency:number;direction:'forward'|'backward'}>();
  let keywordFrequency=0;

  for(const document of documents){
    const tokens=tokenizeForWordTree(document.text,options);
    for(const token of tokens) if(token===keyword) keywordFrequency++;

    for(let n=2;n<=Math.max(2,maxN);n++){
      for(let i=0;i<=tokens.length-n;i++){
        const ngram=tokens.slice(i,i+n);
        const isForward=ngram[0]===keyword;
        const isBackward=ngram[ngram.length-1]===keyword;
        if(!isForward&&!isBackward) continue;

        if(isForward && direction!=='backward') add(ngram,'forward');
        if(isBackward && direction!=='forward') add(ngram,'backward');
      }
    }
  }

  function add(tokens:string[],branchDirection:'forward'|'backward'){
    const key=`${branchDirection}\u0000${tokens.join('\u0001')}`;
    const current=counts.get(key);
    if(current) current.frequency++;
    else counts.set(key,{tokens:[...tokens],frequency:1,direction:branchDirection});
  }

  return {keyword,keywordFrequency,ngrams:[...counts.values()]};
}

export function filterNGramsPerLevel(ngrams:NGramFrequency[],maxPerN:number){
  const groups=new Map<string,NGramFrequency[]>();
  for(const item of ngrams){
    const key=`${item.direction}:${item.tokens.length}`;
    const list=groups.get(key) ?? [];
    list.push(item);
    groups.set(key,list);
  }
  return [...groups.values()].flatMap(list=>
    list.sort((a,b)=>b.frequency-a.frequency).slice(0,Math.max(1,maxPerN))
  );
}
