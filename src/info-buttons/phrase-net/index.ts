import type {InfoTopic} from "../types";
export default {
  "overview": {
    "title": [
      "Rede de Frases",
      "Phrase Net"
    ],
    "body": [
      "Liga termos encontrados em padrões de frase. Escolha uma relação sugerida ou digite um padrão; os nós representam termos e as ligações representam ocorrências, não causalidade.",
      "Connects terms found in phrase patterns. Choose a suggested relation or enter a pattern; nodes represent terms and links represent occurrences, not causality."
    ]
  },
  "pattern": {
    "title": [
      "Padrão de relação",
      "Relation pattern"
    ],
    "body": [
      "Use o padrão sugerido para o idioma do corpus ou adapte a relação procurada. Só aparecem ligações encontradas no texto; confira o contexto antes de interpretar.",
      "Use a suggested pattern for the corpus language or adapt the relation. Only links found in the text appear; check context before interpreting."
    ]
  },
  "min": {
    "title": [
      "Ocorrências mínimas",
      "Minimum occurrences"
    ],
    "body": [
      "Oculta relações abaixo deste número de ocorrências. Aumentar reduz ruído, mas pode esconder relações raras.",
      "Hides relations below this occurrence count. Increasing reduces noise but may hide rare relations."
    ]
  },
  "nodes": {
    "title": [
      "Máximo de nós",
      "Maximum nodes"
    ],
    "body": [
      "Limita os termos visíveis para tornar o grafo legível. O limite de exibição não altera o documento.",
      "Limits visible terms to keep the graph readable. The display limit does not change the document."
    ]
  },
  "cluster": {
    "title": [
      "Força de agrupamento",
      "Clustering strength"
    ],
    "body": [
      "Ajusta a disposição visual dos grupos. Aproximar nós no desenho não demonstra proximidade semântica.",
      "Adjusts visual group layout. Drawing nodes closer does not establish semantic similarity."
    ]
  }
} satisfies Record<string,InfoTopic>;
