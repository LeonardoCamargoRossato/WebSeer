import type {NGramFrequency, WordTreeNode, WordTreeResult} from './wordTreeTypes';
import {filterNGramsPerLevel} from './searchWordTree';

function buildTree(keyword:string,ngrams:NGramFrequency[],direction:'forward'|'backward'):WordTreeNode[]{
  const roots:WordTreeNode[]=[];

  for(const item of ngrams.filter(n=>n.direction===direction)){
    const branchTokens = direction==='forward'
      ? item.tokens.slice(1)
      : [...item.tokens.slice(0,-1)].reverse();

    let siblings=roots;
    const traversed:string[]=[];
    for(const word of branchTokens){
      traversed.push(word);
      let node=siblings.find(n=>n.word===word);
      if(!node){
        const naturalPath = direction==='forward'
          ? [keyword,...traversed]
          : [...traversed].reverse().concat(keyword);
        node={word,frequency:item.frequency,children:[],pathTokens:naturalPath,direction};
        siblings.push(node);
      }
      // Equivalent to the original tree carrying the frequency of the matching prefix/ngram.
      node.frequency=Math.max(node.frequency,item.frequency);
      siblings=node.children;
    }
  }

  const sort=(nodes:WordTreeNode[])=>{
    nodes.sort((a,b)=>b.frequency-a.frequency || a.word.localeCompare(b.word));
    nodes.forEach(n=>sort(n.children));
  };
  sort(roots);
  return roots;
}

export function buildWordTreeResult(
  keyword:string,
  keywordFrequency:number,
  ngrams:NGramFrequency[],
  maxPerN:number
):WordTreeResult{
  const filtered=filterNGramsPerLevel(ngrams,maxPerN);
  return {
    keyword,
    keywordFrequency,
    ngrams:filtered,
    forward:buildTree(keyword,filtered,'forward'),
    backward:buildTree(keyword,filtered,'backward')
  };
}

export function fontSizeFromFrequency(frequency:number,maxFrequency:number,min=13,max=36){
  if(maxFrequency<=0) return min;
  const normalized=Math.max(0,Math.min(1,frequency/maxFrequency));
  return min + Math.cbrt(normalized)*(max-min);
}
