# Web Seer Lab — Active Corpus + Word Tree patch

This ZIP contains only files that need to be added or replaced in the existing project.

## Replace

- `src/App.tsx`
- `src/main.tsx`
- `src/styles.css`
- `src/i18n/ptBR.ts`
- `src/i18n/enUS.ts`
- `src/components/wordTree/WordTreeGraph.tsx`

## Add

- `src/context/CorpusContext.tsx`
- `src/types/corpus.ts`
- `src/utils/pdfExtractor.ts`
- `src/features/wordTree/wordTreeTypes.ts`
- `src/features/wordTree/searchWordTree.ts`
- `src/features/wordTree/buildWordTree.ts`
- `src/features/wordTree/findWordTreeContexts.ts`
- `src/components/visualization/WordNode.tsx`
- `src/components/visualization/ArrowLink.tsx`
- `src/vite-env.d.ts` (safe to merge with an existing Vite env declaration)
- `THIRD_PARTY_NOTICES.md`

## Dependency

Run `npm install pdfjs-dist` in the project root.

## What changes

- PDF text is extracted locally, page by page, with progress.
- The uploaded/pasted corpus becomes the single `ActiveCorpus` shared by Corpus Explorer, Word Tree and Phrase Net.
- No hidden Alice/demo fallback; the demo is explicit.
- Word Tree search ports the N-gram search/build approach from Will Crichton's `wordtree`.
- Both/forward/backward directions, max N/depth, max branches per N and cube-root font interpolation are supported.
- Context follows the selected branch.
- Visible attribution and `THIRD_PARTY_NOTICES.md` are included.
