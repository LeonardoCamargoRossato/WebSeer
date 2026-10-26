export const ptBR = {
  storage: {"title": "Opções de Armazenamento", "browser": "Pelo navegador (IndexedDB)", "supabase": "Storage Supabase (implementação futura)", "browserInfoLabel": "Informações sobre IndexedDB", "supabaseInfoLabel": "Informações sobre Supabase", "browserInfo": "Os PDFs e o texto extraído ficam neste navegador e dispositivo, sem envio a um servidor. Continuam disponíveis após recarregar a página. Limpar os dados do site, usar navegação privada ou a remoção de dados pelo navegador pode apagá-los. Mantenha uma cópia dos originais.", "supabaseInfo": "Integração futura para salvar arquivos na nuvem e acessá-los em outros dispositivos. Está indisponível nesta versão; nenhum arquivo é enviado ao Supabase.", "library": "PDFs salvos neste navegador", "open": "Abrir", "remove": "Excluir", "empty": "Nenhum PDF salvo.", "error": "Não foi possível acessar ou salvar no navegador. Verifique o espaço disponível e as permissões. A análise pode continuar nesta sessão.", "saved": "PDF salvo neste navegador.", "examples": "Textos de exemplo", "english": "Exemplo em inglês", "portuguese": "Exemplo em português", "loadError": "Não foi possível carregar o texto de exemplo. Tente novamente."},
  brand: { name: 'Web Seer Lab', tagline: 'Explorador Visual da Linguagem' },
  nav: { home: 'Início', compare: 'Comparar', wordTree: 'Árvore de Palavras', phraseNet: 'Rede de Frases', frequencies: 'Frequências', wordCloud: 'Mapa de Palavras', corpus: 'Corpus', history: 'Histórico' },
  common: {
    explore: 'Explorar', export: 'Exportar', fit: 'Ajustar', fullscreen: 'Tela inteira', reset: 'Redefinir', settings: 'Configurações',
    occurrences: 'ocorrências', document: 'documento', documents: 'documentos', words: 'palavras', sentences: 'frases',
    uniqueTerms: 'termos únicos', noResults: 'Nenhum resultado encontrado.', zoomIn: 'Aumentar zoom', zoomOut: 'Diminuir zoom',
    visualizationControls: 'Controles da visualização', goCorpus: 'Ir para Corpus'
  },
  home: {
    eyebrow: 'Visualização textual para pesquisa e descoberta',
    title: 'Veja a estrutura da linguagem,\nnão apenas o texto.',
    description: 'Explore padrões, caminhos linguísticos e relações entre conceitos.',
    cards: {
      compare: { title: 'Comparar', description: 'Compare como duas consultas se ramificam e descubra resultados compartilhados.', sampleA: 'gatos são', sampleB: 'cães são' },
      wordTree: { title: 'Árvore de Palavras', description: 'Explore o que aparece antes ou depois de uma palavra dentro de um corpus.', sampleA: 'Alice', sampleB: 'curiosa' },
      phraseNet: { title: 'Rede de Frases', description: 'Descubra relações entre conceitos a partir de padrões linguísticos.', sampleA: 'quantum', sampleB: 'segurança' }
    }
  },
  compare: {
    title: 'Comparar consultas', description: 'Descubra como duas frases divergem e onde seus resultados se encontram.', searchA: 'Consulta A', searchB: 'Consulta B', vs: 'VS', weight: 'Peso', results: 'Resultados', wordsPerSide: 'Palavras por lado', compare: 'Comparar', swap: 'Inverter consultas', frequency: 'Frequência', rank: 'Posição', score: 'Score', empty: 'Digite duas consultas para começar.', shared: 'Compartilhado', unique: 'Exclusivo'
  },
  wordTree: {
    title: 'Árvore de Palavras', description: 'Explore caminhos contextuais dentro do corpus.', search: 'Pesquisar no corpus',
    direction: 'Direção', depth: 'Profundidade', maxBranches: 'Máximo de ramos', generate: 'Gerar árvore',
    both: 'Ambos', after: 'Depois da palavra', before: 'Antes da palavra', reverse: 'Árvore reversa',
    context: 'Contexto', selected: 'Sequência selecionada', empty: 'Pesquise uma palavra dentro do corpus.',
    noContext: 'Nenhum contexto encontrado para esta sequência.', caseSensitive: 'Sensível a maiúsculas/minúsculas',
    ignorePunctuation: 'Ignorar pontuação', removeStopwords: 'Remover palavras comuns', advancedSettings: 'Configurações avançadas',
    activeCorpus: 'Corpus ativo:', pages: 'páginas', noCorpus: 'Nenhum corpus carregado.',
    noCorpusHelp: 'Carregue um TXT, PDF ou cole um texto na aba Corpus.', goCorpus: 'Ir para Corpus',
    loadExample: 'Carregar exemplo', noOccurrence: 'Nenhuma ocorrência encontrada para', suggestions: 'Tente um destes termos frequentes:',
    attribution: 'Algoritmo Word Tree baseado no projeto', license: 'Apache-2.0',
    tooltipDepth: 'Define quantas palavras consecutivas podem aparecer em cada caminho da árvore.',
    tooltipBranches: 'Limita quantas continuações mais frequentes são mostradas por nível.',
    tooltipDirection: 'Ambos mostra palavras anteriores e seguintes. Antes mostra somente palavras anteriores. Depois mostra somente continuações.'
  },
  phraseNet: {
    title: 'Rede de Frases', description: 'Revele relações linguísticas como uma rede de conceitos.', relationPattern: 'Padrão de relação',
    generate: 'Gerar rede', minOccurrence: 'Ocorrência mínima', maxNodes: 'Máximo de nós', commonWords: 'Mostrar palavras comuns',
    clusterStrength: 'Força do cluster', empty: 'Escolha uma relação para revelar conexões.', noRelationships: 'Nenhuma relação encontrada para este padrão.',
    legend: 'Legenda', legendSource: 'Azul — termo origem', legendRelated: 'Laranja — termo relacionado',
    legendShared: 'Roxo — termo compartilhado', legendLine: 'Linha — relação encontrada',
    tooltipPattern: 'Define a palavra de ligação usada para encontrar relações entre conceitos.',
    tooltipMinOccurrence: 'Mostra apenas relações encontradas pelo menos este número de vezes.',
    tooltipMaxNodes: 'Limita o número de conceitos visíveis na rede.',
    tooltipCluster: 'Define o quanto os nós relacionados são atraídos entre si.',
    detectedLanguage: 'Idioma detectado', portuguese: 'Português', english: 'Inglês'
  },
  frequencies: {
    title: 'Frequências', description: 'Explore as palavras mais frequentes do corpus atual.',
    numberWords: 'Número de palavras', order: 'Ordem', mostFrequent: 'Mais frequentes', leastFrequent: 'Menos frequentes',
    removeStopwords: 'Remover palavras comuns', stopwordLanguage: 'Idioma das palavras comuns', minWordLength: 'Tamanho mínimo da palavra',
    type: 'Tipo', horizontal: 'Barras horizontais', vertical: 'Barras verticais',
    empty: 'Nenhum corpus carregado. Carregue um texto, TXT ou PDF para analisar frequências.',
    occurrences: 'ocorrências', ofCorpus: 'das palavras', openWordTree: 'Abrir no Word Tree', exportCsv: 'Exportar CSV'
  },
  wordCloud: {
    title: 'Mapa de Palavras', description: 'Crie um mapa visual das palavras mais frequentes do corpus.',
    quantity: 'Quantidade de palavras', palette: 'Paleta', customColor: 'Cor personalizada', background: 'Fundo',
    shape: 'Forma', rotation: 'Rotação das palavras', font: 'Fonte', scale: 'Escala',
    blue: 'Azul', warm: 'Quente', cool: 'Frio', frequencyPalette: 'Frequência: Frio → Quente', mono: 'Monocromático', rainbow: 'Arco-íris', pastel: 'Pastel', webseer: 'Web Seer', custom: 'Personalizada',
    rectangle: 'Retângulo', circle: 'Círculo', ellipse: 'Elipse', horizontal: 'Somente horizontal', mixed: 'Horizontal + vertical', random: 'Aleatório',
    sizeContrast: 'Contraste de tamanho', tooltipSizeContrast: 'Controla o quanto a frequência influencia o tamanho das palavras. Valores maiores destacam mais as palavras frequentes.',
    wordSpacing: 'Espaçamento entre palavras', tooltipWordSpacing: 'Define a distância mínima entre as palavras no mapa.',
    lowerFrequency: 'Menor frequência', higherFrequency: 'Maior frequência',
    removeStopwords: 'Remover palavras comuns', stopwordLanguage: 'Idioma das palavras comuns',
    empty: 'Carregue um corpus para gerar um mapa de palavras.'
  },
  corpus: {
    title: 'Explorador de Corpus', description: 'Prepare e compreenda seus dados antes da análise.', source: 'Fonte do corpus',
    paste: 'Colar texto', upload: 'Upload TXT', uploadPdf: 'Upload PDF', viewPdf: 'Visualizar PDF', expand: 'Expandir', minimize: 'Minimizar',
    zoomIn: 'Aumentar zoom', zoomOut: 'Reduzir zoom', page: 'Página', extractedText: 'Texto extraído', noPdf: 'Nenhum PDF carregado',
    pdfLocalHint: 'PDFs são armazenados neste navegador quando o IndexedDB está disponível.', statsTextNote: 'As estatísticas usam o corpus ativo.',
    placeholder: 'Cole ou edite o texto do corpus aqui...', stats: 'Estatísticas', topTerms: 'Termos mais frequentes',
    uploadHint: 'Arquivos .txt são carregados localmente no navegador.', useText: 'Usar este texto',
    extracting: 'Extraindo texto do PDF...', corpusReady: 'Corpus pronto para análise.', processingError: 'Não foi possível processar o PDF.'
  },
  history: {
    title: 'Histórico', description: 'Retome análises realizadas neste navegador.', emptyTitle: 'Nenhuma análise salva ainda',
    emptyDescription: 'Suas comparações, árvores e redes aparecerão aqui.', create: 'Criar análise', today: 'Hoje',
    compare: 'Comparação', wordTree: 'Árvore de Palavras', phraseNet: 'Rede de Frases'
  }
} as const;
