// Mock synthesis deterministically; no real voices, microphone or audio requests.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');

function mockSpeech(){
 const events=new EventTarget(),listeners=new Set(),canceled=[];
 let voices=[];
 const data={spoken:[],cancels:0,pauses:0,resumes:0,current:null,paused:false,fail:'',voiceListeners:0};
 window.__speech=data;
 Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{
  constructor(text){this.text=text;this.lang='';this.voice=null;this.rate=1;this.onend=null;this.onerror=null}
 }});
 Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
  getVoices:()=>voices,
  get speaking(){return Boolean(data.current)},
  get paused(){return data.paused},
  addEventListener(type,listener){events.addEventListener(type,listener);if(type==='voiceschanged'){listeners.add(listener);data.voiceListeners=listeners.size}},
  removeEventListener(type,listener){events.removeEventListener(type,listener);if(type==='voiceschanged'){listeners.delete(listener);data.voiceListeners=listeners.size}},
  speak(utterance){
   data.current=utterance;
   data.spoken.push({text:utterance.text,lang:utterance.lang,voice:utterance.voice?.name??null,voiceURI:utterance.voice?.voiceURI??null,rate:utterance.rate});
   if(data.fail){const failure=data.fail;setTimeout(()=>utterance.onerror?.({error:failure}),0)}
  },
  cancel(){data.cancels++;const old=data.current;data.current=null;if(old){canceled.push(old);setTimeout(()=>old.onerror?.({error:'canceled'}),0)}},
  pause(){data.pauses++;data.paused=true},
  resume(){data.resumes++;data.paused=false}
 }});
 window.__speechVoices=()=>{
  voices=[
   {name:'Português local A',voiceURI:'pt-local-a',lang:'pt-BR',localService:true,default:true},
   {name:'Português local B',voiceURI:'pt-local-b',lang:'pt-BR',localService:true,default:false},
   {name:'English local',voiceURI:'en-local',lang:'en-US',localService:true,default:false}
  ];
  events.dispatchEvent(new Event('voiceschanged'));
 };
 window.__speechFinish=()=>{const utterance=data.current;data.current=null;utterance?.onend?.()};
 window.__speechFinishTwice=()=>{const utterance=data.current;data.current=null;utterance?.onend?.();utterance?.onend?.()};
 // A canceled browser utterance can report completion late; it must not restart a queue.
 window.__speechLateCompletion=()=>{for(const utterance of canceled.splice(0))utterance.onend?.()};
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.addInitScript(mockSpeech);
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const base=process.env.TEST_URL||'http://127.0.0.1:4173/';
  const button=(name,target=page)=>target.getByRole('button',{name,exact:true});
  const narration=()=>page.locator('.pageNarration');
  const lastSpeech=()=>page.evaluate(()=>window.__speech.spoken.at(-1));
  const spokenCount=()=>page.evaluate(()=>window.__speech.spoken.length);
  const cancelCount=()=>page.evaluate(()=>window.__speech.cancels);
  const nav=async(name,target=page)=>{
   const destination=target.locator('header nav').getByRole('button',{name,exact:true});
   if(!await destination.isVisible())await button('Menu',target).click();
   await destination.click();
  };
  const assertTopPlacement=async()=>{
   assert.equal(await narration().count(),1,'Examples and guides must have a single narration control');
   const placement=await page.evaluate(()=>{
    const help=document.querySelector('.pageHelpBar'),speech=document.querySelector('.pageNarration'),heading=document.querySelector('.applicationExamples h1,.applicationArticle h1');
    const h=help.getBoundingClientRect(),s=speech.getBoundingClientRect();
    return{right:h.right-s.right,below:s.top>=h.bottom-1,before:Boolean(speech.compareDocumentPosition(heading)&Node.DOCUMENT_POSITION_FOLLOWING),sameParent:help.parentElement===speech.parentElement};
   });
   assert.ok(Math.abs(placement.right)<=2,'Narration should align with the right edge of page help');
   assert.ok(placement.below&&placement.before&&placement.sameParent,'Narration belongs immediately after page help, above the article');
  };
  const assertCompact=async(label='Ouvir')=>{
   const toggle=button(label,narration());
   await toggle.waitFor();
   assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   assert.ok(await toggle.locator('svg').count(),'Use a sound icon rather than a large illustration');
   const box=await toggle.boundingBox();
   assert.ok(box.width<=140&&box.height<=42,`Collapsed control must stay compact (${box.width} × ${box.height})`);
   assert.equal(await narration().getByLabel(/Velocidade da narração|Narration speed/).count(),0);
  };
  const settings=async(en=false)=>{
   const toggle=button(en?'Narration settings':'Configurações da narração',narration());
   if(await toggle.getAttribute('aria-expanded')!=='true')await toggle.click();
  };
  const chooseSection=async(index,en=false)=>{
   const select=narration().getByLabel(en?'Narration section':'Trecho da narração',{exact:true});
   const option=await select.locator('option').nth(index).evaluate(element=>({value:element.value,text:element.textContent}));
   assert.ok(option.text.trim().length>18,'Section choices must include real passage text');
   await select.selectOption(option.value);
   return option.text.replace(/^\s*\d+[\s.·:–—-]+/,'').trim();
  };
  const assertNoOverflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Player/settings must fit the viewport');

  await page.goto(base);
  assert.equal(await narration().count(),0,'Narration is limited to application examples');
  await nav('Exemplos de Aplicação');
  await assertTopPlacement();
  await assertCompact();
  await page.evaluate(()=>window.__speechVoices());
  await button('Ouvir',narration()).click();
  await button('Pausar narração',narration()).waitFor();
  let spoken=await lastSpeech();
  assert.equal(spoken.lang,'pt-BR');
  assert.equal(spoken.voiceURI,'pt-local-a');
  assert.equal(spoken.rate,1);
  assert.match(spoken.text,/Um documento/);
  const initialText=spoken.text;

  await settings();
  const speed=narration().getByLabel('Velocidade da narração',{exact:true});
  assert.deepEqual(await speed.locator('option').evaluateAll(options=>options.map(option=>Number(option.value))),[.5,.75,1,1.25,1.5,1.75,2]);
  const voice=narration().getByLabel('Voz da narração',{exact:true});
  assert.ok(await voice.locator('option[value="pt-local-b"]').count(),'Voices loaded asynchronously must be selectable');
  await voice.selectOption('pt-local-b');
  await page.waitForFunction(()=>window.__speech.spoken.at(-1).voiceURI==='pt-local-b');
  assert.equal((await lastSpeech()).text,initialText,'Voice changes restart the current passage');
  await speed.selectOption('1.5');
  await page.waitForFunction(()=>window.__speech.spoken.at(-1).rate===1.5);
  assert.equal((await lastSpeech()).voiceURI,'pt-local-b');
  const selectedText=await chooseSection(2);
  spoken=await lastSpeech();
  assert.ok(selectedText.includes(spoken.text)||spoken.text.includes(selectedText.replace(/…$/,'')),'Choosing a passage must speak that actual passage');
  assert.equal(spoken.rate,1.5);
  assert.equal(spoken.voiceURI,'pt-local-b');
  const queuedCount=await spokenCount();
  await page.evaluate(()=>window.__speechFinishTwice());
  assert.equal(await spokenCount(),queuedCount+1,'A duplicate completion callback must not submit the same next passage twice');
  assert.equal((await lastSpeech()).rate,1.5,'Queued passages keep the selected speed');
  assert.equal((await lastSpeech()).voiceURI,'pt-local-b','Queued passages keep the selected voice');

  await button('Pausar narração',narration()).click();
  assert.equal(await page.evaluate(()=>window.__speech.pauses),1);
  const pausedCount=await spokenCount();
  await speed.selectOption('2');
  await voice.selectOption('pt-local-a');
  const pausedSection=await chooseSection(4);
  assert.equal(await spokenCount(),pausedCount,'Changing settings while paused must not start speech');
  await button('Retomar narração',narration()).click();
  await button('Pausar narração',narration()).waitFor();
  spoken=await lastSpeech();
  assert.equal(spoken.rate,2);
  assert.equal(spoken.voiceURI,'pt-local-a');
  assert.ok(pausedSection.includes(spoken.text),'Resume reads the passage selected while paused');
  // An unmodified pause/resume should use the browser resume operation.
  await button('Pausar narração',narration()).click();
  const nativeResumes=await page.evaluate(()=>window.__speech.resumes);
  await button('Retomar narração',narration()).click();
  assert.ok(await page.evaluate(()=>window.__speech.resumes)>nativeResumes);

  await button('Parar narração',narration()).click();
  await button('Ouvir narração',narration()).waitFor();
  const idleCount=await spokenCount();
  await speed.selectOption('0.5');
  await voice.selectOption('pt-local-b');
  const idleSection=await chooseSection(1);
  assert.equal(await spokenCount(),idleCount,'Settings changed while stopped must wait for Play');
  await button('Ouvir narração',narration()).click();
  spoken=await lastSpeech();
  assert.equal(spoken.rate,.5);
  assert.equal(spoken.voiceURI,'pt-local-b');
  assert.ok(idleSection.includes(spoken.text),'Play reads the passage selected while stopped');
  let cancellations=await cancelCount();
  await button('Fechar player de narração',narration()).click();
  assert.ok(await cancelCount()>cancellations,'Closing the expanded player must cancel speech');
  await assertCompact();
  const closedCount=await spokenCount();
  await page.evaluate(()=>window.__speechLateCompletion());
  assert.equal(await spokenCount(),closedCount,'Late completion of canceled speech must not restart narration');
  await assertCompact();

  // Every example guide gets the same top control, without a second hero player.
  const guideLabels=await page.locator('.applicationCardOpen').evaluateAll(cards=>cards.map(card=>card.getAttribute('aria-label')));
  for(const label of guideLabels){
   await button(label).click();
   await assertTopPlacement();
   await assertCompact();
   await button('← Todos os exemplos').click();
  }
  await button('Ouvir',narration()).click();
  cancellations=await cancelCount();
  await button('Ler guia: Literatura e personagens').click();
  assert.ok(await cancelCount()>cancellations,'Changing page must stop the previous queue');
  await button('Ouvir',narration()).click();
  assert.match((await lastSpeech()).text,/Literatura e personagens/);

  cancellations=await cancelCount();
  await page.getByLabel('Configurações',{exact:true}).click();
  await page.locator('.localeSelect').selectOption('en-US');
  await page.keyboard.press('Escape');
  await assertCompact('Listen');
  assert.ok(await cancelCount()>cancellations,'Switching locale cancels the Portuguese queue');
  await button('Listen',narration()).click();
  spoken=await lastSpeech();
  assert.equal(spoken.lang,'en-US');
  assert.equal(spoken.voiceURI,'en-local');
  assert.match(spoken.text,/Literature and characters/);
  await settings(true);
  const englishSections=narration().getByLabel('Narration section',{exact:true});
  assert.match(await englishSections.locator('option').first().textContent(),/Literature and characters/);
  assert.ok(await englishSections.locator('option').count()>20,'A full guide exposes its actual passages');
  for(let count=0;count<150&&await button('Pause narration',narration()).count();count++)await page.evaluate(()=>window.__speechFinish());
  await narration().getByRole('status').filter({hasText:'Narration complete'}).waitFor();
  const allSpeech=await page.evaluate(()=>window.__speech.spoken);
  assert.ok(allSpeech.every(item=>item.text.length>0&&item.text.length<=220),'Utterances must remain bounded');
  assert.ok(allSpeech.some(item=>item.text.includes('The Word Tree')));
  assert.ok(allSpeech.some(item=>item.text.includes('Martin Wattenberg')));
  assert.ok(allSpeech.every(item=>!item.text.includes('https://')),'Narration reads reference names, not raw URLs');

  await page.evaluate(()=>window.__speech.fail='not-allowed');
  await button('Play narration',narration()).click();
  await narration().getByRole('alert').filter({hasText:'browser blocked narration'}).waitFor();
  await page.evaluate(()=>window.__speech.fail='');
  await button('Play narration',narration()).click();
  await button('Pause narration',narration()).waitFor();
  cancellations=await cancelCount();
  await nav('Document Corpus');
  assert.ok(await cancelCount()>cancellations);
  assert.equal(await narration().count(),0);
  assert.equal(await page.evaluate(()=>window.__speech.voiceListeners),0,'Unmount must remove voice listeners');

  // The same expanded controls and settings must fit narrow screens.
  await page.setViewportSize({width:390,height:844});
  await nav('Application Examples');
  await assertCompact('Listen');
  await assertTopPlacement();
  await button('Listen',narration()).click();
  await settings(true);
  await assertNoOverflow();
  await page.setViewportSize({width:320,height:740});
  await assertNoOverflow();
  const controls=narration().getByRole('button');
  for(let index=0;index<await controls.count();index++){
   if(!await controls.nth(index).isVisible())continue;
   const box=await controls.nth(index).boundingBox();
   assert.ok(box.x>=0&&box.x+box.width<=320.5,'Mobile player controls stay in view');
  }
  await button('Pause narration',narration()).click();
  cancellations=await cancelCount();
  await button('Close narration player',narration()).click();
  assert.ok(await cancelCount()>cancellations,'Closing while paused must cancel too');
  await assertCompact('Listen');
  await button('Listen',narration()).click();
  await settings(true);
  cancellations=await cancelCount();
  await narration().getByLabel('Narration voice',{exact:true}).focus();
  await page.keyboard.press('Escape');
  assert.ok(await cancelCount()>cancellations,'Escape stops playback and collapses the player');
  await assertCompact('Listen');
  assert.equal(await button('Listen',narration()).evaluate(element=>document.activeElement===element),true,'Closing returns keyboard focus to Listen');
  assert.deepEqual(errors,[]);

  const unsupported=await browser.newPage({viewport:{width:390,height:844}});
  await unsupported.addInitScript(()=>{
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:undefined});
   Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:undefined});
  });
  await unsupported.goto(base);
  await nav('Exemplos de Aplicação',unsupported);
  await button('Ouvir',unsupported).click();
  await unsupported.getByText('A narração não está disponível neste navegador.',{exact:false}).waitFor();
  assert.equal(await button('Ouvir narração',unsupported).isDisabled(),true);
  assert.equal(await unsupported.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  console.log('PASS: compact top-right gallery/guide narration; real voice, section and 0.5–2x speed selection in play/pause/idle; native pause/resume, stop/close; stale-callback cancellation, PT/EN, bounded full-guide reading, errors, cleanup, mobile and unsupported fallback.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
