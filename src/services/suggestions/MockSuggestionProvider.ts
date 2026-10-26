import type { Suggestion } from '../../types/suggestion'
import type { SuggestionProvider } from './SuggestionProvider'
const bank:Record<string,string[]>={
  'gatos são':['carinhosos','inteligentes','independentes','curiosos','companheiros','territoriais'],
  'cães são':['carinhosos','inteligentes','leais','companheiros','protetores','sociáveis'],
  'quantum computing':['future technology','powerful','complex','promising','used in cryptography','expensive'],
  'artificial intelligence':['powerful','transformative','used in healthcare','complex','rapidly evolving','controversial']
}
export class MockSuggestionProvider implements SuggestionProvider {
  async search(query:string):Promise<Suggestion[]> {
    const list=bank[query.toLowerCase()] ?? ['important','interesting','useful','complex','popular','emerging']
    return list.map((text,i)=>({text,score:1-i/list.length,rank:i+1,frequency:Math.max(10,100-i*13),source:'Mock provider'}))
  }
}
