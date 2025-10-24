'use client'
const ACCESS_KEY='seoscribe_access_token', REFRESH_KEY='seoscribe_refresh_token', TYPE_KEY='seoscribe_auth_type'
export function setTokens(a:string,r:string,t='magiclink'){ if(typeof window==='undefined')return; localStorage.setItem(ACCESS_KEY,a||''); localStorage.setItem(REFRESH_KEY,r||''); localStorage.setItem(TYPE_KEY,t||'') }
export function getAccessToken(){ if(typeof window==='undefined')return null; return localStorage.getItem(ACCESS_KEY) }
export function clearTokens(){ if(typeof window==='undefined')return; localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); localStorage.removeItem(TYPE_KEY) }
export function isAuthed(){ return !!getAccessToken() }
export function captureTokensFromURL(){ if(typeof window==='undefined')return; const u=new URL(window.location.href); const at=u.searchParams.get('access_token'); const rt=u.searchParams.get('refresh_token'); const type=u.searchParams.get('type')||undefined; if(at){ setTokens(at, rt||'', type); u.searchParams.delete('access_token'); u.searchParams.delete('refresh_token'); u.searchParams.delete('type'); history.replaceState(null,'',u.toString()) } }
