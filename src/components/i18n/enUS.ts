export const enUS = {
  brand: { name: 'Web Seer Lab', tagline: 'Visual Language Explorer' },
  nav: { home: 'Home', compare: 'Compare', wordTree: 'Word Tree', phraseNet: 'Phrase Net', corpus: 'Corpus', history: 'History' },
  common: { explore: 'Explore', export: 'Export', fit: 'Fit', reset: 'Reset', settings: 'Settings', occurrences: 'occurrences', document: 'document', documents: 'documents', words: 'words', sentences: 'sentences', uniqueTerms: 'unique terms', noResults: 'No results found.', zoomIn: 'Zoom in', zoomOut: 'Zoom out' },
  home: {
    eyebrow: 'Text visualization for research and discovery', title: 'See language structure,\nnot just text.', description: 'Explore patterns, contextual paths and relationships between concepts.',
    cards: {
      compare: { title: 'Compare', description: 'Compare how two queries branch and discover shared results.', sampleA: 'cats are', sampleB: 'dogs are' },
      wordTree: { title: 'Word Tree', description: 'Explore what appears before or after a word inside a corpus.', sampleA: 'Alice', sampleB: 'curious' },
      phraseNet: { title: 'Phrase Net', description: 'Discover relationships between concepts using linguistic patterns.', sampleA: 'quantum', sampleB: 'security' }
    }
  },
  compare: { title: 'Compare queries', description: 'Discover how two phrases diverge and where their results meet.', searchA: 'Query A', searchB: 'Query B', vs: 'VS', weight: 'Weight', results: 'Results', compare: 'Compare', swap: 'Swap queries', frequency: 'Frequency', rank: 'Rank', score: 'Score', empty: 'Enter two queries to get started.', shared: 'Shared', unique: 'Unique' },
  wordTree: {
    title: 'Word Tree', description: 'Explore real contextual paths inside the active corpus.', search: 'Search within corpus', direction: 'Direction', both: 'Both', after: 'After keyword', before: 'Before keyword', depth: 'Depth', maxBranches: 'Max branches per level', reverse: 'Reverse tree', generate: 'Generate tree', context: 'Context', selected: 'Selected sequence', empty: 'Search for a word inside the corpus.', noContext: 'No context found for this sequence.', noOccurrence: 'No occurrences found for', suggestions: 'Try one of these frequent terms:', activeCorpus: 'Active corpus', noCorpus: 'No corpus loaded.', noCorpusHelp: 'Upload a TXT, PDF or paste text in the Corpus tab.', goCorpus: 'Go to Corpus', loadExample: 'Load example', caseSensitive: 'Case sensitive', ignorePunctuation: 'Ignore punctuation', minSize: 'Minimum size', maxSize: 'Maximum size', attribution: "Word Tree algorithm inspired by Will Crichton's wordtree", license: 'Apache-2.0', pages: 'pages'
  },
  phraseNet: { title: 'Phrase Net', description: 'Reveal linguistic relationships using the active corpus.', relationPattern: 'Relation pattern', generate: 'Generate network', minOccurrence: 'Minimum occurrence', maxNodes: 'Maximum nodes', commonWords: 'Show common words', clusterStrength: 'Cluster strength', empty: 'Choose a relation to reveal connections.', noRelationships: 'No relationships found for this pattern.', noCorpus: 'Load a corpus before generating the network.' },
  corpus: {
    title: 'Corpus Explorer', description: 'Prepare and understand your data before analysis.', source: 'Corpus source', paste: 'Paste text', useText: 'Use this text', upload: 'Upload TXT', uploadPdf: 'Upload PDF', viewPdf: 'View PDF', placeholder: 'Paste or edit corpus text here...', stats: 'Statistics', topTerms: 'Most frequent terms', uploadHint: 'TXT and PDF files are processed locally in your browser and are not persisted after refresh.', extracting: 'Extracting text from PDF...', page: 'Page', corpusReady: 'Corpus ready for analysis.', expand: 'Expand', minimize: 'Minimize', zoomIn: 'Zoom in', zoomOut: 'Zoom out', extractedText: 'Extracted text', noPdf: 'No PDF loaded', processingError: 'Could not extract text from this PDF.'
  },
  history: { title: 'History', description: 'Resume analyses created in this browser.', emptyTitle: 'No saved analyses yet', emptyDescription: 'Your comparisons, trees and networks will appear here.', create: 'Create analysis', today: 'Today', compare: 'Compare', wordTree: 'Word Tree', phraseNet: 'Phrase Net' }
} as const;
