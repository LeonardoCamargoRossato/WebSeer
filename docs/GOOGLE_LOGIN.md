# Ativar login Google no WebSeer

O código está preparado, mas o login real depende de um OAuth Client ID criado
pelo administrador no Google Cloud. Não há Client ID fornecido nesta entrega.
Sem configuração, a tela Entrar mostra instruções e o restante do site funciona.

1. Acesse https://console.cloud.google.com/auth/overview e crie/escolha um projeto.
2. Em Google Auth Platform, configure marca (WebSeer), público e contato. Se usar
   modo Testing, cadastre os e-mails das contas que farão os testes.
3. Crie um cliente OAuth **Web application / Aplicativo da Web**.
4. Em **Authorized JavaScript origins**, inclua:
   - `https://leonardocamargorossato.github.io`
   - Para desenvolvimento: `http://localhost:5173` e `http://localhost:4173`.
   A origem não inclui `/WebSeer/`. A URL inicial do aplicativo é
   `https://leonardocamargorossato.github.io/WebSeer/`.
5. Copie somente o Client ID público, terminado em `.apps.googleusercontent.com`.
   Este frontend não precisa de Client Secret: não o coloque no repositório.
6. No GitHub, abra WebSeer → Settings → Secrets and variables → Actions →
   Variables e crie a variável de repositório `GOOGLE_CLIENT_ID` com esse ID.
7. Execute novamente o workflow Deploy GitHub Pages em Actions → Run workflow.
   O workflow o passa ao Vite como `VITE_GOOGLE_CLIENT_ID`.
8. Abra o site publicado, clique Entrar e teste o botão oficial do Google.

Para desenvolvimento, copie `.env.example` para `.env.local`, preencha
`VITE_GOOGLE_CLIENT_ID` e reinicie o Vite. Não use o Client ID de teste da suíte
como configuração real.

## Funcionamento e limites desta etapa

- Google Identity Services abre o fluxo oficial em popup. Isso funciona em site
  estático sem um endpoint POST de callback, que o GitHub Pages não oferece.
- O ID token é verificado com chaves públicas oficiais Google (assinatura RS256,
  emissor, audiência, validade e nonce). Nome/foto só aparecem após verificação.
- O ID token fica em sessionStorage para revalidar a sessão ao recarregar; não
  fica em IndexedDB, relatórios, rascunhos ou localStorage. Expiração e Sair limpam
  a sessão. O login de identidade não solicita tokens YouTube. A autorização separada
  no painel de vídeo mantém seu access token apenas em memória; não usa refresh token.
- Este é um login de identidade no frontend. Não cria backend de autorização,
  sincronização, isolamento de documentos por conta ou armazenamento em nuvem.
  A biblioteca IndexedDB permanece compartilhada neste navegador/origem.
- Entrar com Google não identifica nem autoriza um canal do YouTube. O painel de
  vídeo oferece autorização OAuth YouTube separada e confirmação do canal.
  Consulte [YOUTUBE.md](YOUTUBE.md) para configuração e publicação.

Referências:
- https://developers.google.com/identity/gsi/web/guides/overview
- https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
- https://developers.google.com/identity/gsi/web/reference/js-reference

## Testes de integração com provedor simulado

Os testes não autenticam uma conta Google real. Eles fornecem JWKS e ID tokens
assinados de teste e verificam assinatura, nonce, expiração, avatar, recarga e
logout. Para executá-los sem contaminar a build de produção:

```bash
VITE_GOOGLE_CLIENT_ID=test-client.apps.googleusercontent.com \
  npx vite build --outDir /tmp/webseer-auth-tests-built
npx vite preview --outDir /tmp/webseer-auth-tests-built --port 4174 --strictPort
# Outro terminal:
CHROMIUM_PATH=/usr/bin/chromium npm run test:auth
```

A ativação e validação ponta a ponta com Google real ainda exigem o Client ID,
as origens autorizadas e uma conta de teste configurados pelo administrador.

## Botão Google aparece, mas a validação falha

Se o botão aparece, o Client ID já chegou à build. Uma falha posterior pode ser
conexão com o endpoint público de chaves, credencial expirada, relógio do
dispositivo, audiência/Client ID, assinatura ou nonce. A mensagem genérica antiga
não distinguia essas situações.

A tela agora oferece **Ver diagnóstico do login**, com código e etapa, sem
exibir ID token, nome, e-mail ou conteúdo da credencial. Use o código para o
próximo diagnóstico; não compartilhe tokens nem Client Secret.

- `network` / etapa `keys`: conferir conexão e bloqueio de
  `https://www.googleapis.com/oauth2/v3/certs` no navegador/extensão/rede.
- `audience`: conferir `GOOGLE_CLIENT_ID`, publicar de novo e recarregar.
- `expired` / `clock`: conferir horário automático e refazer login.
- `nonce`: recarregar e tentar novamente. GIS agora é inicializado uma vez por
  página; revisitar a tela não substitui o nonce de um botão já criado.
- `signature` / `keys`: credencial continua recusada; aguardar/recarregar e
  investigar sem desativar verificação criptográfica.

O nome de exibição é opcional no OpenID Connect. Após validar a assinatura e a
identidade, o app usa nome completo, nomes individuais ou e-mail verificado como
alternativas. Isso não dispensa assinatura, audiência, emissor, validade ou nonce.
