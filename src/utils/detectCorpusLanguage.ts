export type CorpusLanguage='pt'|'en';

const PT_MARKERS=new Set(['de','da','do','das','dos','que','e','em','para','com','por','uma','um','não','na','no']);
const EN_MARKERS=new Set(['the','of','and','to','in','is','with','for','on','from','a','an','that','this','not']);

export function detectCorpusLanguage(text:string):CorpusLanguage{
  const words=text.slice(0,150000).toLowerCase().match(/[a-zà-ÿ']+/g)??[];
  let pt=0,en=0;
  for(const word of words.slice(0,12000)){
    if(PT_MARKERS.has(word))pt++;
    if(EN_MARKERS.has(word))en++;
  }
  return pt>=en?'pt':'en';
}

export function getRelationSuggestions(language:CorpusLanguage):string[]{
  return language==='pt'
    ? ['e','de','do','da','com','para','por','em','sobre','entre']
    : ['and','of','with','for','in','on','between','from','to'];
}
