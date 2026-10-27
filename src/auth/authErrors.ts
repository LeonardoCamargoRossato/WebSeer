export type AuthFailure={code:string;stage:'configuration'|'keys'|'token'|'profile'};
export function classifyAuthError(error:unknown):AuthFailure{
 const e=error as {code?:string;claim?:string;name?:string};
 if(e.code==='GOOGLE_NONCE')return{code:'nonce',stage:'token'};
 if(e.code==='GOOGLE_PROFILE')return{code:'profile',stage:'profile'};
 if(e.code==='GOOGLE_CLIENT_ID')return{code:'configuration',stage:'configuration'};
 if(e.code==='ERR_JWT_EXPIRED')return{code:'expired',stage:'token'};
 if(e.code==='ERR_JWT_CLAIM_VALIDATION_FAILED')return{code:e.claim==='aud'?'audience':e.claim==='iss'?'issuer':'clock',stage:'token'};
 if(e.code==='ERR_JWS_SIGNATURE_VERIFICATION_FAILED')return{code:'signature',stage:'token'};
 if(e.code==='ERR_JWKS_TIMEOUT'||e.name==='TypeError'||e.name==='NetworkError')return{code:'network',stage:'keys'};
 if(e.code?.startsWith('ERR_JWK'))return{code:'keys',stage:'keys'};
 return{code:'invalid',stage:'token'};
}
export function authErrorMessage(failure:AuthFailure,en=false){
 const messages:Record<string,[string,string]>={
 configuration:['O Client ID não está configurado. Confira GOOGLE_CLIENT_ID no GitHub e publique novamente.','The Client ID is not configured. Check GOOGLE_CLIENT_ID in GitHub and redeploy.'],
 network:['Não foi possível obter as chaves públicas do Google. Verifique sua conexão e se o navegador, extensão ou rede bloqueia www.googleapis.com. Tente novamente.','Could not fetch Google public keys. Check your connection and whether the browser, an extension or network blocks www.googleapis.com. Retry.'],
 expired:['A credencial expirou. Entre novamente e confira data/hora automáticas no dispositivo.','The credential expired. Sign in again and check automatic device date/time.'],
 clock:['A validade temporal da credencial não confere. Ative data, hora e fuso automáticos no dispositivo e tente novamente.','Credential timing does not match. Enable automatic device date/time/timezone and retry.'],
 audience:['O token não corresponde ao Client ID desta publicação. Confira a variável GOOGLE_CLIENT_ID, faça novo deploy e recarregue a página.','The token does not match this deployment’s Client ID. Check GOOGLE_CLIENT_ID, redeploy and reload.'],
 issuer:['O emissor da credencial não é o Google esperado. A entrada foi recusada.','The credential issuer is not the expected Google issuer. Sign-in was rejected.'],
 nonce:['A resposta não corresponde à tentativa de login desta página. Recarregue e entre novamente.','The response does not match this page’s sign-in attempt. Reload and sign in again.'],
 profile:['A credencial não trouxe identificador e e-mail verificado suficientes. Confira a conta escolhida e tente novamente.','The credential did not include sufficient identity and verified-email claims. Check the selected account and retry.'],
 signature:['A assinatura da credencial não pôde ser validada. Recarregue e tente novamente.','The credential signature could not be verified. Reload and retry.'],
 keys:['As chaves públicas recebidas não correspondem à credencial. Aguarde e tente novamente.','The public keys do not match the credential. Wait and retry.'],
 invalid:['A credencial recebida é inválida. Recarregue a página e tente novamente.','The received credential is invalid. Reload and retry.']
 };
 return(en?'Could not verify Google sign-in. ':'Não foi possível validar o login do Google. ')+(messages[failure.code]??messages.invalid)[en?1:0];
}
