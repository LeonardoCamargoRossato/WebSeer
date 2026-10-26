import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {createRemoteJWKSet,jwtVerify} from 'jose';
export const GOOGLE_CLIENT_ID=(import.meta.env.VITE_GOOGLE_CLIENT_ID??'').trim();
const SESSION_KEY='webseer.google.idToken';
const keys=createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
export type GoogleProfile={id:string;name:string;email:string;picture?:string;expiresAt:number};
type Auth={profile:GoogleProfile|null;loading:boolean;error:string;signIn:(credential:string,nonce:string)=>Promise<void>;signOut:()=>void};
const Context=createContext<Auth|null>(null);
async function verify(credential:string,nonce?:string):Promise<GoogleProfile>{
 if(!GOOGLE_CLIENT_ID)throw new Error('Google Client ID not configured');
 const {payload}=await jwtVerify(credential,keys,{audience:GOOGLE_CLIENT_ID,issuer:['https://accounts.google.com','accounts.google.com'],algorithms:['RS256']});
 if(nonce&&payload.nonce!==nonce)throw new Error('Invalid sign-in nonce');
 if(!payload.sub||typeof payload.name!=='string'||typeof payload.email!=='string'||payload.email_verified!==true||!payload.exp)throw new Error('Incomplete Google profile');
 return{id:payload.sub,name:payload.name,email:payload.email,picture:typeof payload.picture==='string'&&payload.picture.startsWith('https://')?payload.picture:undefined,expiresAt:payload.exp*1000};
}
export function AuthProvider({children}:{children:ReactNode}){
 const [profile,setProfile]=useState<GoogleProfile|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const signOut=()=>{setProfile(null);setError('');try{sessionStorage.removeItem(SESSION_KEY)}catch{/* No persistent credentials are required. */}window.google?.accounts.id.disableAutoSelect()};
 useEffect(()=>{let live=true;const restore=async()=>{try{const token=sessionStorage.getItem(SESSION_KEY);if(token&&GOOGLE_CLIENT_ID){const user=await verify(token);if(live)setProfile(user)}}catch{try{sessionStorage.removeItem(SESSION_KEY)}catch{/* Storage may be unavailable. */}}finally{if(live)setLoading(false)}};void restore();return()=>{live=false}},[]);
 useEffect(()=>{if(!profile)return;const timer=setTimeout(signOut,Math.max(0,profile.expiresAt-Date.now()));return()=>clearTimeout(timer)},[profile]);
 const signIn=async(credential:string,nonce:string)=>{setLoading(true);setError('');try{const user=await verify(credential,nonce);try{sessionStorage.setItem(SESSION_KEY,credential)}catch{/* A memory-only session still works. */}setProfile(user)}catch{setError('Não foi possível validar o login do Google. Tente novamente. / Could not verify Google sign-in. Please retry.');setProfile(null)}finally{setLoading(false)}};
 return <Context.Provider value={{profile,loading,error,signIn,signOut}}>{children}</Context.Provider>;
}
export function useAuth(){const value=useContext(Context);if(!value)throw new Error('Missing AuthProvider');return value}
export function GoogleAvatar({profile}:{profile:GoogleProfile}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[profile.picture]);return profile.picture&&!failed?<img className="googleAvatar" src={profile.picture} alt={profile.name} referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<span className="googleAvatar avatarInitial" aria-label={profile.name}>{profile.name.slice(0,1).toUpperCase()}</span>}
