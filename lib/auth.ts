'use client'
const ACCESS_KEY='seoscribe_access_token', REFRESH_KEY='seoscribe_refresh_token', TYPE_KEY='seoscribe_auth_type'
export function setTokens(a:string,r:string,t='magiclink'){
  if(typeof window==='undefined')return;
  console.log('Setting tokens:', { hasAccess: !!a, hasRefresh: !!r, type: t })
  localStorage.setItem(ACCESS_KEY,a||'');
  localStorage.setItem(REFRESH_KEY,r||'');
  localStorage.setItem(TYPE_KEY,t||'')
}
export function getAccessToken(){
  if(typeof window==='undefined')return null;
  const token = localStorage.getItem(ACCESS_KEY)
  console.log('Getting access token:', token ? 'Found' : 'Not found')
  return token
}
export function clearTokens(){
  if(typeof window==='undefined')return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(TYPE_KEY)
}
export function isAuthed(){ return !!getAccessToken() }
export function captureTokensFromURL(){
  if(typeof window==='undefined')return;
  const u=new URL(window.location.href);
  console.log('Checking URL for tokens:', window.location.href)
  const at=u.searchParams.get('access_token');
  const rt=u.searchParams.get('refresh_token');
  const type=u.searchParams.get('type')||undefined;
  console.log('Found tokens in URL:', { hasAccess: !!at, hasRefresh: !!rt, type })
  if(at){
    setTokens(at, rt||'', type);
    u.searchParams.delete('access_token');
    u.searchParams.delete('refresh_token');
    u.searchParams.delete('type');
    history.replaceState(null,'',u.toString())
  }
}
