import type { Suggestion } from '../../types/suggestion'
export interface SuggestionProvider { search(query:string):Promise<Suggestion[]> }
