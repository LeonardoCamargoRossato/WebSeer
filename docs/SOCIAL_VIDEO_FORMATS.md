# Formatos de vídeo social

O WebSeer separa a orientação do arquivo do destino de publicação:

| Destino | Arquivo preparado | Publicação atual |
| --- | --- | --- |
| YouTube Vídeo | Horizontal 16:9, 960×540 | YouTube Data API v3 |
| YouTube Shorts | Vertical 9:16, 540×960, até 3 minutos | YouTube Data API v3 |
| Instagram Reels | Vertical 9:16, 540×960 | Planejamento e exportação local |
| TikTok | Vertical 9:16, 540×960 | Planejamento e exportação local |

Ao trocar para um destino com outra orientação, o painel procura uma variante já gerada da mesma revisão do documento. Se não existir, pede confirmação e volta ao Histograma animado com as palavras e velocidades preenchidas. O arquivo só é criado quando o usuário clicar em gerar; o relatório original continua preservado.

Shorts usa o mesmo `videos.insert` dos demais vídeos. A API não possui um sinalizador `shorts`; o YouTube classifica o arquivo conforme o formato e seus critérios atuais. O WebSeer valida a orientação e o limite de três minutos antes do envio. A capa anexada continua salva no projeto, mas não é enviada como miniatura personalizada no fluxo de Shorts.

Os modelos de Reels e TikTok guardam textos e configurações em rascunhos separados. A mídia vertical pode ser compartilhada. O JSON exportado é um plano local e não simula uma requisição pronta: permissões da conta, privacidade disponível e limites devem ser consultados quando cada API for conectada.

Fontes de referência:

- [YouTube Shorts](https://support.google.com/youtube/answer/15424877)
- [YouTube videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert)
- [Instagram Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- [TikTok Direct Post](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post)
- [TikTok creator_info](https://developers.tiktok.com/doc/content-posting-api-reference-query-creator-info/)

Todos os vídeos e metadados exportados mantêm a atribuição do WebSeer a Leonardo Camargo Rossato.
