import type {InfoTopic} from "../types";
export default {
  "overview": {
    "title": [
      "Histograma animado",
      "Animated histogram"
    ],
    "body": [
      "Selecione de 2 a 8 palavras. A tabela conta cada página; as barras acumulam ocorrências e mudam de posição conforme o ranking. Gere GIF ou MP4, abra o storyboard ou prepare metadados no painel de vídeo.",
      "Select 2–8 words. The table counts each page; bars accumulate occurrences and change positions with ranking. Generate GIF or MP4, open the storyboard or prepare metadata in the video panel."
    ]
  },
  "word": {
    "title": [
      "Palavra para pesquisar",
      "Word to search"
    ],
    "body": [
      "Digite uma palavra inteira e verifique se existe. Maiúsculas não diferem, mas acentos são preservados. Adicione até oito palavras, no mínimo duas.",
      "Enter a whole word and check it exists. Case is ignored, but accents are preserved. Add two to eight words."
    ]
  },
  "suggestions": {
    "title": [
      "Sugestões de palavras",
      "Word suggestions"
    ],
    "body": [
      "Escolha de 4 a 8 termos frequentes. A opção significativa exclui stopwords; nomes são candidatos por capitalização e repetição, não reconhecimento confiável de pessoas.",
      "Choose 4–8 frequent terms. Significant words exclude stopwords; names are candidates based on capitalization/repetition, not reliable person recognition."
    ]
  },
  "format": {
    "title": [
      "Formato de vídeo",
      "Video format"
    ],
    "body": [
      "MP4 usa H.264/WebCodecs quando disponível e serve para o futuro upload ao YouTube. GIF é uma imagem animada sem áudio. Ambos são gerados localmente.",
      "MP4 uses H.264/WebCodecs when available and suits future YouTube uploads. GIF is an animated image without audio. Both are generated locally."
    ]
  },
  "speed": {
    "title": [
      "Tempo por página",
      "Time per page"
    ],
    "body": [
      "Menor tempo acelera o avanço das páginas no arquivo gerado. A animação usa 24 quadros por segundo; 0,083 s equivale a cerca de 12 páginas por segundo. Gere novamente para mudar a velocidade do arquivo.",
      "Less time speeds up page progression in the generated file. Animation uses 24 frames per second; 0.083 s is about 12 pages per second. Regenerate to change file speed."
    ]
  },
  "page": {
    "title": [
      "Página do storyboard",
      "Storyboard page"
    ],
    "body": [
      "Arraste para examinar uma página/seção específica. Reproduzir anima o avanço; Reiniciar volta ao começo. O arquivo baixado usa a velocidade definida na geração.",
      "Drag to inspect a page/section. Play animates progression; Restart returns to the beginning. Downloads use the speed selected during generation."
    ]
  }
} satisfies Record<string,InfoTopic>;
