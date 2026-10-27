import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {GOOGLE_CLIENT_ID,useAuth} from '../auth/AuthContext';
import {loadGoogle} from '../auth/googleSdk';
import {channels,YouTubeError} from './api';
import {YOUTUBE_SCOPE,type YouTubeChannel} from './types';
type Connection={token:string;expiresAt:number;channel:YouTubeChannel};
type YouTube={connection:Connection|null;ready:boolean;connecting:boolean;error:string;connect:(sameAccount:boolean)=>void;disconnect:()=>void};
const Context=createContext<YouTube|null>(null);
export function YouTubeProvider({children}:{children:ReactNode}){
 const {profile}=useAuth();const [connection,setConnection]=useState<Connection|null>(null),[ready,setReady]=useState(false),[connecting,setConnecting]=useState(false),[error,setError]=useState('');const attempt=useRef(0),active=useRef(true);
 useEffect(()=>{active.current=true;return()=>{active.current=false;attempt.current++}},[]);
 useEffect(()=>{setConnection(null);setError('');attempt.current++;setConnecting(false)},[profile?.id]);
 useEffect(()=>{let live=true;if(GOOGLE_CLIENT_ID)loadGoogle().then(()=>{if(live)setReady(Boolean(window.google?.accounts.oauth2))}).catch(()=>{if(live)setError('Não foi possível carregar a autorização Google. / Could not load Google authorization.')});return()=>{live=false}},[]);
 useEffect(()=>{if(!connection)return;const timer=setTimeout(()=>setConnection(null),Math.max(0,connection.expiresAt-Date.now()-30000));return()=>clearTimeout(timer)},[connection]);
 const disconnect=()=>{attempt.current++;setConnection(null);setConnecting(false);setError('')};
 const connect=(sameAccount:boolean)=>{
  if(!GOOGLE_CLIENT_ID){setError('GOOGLE_CLIENT_ID não configurado. / GOOGLE_CLIENT_ID is not configured.');return}
  const oauth=window.google?.accounts.oauth2;if(!oauth){setError('Autorização Google indisponível. Recarregue a página e confira a conexão. / Google authorization unavailable; reload and check your connection.');return}
  if(sameAccount&&!profile){setError('Entre com Google primeiro ou escolha outra conta. / Sign in first or choose another account.');return}
  const current=++attempt.current;setConnecting(true);setError('');setConnection(null);
  const client=oauth.initTokenClient({client_id:GOOGLE_CLIENT_ID,scope:YOUTUBE_SCOPE,include_granted_scopes:false,callback:response=>{void(async()=>{try{if(response.error||!response.access_token)throw new YouTubeError(`Autorização não concluída / Authorization not completed: ${response.error??'missing_token'}`);if(!oauth.hasGrantedAllScopes(response,YOUTUBE_SCOPE))throw new YouTubeError('Permissão YouTube não concedida. / YouTube permission was not granted.');const found=await channels(response.access_token);if(found.length!==1)throw new YouTubeError(found.length?'Autorize novamente e escolha um único canal/conta de marca no Google. / Reauthorize and select a single channel/Brand Account.':'Esta autorização não tem canal do YouTube. Crie um canal ou escolha outra conta. / This authorization has no YouTube channel.');if(active.current&&attempt.current===current)setConnection({token:response.access_token,expiresAt:Date.now()+(Number(response.expires_in)||3600)*1000,channel:found[0]})}catch(e){if(active.current&&attempt.current===current)setError(e instanceof Error?e.message:String(e))}finally{if(active.current&&attempt.current===current)setConnecting(false)}})()},error_callback:event=>{if(active.current&&attempt.current===current){setConnecting(false);setError(`Não foi possível abrir/concluir a autorização Google / Could not complete Google authorization: ${event.type}`)}}});
  // Called directly from the click, before any awaits, to preserve popup activation.
  client.requestAccessToken(sameAccount?{login_hint:profile!.email,prompt:'consent'}:{prompt:'select_account consent'});
 };
 return <Context.Provider value={{connection,ready,connecting,error,connect,disconnect}}>{children}</Context.Provider>;
}
export function useYouTube(){const value=useContext(Context);if(!value)throw new Error('Missing YouTubeProvider');return value}
