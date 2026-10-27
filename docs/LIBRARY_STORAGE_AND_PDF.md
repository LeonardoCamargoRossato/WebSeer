# Biblioteca, armazenamento e reconversão de PDF

## Capacidade e tamanhos

Não existe limite fixo de 1 GB, nem uma quantidade máxima universal de documentos.
O painel consulta `navigator.storage.estimate()` para mostrar **uso da origem /
cota estimada**. A cota depende do navegador, dispositivo e disco disponível;
não é espaço reservado nem garantia de que um arquivo desse tamanho possa ser
convertido em RAM. Uma API indisponível aparece como “Cota não informada”.

No GitHub Pages, a origem é `https://leonardocamargorossato.github.io`: outros
projetos nesse mesmo domínio podem compartilhar o uso/cota. Isso é armazenamento
no navegador, não espaço enviado ao repositório GitHub ou ao Supabase.

Também mostramos **conteúdo WebSeer estimado** e valores por documento/vídeo.
O original e cada Blob têm tamanho exato; o agregado soma uma aproximação do
conteúdo dos seis object stores. Inclui cópia de reconversão PDF, revisões de
texto, pesquisas, relatórios, animações e anexos. Não é alocação física do
IndexedDB: índices, compressão e deduplicação do navegador podem mudar o total.
O MP4 referenciado por um rascunho não é copiado/somado novamente. Arquivos na
pasta Downloads e versões transcodificadas hospedadas pelo YouTube não entram.

O cálculo percorre registros com cursor, mantendo um registro por vez. Tamanhos
de strings UTF-8 são calculados sem criar cópias em Blob/ArrayBuffer. Atualizações
da biblioteca são agrupadas, e não acionadas por cada quadro de vídeo.

Referências:
- https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate
- https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria

## Navegação e players

Documentos usam inicialmente linhas horizontais com tipo, nome, original,
armazenamento estimado, pesquisas, relatórios e data. Cards e lista detalhada
são preferências locais. As pastas de relatórios iniciam recolhidas.

Vídeos têm capa à esquerda, tamanhos de MP4/GIF, imagem e áudio, link e status.
Um player YouTube só é criado ao clicar. Apenas um player de vídeo e uma prévia
de áudio ficam ativos por biblioteca; filtros/alternância de layout encerram a
prévia. Há paginação de 20 itens para evitar dezenas de players/imagens ativos.
Vídeos privados/em processamento/com incorporação bloqueada podem exigir abrir
no YouTube. O iframe usa `youtube-nocookie.com` e envia referência de origem.

O player remoto mostra o conteúdo realmente enviado. A trilha pode ser incorporada
ao MP4 no painel: AAC a 128 kbps, repetida/cortada na duração do vídeo, com
cópia dos pacotes H.264 originais. A codificação ocorre em Worker, com fallback
AAC WASM local. Salvar preserva o MP4 preparado; prévias, downloads e próximos
envios usam esse arquivo. O original é mantido e ambos entram na estimativa
de espaço. Vídeos já publicados exigem nova versão/novo envio; o link original
é mantido. O player de áudio separado permite conferir o anexo original. A capa local pode diferir da atual no canal; a ajuda explica isso.

## Investigação do travamento na segunda conversão

O código não contém bloqueio deliberado à segunda conversão. Identificamos:

1. Um iframe nativo de PDF era montado mesmo dentro de `<details>` fechado.
   Isso podia manter outro leitor de PDF ativo junto ao PDF.js.
2. Árvore, contextos e frequências podiam ser recalculados fora da ferramenta
   visível. Ao substituir o corpus, consultas antigas podiam ser processadas
   antes de seus estados serem limpos.
3. A listagem de PDFs guardava em estado as páginas extraídas de todos os PDFs.
   Agora a lista usa apenas resumos; a migração também lê páginas apenas quando
   precisa migrar um registro ainda não arquivado.
4. Sair da página não cancelava a extração. Reabrir e iniciar outra podia deixar
   duas conversões sobrepostas. Agora existe AbortController, proteção imediata
   contra duplo clique e uma fila de extração serializada.
