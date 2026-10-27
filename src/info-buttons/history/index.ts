import type {InfoTopic} from "../types";
export default {
  "overview": {
    "title": [
      "Histórico e biblioteca",
      "History and library"
    ],
    "body": [
      "Abra um documento para ver o original, pesquisas e relatórios por ferramenta e versão. Retomar pesquisa restaura os parâmetros. Os arquivos ficam no IndexedDB deste navegador; baixar uma cópia é recomendado antes de limpar dados.",
      "Open a document to see its original, research and reports by tool/version. Resume research restores parameters. Files are in this browser’s IndexedDB; download copies before clearing data."
    ]
  },
  "capacity": {
    "title": [
      "Capacidade do navegador",
      "Browser capacity"
    ],
    "body": [
      "Não há um limite fixo de 1 GB nem um número máximo universal de documentos. Uso/cota vêm de navigator.storage.estimate e são estimativas, não espaço reservado garantido. A cota depende do navegador, dispositivo e espaço disponível. Abrange esta origem inteira (leonardocamargorossato.github.io), incluindo outros projetos no mesmo domínio. Arquivos muito grandes também podem atingir o limite de RAM antes da cota em disco. Limpar dados do site pode apagar a biblioteca.",
      "There is no fixed 1 GB limit or universal document count. Usage/quota come from navigator.storage.estimate; these are estimates, not guaranteed reserved space. Quota depends on browser, device and free disk space. It covers the entire origin (leonardocamargorossato.github.io), including other projects there. Large files can hit RAM limits before disk quota. Clearing site data can erase the library."
    ]
  },
  "itemStorage": {
    "title": [
      "Espaço de cada item",
      "Per-item storage"
    ],
    "body": [
      "Clique no total armazenado para abrir o gráfico de pizza e a legenda por categoria, com cores correspondentes. Original é o tamanho exato do arquivo. Armazenado soma uma estimativa dos conteúdos locais associados: original, textos/revisões, pesquisas, relatórios, vídeos, capas, áudio e cópia de reconversão PDF. Vídeos mostram apenas a animação, anexos e dados daquela versão. Isso não mede a alocação física do IndexedDB: índices, compressão e deduplicação do navegador podem mudar o total real. O MP4 original e o MP4 preparado com som são arquivos diferentes e ambos entram no total quando salvos. Uma simples referência ao mesmo MP4 não é somada duas vezes. Cópias baixadas para a pasta Downloads e o armazenamento do YouTube não entram neste indicador.",
      "Click the stored total to open a pie chart and category legend with matching colors. Original is the exact file size. Stored sums estimated associated local content: original, text/revisions, research, reports, videos, thumbnails, audio and PDF reconversion copy. Videos count that version’s animation, attachments and data only. This is not physical IndexedDB allocation: indexes, compression and browser deduplication can change actual usage. The original MP4 and the prepared MP4 with sound are separate files and both count when saved. A simple reference to the same MP4 is not counted twice. Files downloaded to your Downloads folder and YouTube hosting are not included."
    ]
  },
  "videoPlayer": {
    "title": [
      "Conferir o vídeo e a trilha",
      "Review video and soundtrack"
    ],
    "body": [
      "Reproduzir no YouTube carrega a versão realmente enviada ao canal. O player só é carregado ao clicar, para poupar memória. Vídeos privados, em processamento ou com incorporação bloqueada podem exigir Abrir no YouTube. A capa salva no projeto pode diferir da atual no canal. No painel, prepare e salve o MP4 com trilha para ouvir o som nas prévias e nos próximos envios. O player de áudio separado confere o anexo original. Vídeos já publicados não mudam: crie uma nova versão para publicar com som.",
      "Play on YouTube loads the actual uploaded version. The player loads only on click to save memory. Private/processing videos or videos with embedding disabled may require Open on YouTube. Saved artwork may differ from the channel’s current artwork. Prepare and save MP4 with soundtrack in the panel for audio in previews and new uploads. The separate audio player reviews the original attachment. Existing uploads remain unchanged: create a new version to publish with sound."
    ]
  }
  ,"trash":{"title":["Lixeira e restauração","Trash and restore"],"body":["Excluir move o registro para a lixeira local, com data da exclusão. A contagem principal mostra apenas itens ativos; o ícone de lixeira mostra os excluídos. Você pode restaurá-los mantendo pesquisas, versões e links. Itens na lixeira ainda ocupam espaço. Excluir um documento oculta seus vídeos e relatórios, mas não apaga vídeos do YouTube. Excluir uma pesquisa não apaga os relatórios já gerados.","Delete moves records to local trash with a deletion timestamp. Main counts show active items; the trash icon counts deleted items. Restore keeps research, versions and links. Trash still uses storage. Deleting a document hides its videos/reports and never removes YouTube uploads. Deleting research does not remove generated reports."]}
} satisfies Record<string,InfoTopic>;
