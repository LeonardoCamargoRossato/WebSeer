import type {StopwordLanguage} from './frequencyTypes';

export const STOPWORDS: Record<StopwordLanguage, Set<string>> = {
  pt: new Set([
    'a','as','ao','aos','com','como','da','das','de','do','dos','e','é','em','entre','essa','esse',
    'esta','este','eu','foi','há','isso','isto','já','lhe','mais','mas','me','mesmo','meu','minha',
    'na','nas','não','no','nos','o','os','ou','para','pela','pelo','por','que','se','sem','ser',
    'seu','sua','também','te','tem','um','uma','você'
  ]),
  en: new Set([
    'a','an','and','are','as','at','be','been','but','by','for','from','had','has','have','he','her',
    'his','i','in','is','it','its','me','my','not','of','on','or','our','she','that','the','their',
    'them','there','they','this','to','was','we','were','with','you','your'
  ])
};

export function isStopword(word:string, language:StopwordLanguage){
  return STOPWORDS[language].has(word.toLowerCase());
}
