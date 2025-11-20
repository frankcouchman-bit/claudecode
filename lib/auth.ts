'use client'
const ACCESS_KEY='seoscribe_access_token', REFRESH_KEY='seoscribe_refresh_token', TYPE_KEY='seoscribe_auth_type'
export function setTokens(a:string,r:string,t='magiclink'){ if(typeof window==='undefined')return; localStorage.setItem(ACCESS_KEY,a||''); localStorage.setItem(REFRESH_KEY,r||''); localStorage.setItem(TYPE_KEY,t||'') }
export function getAccessToken(){ if(typeof window==='undefined')return null; return localStorage.getItem(ACCESS_KEY) }
export function clearTokens(){ if(typeof window==='undefined')return; localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); localStorage.removeItem(TYPE_KEY) }
export function isAuthed() {
  if (typeof window === 'undefined') return false
  const token = getAccessToken()
  if (!token) return false
  try {
    // Decode the JWT payload to check expiry.  JWTs are in the form
    // header.payload.signature, where payload is base64url encoded JSON.
    const parts = token.split('.')
    if (parts.length < 2) return false
    const payload = parts[1]
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    const exp = json.exp
    // exp is in seconds since epoch.  Consider token valid if it has not expired.
    if (typeof exp === 'number' && exp * 1000 > Date.now()) {
      return true
    }
  } catch {
    // Fall through to return false on error
  }
  return false
}
/**
 * Inspect the current URL for authentication tokens.  Tokens may arrive
 * either in the query string (e.g., ?access_token=xxx) or in the URL
 * fragment/hash (e.g., #access_token=xxx).  When tokens are found,
 * they are persisted to localStorage via `setTokens()` and removed from
 * the URL so that refreshing the page does not expose them.  A boolean
 * is returned to indicate whether any tokens were captured; callers may
 * use this to trigger a redirect or refresh to ensure authentication
 * state is reflected across the app.
 */
export function captureTokensFromURL(): boolean {
  if (typeof window === 'undefined') return false
  const u = new URL(window.location.href)
  let access: string | null = u.searchParams.get('access_token')
  let refresh: string | null = u.searchParams.get('refresh_token')
  let type: string | undefined = u.searchParams.get('type') || undefined
  let tokensCaptured = false

  // If no access token found in query params, check the hash fragment.
  if (!access && window.location.hash) {
    const hash = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hash)
    access = hashParams.get('access_token') || null
    refresh = hashParams.get('refresh_token') || null
    type = hashParams.get('type') || type
    if (access) {
      // Persist tokens and mark captured
      setTokens(access, refresh || '', type)
      tokensCaptured = true
      // Remove the token params from the hash to avoid leaking tokens
      hashParams.delete('access_token')
      hashParams.delete('refresh_token')
      hashParams.delete('type')
      const newHash = hashParams.toString()
      const base = u.origin + u.pathname + u.search
      history.replaceState(null, '', newHash ? `${base}#${newHash}` : base)
      return tokensCaptured
    }
  }
  if (access) {
    setTokens(access, refresh || '', type)
    tokensCaptured = true
    // Clean up query params
    u.searchParams.delete('access_token')
    u.searchParams.delete('refresh_token')
    u.searchParams.delete('type')
    history.replaceState(null, '', u.toString())
  }
  return tokensCaptured
}
