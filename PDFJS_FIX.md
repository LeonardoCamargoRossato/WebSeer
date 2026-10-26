# PDF.js / Vite fix

The Vite error was caused by a dependency mismatch: `pdfExtractor.ts` imports the PDF.js 4.x ESM worker (`pdf.worker.min.mjs`), while `pdfjs-dist` was not declared/pinned in `package.json`.

This patch pins:

```json
"pdfjs-dist": "4.10.38"
```

and keeps the Vite asset import:

```ts
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
```

After copying the files, run from the project root:

```bash
npm install
npm run dev
```

If an incompatible old `pdfjs-dist` remains in `node_modules`, `npm install` should replace it according to `package.json`. If it does not, remove `node_modules/pdfjs-dist` and run `npm install` again.
