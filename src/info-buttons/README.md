# Informações contextuais

Textos estáticos em PT-BR e EN-US, versionados com o site. Não usam banco,
Storage ou chamadas de IA. Cada pasta corresponde a uma página/ferramenta:
`home`, `corpus`, `compare`, `word-tree`, `phrase-net`, `frequencies`,
`word-cloud`, `dashboard`, `history`, `examples` e `login`.

`animated-histogram/video-studio` contém o painel de vídeo e as configurações de
sugestões; `common` contém controles reutilizáveis, relatórios e armazenamento.

Cada `index.ts` exporta tópicos com chaves estáveis, `title: [pt, en]` e
`body: [pt, en]`. `InfoButton` referencia grupo/tópico explicitamente: não procura
rótulos na DOM. O ícone abre uma janela acessível por clique, Enter ou Espaço;
Escape fecha e devolve o foco. Ajuda dentro de checkbox não deve alternar o campo.
Novos campos devem ter nome acessível próprio e uma referência ao tópico.
