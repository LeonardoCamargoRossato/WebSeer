export type WordTreeDirection = 'both' | 'forward' | 'backward';
export type BranchDirection = 'forward' | 'backward';

export interface TokenizerOptions {
  caseSensitive: boolean;
  ignorePunctuation: boolean;
}

export interface NGramFrequency {
  tokens: string[];
  frequency: number;
  direction: BranchDirection;
}

export interface WordTreeNode {
  word: string;
  frequency: number;
  children: WordTreeNode[];
  pathTokens: string[];
  direction: BranchDirection;
}

export interface WordTreeResult {
  keyword: string;
  keywordFrequency: number;
  forward: WordTreeNode[];
  backward: WordTreeNode[];
  ngrams: NGramFrequency[];
}
