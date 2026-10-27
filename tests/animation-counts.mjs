import assert from 'node:assert/strict';
import {countPages,normalizeTerm,suggestions,nameSuggestions} from '../src/features/animatedHistogram/countPages.ts';
import {drawFrame} from '../src/features/animatedHistogram/drawFrame.ts';
import {videoDimensions,platformOrientation} from '../src/features/animatedHistogram/videoFormats.ts';
const docs=[{id:'1',title:'1',pageNumber:1,text:'Deus Deus disse Adão.'},{id:'2',title:'2',pageNumber:2,text:'disse disse disse Eva Eva.'},{id:'3',title:'3',pageNumber:3,text:'DEUS Eva não Adãozinho.'}];
const rows=countPages(docs,['Deus','disse','Eva']);
assert.deepEqual(rows.map(r=>r.counts),[[2,1,0],[0,3,2],[1,0,1]]);
assert.deepEqual(rows.map(r=>r.cumulative),[[2,1,0],[2,4,2],[3,4,3]]);
assert.equal(countPages(docs,['Adão','Eva'])[2].counts[0],0);
assert.equal(countPages([{id:'x',title:'blank',text:''},docs[0]],['Deus','Eva'])[0].counts[0],0);
assert.equal(normalizeTerm(' NÃO '),'não');assert.equal(normalizeTerm('COVID-19'),'covid-19');assert.equal(normalizeTerm('2026'),'');assert.equal(normalizeTerm('duas palavras'),'');
assert.throws(()=>countPages(docs,['Deus']));assert.throws(()=>countPages(docs,['Deus','DEUS']));assert.throws(()=>countPages(docs,['a','b','c','d','e','f','g','h','i']));
assert.equal(suggestions('o o o Deus Deus Eva',true)[0].word,'deus');assert.equal(suggestions('o o o Deus Deus Eva')[0].word,'o');
assert.ok(nameSuggestions('Alice encontrou Eva. Alice falou com Eva.').some(n=>n.word==='Alice'));
const labels=[];const ctx={fillRect(){},fillText(text,x,y){labels.push({text,y})},roundRect(){},fill(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}};
drawFrame(ctx,['Deus','disse','Eva'],rows,1,1,'Test');const byline=labels.find(label=>label.text==='By Leonardo Camargo Rossato'),portfolio=labels.find(label=>label.text.includes('https://leonardocamargorossato.github.io/'));assert.ok(byline&&portfolio);assert.ok(byline.y>502&&portfolio.y>byline.y+10&&portfolio.y<540);assert.ok(labels.find(x=>x.text==='disse').y<labels.find(x=>x.text==='Deus').y);
console.log('PASS: exact words, accents, case, page counts, cumulative counts, empty pages, selection limits, name candidates and ranking crossover.');

// Keep eight bars and axis labels above the independent progress line.
const ticks=[],rects=[],rounded=[];const layoutCtx={fillRect(x,y,w,h){rects.push({x,y,w,h})},fillText(text,x,y){if(/^\d+$/.test(text))ticks.push(y)},roundRect(x,y,w,h,r){rounded.push({x,y,w,h,r})},fill(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}};
drawFrame(layoutCtx,['a','b','c','d','e','f','g','h'],[{page:1,counts:[8,7,6,5,4,3,2,1],cumulative:[8,7,6,5,4,3,2,1]}],0,1,'Layout');
const progressLine=rects.find(r=>r.h===3);assert.ok(Math.max(...ticks)+12<progressLine.y);assert.equal(rounded.length,8);assert.ok(rounded.every(r=>r.r>0&&r.r<=10&&r.y+r.h<progressLine.y));
console.log('PASS: eight rounded bars and axis labels do not overlap the progress line.');

// Portrait exports reflow the same counts, with separate graph/progress/attribution areas.
assert.deepEqual(videoDimensions(),{width:960,height:540});assert.deepEqual(videoDimensions('vertical'),{width:540,height:960});
assert.equal(platformOrientation('youtube'),'horizontal');for(const platform of ['youtubeShorts','instagramReels','tiktok'])assert.equal(platformOrientation(platform),'vertical');
for(const number of [2,8]){
 const portraitLabels=[],portraitRects=[],portraitBars=[];
 const portrait={fillRect(x,y,w,h){portraitRects.push({x,y,w,h})},fillText(text,x,y){portraitLabels.push({text,x,y})},roundRect(x,y,w,h,r){portraitBars.push({x,y,w,h,r})},fill(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}};
 const terms=Array.from({length:number},(_,index)=>`word${index}`),cumulative=terms.map((_,index)=>number-index),row={page:3,counts:cumulative,cumulative};
 drawFrame(portrait,terms,[row],0,1,'Portrait exact counts',false,undefined,'vertical');
 assert.deepEqual(portraitRects[0],{x:0,y:0,w:540,h:960});
 assert.equal(portraitBars.length,number);assert.ok(portraitBars.every(bar=>bar.r>0&&bar.r<=10&&bar.x>=140&&bar.x+bar.w<=414&&bar.y+bar.h<780));
 const line=portraitRects.find(rect=>rect.h===3);assert.equal(line.y,800);
 assert.ok(portraitLabels.filter(label=>/^\d+$/.test(label.text)).every(label=>label.y+12<line.y));
 for(const term of terms)assert.ok(portraitLabels.some(label=>label.text===term));
 const by=portraitLabels.find(label=>label.text==='By Leonardo Camargo Rossato'),url=portraitLabels.find(label=>label.text.startsWith('https://'));
 assert.ok(by.y>line.y+20&&url.y>by.y&&url.y<860);assert.ok(portraitLabels.some(label=>label.text==='Página 3'));
}
console.log('PASS: horizontal/vertical dimensions, shared platform orientation, portrait counts, safe margins, rounded bars and attribution.');

const {advanceRank,sampleRank}=await import('../src/features/animatedHistogram/rankMotion.ts');
let motion=advanceRank(undefined,[10,8],0,1).motion;
const crossing=advanceRank(motion,[10,11],.1,1);motion=crossing.motion;assert.deepEqual(crossing.positions,[0,1]);
const during=advanceRank(motion,[13,18],.6,1);assert.ok(during.positions[0]>0&&during.positions[0]<1);assert.ok(during.positions[1]>0&&during.positions[1]<1);
assert.deepEqual(sampleRank(during.motion,1.2),[1,0]);
const reverse=advanceRank(during.motion,[25,20],.7,1);assert.deepEqual(reverse.positions,sampleRank(during.motion,.7));assert.deepEqual(sampleRank(reverse.motion,1.8),[0,1]);
console.log('PASS: independent rank overtakes continue smoothly across advancing counts and reverse without jumps.');
