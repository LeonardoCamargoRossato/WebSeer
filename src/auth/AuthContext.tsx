import {classifyAuthError,type AuthFailure} from './authErrors';
import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {createRemoteJWKSet,jwtVerify} from 'jose';
export const GOOGLE_CLIENT_ID=(import.meta.env.VITE_GOOGLE_CLIENT_ID??'').trim();
const SESSION_KEY='webseer.google.idToken';
const keys=createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
export type GoogleProfile={id:string;name:string;email:string;picture?:string;expiresAt:number};
type Auth={profile:GoogleProfile|null;loading:boolean;error:AuthFailure|null;signIn:(credential:string,nonce:string)=>Promise<void>;signOut:()=>void};
const Context=createContext<Auth|null>(null);
async function verify(credential:string,nonce?:string):Promise<GoogleProfile>{
 if(!GOOGLE_CLIENT_ID)throw Object.assign(new Error('Google Client ID not configured'),{code:'GOOGLE_CLIENT_ID'});
 const {payload}=await jwtVerify(credential,keys,{audience:GOOGLE_CLIENT_ID,issuer:['https://accounts.google.com','accounts.google.com'],algorithms:['RS256']});
 if(nonce&&payload.nonce!==nonce)throw Object.assign(new Error('Invalid sign-in nonce'),{code:'GOOGLE_NONCE'});
 if(!payload.sub||typeof payload.email!=='string'||payload.email_verified!==true||!payload.exp)throw Object.assign(new Error('Incomplete Google profile'),{code:'GOOGLE_PROFILE'});
 const name=typeof payload.name==='string'&&payload.name.trim()?payload.name:[payload.given_name,payload.family_name].filter(v=>typeof v==='string').join(' ').trim()||payload.email;
 return{id:payload.sub,name,email:payload.email,picture:typeof payload.picture==='string'&&payload.picture.startsWith('https://')?payload.picture:undefined,expiresAt:payload.exp*1000};
}
export function AuthProvider({children}:{children:ReactNode}){
 const [profile,setProfile]=useState<GoogleProfile|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState<AuthFailure|null>(null);
 const attempt=useRef(0);
 const signOut=()=>{attempt.current++;setProfile(null);setError(null);setLoading(false);try{sessionStorage.removeItem(SESSION_KEY)}catch{/* No persistent credentials are required. */}window.google?.accounts.id.disableAutoSelect()};
 useEffect(()=>{let live=true;const current=attempt.current;const restore=async()=>{try{const token=sessionStorage.getItem(SESSION_KEY);if(token&&GOOGLE_CLIENT_ID){const user=await verify(token);if(live&&current===attempt.current)setProfile(user)}}catch{if(live&&current===attempt.current)try{sessionStorage.removeItem(SESSION_KEY)}catch{/* Storage may be unavailable. */}}finally{if(live&&current===attempt.current)setLoading(false)}};void restore();return()=>{live=false}},[]);
 useEffect(()=>{if(!profile)return;const timer=setTimeout(signOut,Math.max(0,profile.expiresAt-Date.now()));return()=>clearTimeout(timer)},[profile]);
 const signIn=async(credential:string,nonce:string)=>{const current=++attempt.current;setLoading(true);setError(null);try{const user=await verify(credential,nonce);if(current!==attempt.current)return;try{sessionStorage.setItem(SESSION_KEY,credential)}catch{/* A memory-only session still works. */}setProfile(user)}catch(error){if(current!==attempt.current)return;try{sessionStorage.removeItem(SESSION_KEY)}catch{/* Storage may be unavailable. */}setError(classifyAuthError(error));setProfile(null)}finally{if(current===attempt.current)setLoading(false)}};
 return <Context.Provider value={{profile,loading,error,signIn,signOut}}>{children}</Context.Provider>;
}
export function useAuth(){const value=useContext(Context);if(!value)throw new Error('Missing AuthProvider');return value}
export function GoogleAvatar({profile}:{profile:GoogleProfile}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[profile.picture]);return profile.picture&&!failed?<img className="googleAvatar" src={profile.picture} alt={profile.name} referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<span className="googleAvatar avatarInitial" aria-label={profile.name}>{profile.name.slice(0,1).toUpperCase()}</span>}
