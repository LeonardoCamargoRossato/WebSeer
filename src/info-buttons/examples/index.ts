import type {InfoTopic} from "../types";
export default {
  "illustrations":{"title":["Sobre as ilustrações","About the illustrations"],"body":["As seis ilustrações foram geradas com IA para representar os temas dos guias. São imagens conceituais, não gráficos produzidos a partir dos seus documentos e não evidências científicas.","The six illustrations were AI-generated to represent guide topics. They are conceptual images, not charts from your documents or scientific evidence."]},
  "demo":{"title":["Texto demonstrativo","Demonstration text"],"body":["Testar este texto troca o corpus ativo por um exemplo fictício curto e abre a ferramenta sugerida. Ele é salvo como um documento separado na biblioteca. Ler o guia e explorar uma ferramenta não substitui automaticamente seu documento.","Trying the text replaces the active corpus with a short fictional example and opens the suggested tool. It is saved as a separate library document. Reading a guide or exploring a tool does not automatically replace your document."]},
  "research":{"title":["Artigos relacionados","Related papers"],"body":["As referências apontam para pesquisas sobre os métodos e para documentação técnica. Não são estudos feitos com o WebSeer nem comprovam conclusões sobre seu corpus. Leia os textos originais antes de citá-los em um trabalho.","References link to research about methods and technical documentation. They are not WebSeer studies or evidence for conclusions about your corpus. Read original texts before citing them in your work."]},
  "overview": {
    "title": [
      "Exemplos de aplicação",
      "Application examples"
    ],
    "body": [
      "Os exemplos sugerem perguntas e ferramentas para explorar textos. Carregar um exemplo muda o corpus ativo; análises não são avaliações automáticas de veracidade.",
      "Examples suggest questions and tools for text exploration. Loading one changes the active corpus; analyses are not automated truth assessments."
    ]
  }
} satisfies Record<string,InfoTopic>;
