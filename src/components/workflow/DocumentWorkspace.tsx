import {useEffect,useRef,useState} from 'react';
import {useI18n} from '../../i18n';
import {useCorpus} from '../../context/CorpusContext';
import {extractPdfText,type PdfReadOptions,type PdfExtractionProgress} from '../../utils/pdfExtractor';
import {savePdf,listPdfs,deletePdf,type StoredPdf} from '../../storage/pdfStore';
import type {ActiveCorpus,CorpusSourceType} from '../../types/corpus';
import type {Page} from '../layout/AppHeader';
type Kind='pdf'|'docx'|'md'|'txt';
export default function DocumentWorkspace({onOpen}:{onOpen:(p:Page)=>void}){
 const {locale,t}=useI18n();const tr=(pt:string,en:string)=>locale==='pt-BR'?pt:en;const {activeCorpus,setActiveCorpus}=useCorpus();
 const [savedId,setSavedId]=useState<string|null>(null);
 const [file,setFile]=useState<File|null>(null),[kind,setKind]=useState<Kind|null>(null),[drag,setDrag]=useState(false),[busy,setBusy]=useState(false),[draft,setDraft]=useState(activeCorpus?.rawText??'');
 const [options,setOptions]=useState<PdfReadOptions>({mode:'layout',removeMargins:false});const [progress,setProgress]=useState<PdfExtractionProgress|null>(null);
 const [saved,setSaved]=useState<StoredPdf[]>([]),[warning,setWarning]=useState(''),[success,setSuccess]=useState(false),[failure,setFailure]=useState<{message:string;details:string}|null>(null);
 const [preview,setPreview]=useState<string|null>(null);const input=useRef<HTMLInputElement>(null);const selecting=useRef(0);const progressRef=useRef<PdfExtractionProgress|null>(null);
 useEffect(()=>{let live=true;listPdfs().then(items=>{if(live)setSaved(items)}).catch(()=>{if(live)setWarning(t.storage.error)});return()=>{live=false}},[]);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 useEffect(()=>{document.querySelector('.errorNotice,.successNotice')?.scrollIntoView({behavior:'smooth',block:'center'})},[success,failure]);
 const fail=(error:unknown,stage:string,filename=file?.name)=>{const message=error instanceof Error?error.message:String(error);setFailure({message,details:JSON.stringify({stage,file:filename,converter:kind==='pdf'?`PDF.js ${options.mode}`:kind,page:progressRef.current?.page,error:message,time:new Date().toISOString()},null,2)})};
 const stageFile=async(candidate?:File,existingId?:string)=>{
  const version=++selecting.current;setFailure(null);setSuccess(false);setFile(null);setKind(null);setSavedId(existingId??null);if(!candidate)return;
  try{
   const bytes=new Uint8Array(await candidate.slice(0,8).arrayBuffer());if(version!==selecting.current)return;
   const ext=candidate.name.split('.').pop()?.toLowerCase();let detected:Kind;
   if(new TextDecoder().decode(bytes).startsWith('%PDF-'))detected='pdf';
   else if(ext==='docx'&&bytes[0]===80&&bytes[1]===75)detected='docx';
   else if(ext==='md'||ext==='markdown')detected='md';
   else if(ext==='txt')detected='txt';
   else throw new Error(tr('Formato não suportado. Use PDF, Word .docx, TXT ou MD. Para .doc antigo, exporte como .docx.','Unsupported format. Use PDF, Word .docx, TXT or MD. Export legacy .doc as .docx.'));
   if(!candidate.size)throw new Error(tr('O arquivo está vazio.','The file is empty.'));
   setFile(candidate);setKind(detected);setProgress(null);setPreview(detected==='pdf'?URL.createObjectURL(candidate):null);
  }catch(error){fail(error,'identify',candidate.name)}
 };
 const applyText=(name:string,text:string,sourceType:CorpusSourceType,metadata?:ActiveCorpus['metadata'],pages?:string[],sourceFile?:Blob)=>{
  if(!text.trim())throw new Error(tr('Nenhum texto foi encontrado. Se o PDF for digitalizado, será necessário OCR, ainda indisponível nesta versão.','No text was found. Scanned PDFs need OCR, which is not available in this version.'));
  const id=crypto.randomUUID();setActiveCorpus({id,name,sourceFile,sourceType,rawText:text,documents:(pages??[text]).map((text,i)=>({id:`${id}-${i}`,title:pages?`${name} — ${i+1}`:name,text,pageNumber:pages?i+1:undefined})),pageCount:pages?.length,metadata,createdAt:new Date().toISOString()});setDraft(text);setSuccess(true);
 };
 const convert=async()=>{
  if(!file||!kind||busy)return;setBusy(true);setFailure(null);setSuccess(false);setWarning('');setProgress(null);progressRef.current=null;
  try{
   if(kind==='pdf'){
    const result=await extractPdfText(file,p=>{progressRef.current=p;setProgress(p)},options);
    applyText(file.name,result.rawText,'pdf',result.metadata,result.pages,file);
    try{
     const digest=await crypto.subtle.digest('SHA-256',await file.arrayBuffer());const id=savedId??Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
     const item:StoredPdf={id,name:file.name,file,pages:result.pages,metadata:result.metadata,options,savedAt:new Date().toISOString()};await savePdf(item);setSaved(items=>[...items.filter(x=>x.id!==id),item]);
    }catch{setWarning(t.storage.error)}
   }else if(kind==='docx'){
    const mammoth=await import('mammoth');const result=await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});applyText(file.name,result.value,'docx',{converter:'Mammoth / DOCX'},undefined,file);
    if(result.messages.length)setWarning(result.messages.map(m=>m.message).join(' · '));
   }else{
    const bytes=new Uint8Array(await file.arrayBuffer());let text:string;
    if(bytes[0]===255&&bytes[1]===254)text=new TextDecoder('utf-16le').decode(bytes);else if(bytes[0]===254&&bytes[1]===255)text=new TextDecoder('utf-16be').decode(bytes);else text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
    applyText(file.name,text,kind,{converter:'Text / Unicode'},undefined,file);
   }
  }catch(error){fail(error,'convert-and-apply')}finally{setBusy(false)}
 };
 const example=async(language:string)=>{setFailure(null);setBusy(true);setSuccess(false);try{const response=await fetch(`${import.meta.env.BASE_URL}corpora/${language}.txt`);if(!response.ok)throw new Error(t.storage.loadError);const text=await response.text();applyText(language==='pt'?'Exemplo em português':'English example',text,'text',{converter:'WebSeer example'});setFile(null);setKind(null);setPreview(null)}catch(e){fail(e,'load-example')}finally{setBusy(false)}};
 return <section className="documentWorkspace"><div className="pageHeading"><span className="eyebrow">01 · {tr('PREPARAR','PREPARE')}</span><h1>{tr('Corpus do Documento','Document Corpus')}</h1><p>{tr('Adicione, configure a leitura e aplique seu documento. Nenhum arquivo é enviado a servidores.','Add, configure reading and apply your document. No files are uploaded to servers.')}</p></div>
 <div className="importGrid"><section className="surface importPanel"><h2>{tr('1. Escolha o documento','1. Choose a document')}</h2><div className={`dropZone ${drag?'dragging':''}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);if(busy)return;if(e.dataTransfer.files.length!==1){fail(new Error(tr('Adicione um arquivo por vez.','Add one file at a time.')),'identify');return}void stageFile(e.dataTransfer.files[0])}}><span aria-hidden="true">↥</span><strong>{tr('Arraste seu arquivo aqui','Drop your file here')}</strong><p>PDF · DOCX · TXT · MD</p><button disabled={busy} onClick={()=>input.current?.click()}>{tr('Selecionar arquivo','Choose file')}</button><input ref={input} type="file" hidden accept=".pdf,.docx,.txt,.md,.markdown" disabled={busy} onChange={e=>{void stageFile(e.target.files?.[0]);e.target.value=''}}/></div>
 {file&&<div className="fileIdentity"><span className="fileBadge">{kind?.toUpperCase()}</span><div><strong>{file.name}</strong><p>{(file.size/1024).toLocaleString(locale,{maximumFractionDigits:1})} KB · {file.type||tr('Tipo identificado pelo arquivo','Type identified from file')}</p></div></div>}
 <h2>{tr('2. Configure a leitura','2. Configure reading')}</h2>{kind==='pdf'?<><label className="fieldLabel">{tr('Tipo de conversor de PDF','PDF converter')}<select value={options.mode} disabled={busy} onChange={e=>setOptions({...options,mode:e.target.value as PdfReadOptions['mode']})}><option value="layout">{tr('PDF.js — reconstrução de palavras (recomendado)','PDF.js — word reconstruction (recommended)')}</option><option value="literal">{tr('PDF.js — fragmentos originais (diagnóstico)','PDF.js — original fragments (diagnostic)')}</option></select></label><p className="hint">{tr('A leitura recomendada preserva espaços reais e usa a posição dos fragmentos para recompor palavras. PDFs digitalizados precisam de OCR, ainda não disponível.','Recommended reading preserves real spaces and uses fragment positions to reconstruct words. Scanned PDFs need OCR, not yet available.')}</p><label className="checkboxLabel"><input type="checkbox" disabled={busy} checked={options.removeMargins} onChange={e=>setOptions({...options,removeMargins:e.target.checked})}/>{tr('Remover cabeçalhos e rodapés repetidos (heurística)','Remove repeated headers and footers (heuristic)')}</label><small>{tr('Pode remover conteúdo útil das margens; confira a prévia após converter.','May remove useful margin content; review the preview after conversion.')}</small></>:<p>{tr('A leitura é selecionada automaticamente pelo tipo do arquivo. Word aceita .docx; TXT e MD devem estar em UTF-8 ou UTF-16 com BOM.','Reading is selected automatically by file type. Word accepts .docx; TXT and MD must be UTF-8 or UTF-16 with BOM.')}</p>}
 <button className="primary convertButton" disabled={!file||busy} onClick={()=>void convert()}>{busy?tr('Processando documento…','Processing document…'):tr('Fazer conversão e aplicar documento no WebSeer','Convert and apply document to WebSeer')}</button>
 {busy&&<div role="status" className="processing"><progress max={100} value={progress?.percent}/><p>{progress?`${tr('Página','Page')} ${progress.page} / ${progress.totalPages}`:tr('Lendo o documento…','Reading document…')}</p></div>}</section>
 <aside className="surface importPanel"><h2>{tr('Ou cole seu texto','Or paste your text')}</h2><textarea aria-label={tr('Texto do documento','Document text')} value={draft} onChange={e=>setDraft(e.target.value)} placeholder={t.corpus.placeholder}/><button disabled={busy||!draft.trim()} onClick={()=>{setFailure(null);try{applyText('Pasted text',draft,'text');setFile(null);setKind(null);setPreview(null)}catch(e){fail(e,'apply-text')}}}>{tr('Aplicar texto no WebSeer','Apply text to WebSeer')}</button><h3>{t.storage.examples}</h3><div className="libraryActions"><button disabled={busy} onClick={()=>void example('pt')}>{t.storage.portuguese}</button><button disabled={busy} onClick={()=>void example('en')}>{t.storage.english}</button></div></aside></div>
 {failure&&<section className="notice errorNotice" role="alert"><h3>{tr('Não foi possível aplicar o documento','Could not apply document')}</h3><p>{failure.message}</p><details><summary>{tr('Quer saber mais? Ver diagnóstico','Want to know more? View diagnostics')}</summary><pre>{failure.details}</pre><p>{tr('Confira o formato, a integridade e se o PDF exige senha. Corrija o problema e tente novamente.','Check format, file integrity and whether the PDF requires a password. Fix the issue and retry.')}</p></details></section>}
 {success&&<section className="notice successNotice" role="status"><h3>{tr('Tudo certo! Documento aplicado ao WebSeer.','Success! Document applied to WebSeer.')}</h3><p>{activeCorpus?.name}</p><button className="primary" disabled={busy} onClick={()=>onOpen('dashboard')}>{tr('Ver dashboard inicial de dados','View initial data dashboard')} →</button></section>}
 {warning&&<p className="notice" role="alert">{warning}</p>}
 {activeCorpus&&<section className="surface importPanel"><h2>{tr('Prévia do texto ativo','Active text preview')}</h2><p>{tr('Confira palavras e ordem de leitura antes de analisar. Edite no campo acima e aplique novamente se necessário.','Review words and reading order before analyzing. Edit in the field above and apply again if needed.')}</p><pre className="textPreview">{activeCorpus.rawText.slice(0,6000)}</pre></section>}
 {preview&&<details className="surface importPanel"><summary>{tr('Visualizar PDF original','View original PDF')}</summary><iframe className="documentFrame" src={preview} title={t.corpus.viewPdf}/></details>}
 <section className="surface importPanel"><h2>{t.storage.library}</h2><p>{tr('Esta lista permite reconverter PDFs. Os documentos e relatórios ficam no Histórico; excluir desta lista não os remove da biblioteca.','This list lets you reconvert PDFs. Documents and reports are in History; deleting from this list does not remove them from the library.')}</p><p>{tr('Abrir prepara o arquivo para uma nova conversão, inclusive PDFs salvos com o extrator antigo.','Open prepares the file for a new conversion, including PDFs saved with the old extractor.')}</p>{saved.length?saved.map(item=><div className="savedPdf" key={item.id}><span>{item.name} · {(item.file.size/1024/1024).toFixed(2)} MB</span><div><button disabled={busy} onClick={()=>{setOptions(item.options??{mode:'layout',removeMargins:false});void stageFile(new File([item.file],item.name,{type:'application/pdf'}),item.id);window.scrollTo({top:0,behavior:'smooth'})}}>{t.storage.open}</button><button disabled={busy} onClick={async()=>{try{await deletePdf(item.id);setSaved(items=>items.filter(x=>x.id!==item.id))}catch{setWarning(t.storage.error)}}}>{t.storage.remove}</button></div></div>):<p>{t.storage.empty}</p>}</section>
 </section>;
}
