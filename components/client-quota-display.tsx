"use client"

import { useQuota } from "@/contexts/quota-context"
import { QuotaDisplay } from "@/components/quota-display"
import { usePathname } from "next/navigation"

export function ClientQuotaDisplay() {
  const { quota, isAuthenticated } = useQuota()
  const pathname = usePathname()

  // Don't show on auth page or landing pages
  const hiddenPaths = ['/auth', '/pricing', '/terms', '/privacy']
  const shouldShow = !hiddenPaths.includes(pathname)

  if (!shouldShow) return null

  return <QuotaDisplay isAuthenticated={isAuthenticated} />
}
