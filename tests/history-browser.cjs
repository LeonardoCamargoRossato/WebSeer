const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const mainContext=await browser.newContext({viewport:{width:1440,height:1000}});const page=await mainContext.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const base=process.env.TEST_URL||'http://127.0.0.1:4173/';
 const nav=name=>page.locator('header nav').getByRole('button',{name,exact:true}).click();
 const tool=async name=>{await nav('Ferramentas de Análise ▾');await page.locator('.analysisPopover').getByRole('button',{name,exact:true}).click()};
 const read=store=>page.evaluate(store=>new Promise((resolve,reject)=>{const r=indexedDB.open('webseer');r.onsuccess=()=>{const db=r.result,tx=db.transaction(store,'readonly'),all=tx.objectStore(store).getAll();tx.oncomplete=()=>{db.close();resolve(all.result)};tx.onerror=()=>reject(tx.error)}}),store);
 const report=async version=>{await page.getByRole('button',{name:'Gerar relatório',exact:true}).click();await page.locator('.researchActions').getByRole('status').filter({hasText:`v${version}`}).waitFor()};
 const text='Capítulo 1\nAlice viu o coelho. Alice viu a casa. Alice encontrou o coelho. O coelho viu Alice.\nCapítulo 2\nAlice e o coelho. Alice e a casa. Alice e o jardim.';
 await page.goto(base);await nav('Corpus do Documento');await page.locator('input[type=file]').setInputFiles({name:'Pesquisa.txt',mimeType:'text/plain',buffer:Buffer.from(text)});await page.getByRole('button',{name:'Fazer conversão e aplicar documento no WebSeer',exact:true}).click();await page.locator('.successNotice').waitFor();
 await page.getByRole('button',{name:'Ver dashboard inicial de dados →',exact:true}).click();await report(1);
 await tool('Árvore de Palavras');await page.locator('.wordTreeSearch input').fill('Alice');await page.getByRole('button',{name:'Gerar árvore',exact:true}).click();await page.locator('.wordTreeLayout svg').waitFor();await report(1);
 await page.locator('.wordTreeControls select').nth(1).selectOption('2');await report(2);
 await tool('Comparar');const qs=page.locator('.queryPair input');await qs.nth(0).fill('Alice');await qs.nth(1).fill('coelho');await page.getByRole('button',{name:'Comparar',exact:true}).click();await report(1);
 await tool('Rede de Frases');await page.getByRole('button',{name:'Gerar rede',exact:true}).click();await report(1);
 await tool('Frequências');await report(1);
 await tool('Mapa de Palavras');await report(1);
 await page.waitForTimeout(600);await nav('Histórico');await page.locator('.documentCard').filter({hasText:'Pesquisa.txt'}).click();
 await page.getByRole('button',{name:'Ver documento',exact:true}).click();await page.getByText(text,{exact:true}).waitFor();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Baixar original',exact:true}).click();const original=await downloadPromise;assert.equal(original.suggestedFilename(),'Pesquisa.txt');assert.equal(await fs.readFile(await original.path(),'utf8'),text);
 let reports=await read('reports');assert.equal(reports.length,7);assert.deepEqual(reports.filter(r=>r.tool==='wordTree').map(r=>r.version).sort(),[1,2]);assert.equal((await read('documents')).length,1);
 const visualChecks=await page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('webseer');request.onsuccess=()=>{const db=request.result,tx=db.transaction('reports','readonly'),all=tx.objectStore('reports').getAll();tx.oncomplete=()=>{db.close();resolve(all.result.map(r=>({tool:r.tool,type:r.visual?.type,size:r.visual?.size})))};tx.onerror=()=>reject(tx.error)}}));assert.equal(visualChecks.every(r=>r.size>100),true);assert.equal(visualChecks.find(r=>r.tool==='wordCloud').type,'image/png');
 console.log('All six tools save reports and visual snapshots; document original and version folders: PASS');
 await page.locator('.reportsFolder > summary').click();await page.locator('.reportToolFolder').filter({has:page.locator('summary').filter({hasText:'Árvore de Palavras'})}).locator('summary').first().click();
 await page.getByRole('button',{name:/Árvore de Palavras · versão 1/}).click();
 const htmlPromise=page.waitForEvent('download');await page.locator('.savedReport').getByRole('button',{name:'Baixar relatório (HTML / imprimir em PDF)',exact:true}).click();const html=await htmlPromise;const content=await fs.readFile(await html.path(),'utf8');assert.match(content,/Alice/);assert.match(content,/data:image\/svg\+xml;base64/);
 const before=(await read('runs')).length;
 await page.locator('.savedReport').getByRole('button',{name:'Retomar pesquisa',exact:true}).click();await page.locator('.wordTreeLayout svg').waitFor();assert.equal(await page.locator('.wordTreeSearch input').inputValue(),'Alice');assert.equal(await page.locator('.wordTreeControls select').nth(1).inputValue(),'5');await page.waitForTimeout(650);assert.equal((await read('runs')).length,before);
 await page.getByRole('button',{name:'Refazer pesquisa',exact:true}).click();await page.waitForTimeout(650);assert.equal((await read('runs')).length,before+1);
 // Resuming the most recent run and rerunning must count again, even with identical inputs.
 await nav('Histórico');await page.locator('.documentCard').filter({hasText:'Pesquisa.txt'}).click();await page.locator('.archiveFolder').filter({has:page.locator('summary').filter({hasText:/^▣ Pesquisas/})}).locator('summary').first().click();await page.locator('.researchRow').first().getByRole('button',{name:'Retomar pesquisa',exact:true}).click();await page.locator('.wordTreeLayout svg').waitFor();await page.waitForTimeout(500);const latestCount=(await read('runs')).length;await page.getByRole('button',{name:'Refazer pesquisa',exact:true}).click();await page.waitForTimeout(600);assert.equal((await read('runs')).length,latestCount+1);
 console.log('HTML report embeds screenshot; resume restores inputs without new run; rerun adds one: PASS');
 await page.reload();await nav('Histórico');await page.locator('.documentCard').filter({hasText:'Pesquisa.txt'}).click();await page.getByRole('button',{name:'Gerar relatório geral',exact:true}).click();await page.locator('.savedReport').getByRole('heading',{name:'Relatório geral',exact:true}).waitFor();
 reports=await read('reports');const general=reports.find(r=>r.tool==='general');assert.equal(general.relatedReportIds.length,6);assert.equal(general.version,1);assert.equal((await read('documents')).length,1);
 await page.screenshot({path:path.join(require('node:os').tmpdir(),'webseer-document-history.png'),fullPage:true});
 console.log('Reload persistence and general report referencing latest six tool versions: PASS');
 // Concurrent report requests must receive distinct version numbers.
 const second=await page.context().newPage();await second.goto(base);await second.locator('header nav').getByRole('button',{name:'Histórico',exact:true}).click();await second.locator('.documentCard').filter({hasText:'Pesquisa.txt'}).click();
 await Promise.all([page.getByRole('button',{name:'Gerar relatório geral',exact:true}).click(),second.getByRole('button',{name:'Gerar relatório geral',exact:true}).click()]);await Promise.all([page.getByRole('button',{name:'Gerar relatório geral',exact:true}).waitFor(),second.getByRole('button',{name:'Gerar relatório geral',exact:true}).waitFor()]);await page.waitForTimeout(400);
 const versions=(await read('reports')).filter(r=>r.tool==='general').map(r=>r.version).sort();assert.deepEqual(versions,[1,2,3]);await second.close();
 console.log('Concurrent tab version allocation: PASS'); await page.evaluate(()=>{const add=IDBObjectStore.prototype.add;IDBObjectStore.prototype.add=function(...args){if(this.name==='reports')throw new DOMException('Test quota','QuotaExceededError');return add.apply(this,args)}});
 const countBeforeFailure=(await read('reports')).length;await page.getByRole('button',{name:'Gerar relatório geral',exact:true}).click();await page.getByRole('alert').filter({hasText:'Test quota'}).waitFor();assert.equal((await read('reports')).length,countBeforeFailure);
 await page.reload();await nav('Histórico');await page.locator('.documentCard').filter({hasText:'Pesquisa.txt'}).click();await page.getByRole('button',{name:'Gerar relatório geral',exact:true}).click();await page.locator('.savedReport .eyebrow').filter({hasText:'V4'}).waitFor();assert.deepEqual((await read('reports')).filter(r=>r.tool==='general').map(r=>r.version).sort(),[1,2,3,4]);
 console.log('Storage failure rolls back report/version and allows retry: PASS');

 // Upgrade a separate, pre-existing v1 database without losing PDF files.
 const context=await browser.newContext();const legacy=await context.newPage();await legacy.goto(base);await legacy.evaluate(()=>new Promise((resolve,reject)=>{const drop=indexedDB.deleteDatabase('webseer');drop.onsuccess=()=>{const r=indexedDB.open('webseer',1);r.onupgradeneeded=()=>r.result.createObjectStore('pdfs',{keyPath:'id'});r.onsuccess=()=>{const db=r.result,tx=db.transaction('pdfs','readwrite');tx.objectStore('pdfs').put({id:'old-pdf',name:'Legacy.pdf',file:new Blob(['%PDF-legacy'],{type:'application/pdf'}),pages:['Texto legado'],savedAt:new Date().toISOString()});tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)}};drop.onerror=()=>reject(drop.error)}));await legacy.reload();if(await legacy.getByRole('button',{name:'Menu',exact:true}).isVisible())await legacy.getByRole('button',{name:'Menu',exact:true}).click();await legacy.locator('header nav').getByRole('button',{name:'Histórico',exact:true}).click();await legacy.locator('.documentCard').filter({hasText:'Legacy.pdf'}).waitFor();
 console.log('Legacy IndexedDB v1 PDF migration: PASS');await context.close();
 const mobile=await mainContext.newPage();await mobile.setViewportSize({width:390,height:844});await mobile.goto(base);await mobile.getByRole('button',{name:'Menu',exact:true}).click();await mobile.locator('header nav').getByRole('button',{name:'Histórico',exact:true}).click();assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await mobile.close();assert.deepEqual(errors,[]);await browser.close();console.log('Document archive browser tests passed.');
})().catch(error=>{console.error(error);process.exit(1)});
