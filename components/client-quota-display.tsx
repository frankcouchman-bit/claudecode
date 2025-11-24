"use client"

import { useEffect } from "react"
import { captureTokensFromURL } from "@/lib/auth"

// This component runs on the client and captures tokens from the URL when present.
// It no longer renders any UI, avoiding intrusive overlays.  If tokens are captured,
// the page reloads to initialise state with the new credentials.
export function ClientQuotaDisplay() {
  useEffect(() => {
    const captured = captureTokensFromURL()
    if (captured) {
      // Reload to ensure auth state is updated
      window.location.reload()
    }
  }, [])
  return null
}
