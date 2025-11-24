'use client'
const ACCESS_KEY='seoscribe_access_token', REFRESH_KEY='seoscribe_refresh_token', TYPE_KEY='seoscribe_auth_type'
export function setTokens(a:string,r:string,t='magiclink'){ if(typeof window==='undefined')return; localStorage.setItem(ACCESS_KEY,a||''); localStorage.setItem(REFRESH_KEY,r||''); localStorage.setItem(TYPE_KEY,t||'') }
export function getAccessToken(){ if(typeof window==='undefined')return null; return localStorage.getItem(ACCESS_KEY) }
export function clearTokens(){ if(typeof window==='undefined')return; localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); localStorage.removeItem(TYPE_KEY) }
export function isAuthed(){ return !!getAccessToken() }
// Capture tokens from URL query or hash fragment.  Returns true if tokens were found and stored.
export function captureTokensFromURL(): boolean {
  if (typeof window === 'undefined') return false
  const url = new URL(window.location.href)
  // Parse query parameters
  const search = url.searchParams
  // Parse hash parameters (#access_token=...)
  const hashString = window.location.hash?.replace(/^#/, '') || ''
  const hashParams = new URLSearchParams(hashString)

  const accessToken = search.get('access_token') || hashParams.get('access_token')
  const refreshToken = search.get('refresh_token') || hashParams.get('refresh_token') || ''
  const typeParam = search.get('type') || hashParams.get('type') || undefined

  if (accessToken) {
    setTokens(accessToken, refreshToken, typeParam)
    // Remove tokens from search params
    search.delete('access_token')
    search.delete('refresh_token')
    search.delete('type')
    // Remove tokens from hash params
    hashParams.delete('access_token')
    hashParams.delete('refresh_token')
    hashParams.delete('type')
    // Construct new URL without the sensitive params
    const newUrl = url.toString().split('#')[0]
    history.replaceState(null, '', newUrl)
    return true
  }
  return false
}
