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
A ferramenta Comparar ainda usa o provedor de demonstração preexistente.
