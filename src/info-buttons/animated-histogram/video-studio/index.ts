import type {InfoTopic} from "../../types";
export default {
  "platforms": {"title": ["Destino e formato", "Destination and format"], "body": ["YouTube Vídeo usa horizontal; YouTube Shorts, Instagram Reels e TikTok compartilham o formato vertical 9:16. Cada rede tem seu rascunho de metadados. YouTube mantém a publicação existente; Reels e TikTok preparam arquivos e planejamento local, com conexão por API em uma etapa futura.", "YouTube Video uses landscape; YouTube Shorts, Instagram Reels and TikTok share portrait 9:16. Each network has a metadata draft. YouTube retains existing publishing; Reels and TikTok prepare files and local plans, with API connection in a later step."]},
  "shorts": {"title": ["YouTube Shorts", "YouTube Shorts"], "body": ["Shorts usam vídeos quadrados ou verticais de até 3 minutos, sujeitos aos critérios atuais do YouTube. Não existe parâmetro Shorts em videos.insert: a plataforma classifica o vídeo; #Shorts não é obrigatório. O WebSeer prepara 9:16 e avisa quando a duração ultrapassa 3 minutos. A miniatura de Shorts pode ser um quadro escolhido no aplicativo do YouTube; uma imagem enviada pela API não garante a mesma exibição em todas as superfícies.", "Shorts use square or portrait videos up to 3 minutes, subject to current YouTube criteria. There is no Shorts parameter in videos.insert: the platform classifies the video; #Shorts is not required. WebSeer prepares 9:16 and warns when duration exceeds 3 minutes. A Shorts thumbnail can be a frame chosen in the YouTube app; an API-uploaded image does not guarantee identical display on every surface."]},
  "variants": {"title": ["Criar outra versão de formato", "Create another format version"], "body": ["A versão reutiliza palavras, velocidade, movimento das barras e a revisão do texto que originou a animação. A geração cria um arquivo separado em horizontal ou vertical, preservando o vídeo original e seus links. Confirme os dados antes de gerar; não é um recorte automático de um MP4 antigo.", "A version reuses words, speed, bar motion and the text revision that produced the animation. Generation creates a separate landscape or portrait file, preserving the original video and its links. Review settings before generation; this is not an automatic crop of an old MP4."]},
  "reelsTitle": {"title": ["Nome local do Reel", "Local Reel name"], "body": ["Organiza o projeto e nomeia o download. O Instagram Reels não tem um campo público de título separado da legenda neste template.", "Organizes the project and names the download. This template has no separate public Instagram Reels title field."]},
  "reelsCaption": {"title": ["Legenda do Reel", "Reel caption"], "body": ["Texto que acompanha a publicação. O template aceita até 2.200 caracteres contando as hashtags. Explique o documento e o método; o nome local do projeto não é enviado como um título público separado.", "Text accompanying the post. This template accepts up to 2,200 characters including hashtags. Explain the document and method; the local project name is not sent as a separate public title."]},
  "reelsHashtags": {"title": ["Hashtags do Reel", "Reel hashtags"], "body": ["São anexadas ao final da legenda, não enviadas como tags do YouTube. Use letras, números ou sublinhado, separando por espaços ou vírgulas. A conta e as regras atuais do Instagram podem impor limites adicionais.", "Appended to the caption, not sent as YouTube tags. Use letters, numbers or underscores, separating with spaces or commas. The account and current Instagram rules may impose further limits."]},
  "reelsFeed": {"title": ["Compartilhar no feed", "Share to feed"], "body": ["Planeja share_to_feed: além da área Reels, solicita compartilhamento no feed. A exibição efetiva depende da conta e do comportamento do Instagram. Não publica nada nesta versão.", "Plans share_to_feed: in addition to Reels, requests feed sharing. Actual display depends on the account and Instagram behavior. Nothing is published in this version."]},
  "reelsCollaborators": {"title": ["Colaboradores", "Collaborators"], "body": ["Nomes de usuário separados por vírgulas. A integração futura precisa verificar se a conta e os colaboradores podem receber o convite. Preencher não envia convite nem marca ninguém agora.", "Comma-separated usernames. Future integration must verify the account and collaborators are eligible for an invitation. Entering names does not send invitations or tag anyone now."]},
  "reelsLocation": {"title": ["Localização", "Location"], "body": ["ID numérico de um local reconhecido pelo Instagram, se você já o conhece. Não é um endereço de texto ou uma coordenada. A existência e a permissão para usar o local serão verificadas na integração.", "Numeric ID of an Instagram-recognized location, if known. It is not a text address or coordinate. Location existence and permissions will be checked during integration."]},
  "reelsCover": {"title": ["Quadro da capa do Reel", "Reel cover frame"], "body": ["Tempo do vídeo em segundos para planejar thumb_offset, convertido para milissegundos no JSON. A capa anexada fica no projeto local; uma futura integração poderá enviá-la ou usar este quadro. O tempo precisa caber no vídeo e será validado com a mídia antes de publicar.", "Video time in seconds to plan thumb_offset, converted to milliseconds in JSON. The attached cover stays in the local project; future integration may upload it or use this frame. The time must fit the video and will be checked against media before posting."]},
  "reelsPaid": {"title": ["Parceria paga no Reel", "Reel paid partnership"], "body": ["Registra que há parceria paga ou conteúdo de marca para revisão. A integração precisará validar elegibilidade, parceiro e requisitos do Instagram antes de aplicar a declaração. Não ativa monetização.", "Records paid partnership or branded content for review. Integration must validate eligibility, partner and Instagram requirements before applying disclosure. Does not enable monetization."]},
  "reelsAi": {"title": ["Conteúdo gerado por IA", "AI-generated content"], "body": ["Planeja a declaração de IA disponível na plataforma. Revise o vídeo, a capa e o áudio: uma contagem de palavras calculada por regras não é, por si só, conteúdo gerado por IA. O rascunho não altera rótulos no Instagram.", "Plans platform AI disclosure. Review video, cover and audio: rule-based word counts alone are not AI-generated content. The draft does not change Instagram labels."]},
  "reelsNotes": {"title": ["Notas do Reel", "Reel notes"], "body": ["Lembretes locais sobre legenda, direitos de música, conta, capa e revisão. Não fazem parte da legenda pública nem são enviados a uma API.", "Local reminders about captions, music rights, account, cover and review. Not part of the public caption or sent to an API."]},
  "tiktokCaption": {"title": ["Legenda do TikTok", "TikTok caption"], "body": ["Planeja o campo title da Content Posting API, com texto e hashtags. O template aceita até 2.200 caracteres no total. É diferente do título de até 100 caracteres usado no YouTube.", "Plans the Content Posting API title field, containing text and hashtags. The template accepts up to 2,200 total characters. This differs from the YouTube title of up to 100 characters."]},
  "tiktokHashtags": {"title": ["Hashtags do TikTok", "TikTok hashtags"], "body": ["As hashtags são incorporadas à legenda. Não existe neste template uma lista separada de tags no formato YouTube. Prefira termos relacionados à análise e ao documento.", "Hashtags are included in the caption. This template has no separate YouTube-style tags list. Prefer terms related to the analysis and document."]},
  "tiktokPrivacy": {"title": ["Privacidade do TikTok", "TikTok privacy"], "body": ["Escolha apenas como planejamento. Quando a API for conectada, creator_info precisa fornecer privacy_level_options e o usuário deve confirmar uma opção realmente disponível para sua conta. Não presumimos que uma conta possa publicar para Todos.", "Choose for planning only. When the API is connected, creator_info must provide privacy_level_options and the user must confirm an option actually available to the account. We do not assume every account can post to Everyone."]},
  "tiktokComments": {"title": ["Comentários no TikTok", "TikTok comments"], "body": ["Solicita permitir comentários. A integração deve respeitar comment_disabled retornado para a conta; sua permissão não pode superar as restrições do criador.", "Requests comments. Integration must respect account comment_disabled; your choice cannot override creator restrictions."]},
  "tiktokDuet": {"title": ["Dueto no TikTok", "TikTok Duet"], "body": ["Solicita permitir Dueto com o vídeo. A disponibilidade depende das configurações e permissões atuais da conta; precisa ser confirmada por creator_info.", "Requests Duet with the video. Availability depends on current account settings and permissions and must be confirmed through creator_info."]},
  "tiktokStitch": {"title": ["Costurar / Stitch", "Stitch"], "body": ["Solicita permitir que outros criadores usem trechos do vídeo. A integração deverá respeitar stitch_disabled e demais restrições da conta.", "Requests allowing other creators to use parts of the video. Integration must respect stitch_disabled and other account restrictions."]},
  "tiktokBrand": {"title": ["Minha própria marca", "My own brand"], "body": ["Planeja brand_organic_toggle para promoção da sua própria marca ou negócio. É diferente de uma parceria paga com outra marca. Revise as declarações comerciais exigidas antes de publicar.", "Plans brand_organic_toggle for promoting your own brand or business. This differs from a paid partnership with another brand. Review required commercial disclosures before posting."]},
  "tiktokPaid": {"title": ["Conteúdo de marca / parceria paga", "Branded content / paid partnership"], "body": ["Planeja brand_content_toggle quando há uma parceria com outra marca. Conteúdo comercial pode exigir confirmações e restrições próprias; Somente eu não é aceito para esse planejamento. Isto não habilita monetização.", "Plans brand_content_toggle for a partnership with another brand. Commercial content may require specific confirmations and restrictions; Only me is not accepted for this plan. Does not enable monetization."]},
  "tiktokAi": {"title": ["Conteúdo gerado por IA no TikTok", "TikTok AI-generated content"], "body": ["Planeja is_aigc quando a publicação requer uma declaração de conteúdo gerado por IA. Confira vídeo, capa e trilha. A integração futura deverá aplicar as regras e confirmações atuais da plataforma.", "Plans is_aigc when the post requires AI-generated content disclosure. Review video, cover and soundtrack. Future integration must apply current platform rules and confirmations."]},
  "tiktokCover": {"title": ["Quadro da capa no TikTok", "TikTok cover frame"], "body": ["Tempo em segundos de um quadro dentro do vídeo, planejado como video_cover_timestamp_ms. A imagem de capa anexada ao projeto não substitui automaticamente um quadro do vídeo no TikTok.", "Time in seconds of a frame within the video, planned as video_cover_timestamp_ms. A project cover image does not automatically replace a video frame on TikTok."]},
  "tiktokNotes": {"title": ["Notas do TikTok", "TikTok notes"], "body": ["Lembretes locais para a publicação, como revisão de texto, direitos da trilha, disponibilidade da conta e capa. Não são parte da legenda pública.", "Local posting reminders, such as text review, soundtrack rights, account availability and cover. Not part of the public caption."]},
  "tiktokTitle": {"title": ["Nome local do TikTok", "Local TikTok name"], "body": ["Nome usado para organizar e baixar o arquivo. Na Content Posting API, o campo title corresponde à legenda pública; neste painel ela é preenchida em Legenda da publicação.", "Name used to organize and download the file. In the Content Posting API, title corresponds to the public caption; this panel fills it through Post caption."]},
  "overview": {
    "title": [
      "Painel de criação de vídeo",
      "Video creation panel"
    ],
    "body": [
      "Prepare metadados, sincronize o canal e clique em Postar no YouTube para enviar o MP4. Salvar rascunho guarda as configurações localmente. Depois do envio, o link e o status ficam no painel e no Histórico; processamento do YouTube pode continuar.",
      "Prepare metadata, connect a channel and click Post to YouTube to upload MP4. Save draft stores settings locally. After upload, the link and status remain in the panel and History; YouTube processing may continue."
    ]
  },
  "title": {
    "title": [
      "Título",
      "Title"
    ],
    "body": [
      "Título público do vídeo, até 100 caracteres. Use o documento e as palavras analisadas para explicar o conteúdo. Também define o nome do download: WebSeer - título.",
      "Public video title, up to 100 characters. Identify the document and analyzed words. It also names the download: WebSeer - title."
    ]
  },
  "description": {
    "title": [
      "Descrição",
      "Description"
    ],
    "body": [
      "Explique o documento, método, palavras, resultados e fontes. Limite de 5.000 bytes UTF-8; acentos podem ocupar mais de um byte. Sugestões são editáveis.",
      "Describe the document, method, words, results and sources. Limit: 5,000 UTF-8 bytes; accented characters can take multiple bytes. Suggestions are editable."
    ]
  },
  "tags": {
    "title": [
      "Tags",
      "Tags"
    ],
    "body": [
      "Separe palavras-chave por vírgulas ou linhas. Use termos relevantes, variações e nomes do documento. O limite total é 500 caracteres, contando separadores e aspas; tags não garantem alcance.",
      "Separate keywords by commas or new lines. Use relevant terms, variants and document names. Total limit: 500 characters including separators and quotes; tags do not guarantee reach."
    ]
  },
  "category": {
    "title": [
      "Categoria",
      "Category"
    ],
    "body": [
      "Organiza o vídeo no YouTube; não define público etário. Entretenimento é o padrão solicitado; Educação ou Ciência e tecnologia podem ser mais adequadas conforme o conteúdo.",
      "Organizes the video on YouTube; does not set audience age. Entertainment is the requested default; Education or Science & Technology may better suit the content."
    ]
  },
  "language": {
    "title": [
      "Idioma do título e descrição",
      "Title and description language"
    ],
    "body": [
      "Informe o idioma original dos metadados, por exemplo pt-BR. Não traduz automaticamente nem altera o idioma da interface.",
      "Set the original metadata language, for example pt-BR. Does not translate automatically or change interface language."
    ]
  },
  "audioLanguage": {
    "title": [
      "Idioma do áudio",
      "Audio language"
    ],
    "body": [
      "Sem áudio é o padrão. Se houver fala, escolha o idioma falado; música instrumental não precisa de idioma de fala. Prepare o MP4 com trilha para incluir áudio.",
      "No audio is the default. If speech exists, choose its language; instrumental music needs no spoken language. Prepare MP4 with soundtrack to include audio."
    ]
  },
  "privacy": {
    "title": [
      "Visibilidade",
      "Visibility"
    ],
    "body": [
      "Privado: só você e pessoas convidadas. Não listado: qualquer pessoa com o link pode assistir e repassar, sem busca pública normal. Público: pode aparecer em buscas e no canal. Padrão: Não listado. Confira a visibilidade retornada pelo YouTube, pois configurações ou restrições do canal podem interferir.",
      "Private: you and invited people only. Unlisted: anyone with the link can watch and share, without normal public search listing. Public: may appear in searches and on your channel. Default: Unlisted. Check returned visibility because channel settings or restrictions can affect it."
    ]
  },
  "kids": {
    "title": [
      "Feito para crianças",
      "Made for kids"
    ],
    "body": [
      "No YouTube, significa conteúdo direcionado a crianças, não apenas adequado para jovens. “Sim” restringe recursos como comentários e anúncios personalizados. O padrão é Não; revise conforme o público real do vídeo.",
      "On YouTube this means directed at children, not merely suitable for young viewers. Yes restricts features such as comments and personalized ads. Default is No; review against the actual intended audience."
    ]
  },
  "synthetic": {
    "title": [
      "Conteúdo sintético realista",
      "Realistic synthetic content"
    ],
    "body": [
      "Informe alterações relevantes ou geração sintética que pareçam reais: por exemplo pessoa real dizendo algo que não disse ou evento realista inventado. Um gráfico animado comum, por si só, não equivale a esse caso. A declaração pode gerar rótulo de transparência; não garante alcance.",
      "Disclose meaningful alterations or synthetic generation that appear real, such as a real person saying something they never said or a realistic invented event. An ordinary animated chart alone is not that case. Disclosure may add a transparency label; it does not guarantee reach."
    ]
  },
  "license": {
    "title": [
      "Licença",
      "License"
    ],
    "body": [
      "YouTube Standard mantém os direitos com o titular e permite uso conforme os termos do YouTube. Creative Commons Attribution permite reutilização por terceiros com atribuição, inclusive usos comerciais. Escolha CC apenas se tiver direitos sobre todos os elementos, incluindo música e imagens.",
      "YouTube Standard retains rights with the owner and allows use under YouTube terms. Creative Commons Attribution permits reuse with attribution, including commercial use. Choose CC only if you hold rights to every element, including music and images."
    ]
  },
  "schedule": {
    "title": [
      "Agendar publicação",
      "Schedule publication"
    ],
    "body": [
      "Defina data e hora futuras no fuso mostrado e mantenha o vídeo Privado. O agendamento é enviado ao YouTube junto ao upload. Revise o horário antes de postar.",
      "Set a future date/time in the displayed timezone and keep the video Private. The schedule is sent to YouTube with the upload. Review the time before posting."
    ]
  },
  "date": {
    "title": [
      "Data de gravação",
      "Recording date"
    ],
    "body": [
      "Começa com a data de geração da animação. Você pode corrigir a data; este campo é diferente da data agendada para publicar.",
      "Starts with the animation generation date. You can correct it; this differs from the scheduled publication date."
    ]
  },
  "hasPaidProductPlacement": {
    "title": [
      "Promoção paga",
      "Paid promotion"
    ],
    "body": [
      "Marque se o vídeo contém patrocínio, publicidade ou colocação de produto que exija declaração. Não é uma opção para ativar monetização.",
      "Select if sponsorship, advertising or product placement requires disclosure. This does not enable monetization."
    ]
  },
  "embeddable": {
    "title": [
      "Permitir incorporação",
      "Allow embedding"
    ],
    "body": [
      "Permite que o player seja incorporado em outros sites, respeitando as restrições de privacidade.",
      "Allows embedding the player on other sites, subject to privacy restrictions."
    ]
  },
  "publicStatsViewable": {
    "title": [
      "Estatísticas estendidas",
      "Extended statistics"
    ],
    "body": [
      "Controla a disponibilidade de estatísticas estendidas ao público. Não torna públicos seus relatórios privados do YouTube Analytics nem oculta todas as métricas básicas.",
      "Controls availability of extended public statistics. Does not expose private YouTube Analytics reports or hide all basic metrics."
    ]
  },
  "notifySubscribers": {
    "title": [
      "Notificar inscritos",
      "Notify subscribers"
    ],
    "body": [
      "Solicita notificar inscritos no upload. O YouTube e as preferências dos usuários determinam a entrega. Não listado/Privado não funcionam como uma publicação pública no feed.",
      "Requests subscriber notifications on upload. YouTube and user preferences determine delivery. Unlisted/Private do not act like a public feed publication."
    ]
  },
  "playlists": {
    "title": [
      "Playlists",
      "Playlists"
    ],
    "body": [
      "Guarde os IDs desejados como planejamento. Adicionar a uma playlist exige uma operação separada da API; este campo ainda não modifica o YouTube.",
      "Keep desired IDs as planning. Playlist insertion requires a separate API operation; this field does not change YouTube yet."
    ]
  },
  "age": {
    "title": [
      "Restrição etária",
      "Age restriction"
    ],
    "body": [
      "Planeja restrição a maiores de 18 anos. É diferente de “feito para crianças”: conteúdo não infantil pode continuar apropriado para todas as idades. Este campo é apenas uma nota local.",
      "Plans an 18+ restriction. This differs from made for kids: non-child-directed content can still suit all ages. This is a local planning note only."
    ]
  },
  "captions": {
    "title": [
      "Notas sobre legendas",
      "Caption notes"
    ],
    "body": [
      "Anote idioma e necessidades de legendas para uma etapa futura. Este campo não cria legendas nem envia arquivos ao YouTube. Pode permanecer vazio.",
      "Note caption language and needs for a future stage. Does not create captions or upload files to YouTube. May remain empty."
    ]
  },
  "thumbnail": {
    "title": [
      "Miniatura",
      "Thumbnail"
    ],
    "body": [
      "Imagem de capa antes de assistir. PNG/JPEG até 2 MB, preferencialmente 1280×720. Clique para ampliar, trocar ou excluir; salve o rascunho. Depois do upload, a miniatura é enviada ao YouTube se o canal tiver permissão para miniaturas personalizadas. Uma falha não apaga o vídeo.",
      "Cover image shown before watching. PNG/JPEG up to 2 MB, preferably 1280×720. Click to enlarge, replace or remove; save the draft. After upload, the thumbnail is sent if the channel permits custom thumbnails. Failure does not delete the video."
    ]
  },
  "soundtrack": {
    "title": [
      "Áudio de fundo",
      "Soundtrack"
    ],
    "body": [
      "Carregue uma trilha que você possa utilizar: MP3/WAV/M4A/AAC/OGG até 25 MB, conforme suporte do navegador. Clique para ouvir. Ao carregar em um MP4, o WebSeer prepara o vídeo com áudio AAC no navegador. A trilha repete e é cortada na duração da animação. Salve o rascunho para manter esse arquivo. O vídeo original permanece guardado; vídeos já publicados exigem uma nova versão e novo envio.",
      "Upload a track you can use: MP3/WAV/M4A/AAC/OGG up to 25 MB, subject to browser support. Click to listen. For MP4, WebSeer prepares the video with AAC audio in your browser. Soundtrack loops and trims to the animation duration. Save the draft to retain this file. Original video stays saved; existing uploads require a new version and upload."
    ]
  },
  "provider": {
    "title": [
      "Provedor de sugestões",
      "Suggestion provider"
    ],
    "body": [
      "O assistente ativo usa regras locais e contagens já calculadas. Não é IA, não lê o vídeo e não envia arquivos a serviços externos.",
      "The active assistant uses local rules and computed counts. It is not AI, does not watch the video and does not send files externally."
    ]
  },
  "suggestionLanguage": {
    "title": [
      "Idioma das sugestões",
      "Suggestion language"
    ],
    "body": [
      "Define o idioma dos novos textos sugeridos. Aplicar configurações não substitui campos editados; use Gerar sugestões para atualizar.",
      "Sets the language for new suggestions. Applying settings does not replace edited fields; use Generate suggestions to update them."
    ]
  },
  "style": {
    "title": [
      "Estilo do título",
      "Title style"
    ],
    "body": [
      "Descritivo apresenta documento e termos; Descoberta adiciona um convite à exploração. Revise o título para evitar promessas que a análise não sustenta.",
      "Descriptive presents the document and terms; Discovery adds an invitation to explore. Review to avoid claims unsupported by the analysis."
    ]
  },
  "titleTerms": {
    "title": [
      "Palavras no título",
      "Terms in title"
    ],
    "body": [
      "Limita quantas palavras analisadas entram na sugestão de título. O título continua limitado a 100 caracteres.",
      "Limits how many analyzed terms enter title suggestions. Title still has a 100-character limit."
    ]
  },
  "includeCounts": {
    "title": [
      "Contagens na descrição",
      "Counts in description"
    ],
    "body": [
      "Inclui as contagens acumuladas finais para as palavras escolhidas. São dados descritivos do corpus, sem interpretação por IA.",
      "Includes final cumulative counts for selected words. These are descriptive corpus data without AI interpretation."
    ]
  },
  "youtubeConnect": {
    "title": [
      "Sincronizar canal",
      "Connect channel"
    ],
    "body": [
      "O Google pede autorização YouTube separada do login. Você pode continuar com a conta atual ou escolher outra conta/canal de marca. O canal retornado pela API é o destino real. A permissão youtube.force-ssl permite gerenciar vídeos, miniaturas e playlists; não dá acesso aos seus PDFs. O token expira e fica apenas na memória.",
      "Google requests YouTube authorization separately from sign-in. Continue with your current account or choose another account/Brand Account. The API-returned channel is the actual destination. youtube.force-ssl permits managing videos, thumbnails and playlists, not your PDFs. The expiring token stays in memory."
    ]
  },
  "youtubePlaylist": {
    "title": [
      "Playlist de destino",
      "Target playlist"
    ],
    "body": [
      "Escolha uma playlist do canal autorizado ou Sem playlist. A lista inclui playlists privadas que a autorização permita ler; use Carregar mais para paginar. O vídeo é enviado primeiro e depois adicionado à playlist. Se essa etapa falhar, o vídeo e seu link são mantidos.",
      "Choose a playlist owned by the authorized channel or No playlist. The list includes private playlists permitted by the authorization; use Load more for pagination. The video uploads first, then is added to the playlist. If that step fails, the uploaded video and link are retained."
    ]
  },
  "youtubePublish": {
    "title": [
      "Postar no YouTube",
      "Post to YouTube"
    ],
    "body": [
      "Envia o MP4 ao canal confirmado com os metadados revisados. Não listado é o padrão para novos vídeos; confira a visibilidade efetiva retornada pelo YouTube. A porcentagem representa bytes enviados; o YouTube ainda pode processar o vídeo. O ID e o link ficam no rascunho e no Histórico. Falhas de playlist/miniatura não repetem o upload.",
      "Uploads MP4 to the confirmed channel with reviewed metadata. Unlisted is the new-video default; check actual visibility returned by YouTube. Percentage measures uploaded bytes; YouTube may still process the video. ID and link stay in the draft and History. Playlist/thumbnail failures do not re-upload the video."
    ]
  },
  "createPlaylist": {
    "title": [
      "Criar playlist no canal",
      "Create channel playlist"
    ],
    "body": [
      "Cria uma playlist real no canal autorizado, usando a permissão youtube.force-ssl já concedida. Informe nome, descrição e visibilidade. Ela será adicionada e selecionada na lista após a confirmação do YouTube. Abrir playlists leva ao canal no YouTube; essa página pode omitir playlists privadas. Uma falha de rede pode deixar a criação sem confirmação: confira o canal antes de repetir.",
      "Creates a real playlist in the authorized channel using the existing youtube.force-ssl permission. Enter title, description and visibility. It is added and selected after YouTube confirms. Open playlists takes you to the channel on YouTube; that page may omit private playlists. Network failures can leave creation unconfirmed: check the channel before retrying."
    ]
  }
} satisfies Record<string,InfoTopic>;
