import type {Report} from '../storage/archive';
import {AUTHOR_NAME,PORTFOLIO_URL} from '../config/author.ts';
export type VideoDraft={id:string;reportId:string;documentId:string;title:string;description:string;tags:string;categoryId:string;defaultLanguage:string;defaultAudioLanguage:string;privacyStatus:'private'|'unlisted'|'public';license:'youtube'|'creativeCommon';madeForKids:'unset'|'yes'|'no';syntheticMedia:'unset'|'yes'|'no';hasPaidProductPlacement:boolean;embeddable:boolean;publicStatsViewable:boolean;notifySubscribers:boolean;publishAtLocal:string;recordingDate:string;playlistIds:string;ageRestrictionPlan:'unset'|'18+';captionsPlan:string;updatedAt:string;preparedBy?:string};
export const newDraft=(report:Report):VideoDraft=>({id:report.id,reportId:report.id,documentId:report.documentId,title:'',description:'',tags:'',categoryId:'27',defaultLanguage:'pt-BR',defaultAudioLanguage:'',privacyStatus:'private',license:'youtube',madeForKids:'unset',syntheticMedia:'unset',hasPaidProductPlacement:false,embeddable:true,publicStatsViewable:true,notifySubscribers:true,publishAtLocal:'',recordingDate:'',playlistIds:'',ageRestrictionPlan:'unset',captionsPlan:'',updatedAt:new Date().toISOString()});
const truncate=(text:string,max:number)=>Array.from(text).length>max?Array.from(text).slice(0,max-1).join('')+'…':text;
export const parseTags=(value:string)=>[...new Set(value.split(/[,;\n]/).map(s=>s.trim()).filter(Boolean))];
export const tagLength=(tags:string[])=>tags.reduce((total,tag)=>total+Array.from(tag).length+(/\s/.test(tag)?2:0),Math.max(0,tags.length-1));
export const descriptionBytes=(description:string)=>new TextEncoder().encode(description).length;
export function automaticSuggestions(report:Report,documentName:string,en=false){
 const data=report.data as {terms?:string[];totalPages?:number;rows?:{cumulative:number[]}[]};const terms=data.terms??report.inputs.terms as string[]??[];const name=documentName.replace(/\.[^.]+$/,'').replace(/[_]+/g,' ').trim();
 const title=truncate(`${name}: ${en?'evolution of':'evolução de'} ${terms.slice(0,4).join(', ')}${terms.length>4?(en?' and more words':' e outras palavras'):''} | WebSeer`,100);
 const totals=data.rows?.[data.rows.length-1]?.cumulative??[];
 const description=en?`Animated histogram of cumulative occurrences in “${name}”.\n\nWords: ${terms.join(', ')}.\nPages/sections analyzed: ${data.totalPages??'not provided'}.\nFinal counts:\n${terms.map((word,i)=>`${word}: ${totals[i]??'not provided'}`).join('\n')}\n\nMethod: whole-word matching, case-insensitive, accents preserved. Counts accumulate through the document. This is a descriptive visualization, without AI interpretation.\n\nTool: WebSeer, developed by ${AUTHOR_NAME}.\nPortfolio: ${PORTFOLIO_URL}`:`Histograma animado das ocorrências acumuladas em “${name}”.\n\nPalavras: ${terms.join(', ')}.\nPáginas/seções analisadas: ${data.totalPages??'não informado'}.\nContagens finais:\n${terms.map((word,i)=>`${word}: ${totals[i]??'não informado'}`).join('\n')}\n\nMétodo: palavras inteiras, sem distinguir maiúsculas/minúsculas e preservando acentos. As contagens são acumuladas ao longo do documento. Visualização descritiva, sem interpretação por IA.\n\nFerramenta: WebSeer, desenvolvida por ${AUTHOR_NAME}.\nPortfólio: ${PORTFOLIO_URL}`;
 return{title,description,tags:['WebSeer',en?'animated histogram':'histograma animado',en?'text analysis':'análise de texto',...terms].join(', '),defaultLanguage:en?'en-US':'pt-BR'};
}
export function validateDraft(d:VideoDraft,en=false){const errors:string[]=[];const tr=(pt:string,eng:string)=>en?eng:pt;
 if(!d.title.trim()||Array.from(d.title).length>100||/[<>]/.test(d.title))errors.push(tr('Título: preencha até 100 caracteres, sem < ou >.','Title: enter up to 100 characters, without < or >.'));
 if(descriptionBytes(d.description)>5000||/[<>]/.test(d.description))errors.push(tr('Descrição: até 5.000 bytes UTF-8, sem < ou >.','Description: up to 5,000 UTF-8 bytes, without < or >.'));
 if(tagLength(parseTags(d.tags))>500)errors.push(tr('Tags: limite total de 500 caracteres, incluindo separadores e aspas para tags com espaços.','Tags: total limit is 500 characters, including separators and quotes for tags containing spaces.'));
 if(!/^\d+$/.test(d.categoryId))errors.push(tr('Escolha uma categoria válida.','Choose a valid category.'));
 if(d.madeForKids==='unset')errors.push(tr('Informe se o conteúdo é feito para crianças.','Specify whether the content is made for kids.'));
 if(d.publishAtLocal&&(d.privacyStatus!=='private'||!Number.isFinite(Date.parse(d.publishAtLocal))||Date.parse(d.publishAtLocal)<=Date.now()))errors.push(tr('Agendamento: use data futura e visibilidade privada.','Scheduling: use a future date and private visibility.'));
 for(const lang of [d.defaultLanguage,d.defaultAudioLanguage])if(lang){try{Intl.getCanonicalLocales(lang)}catch{errors.push(tr('Código de idioma inválido.','Invalid language code.'))}}
 if(d.recordingDate&&!Number.isFinite(Date.parse(d.recordingDate)))errors.push(tr('Data de gravação inválida.','Invalid recording date.'));
 return errors;
}
export function youtubeMetadata(d:VideoDraft){const errors=validateDraft(d);if(errors.length)throw new Error(errors.join('\n'));
 const snippet={title:d.title.trim(),description:d.description,tags:parseTags(d.tags),categoryId:d.categoryId,...(d.defaultLanguage?{defaultLanguage:d.defaultLanguage}:{}),...(d.defaultAudioLanguage?{defaultAudioLanguage:d.defaultAudioLanguage}:{})};
 const status={privacyStatus:d.privacyStatus,license:d.license,selfDeclaredMadeForKids:d.madeForKids==='yes',embeddable:d.embeddable,publicStatsViewable:d.publicStatsViewable,...(d.syntheticMedia!=='unset'?{containsSyntheticMedia:d.syntheticMedia==='yes'}:{}),...(d.publishAtLocal?{publishAt:new Date(d.publishAtLocal).toISOString()}:{})};
 return{snippet,status,paidProductPlacementDetails:{hasPaidProductPlacement:d.hasPaidProductPlacement},...(d.recordingDate?{recordingDetails:{recordingDate:new Date(d.recordingDate+'T00:00:00Z').toISOString()}}:{})};
}
