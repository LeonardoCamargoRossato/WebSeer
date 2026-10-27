import assert from 'node:assert/strict';
import {countPages,normalizeTerm,suggestions,nameSuggestions} from '../src/features/animatedHistogram/countPages.ts';
import {drawFrame} from '../src/features/animatedHistogram/drawFrame.ts';
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
drawFrame(ctx,['Deus','disse','Eva'],rows,1,1,'Test');assert.ok(labels.find(x=>x.text==='disse').y<labels.find(x=>x.text==='Deus').y);
console.log('PASS: exact words, accents, case, page counts, cumulative counts, empty pages, selection limits, name candidates and ranking crossover.');

// Keep eight bars and axis labels above the independent progress line.
const ticks=[],rects=[],rounded=[];const layoutCtx={fillRect(x,y,w,h){rects.push({x,y,w,h})},fillText(text,x,y){if(/^\d+$/.test(text))ticks.push(y)},roundRect(x,y,w,h,r){rounded.push({x,y,w,h,r})},fill(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}};
drawFrame(layoutCtx,['a','b','c','d','e','f','g','h'],[{page:1,counts:[8,7,6,5,4,3,2,1],cumulative:[8,7,6,5,4,3,2,1]}],0,1,'Layout');
const progressLine=rects.find(r=>r.h===3);assert.ok(Math.max(...ticks)+12<progressLine.y);assert.equal(rounded.length,8);assert.ok(rounded.every(r=>r.r>0&&r.r<=10&&r.y+r.h<progressLine.y));
console.log('PASS: eight rounded bars and axis labels do not overlap the progress line.');
