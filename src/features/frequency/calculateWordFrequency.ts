import {tokens} from '../../utils/corpusParser';
import {isStopword} from './stopwords';
import type {FrequencyOptions,WordFrequency} from './frequencyTypes';

export function calculateWordFrequency(text:string, options:FrequencyOptions={}):WordFrequency[]{
  const {
    removeStopwords=false,
    stopwordLanguage='pt',
    minWordLength=1
  }=options;
  const words=tokens(text,false).filter(word=>{
    if(word.length<Math.max(1,minWordLength)) return false;
    return !removeStopwords || !isStopword(word,stopwordLanguage);
  });
  const counts=new Map<string,number>();
  words.forEach(word=>counts.set(word,(counts.get(word)||0)+1));
  const total=Math.max(1,words.length);
  return [...counts.entries()]
    .map(([word,count])=>({word,count,percentage:(count/total)*100}))
    .sort((a,b)=>b.count-a.count||a.word.localeCompare(b.word));
}
