'use client'
const ACCESS_KEY='seoscribe_access_token', REFRESH_KEY='seoscribe_refresh_token', TYPE_KEY='seoscribe_auth_type'

export function setTokens(a:string,r:string,t='magiclink'){
  if(typeof window==='undefined')return;
  console.log('[AUTH] Setting tokens:', { hasAccess: !!a, hasRefresh: !!r, type: t, accessTokenLength: a?.length })

  if (a) {
    localStorage.setItem(ACCESS_KEY, a)
    localStorage.setItem(REFRESH_KEY, r||'')
    localStorage.setItem(TYPE_KEY, t||'magiclink')

    // Verify tokens were saved
    const saved = localStorage.getItem(ACCESS_KEY)
    console.log('[AUTH] Tokens saved successfully:', !!saved)
  }
}

export function getAccessToken(){
  if(typeof window==='undefined')return null;
  const token = localStorage.getItem(ACCESS_KEY)
  console.log('[AUTH] Getting access token:', token ? `Found (${token.substring(0,20)}...)` : 'Not found')
  return token
}

export function clearTokens(){
  if(typeof window==='undefined')return;
  console.log('[AUTH] Clearing tokens')
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(TYPE_KEY)
}

export function isAuthed(){
  const token = getAccessToken()
  return !!token
}

export function captureTokensFromURL(){
  if(typeof window==='undefined')return false;

  const url = new URL(window.location.href);
  console.log('[AUTH] Checking URL for tokens:', window.location.href)

  const at = url.searchParams.get('access_token');
  const rt = url.searchParams.get('refresh_token');
  const type = url.searchParams.get('type') || 'signup';

  console.log('[AUTH] URL params:', {
    hasAccess: !!at,
    hasRefresh: !!rt,
    type,
    accessTokenPreview: at ? `${at.substring(0,20)}...` : 'none'
  })

  if(at){
    console.log('[AUTH] Found tokens in URL, saving to localStorage')
    setTokens(at, rt||'', type);

    // Clean URL
    url.searchParams.delete('access_token');
    url.searchParams.delete('refresh_token');
    url.searchParams.delete('type');

    try {
      window.history.replaceState(null, '', url.toString())
      console.log('[AUTH] URL cleaned')
    } catch(e) {
      console.error('[AUTH] Failed to clean URL:', e)
    }

    return true
  }

  console.log('[AUTH] No tokens found in URL')
  return false
}
