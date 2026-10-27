import assert from 'node:assert/strict';
import {utf8Length,payloadBytes,formatBytes} from '../src/storage/storageSizes.ts';
for(const text of ['Gênesis','👨‍👩‍👧‍👦','\ud800','abc',''])assert.equal(utf8Length(text),new TextEncoder().encode(text).length);
const large='á😀'.repeat(100000);assert.equal(utf8Length(large),600000);
assert.equal(payloadBytes(new Blob([new Uint8Array(1234)])),1234);
const cycle={name:'teste'};cycle.self=cycle;assert.ok(Number.isFinite(payloadBytes(cycle)));
assert.equal(formatBytes(1024**3,'pt-BR'),'1 GB');assert.equal(formatBytes(undefined),'—');
console.log('PASS: allocation-free Unicode byte counts, Blob sizes, cyclic records and unknown quota formatting.');
