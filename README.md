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
- PDF mantido no navegador, com persistência em IndexedDB.

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

## Biblioteca por documento e relatórios (v0, sem IA)

O Histórico é uma biblioteca no IndexedDB, organizada por documento. Cada pasta
oferece visualização (PDF original ou texto extraído), download do arquivo
original, contagem de uso das ferramentas, pesquisas e relatórios. DOCX, TXT,
Markdown, texto colado e exemplos também são salvos; o arquivo original é
preservado quando existe, e texto colado recebe um original TXT.

A base IndexedDB `webseer` foi atualizada para a versão 2, preservando `pdfs` e
adicionando `documents`, `snapshots`, `runs` e `reports`. PDFs antigos são
importados para a biblioteca. O histórico antigo em localStorage é preservado e
exibido separadamente: ele não guardava documento nem parâmetros completos, por
isso não é associado artificialmente a um documento.

Documentos são identificados por hash do original. Revisões da extração são
identificadas pelo conteúdo e metadados, compartilhadas pelas pesquisas e
relatórios sem repetir todo o corpus a cada análise. Uma pesquisa guarda a
ferramenta, os parâmetros completos, data/hora e a revisão do texto. Retomar
restaura esses dados e não conta uma execução nova; Refazer registra outra.
Alterações em filtros de ferramentas com atualização automática também são
registradas, com debounce e gravação ao navegar para outra página.

Cada ferramenta possui Gerar relatório. Resultados e parâmetros são congelados
no momento da geração. Gráficos SVG recebem estilos embutidos; o mapa de palavras
é salvo como PNG depois de terminar o desenho. O dashboard recebe um histograma
SVG. São capturas dos gráficos, não screenshots de toda a interface.

Relatórios ficam em Documento → Relatórios → Ferramenta → Versão/data/hora. A
numeração é transacional por documento/ferramenta, inclusive em abas concorrentes.
Um relatório geral reúne as estatísticas do documento e os últimos relatórios
salvos por ferramenta, mantendo referências às versões originais; não executa
análises ausentes. Os relatórios podem ser visualizados, baixados em HTML com
imagens incorporadas e impressos/salvos em PDF pelo navegador. Os gráficos também
podem ser baixados separadamente. Não há integração com GPT ou serviços externos.

`CHROMIUM_PATH=/usr/bin/chromium npm run test:history` valida as seis ferramentas,
versões de relatórios, captura de gráficos, original TXT, exportação HTML,
retomada/refazer, persistência após recarregar, relatório geral, versões em duas
abas concorrentes e migração de um IndexedDB v1 com PDF legado.

Tudo fica apenas no navegador/origem atual. Limpar os dados do site, usar outro
dispositivo ou a remoção de dados pelo navegador pode tornar a biblioteca
indisponível. Mantenha cópias dos originais e exporte relatórios importantes.
Os PDFs antigos continuam também na biblioteca de conversão para compatibilidade;
essa cópia pode ocupar espaço adicional. Excluir um PDF nessa lista de conversão
não remove o documento nem os relatórios do Histórico.