5. O arquivo podia ser relido para hashes paralelos no cache e no arquivo do
   documento. Um WeakMap compartilha a mesma operação para o mesmo Blob imutável.

O PDF.js **já tinha `task.destroy()` em `finally`**. Não atribuímos o problema
à ausência desse cleanup. Agora a destruição também ocorre ao cancelar/sair,
`page.cleanup()` roda mesmo em falhas e a interface recebe oportunidade de
responder a cada página. A prévia nativa só existe quando solicitada e é fechada
antes da conversão. A leitura de texto desativa FontFace, pois não renderiza PDF.

No teste Chromium headless com o Gênesis completo, três conversões seguidas
terminaram sem crash e os workers chegaram a zero após cada uma. Um ensaio
registrou aproximadamente 2,8 / 3,4 / 4,0 s e heap JS após GC de 5,2 / 6,1 / 6,8 MB.
Esses números são observações do ambiente de teste, não uma garantia para o PC do
usuário, nem medição da RAM total do processo, GPU ou visualizador nativo.
Cancelamento, navegação durante leitura e nova tentativa também foram testados.
Conversões idênticas mantiveram 1 documento, 1 revisão e 1 entrada de cache.

Sem relatório de falha do Edge/Chrome do usuário não é possível provar a causa
exata do crash. Falta de RAM, extensões ou falha do leitor nativo/GPU continuam
possibilidades se persistir. **RAM é diferente da cota de armazenamento em disco**:
um PDF comprimido pequeno pode exigir muito mais memória durante leitura e
análises. Estourar a cota normalmente gera erro de gravação, não prova falta de RAM.

Não recomendamos limpar dados do site como tentativa automática: isso pode apagar
os documentos IndexedDB. Se persistir, o gerenciador de tarefas do navegador
(Shift+Esc no Chrome/Edge) ajuda a observar o consumo antes/depois da reconversão;
guarde nome do arquivo, página atingida, opções e versão do navegador.

## Testes

Com preview de produção na porta 4173:

```bash
CHROMIUM_PATH=/usr/bin/chromium npm run test:pdf-repeat
CHROMIUM_PATH=/usr/bin/chromium npm run test:library
```

O primeiro executa reconversões reais, verifica resposta da UI, workers,
cancelamento e deduplicação. O segundo usa cota simulada e mídia de teste para
verificar tamanhos, layouts, pastas fechadas e players. Nenhum desses testes
publica vídeos ou usa uma conta real de YouTube.

## Exclusão e apresentação

O botão único de ícone à direita de Documentos/Vídeos alterna lista/cards;
a preferência é mantida por biblioteca. Pesquisas usam linhas compactas no PC.
`deletedAt` nos registros permite lixeira/restauração sem nova versão do schema.
Contagens de itens ativos excluem os apagados; a lixeira mostra os itens e data.
Excluir documento oculta seus vídeos/relatórios, mantendo os vínculos para restaurar.
Excluir pesquisa preserva relatórios já gerados. A alocação de versões inclui
relatórios excluídos para nunca reutilizar um número. Lixeira ainda ocupa disco;
nenhuma exclusão local chama a API para apagar vídeos no canal.

Teste adicional: `npm run test:library-audio` (Chromium + ffmpeg/ffprobe) verifica
restauração e contagens, MP4 com AAC audível, igualdade dos pacotes H.264 antes e
depois da preparação e persistência do arquivo. APIs externas são simuladas.

## Organização visual e distribuição do espaço

A barra azul-clara reúne Documentos, Vídeos, Todos os documentos (quando dentro
de uma pasta), lixeira, ajuda e seletor de visualização. O documento e suas ações
ficam em um bloco separado das ferramentas, pesquisas e relatórios.
O total de `UsageBreakdown` abre um diálogo com gráfico de pizza e nove categorias.
Cada setor usa a mesma cor do rótulo/valor na legenda; linhas claras com borda
colorida mantêm contraste. Valores zerados também constam da legenda. O gráfico
normaliza os conteúdos lógicos do item, não a cota do navegador. Há fechamento
por Escape/clique fora e restauração de foco ao botão; a janela rola no celular.
