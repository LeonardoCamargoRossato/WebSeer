import type {InfoTopic} from "../types";
export default {
  "overview": {
    "title": [
      "Árvore de Palavras",
      "Word Tree"
    ],
    "body": [
      "Mostra sequências antes/depois de uma consulta. Clique nos ramos para ler trechos de contexto. Gere relatório para guardar os parâmetros e uma imagem da análise.",
      "Shows sequences before/after a query. Click branches to read context excerpts. Generate a report to keep parameters and an image."
    ]
  },
  "query": {
    "title": [
      "Pesquisar no corpus",
      "Search corpus"
    ],
    "body": [
      "Digite uma palavra ou sequência presente no documento. A árvore agrupa suas continuações, sem reescrever ou interpretar o texto.",
      "Enter a word or sequence found in the document. The tree groups continuations without rewriting or interpreting text."
    ]
  },
  "direction": {
    "title": [
      "Direção",
      "Direction"
    ],
    "body": [
      "Depois explora as palavras seguintes; Antes explora as anteriores; Ambos mostra os dois lados da consulta.",
      "After explores following words; Before explores preceding words; Both shows both sides."
    ]
  },
  "depth": {
    "title": [
      "Profundidade",
      "Depth"
    ],
    "body": [
      "Número máximo de passos de contexto em cada caminho. Valores maiores mostram frases mais longas e podem deixar a árvore mais densa.",
      "Maximum context steps along each path. Larger values show longer phrases and can make the tree denser."
    ]
  },
  "branches": {
    "title": [
      "Máximo de ramos",
      "Maximum branches"
    ],
    "body": [
      "Limita a quantidade de ramificações exibidas. Aumente para mais variedade ou reduza para destacar padrões recorrentes.",
      "Limits displayed branches. Increase for variety or reduce to highlight recurring patterns."
    ]
  },
  "case": {
    "title": [
      "Maiúsculas e minúsculas",
      "Letter case"
    ],
    "body": [
      "Ative para tratar Deus e deus como consultas diferentes. Desative para reunir variações de capitalização.",
      "Enable to distinguish Deus from deus. Disable to combine capitalization variants."
    ]
  },
  "punctuation": {
    "title": [
      "Pontuação",
      "Punctuation"
    ],
    "body": [
      "Ignorar pontuação aproxima sequências separadas por sinais. Desative quando a pontuação fizer parte da análise.",
      "Ignoring punctuation groups sequences across punctuation marks. Disable when punctuation matters to the analysis."
    ]
  },
  "reverse": {
    "title": [
      "Árvore reversa",
      "Reverse tree"
    ],
    "body": [
      "Mostra o contexto anterior à consulta. Ao desmarcar, a direção volta para ambos os lados.",
      "Shows context preceding the query. Unchecking restores both directions."
    ]
  }
} satisfies Record<string,InfoTopic>;
