const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

function pdfFixture(){
 const texts=['Deus Deus disse Adao.','disse disse disse Eva Eva.','Deus Eva Alice Alice.'];
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [4 0 R 6 0 R 8 0 R] /Count 3 >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
 for(let index=0;index<texts.length;index++){
  const stream=`BT /F1 16 Tf 50 700 Td (${texts[index]}) Tj ET`;
  objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5+index*2} 0 R >>`,`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
 }
 let pdf='%PDF-1.4\n';const offsets=[];
 objects.forEach((object,index)=>{offsets.push(Buffer.byteLength(pdf));pdf+=`${index+1} 0 obj\n${object}\nendobj\n`});
 const start=Buffer.byteLength(pdf);
 pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.map(value=>`${String(value).padStart(10,'0')} 00000 n \n`).join('')+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
 return Buffer.from(pdf);
}

async function archive(page){
 return page.evaluate(()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('webseer',4);
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result,transaction=db.transaction(['reports','videoDrafts','snapshots'],'readonly');
   const result={reports:[],drafts:[],snapshots:[]};
   for(const [store,key]of [['reports','reports'],['videoDrafts','drafts'],['snapshots','snapshots']]){
    const read=transaction.objectStore(store).getAll();
    read.onsuccess=()=>result[key]=read.result.map(item=>key==='reports'?{...item,visual:item.visual?{size:item.visual.size,type:item.visual.type}:undefined}:key==='drafts'?{...item,renderedVideo:undefined,thumbnail:undefined,soundtrack:undefined}:item);
   }
   transaction.oncomplete=()=>{db.close();resolve(result)};
   transaction.onerror=transaction.onabort=()=>{db.close();reject(transaction.error)};
  };
 }));
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await context.newPage(),errors=[],externalWrites=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route(/https:\/\/(?:graph\.facebook\.com|graph\.instagram\.com|open\.tiktokapis\.com|www\.googleapis\.com\/upload|youtube\.googleapis\.com\/upload)/,route=>{externalWrites.push(route.request().url());return route.abort()});
  const base=process.env.TEST_URL||'http://127.0.0.1:4173/';
  const button=name=>page.getByRole('button',{name,exact:true});
  const nav=async name=>{const destination=page.locator('header nav').getByRole('button',{name,exact:true});if(!await destination.isVisible())await button('Menu').click();await destination.click()};
  const tab=name=>page.getByRole('tab').nth(name.includes('Shorts')?1:name.includes('Instagram')?2:name==='TikTok'?3:0);
  const openHistogram=async()=>{await nav('Ferramentas de Análise ▾');await page.locator('.analysisPopover').getByRole('button',{name:'Histograma animado',exact:true}).click();await page.getByLabel('Orientação do vídeo',{exact:true}).waitFor()};
  const openReport=async version=>{
   await nav('Histórico');
   await page.locator('.documentCard').filter({hasText:'Platform-timeline.pdf'}).click();
   await page.locator('.reportsFolder > summary').click();
   await page.locator('.reportToolFolder').filter({hasText:'Histograma animado'}).locator('summary').first().click();
   await button(new RegExp(`^Histograma animado · versão ${version}\\b`)).click();
   await button('Preparar vídeo para YouTube').click();
   await page.getByRole('heading',{name:'Painel de criação de vídeo',exact:true}).waitFor();
  };
  const save=async()=>{await button('Salvar rascunho').click();await page.getByRole('status').filter({hasText:'Rascunho salvo'}).waitFor()};
  const download=async name=>{const pending=page.waitForEvent('download');await button(name).click();const file=await pending;return{file,bytes:await fs.readFile(await file.path())}};
  const assertTabs=async()=>assert.equal(await page.getByRole('tab').count(),4,`Platform tabs: ${JSON.stringify(await page.getByRole('tab').allTextContents())}`);
  const assertNoOverflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);

  await page.goto(base);
  await nav('Corpus do Documento');
  await page.locator('input[type=file]').setInputFiles({name:'Platform-timeline.pdf',mimeType:'application/pdf',buffer:pdfFixture()});
  await button('Fazer conversão e aplicar documento no WebSeer').click();
  await page.locator('.successNotice').waitFor();
  await openHistogram();
  assert.equal(await page.getByLabel('Orientação do vídeo',{exact:true}).inputValue(),'horizontal');
  for(const word of ['Deus','disse','Eva']){await page.getByLabel('Palavra para pesquisar',{exact:true}).fill(word);await button('Adicionar palavra').click()}
  await page.getByLabel('Tempo por página',{exact:true}).selectOption('2');
  await page.getByLabel('Tempo de ultrapassagem',{exact:true}).selectOption('1.5');
  await button('Gerar histograma animado').click();
  await page.getByRole('heading',{name:'Histograma animado pronto',exact:true}).waitFor({timeout:90000});
  const horizontal=await download('Baixar GIF');
  assert.equal(horizontal.bytes.subarray(0,6).toString(),'GIF89a');
  assert.equal(horizontal.bytes.readUInt16LE(6),960);
  assert.equal(horizontal.bytes.readUInt16LE(8),540);
  let saved=await archive(page);
  const original=saved.reports.find(item=>item.tool==='animatedHistogram');
  assert.equal(original.inputs.orientation,'horizontal');
  assert.deepEqual(original.inputs.terms,['deus','disse','eva']);
  const sourceSnapshot=saved.snapshots.find(item=>item.id===original.snapshotId);
  assert.equal(sourceSnapshot.corpus.documents.length,3);

  // Another selected document must not replace the frozen source revision when creating a variant.
  await nav('Corpus do Documento');
  await page.getByLabel('Texto do documento',{exact:true}).fill('Outro documento. Texto sem as palavras originais.');
  await button('Aplicar texto no WebSeer').click();
  await page.locator('.successNotice').waitFor();
  await openReport(original.version);
  await assertTabs();
  assert.equal(await tab('YouTube Vídeo').getAttribute('aria-selected'),'true');
  await page.getByLabel('Título',{exact:true}).fill('Vídeo horizontal original');
  await save();
  await tab('YouTube Shorts – Short').click();
  let dialog=page.getByRole('dialog',{name:'Criar versão vertical',exact:true});
  await dialog.waitFor();
  await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();
  assert.equal(await tab('YouTube Vídeo').getAttribute('aria-selected'),'true');
  await tab('YouTube Shorts – Short').click();
  dialog=page.getByRole('dialog',{name:'Criar versão vertical',exact:true});
  await dialog.getByRole('button',{name:'Criar versão vertical',exact:true}).click();
  await page.getByRole('heading',{name:'Histograma animado',exact:true}).waitFor();
  await page.getByLabel('Orientação do vídeo',{exact:true}).waitFor();
  assert.equal(await page.getByLabel('Orientação do vídeo',{exact:true}).inputValue(),'vertical');
  assert.equal(await page.getByLabel('Tempo por página',{exact:true}).inputValue(),'2');
  assert.equal(await page.getByLabel('Tempo de ultrapassagem',{exact:true}).inputValue(),'1.5');
  assert.deepEqual(await page.locator('.selectedHistogramWords button').evaluateAll(items=>items.map(item=>item.firstChild.textContent.trim())),['deus','disse','eva']);
  assert.ok((await page.locator('.animatedHistogram').innerText()).includes('Platform-timeline.pdf'));
  assert.equal((await archive(page)).reports.filter(item=>item.tool==='animatedHistogram').length,1,'Choosing a platform must not generate an animation automatically');
  const format=page.getByLabel('Formato',{exact:true});
  await page.waitForFunction(()=>!document.querySelector('.animationSettings select[aria-label="Formato"] option[value="mp4"]').disabled);
  await format.selectOption('mp4');
  await button('Gerar histograma animado versão Short').click();
  await page.getByRole('heading',{name:'Histograma animado pronto',exact:true}).waitFor({timeout:90000});
  const vertical=await download('Baixar MP4');
  const mp4Path=path.join(os.tmpdir(),'webseer-platforms-vertical.mp4');
  await fs.writeFile(mp4Path,vertical.bytes);
  const info=JSON.parse(execFileSync(process.env.FFPROBE_PATH||'ffprobe',['-v','error','-show_entries','stream=codec_name,width,height:format=duration','-of','json',mp4Path],{encoding:'utf8'}));
  assert.equal(info.streams[0].codec_name,'h264');
  assert.deepEqual([info.streams[0].width,info.streams[0].height],[540,960]);
  assert.ok(Number(info.format.duration)>0&&Number(info.format.duration)<180);
  saved=await archive(page);
  const variant=saved.reports.find(item=>item.tool==='animatedHistogram'&&item.id!==original.id);
  assert.equal(variant.snapshotId,original.snapshotId);
  assert.equal(variant.documentId,original.documentId);
  assert.equal(variant.inputs.sourceReportId,original.id);
  assert.equal(variant.inputs.targetPlatform,'youtubeShorts');
  assert.equal(variant.inputs.orientation,'vertical');
  assert.deepEqual(variant.data.rows,original.data.rows,'The vertical layout must preserve every per-page and cumulative count');
  assert.deepEqual(saved.reports.find(item=>item.id===original.id),original,'Creating a variant must not modify the source report');
  await button('Visualizar storyboard animado').click();
  assert.deepEqual(await page.locator('.animationPlayer canvas').evaluate(canvas=>[canvas.width,canvas.height]),[540,960]);
  await button('Abrir painel de criação de vídeo →').click();
  await assertTabs();
  assert.equal(await tab('YouTube Shorts – Short').getAttribute('aria-selected'),'true');
  await page.getByLabel('Título',{exact:true}).fill('Meu Short vertical');
  await save();
  await tab('YouTube Vídeo').click();
  await page.waitForFunction(()=>document.querySelector('input[aria-label="Título"]')?.value==='Vídeo horizontal original');
  assert.equal(await tab('YouTube Vídeo').getAttribute('aria-selected'),'true');
  await tab('YouTube Shorts – Short').click();
  await page.waitForFunction(()=>document.querySelector('input[aria-label="Título"]')?.value==='Meu Short vertical');
  assert.equal(await page.getByRole('dialog',{name:'Criar versão vertical',exact:true}).count(),0,'A saved compatible vertical version must reopen directly');

  // Platform editor checks are completed against the actual labels/model once those components land.
  await page.screenshot({path:path.join(os.tmpdir(),'webseer-short-studio.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await assertNoOverflow();
  assert.deepEqual(externalWrites,[],'Preparing templates must not publish to any remote platform');
  assert.deepEqual(errors,[]);
  console.log('PASS: real 16:9 GIF and 9:16 H.264 MP4, frozen-source variant generation, four platform tabs, original preservation, Shorts reopening, storyboard dimensions, mobile and no remote writes.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
