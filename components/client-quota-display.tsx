"use client"

import { useState, useEffect } from "react"
import { useQuota } from "@/contexts/quota-context"
import { QuotaDisplay } from "@/components/quota-display"
import { usePathname } from "next/navigation"

export function ClientQuotaDisplay() {
  const [mounted, setMounted] = useState(false)
  const { quota, isAuthenticated } = useQuota()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  // Don't show on auth page or landing pages
  const hiddenPaths = ['/auth', '/pricing', '/terms', '/privacy']
  const shouldShow = !hiddenPaths.includes(pathname)

  if (!shouldShow) return null

  return <QuotaDisplay isAuthenticated={isAuthenticated} />
}
