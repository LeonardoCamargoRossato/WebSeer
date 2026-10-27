import type {InfoTopic} from "../types";
export default {
  "overview": {
    "title": [
      "Mapa de Palavras",
      "Word Cloud"
    ],
    "body": [
      "O tamanho das palavras reflete suas frequências após os filtros. Cores, posição e rotação são escolhas visuais e não indicam sentimento ou significado.",
      "Word sizes reflect frequencies after filtering. Colors, placement and rotation are visual choices and do not indicate sentiment or meaning."
    ]
  },
  "quantity": {
    "title": [
      "Quantidade de palavras",
      "Word quantity"
    ],
    "body": [
      "Quantidade máxima de termos no mapa, até 500. Muitos termos podem não caber: ajuste escala e espaçamento.",
      "Maximum number of terms, up to 500. Some may not fit: adjust scale and spacing."
    ]
  },
  "palette": {
    "title": [
      "Paleta",
      "Palette"
    ],
    "body": [
      "Seleciona cores do mapa. Cor é apenas estilo visual; não classifica significado nem sentimento.",
      "Selects map colors. Color is visual styling and does not classify meaning or sentiment."
    ]
  },
  "color": {
    "title": [
      "Cor personalizada",
      "Custom color"
    ],
    "body": [
      "Escolhe uma cor para a paleta personalizada. Mantenha contraste suficiente com o fundo.",
      "Chooses a color for the custom palette. Maintain enough contrast with the background."
    ]
  },
  "background": {
    "title": [
      "Fundo",
      "Background"
    ],
    "body": [
      "Define a cor de fundo da visualização exportada. Prefira contraste forte com as palavras.",
      "Sets the exported visualization background. Prefer strong contrast with words."
    ]
  },
  "shape": {
    "title": [
      "Forma",
      "Shape"
    ],
    "body": [
      "Define a área de distribuição das palavras. Não muda as contagens.",
      "Defines the word placement area. Does not change counts."
    ]
  },
  "rotation": {
    "title": [
      "Rotação",
      "Rotation"
    ],
    "body": [
      "Controla as orientações permitidas. Somente horizontal costuma ser mais fácil de ler.",
      "Controls allowed orientations. Horizontal only is usually easier to read."
    ]
  },
  "font": {
    "title": [
      "Fonte",
      "Font"
    ],
    "body": [
      "Seleciona a família tipográfica. Fontes disponíveis podem variar entre dispositivos.",
      "Selects the font family. Available fonts may differ across devices."
    ]
  },
  "scale": {
    "title": [
      "Escala",
      "Scale"
    ],
    "body": [
      "Aumenta ou reduz todas as palavras. Se algumas desaparecerem, reduza a escala para caberem na área.",
      "Enlarges or shrinks all words. If some disappear, reduce scale so they fit."
    ]
  },
  "contrast": {
    "title": [
      "Contraste de tamanho",
      "Size contrast"
    ],
    "body": [
      "Aumenta ou reduz a diferença visual entre termos frequentes e raros sem mudar suas contagens.",
      "Changes size differences between frequent and rare terms without changing counts."
    ]
  },
  "spacing": {
    "title": [
      "Espaçamento",
      "Spacing"
    ],
    "body": [
      "Controla a distância entre palavras. Mais espaço melhora leitura mas reduz quantas palavras cabem.",
      "Controls spacing between words. More space improves readability but reduces capacity."
    ]
  },
  "language": {
    "title": [
      "Idioma do filtro",
      "Filter language"
    ],
    "body": [
      "Escolhe a lista de palavras comuns. Deve acompanhar o idioma do corpus.",
      "Chooses the stopword list. Match it to the corpus language."
    ]
  },
  "stopwords": {
    "title": [
      "Palavras comuns",
      "Stopwords"
    ],
    "body": [
      "Remove termos comuns da lista do idioma. Para estudar artigos e preposições, desative o filtro.",
      "Removes common terms using the language list. Disable to study articles and prepositions."
    ]
  }
} satisfies Record<string,InfoTopic>;
