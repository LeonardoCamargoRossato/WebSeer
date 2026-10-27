# Publicação de vídeos no YouTube

O WebSeer faz autorização interativa e upload direto do navegador, sem backend,
API key ou Client Secret. O login Google do aplicativo e a autorização YouTube
são separados. O token YouTube fica somente em memória e expira; não é salvo
no IndexedDB, JSON ou histórico. Recarregar exige autorizar novamente para novas
operações; links publicados continuam salvos.

## O que Leonardo precisa configurar no Google Cloud

1. Abra o projeto **WebSeer (`webseer-512823`)**, o mesmo do OAuth já configurado.
2. Em **APIs e serviços → Biblioteca**, procure e habilite **YouTube Data API v3**:
   https://console.cloud.google.com/apis/library/youtube.googleapis.com?project=webseer-512823
3. Em **Google Auth Platform → Acesso a dados → Adicionar/remover escopos**,
   adicione `https://www.googleapis.com/auth/youtube.force-ssl`.
   Esse escopo permite consultar canal/playlists e gerenciar vídeos, miniaturas
   e itens de playlists. A tela do Google também descreve permissões de
   edição/exclusão, embora o WebSeer não implemente exclusão. `youtube.upload`
   sozinho não autoriza `playlistItems.insert`; por isso este fluxo usa
   `youtube.force-ssl`. Salve a configuração.
4. Em **Público-alvo → Usuários de teste**, mantenha/adicione o e-mail que usará o
   canal. Em modo de teste, somente usuários autorizados devem usar os escopos
   sensíveis. Se abrir o app ao público, siga a verificação OAuth do Google e
   seus requisitos de domínio, política de privacidade e consentimento.
5. Em **Clientes**, mantenha o OAuth do tipo **Aplicativo da Web** com origem
   `https://leonardocamargorossato.github.io` (sem `/WebSeer/`). O fluxo usa popup
   do Google Identity Services: não precisa de callback de servidor nem de
   Client Secret. A variável GitHub `GOOGLE_CLIENT_ID` já usada pelo login
   continua a mesma; não é necessário criar outra chave se ela está correta.
6. No WebSeer, gere um **MP4** e abra seu painel. Clique em **Sincronizar canal do
   YouTube**. Continue com a conta atual ou escolha outra. Se houver canal de
   marca, escolha o canal correto na autorização Google. Confira o canal que
   a API retornar, selecione a playlist e confirme.
7. Revise título, descrição, tags, público e visibilidade. Novos rascunhos usam
   **Não listado**. Clique em **Postar no YouTube**. O botão inicia um envio real;
   apenas sincronizar o canal ou salvar rascunho não publica nada.
8. Confira o link e a **visibilidade retornada pelo YouTube**. A especificação
   oficial Google `20261012` informa que projetos de API não verificados **não
   são automaticamente limitados a Privado**. Preferências do criador ou
   restrições específicas podem interferir: o app mostra a resposta efetiva.
   Auditorias de conformidade/cota YouTube são separadas da verificação OAuth;
   siga qualquer exigência que o Google apresentar para seu caso.

O WebSeer não pode verificar nem alterar a configuração do seu projeto Cloud a
partir deste ambiente. Os testes de integração usam respostas simuladas; não
publicam vídeos reais na sua conta.

## Funcionamento e recuperação

- Antes de enviar, a API confirma o canal real do token. O frontend não pode
  direcionar uploads a um canal arbitrário apenas passando um ID.
- O upload usa `videos.insert` com sessão resumível e progresso de bytes via XHR.
  Um erro de rede consulta a **mesma sessão**, sem criar outro vídeo. Há limite
  de tentativas de recuperação, botão de interromper e tempo decorrido.
- O ID/link é salvo **antes** de adicionar playlist ou miniatura. Essas operações
  são separadas; falhas viram avisos e não reenviam o vídeo.
- O link aparece na notificação, abaixo do botão e em **Histórico → Vídeos**,
  com filtros **Vídeos publicados** e **Vídeos não publicados**. “Publicado”
  significa envio confirmado com um ID; processamento e visibilidade ainda
  dependem do YouTube. Use **Atualizar status do YouTube** no painel.
- A biblioteca registra título, canal, data, visibilidade, processamento e avisos.
  A relação continua sendo por documento e versão de animação, sem duplicar MP4.
- Uma trava transacional no IndexedDB evita iniciar dois uploads da mesma versão
  em abas distintas. Se a conexão cair sem confirmação, a versão fica marcada
  como incerta. Confira o YouTube Studio antes de liberar manualmente outra
  tentativa. Um envio iniciado em uma aba que foi fechada também exige conferência.
- Miniaturas exigem elegibilidade/permissão do canal. A trilha de áudio é
  incorporada ao MP4 preparado antes do envio (AAC). Salve e confira a prévia.
  Vídeos já publicados não podem ser substituídos: crie uma nova versão com som.
- Cotas, permissões negadas, ausência de canal, API desabilitada e erros de rede
  são exibidos. Não há automação em segundo plano nem refresh token no Pages.

## Testes

`npm test` cobre também o movimento vertical independente das contagens.
`tests/youtube-browser.cjs` simula OAuth, playlists paginadas, upload, miniatura,
links persistentes, duplicatas, erro 403, visibilidade privada e falha de rede.
Não usa credenciais reais e nunca envia um vídeo real.

Use um build **separado**, preservando `dist` de produção:

```bash
VITE_GOOGLE_CLIENT_ID=test-client.apps.googleusercontent.com npx vite build --outDir /tmp/webseer-youtube-test-dist --base /
npx vite preview --outDir /tmp/webseer-youtube-test-dist --host 127.0.0.1 --port 4175
# Em outro terminal:
CHROMIUM_PATH=/usr/bin/chromium npm run test:youtube
```

Referências oficiais:
- https://developers.google.com/identity/oauth2/web/guides/use-token-model
- https://developers.google.com/youtube/v3/guides/using_resumable_upload_protocol
- https://developers.google.com/youtube/v3/docs/videos/insert
- https://developers.google.com/youtube/v3/docs/playlistItems/insert
- https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits

Escopos e métodos conferidos no discovery oficial Google, revisão `20261012`:
https://github.com/googleapis/google-api-python-client/blob/main/googleapiclient/discovery_cache/documents/youtube.v3.json

## Criar e abrir playlists

O menu de sincronização oferece **Criar nova playlist**, com nome, descrição e
visibilidade (Não listado por padrão). O botão final cria uma playlist real via
`playlists.insert`, e a resposta confirmada é inserida/selecionada na lista.
A autorização `youtube.force-ssl` já utilizada cobre esse método; não é preciso
adicionar outro escopo. Os links **Entrar nas playlists do canal**, **Gerenciar
playlists no YouTube Studio** e **Abrir playlist selecionada** permitem conferir
no YouTube; playlists privadas podem não aparecer na página pública do canal.

Criação não é repetida automaticamente em erros de rede: confira o canal antes
de tentar novamente, pois uma resposta perdida pode ocultar uma criação concluída.
Confirmar o canal/playlist aplica o destino ao rascunho; salve o rascunho para
persistir a escolha. Criar playlist não reenvia vídeos já publicados.
