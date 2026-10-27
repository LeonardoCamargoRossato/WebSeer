import type {InfoTopic} from "../types";
export default {
  "overview": {
    "title": [
      "Comparar",
      "Compare"
    ],
    "body": [
      "Compare as continuações imediatas de duas palavras ou expressões presentes no corpus. Trocar inverte os lados; redefinir limpa os resultados. Relação visual não implica relação causal.",
      "Compare immediate continuations of two words or phrases found in the corpus. Swap reverses sides; reset clears results. Visual relations do not imply causality."
    ]
  },
  "a": {
    "title": [
      "Consulta A",
      "Query A"
    ],
    "body": [
      "Digite uma palavra ou expressão existente no texto. O gráfico mostra as palavras imediatamente seguintes; use a segunda consulta para comparar os contextos.",
      "Enter a word or phrase present in the text. The graph shows immediately following words; use the second query to compare contexts."
    ]
  },
  "b": {
    "title": [
      "Consulta B",
      "Query B"
    ],
    "body": [
      "Escolha outra palavra ou expressão do mesmo corpus. Consultas ausentes não podem ser comparadas.",
      "Choose another word or phrase from the same corpus. Queries absent from the text cannot be compared."
    ]
  },
  "weight": {
    "title": [
      "Peso das relações",
      "Relation weight"
    ],
    "body": [
      "Frequência usa ocorrências, Rank usa posição relativa e Score usa a pontuação da comparação. Alterar o peso muda a ênfase visual, não o texto de origem.",
      "Frequency uses occurrences, Rank uses relative position and Score uses the comparison score. Changing weight changes visual emphasis, not source text."
    ]
  },
  "limit": {
    "title": [
      "Palavras por lado",
      "Words per side"
    ],
    "body": [
      "Limita as continuações exibidas em cada lado. Comece com poucas para legibilidade e aumente para explorar contextos menos frequentes.",
      "Limits continuations on each side. Start with a few for readability and increase to explore less frequent contexts."
    ]
  }
} satisfies Record<string,InfoTopic>;
