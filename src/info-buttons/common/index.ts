import type {InfoTopic} from "../types";
export default {
  "visualization": {
    "title": [
      "Controles do gráfico",
      "Chart controls"
    ],
    "body": [
      "Use +/− para zoom, Ajustar para enquadrar, Tela inteira para ampliar e Exportar para baixar a visualização. Exportar não salva uma pesquisa: use Gerar relatório para vinculá-la ao documento.",
      "Use +/− for zoom, Fit to frame, Fullscreen to enlarge and Export to download the visualization. Export does not save research: Generate report links it to the document."
    ]
  },
  "reports": {
    "title": [
      "Relatórios e pesquisa",
      "Reports and research"
    ],
    "body": [
      "Gerar relatório salva parâmetros, dados e imagem disponíveis no Histórico, em uma nova versão por ferramenta. Refazer pesquisa executa os parâmetros atuais. Confira o corpus ativo antes de gerar.",
      "Generate report saves parameters, data and available image in History, as a new version per tool. Rerun research executes current parameters. Check the active corpus before generating."
    ]
  },
  "storage": {
    "title": [
      "Armazenamento local",
      "Local storage"
    ],
    "body": [
      "IndexedDB guarda arquivos neste navegador e dispositivo. Limpar dados do site ou usar janela privada pode removê-los. Login Google não sincroniza os arquivos. Supabase ainda é uma opção futura.",
      "IndexedDB stores files in this browser and device. Clearing site data or using private browsing may remove them. Google login does not sync files. Supabase is a future option."
    ]
  },
  "language": {
    "title": [
      "Idioma da interface",
      "Interface language"
    ],
    "body": [
      "Alterna os textos do aplicativo entre português e inglês. Não traduz o documento, as pesquisas ou os metadados já editados.",
      "Switches app text between Portuguese and English. Does not translate the document, research or already edited metadata."
    ]
  }
  ,"supabase":{"title":["Storage Supabase","Supabase Storage"],"body":["Integração futura para salvar arquivos na nuvem e acessá-los em outros dispositivos. Indisponível nesta versão; nenhum arquivo é enviado ao Supabase.","Future integration to save files in the cloud and access them across devices. Unavailable in this version; no files are sent to Supabase."]}
} satisfies Record<string,InfoTopic>;
