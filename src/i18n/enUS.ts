export const enUS = {
  storage: {"title": "Storage Options", "browser": "In the browser (IndexedDB)", "supabase": "Supabase Storage (future implementation)", "browserInfoLabel": "About IndexedDB", "supabaseInfoLabel": "About Supabase", "browserInfo": "Documents, extracted text, research, reports and charts stay in this browser and device, without being sent to a server. They remain available after reloading. Clearing site data, private browsing, or browser eviction may remove them. Keep your original files.", "supabaseInfo": "Future integration to save files in the cloud and access them across devices. Unavailable in this version; no files are sent to Supabase.", "library": "PDFs saved in this browser", "open": "Open", "remove": "Delete", "empty": "No saved PDFs.", "error": "Could not access or save browser storage. Check available space and permissions. You can continue analyzing in this session.", "saved": "PDF saved in this browser.", "examples": "Example texts", "english": "English example", "portuguese": "Portuguese example", "loadError": "Could not load the example text. Please try again."},
  brand: { name: 'Web Seer Lab', tagline: 'Visual Language Explorer' },
  nav: { home: 'Home', compare: 'Compare', wordTree: 'Word Tree', phraseNet: 'Phrase Net', frequencies: 'Frequencies', wordCloud: 'Word Cloud', corpus: 'Corpus', history: 'History' },
  common: {
    explore: 'Explore', export: 'Export', fit: 'Fit', fullscreen: 'Fullscreen', reset: 'Reset', settings: 'Settings',
    occurrences: 'occurrences', document: 'document', documents: 'documents', words: 'words', sentences: 'sentences',
    uniqueTerms: 'unique terms', noResults: 'No results found.', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
    visualizationControls: 'Visualization controls', goCorpus: 'Go to Corpus'
  },
  home: {
    eyebrow: 'Text visualization for research and discovery',
    title: 'See language structure,\nnot just text.',
    description: 'Explore patterns, contextual paths and relationships between concepts.',
    cards: {
      compare: { title: 'Compare', description: 'Compare how two queries branch and discover shared results.', sampleA: 'cats are', sampleB: 'dogs are' },
      wordTree: { title: 'Word Tree', description: 'Explore what appears before or after a word inside a corpus.', sampleA: 'Alice', sampleB: 'curious' },
      phraseNet: { title: 'Phrase Net', description: 'Discover relationships between concepts using linguistic patterns.', sampleA: 'quantum', sampleB: 'security' }
    }
  },
  compare: {
    title: 'Compare queries', description: 'Discover how two phrases diverge and where their results meet.', searchA: 'Query A', searchB: 'Query B', vs: 'VS', weight: 'Weight', results: 'Results', wordsPerSide: 'Words per side', compare: 'Compare', swap: 'Swap queries', frequency: 'Frequency', rank: 'Rank', score: 'Score', empty: 'Enter two queries to get started.', shared: 'Shared', unique: 'Unique'
  },
  wordTree: {
    title: 'Word Tree', description: 'Explore contextual paths inside the corpus.', search: 'Search corpus',
    direction: 'Direction', depth: 'Depth', maxBranches: 'Max branches', generate: 'Generate tree',
    both: 'Both', after: 'After keyword', before: 'Before keyword', reverse: 'Reverse tree',
    context: 'Context', selected: 'Selected sequence', empty: 'Search for a word inside the corpus.',
    noContext: 'No context found for this sequence.', caseSensitive: 'Case sensitive',
    ignorePunctuation: 'Ignore punctuation', removeStopwords: 'Remove common words', advancedSettings: 'Advanced settings',
    activeCorpus: 'Active corpus:', pages: 'pages', noCorpus: 'No corpus loaded.',
    noCorpusHelp: 'Upload a TXT, PDF, or paste text in the Corpus tab.', goCorpus: 'Go to Corpus',
    loadExample: 'Load example', noOccurrence: 'No occurrences found for', suggestions: 'Try one of these frequent terms:',
    attribution: 'Word Tree algorithm based on', license: 'Apache-2.0',
    tooltipDepth: 'Defines how many consecutive words can appear in each tree path.',
    tooltipBranches: 'Limits how many of the most frequent continuations are shown per level.',
    tooltipDirection: 'Both shows words before and after. Before shows only previous words. After shows only continuations.'
  },
  phraseNet: {
    title: 'Phrase Net', description: 'Reveal linguistic relationships as a network of concepts.', relationPattern: 'Relation pattern',
    generate: 'Generate network', minOccurrence: 'Minimum occurrence', maxNodes: 'Maximum nodes', commonWords: 'Show common words',
    clusterStrength: 'Cluster strength', empty: 'Choose a relation to reveal connections.', noRelationships: 'No relationships found for this pattern.',
    legend: 'Legend', legendSource: 'Blue — source term', legendRelated: 'Orange — related term',
    legendShared: 'Purple — shared term', legendLine: 'Line — relationship found',
    tooltipPattern: 'Defines the linking word used to find relationships between concepts.',
    tooltipMinOccurrence: 'Shows only relationships found at least this many times.',
    tooltipMaxNodes: 'Limits the number of concepts visible in the network.',
    tooltipCluster: 'Defines how strongly related nodes are attracted to each other.',
    detectedLanguage: 'Detected language', portuguese: 'Portuguese', english: 'English'
  },
  frequencies: {
    title: 'Frequencies', description: 'Explore the most frequent words in the active corpus.',
    numberWords: 'Number of words', order: 'Order', mostFrequent: 'Most frequent', leastFrequent: 'Least frequent',
    removeStopwords: 'Remove common words', stopwordLanguage: 'Stopword language', minWordLength: 'Minimum word length',
    type: 'Type', horizontal: 'Horizontal bars', vertical: 'Vertical bars',
    empty: 'No corpus loaded. Upload text, TXT, or PDF to analyze frequencies.',
    occurrences: 'occurrences', ofCorpus: 'of words', openWordTree: 'Open in Word Tree', exportCsv: 'Export CSV'
  },
  wordCloud: {
    title: 'Word Cloud', description: 'Create a visual map of the most frequent words in the corpus.',
    quantity: 'Number of words', palette: 'Palette', customColor: 'Custom color', background: 'Background',
    shape: 'Shape', rotation: 'Word rotation', font: 'Font', scale: 'Scale',
    blue: 'Blue', warm: 'Warm', cool: 'Cool', frequencyPalette: 'Frequency: Cool → Hot', mono: 'Monochrome', rainbow: 'Rainbow', pastel: 'Pastel', webseer: 'Web Seer', custom: 'Custom',
    rectangle: 'Rectangle', circle: 'Circle', ellipse: 'Ellipse', horizontal: 'Horizontal only', mixed: 'Horizontal + vertical', random: 'Random',
    sizeContrast: 'Size contrast', tooltipSizeContrast: 'Controls how strongly frequency affects word size. Higher values emphasize frequent words more.',
    wordSpacing: 'Word spacing', tooltipWordSpacing: 'Defines the minimum distance between words in the cloud.',
    lowerFrequency: 'Lower frequency', higherFrequency: 'Higher frequency',
    removeStopwords: 'Remove common words', stopwordLanguage: 'Stopword language',
    empty: 'Load a corpus to generate a word cloud.'
  },
  corpus: {
    title: 'Corpus Explorer', description: 'Prepare and understand your data before analysis.', source: 'Corpus source',
    paste: 'Paste text', upload: 'Upload TXT', uploadPdf: 'Upload PDF', viewPdf: 'View PDF', expand: 'Expand', minimize: 'Minimize',
    zoomIn: 'Zoom in', zoomOut: 'Zoom out', page: 'Page', extractedText: 'Extracted text', noPdf: 'No PDF loaded',
    pdfLocalHint: 'PDFs are stored in this browser when IndexedDB is available.', statsTextNote: 'Statistics use the active corpus.',
    placeholder: 'Paste or edit corpus text here...', stats: 'Statistics', topTerms: 'Most frequent terms',
    uploadHint: '.txt files are loaded locally in your browser.', useText: 'Use this text',
    extracting: 'Extracting PDF text...', corpusReady: 'Corpus ready for analysis.', processingError: 'Could not process the PDF.'
  },
  history: {
    title: 'History', description: 'Resume analyses created in this browser.', emptyTitle: 'No saved analyses yet',
    emptyDescription: 'Your comparisons, trees and networks will appear here.', create: 'Create analysis', today: 'Today',
    compare: 'Compare', wordTree: 'Word Tree', phraseNet: 'Phrase Net'
  }
} as const;
