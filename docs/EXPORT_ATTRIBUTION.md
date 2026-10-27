# Assinatura nas exportações

Os artefatos gerados usam a assinatura **By Leonardo Camargo Rossato** e o
endereço do Portfólio LCR. O texto fica em uma faixa própria, sem cobrir o
conteúdo do gráfico.

- SVG: assinatura e URL visíveis, com link clicável para o portfólio. Os estilos
  calculados são incorporados para preservar as cores fora do site.
- PNG: o canvas original é preservado pixel a pixel; uma faixa de 68 px é
  adicionada abaixo. A assinatura e a URL ficam visíveis. O formato PNG não
  oferece um hiperlink clicável dentro dos pixels.
- MP4 e GIF novos: cada frame inclui a assinatura e a URL abaixo da linha de
  progresso, com espaço separado dos rótulos dos eixos. O vídeo mantém 960×540.
  O texto é visual; o formato não transforma esse rodapé em um link clicável.
- Relatórios HTML/PDF via impressão: assinatura e link no rodapé do documento,
  metadado de autoria e assinatura nas imagens incorporadas.
- CSV de frequências e de contagens por página: colunas `created_by` e
  `portfolio_url`, mantendo o cabeçalho e o formato tabular consistente.
- JSON de rascunho e pacote de metadados YouTube: objeto `attribution` fora do
  corpo enviado à API. As sugestões de descrição também citam a assinatura.

Arquivos originais enviados pelo usuário (PDFs, documentos, miniaturas e áudio)
continuam sendo baixados sem alteração. A autoria identifica o software e sua
visualização; não reivindica a autoria do texto original analisado.

`src/reports/exportAttribution.ts` centraliza a lógica. Um marcador `tEXt`
persistente no PNG e um atributo no SVG evitam repetir o rodapé quando um print
já assinado é aberto, guardado e exportado novamente.

Prints SVG/PNG antigos recebem a assinatura ao baixar o print ou exportar o
relatório HTML. GIF/MP4 salvos antes desta implementação precisam ser gerados
novamente para receber a assinatura em seus frames. Não há recodificação
silenciosa dos vídeos antigos.

Verificações:

```sh
npm test
npx tsc --noEmit -p tsconfig.app.json
CHROMIUM_PATH=/usr/bin/chromium node tests/export-attribution-browser.cjs
```

O teste de navegador usa os módulos reais após remover apenas tipos TypeScript,
sem reconstruir o diretório `dist`. Ele verifica links SVG, preservação de pixels,
dimensões, metadados PNG, idempotência e autoria no HTML. Os testes de animação
verificam que o rodapé permanece abaixo do progresso e dentro dos limites do vídeo.
