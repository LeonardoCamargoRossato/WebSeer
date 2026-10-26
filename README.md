# Web Seer Lab — Planner Iteration

Aplicação React + TypeScript + Vite para exploração visual de linguagem.

## Esta iteração inclui

- Sistema visual reutilizável para palavras/conceitos (`WordNode`) e relações (`ArrowLink`).
- Nodes com contorno, fundo suave, estados de hover/seleção e variações esquerda/direita/compartilhada.
- Flechas curvas com ponta e cálculo de conexão no perímetro do node, evitando atravessar o texto.
- Compare padronizado e controle **Palavras por lado / Words per side**.
- Word Tree usando o mesmo sistema de nodes e flechas.
- Phrase Net com nodes retangulares, links direcionais e force simulation preservada.
- Corpus com **Upload PDF**, preview local, zoom +/− e modo expandido/minimizado.
- PT-BR / EN-US para as novas funcionalidades.
- PDF mantido somente na sessão do navegador, sem cache/persistência.

## Executar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

O projeto depende de React, D3 e Vite conforme `package.json`.

## Armazenamento e exemplos

A opção **Opções de Armazenamento** no cabeçalho explica os modos disponíveis.
PDFs importados e suas páginas extraídas são salvos no IndexedDB deste navegador.
Na aba Corpus é possível abrir e excluir os PDFs salvos, inclusive após recarregar.
Os arquivos não são enviados a nenhum servidor. Limpar os dados do site ou a
remoção de dados pelo navegador pode apagá-los: mantenha os arquivos originais.
Se o armazenamento falhar, a análise do PDF continua disponível na sessão e a
interface informa a falha. Supabase é somente uma opção futura desabilitada.

Os exemplos curtos em português e inglês ficam em `public/corpora/`, publicados
junto ao site, e são carregados sob demanda na aba Corpus. Os PDFs do repositório
não são copiados para a pasta pública nem para o artefato do GitHub Pages.

## GitHub Pages

O workflow `.github/workflows/pages.yml` instala com `npm ci`, verifica TypeScript,
gera `dist/` e publica no GitHub Pages a cada push em `main`. Em **Settings → Pages
→ Build and deployment → Source**, selecione **GitHub Actions**. O endereço padrão
esperado é `https://leonardocamargorossato.github.io/WebSeer/`.
O Vite usa caminhos relativos para funcionar também dentro de `/WebSeer/`.

## Verificação no navegador

```bash
npm ci
npx playwright install chromium
npm run build
npm run preview -- --port 4173 --strictPort
# Em outro terminal:
npm run test:browser
# Para usar Chromium já instalado:
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

O teste verifica o menu, exemplos PT/EN, importação de PDF, persistência após
recarregar, restauração da análise em árvore e exclusão persistente.
A ferramenta Comparar usa as continuações reais das consultas no corpus; palavras e sequências ausentes são bloqueadas.


## Fluxo de documentos e leitura de PDF

A navegação principal é Início → Corpus do Documento → Ferramentas de Análise,
seguida de Histórico e Exemplos de Aplicação. O menu de análise começa pelo
Dashboard de dados e inclui Comparar, Árvore de Palavras, Rede de Frases,
Frequências e Mapa de Palavras.

No Corpus, arraste ou selecione um arquivo e confirme a conversão explicitamente.
São aceitos PDF, DOCX (Word moderno), TXT e Markdown; .doc legado deve ser
exportado como DOCX. Texto simples usa UTF-8 ou UTF-16 com BOM. A leitura de
DOCX é carregada sob demanda com Mammoth e usa somente texto, sem inserir HTML.

PDF.js oferece reconstrução de palavras por espaços/posição dos fragmentos
(padrão) e leitura literal para diagnóstico. Quebras de linha são preservadas;
remover margens repetidas é uma opção heurística desativada por padrão. Não
removemos hífens indiscriminadamente e não há OCR nesta versão. PDFs sem texto
produzem uma mensagem explicativa, sem substituir o corpus ativo. Erros de
conversão mostram etapa, arquivo, conversor e página quando disponíveis.

PDFs salvos no IndexedDB são reprocessados a partir do original ao clicar em
Abrir e confirmar a conversão; isso corrige documentos extraídos pela versão
antiga. O registro salvo é atualizado. Novos uploads usam hash SHA-256 para
reutilizar o registro quando o mesmo arquivo for importado novamente.

O dashboard mostra palavras, tokens distintos, páginas, frequências, metadados,
marcadores e sinais heurísticos para revisão. Não apresenta uma porcentagem de
acerto inventada: medir acurácia exige uma transcrição de referência. Capítulos
são candidatos por títulos explícitos. Detecção de notas de rodapé ainda não está
implementada; campos ausentes são identificados como não informados/avaliados.

Comparar conta palavras imediatamente seguintes às duas consultas, com
frequência, posição e proporção reais; não consulta serviços externos. Consultas
são normalizadas por Unicode e devem existir como sequências completas dentro
de um documento. Nenhuma ligação é criada entre páginas/documentos distintos.

Execute `npm test` para regressões de reconstrução (incluindo o PDF de Gênesis),
espaços, quebras de linha, margens e comparação. O teste de navegador cobre o
novo fluxo, PDF completo, dashboard, IndexedDB/reprocessamento/exclusão, DOCX,
TXT, arraste de Markdown, diagnóstico de PDF inválido, visualizações, PT/EN,
exemplos, menu móvel e funcionamento sem acesso ao IndexedDB.
