export type StopwordLanguage = 'pt' | 'en';

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface FrequencyOptions {
  removeStopwords?: boolean;
  stopwordLanguage?: StopwordLanguage;
  minWordLength?: number;
}
