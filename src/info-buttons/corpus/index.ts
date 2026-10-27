import type {InfoTopic} from "../types";
export default {
  "overview": {
    "title": [
      "Corpus do Documento",
      "Document Corpus"
    ],
    "body": [
      "Arraste um arquivo ou cole texto. Confira nome e tipo, configure a leitura e clique em converter/aplicar. O documento e suas análises ficam relacionados no Histórico deste navegador. A conversão prepara o texto no IndexedDB, sem abrir prévia. Ao clicar em uma aba de análise, apenas aquela ferramenta carrega o texto salvo; sair da aba libera a cópia da ferramenta. Se o armazenamento estiver bloqueado, a sessão mantém uma cópia temporária.",
      "Drop a file or paste text. Check its name and type, configure reading and convert/apply. The document and its analyses are linked in this browser’s History. Conversion prepares text in IndexedDB without opening a preview. Clicking an analysis tab loads saved text for that tool only; leaving releases its copy. If storage is blocked, a temporary session copy is retained."
    ]
  },
  "converter": {
    "title": [
      "Conversor PDF",
      "PDF converter"
    ],
    "body": [
      "PDF.js com reconstrução usa posições dos caracteres para unir fragmentos sem apagar espaços reais. O modo literal preserva os fragmentos do PDF e pode produzir palavras quebradas. PDFs escaneados precisam de OCR, não incluído aqui.",
      "PDF.js reconstruction uses character positions to join fragments while preserving real spaces. Literal mode keeps PDF fragments and may split words. Scanned PDFs require OCR, which is not included."
    ]
  },
  "margins": {
    "title": [
      "Cabeçalhos e rodapés",
      "Headers and footers"
    ],
    "body": [
      "Remove linhas que se repetem nas margens de várias páginas. Isso pode reduzir ruído na contagem, mas também remover conteúdo válido: confira o texto extraído.",
      "Removes lines repeated in page margins. This can reduce counting noise but may remove valid content: review extracted text."
    ]
  },
  "paste": {
    "title": [
      "Texto do documento",
      "Document text"
    ],
    "body": [
      "Cole texto simples e aplique-o como corpus. Sem páginas físicas de PDF, as unidades usadas pela animação são as seções do documento. Guarde o original antes de limpar dados do navegador.",
      "Paste plain text and apply it as the corpus. Without physical PDF pages, animation units are document sections. Keep originals before clearing browser data."
    ]
  }
} satisfies Record<string,InfoTopic>;
