"use client"

import { useQuota } from "@/contexts/quota-context"
import { useEffect } from "react"
import { captureTokensFromURL } from "@/lib/auth"
// Removed QuotaDisplay and usePathname because we no longer display an overlay

export function ClientQuotaDisplay() {
  const { isAuthenticated } = useQuota()
  // On mount, attempt to capture tokens from the URL.  If new tokens are
  // captured, immediately redirect to the dashboard.  This triggers the
  // QuotaProvider to re-evaluate authentication state on reload.
  useEffect(() => {
    const captured = captureTokensFromURL()
    if (captured) {
      // Redirect to dashboard to reload context with authenticated state
      window.location.assign('/dashboard')
      return
    }
    // If tokens remain in hash, ensure a clean URL
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        window.location.assign('/dashboard')
      }
    }
  }, [])
  return null
}
