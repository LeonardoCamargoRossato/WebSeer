let promise:Promise<void>|undefined;
export function loadGoogle(){
 if(window.google?.accounts)return Promise.resolve();
 if(!promise)promise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.defer=true;script.onload=()=>resolve();script.onerror=()=>{script.remove();promise=undefined;reject(new Error('Não foi possível carregar Google Identity Services. Confira a conexão e o bloqueador. / Could not load Google Identity Services.'))};document.head.appendChild(script)});
 return promise;
}
