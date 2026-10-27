import type {InfoTopic} from "../types";
export default {
  "overview": {
    "title": [
      "Frequências",
      "Frequencies"
    ],
    "body": [
      "Conta palavras do corpus. Ajuste filtros e ordenação; gere relatório para salvar a análise. As contagens dependem da qualidade da extração e dos filtros selecionados.",
      "Counts corpus words. Adjust filters and sorting; generate a report to save the analysis. Counts depend on extraction quality and selected filters."
    ]
  },
  "quantity": {
    "title": [
      "Quantidade de palavras",
      "Word quantity"
    ],
    "body": [
      "Número de palavras exibidas no gráfico após aplicar os filtros. Aumente para explorar termos menos frequentes.",
      "Number of words displayed after filtering. Increase to explore less frequent terms."
    ]
  },
  "order": {
    "title": [
      "Ordenação",
      "Sorting"
    ],
    "body": [
      "Decrescente destaca as maiores contagens; crescente mostra primeiro as menores contagens disponíveis após os filtros.",
      "Descending highlights larger counts; ascending shows smaller available counts first after filtering."
    ]
  },
  "orientation": {
    "title": [
      "Orientação",
      "Orientation"
    ],
    "body": [
      "Alterna barras horizontais e verticais. Barras horizontais facilitam a leitura de palavras longas.",
      "Switches horizontal and vertical bars. Horizontal bars make long words easier to read."
    ]
  },
  "length": {
    "title": [
      "Comprimento mínimo",
      "Minimum length"
    ],
    "body": [
      "Exclui palavras com menos caracteres que o mínimo definido. Use valores pequenos para manter termos curtos importantes.",
      "Excludes words shorter than this minimum. Use small values to retain important short terms."
    ]
  },
  "language": {
    "title": [
      "Idioma das palavras comuns",
      "Stopword language"
    ],
    "body": [
      "Seleciona a lista de palavras comuns removidas quando o filtro está ativo. Escolha o idioma do texto, não necessariamente o da interface.",
      "Selects the stopword list used when filtering is enabled. Choose the text language, which may differ from the interface."
    ]
  },
  "stopwords": {
    "title": [
      "Remover palavras comuns",
      "Remove stopwords"
    ],
    "body": [
      "Filtra artigos, preposições e outras palavras comuns conforme a lista do idioma. É um filtro por lista, não interpretação por IA.",
      "Filters articles, prepositions and other common words using a language list. This is list filtering, not AI interpretation."
    ]
  }
} satisfies Record<string,InfoTopic>;
