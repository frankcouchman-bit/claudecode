"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { isAuthed } from "@/lib/auth"
import { getProfile } from "@/lib/api"
import {
  getQuota,
  saveQuota,
  updatePlan,
  type QuotaLimits
} from "@/lib/quota-enforcement"

interface QuotaContextType {
  quota: QuotaLimits
  isAuthenticated: boolean
  refreshQuota: () => void
  updateQuota: (newQuota: QuotaLimits) => void
  syncWithBackend: () => Promise<void>
}

const QuotaContext = createContext<QuotaContextType | undefined>(undefined)

export function QuotaProvider({ children }: { children: ReactNode }) {
  const [quota, setQuota] = useState<QuotaLimits>(getQuota())
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth and sync with backend
  useEffect(() => {
    const authed = isAuthed()
    setIsAuthenticated(authed)

    if (authed) {
      syncWithBackend()
    }
  }, [])

  // Sync local quota with backend profile
  const syncWithBackend = useCallback(async () => {
    try {
      const profile = await getProfile()

      if (profile) {
        const backendQuota = {
          ...quota,
          plan: profile.plan || 'free',
          todayGenerations: profile.usage?.today?.generations || 0,
          weekGenerations: profile.usage?.week?.generations || 0,
          toolsToday: profile.tools_today || 0,
        }

        setQuota(backendQuota)
        saveQuota(backendQuota)
      }
    } catch (error) {
      console.error('Failed to sync quota with backend:', error)
    }
  }, [quota])

  // Refresh quota from localStorage
  const refreshQuota = useCallback(() => {
    const currentQuota = getQuota()
    setQuota(currentQuota)
  }, [])

  // Update quota and save
  const updateQuota = useCallback((newQuota: QuotaLimits) => {
    setQuota(newQuota)
    saveQuota(newQuota)
  }, [])

  // Listen for plan upgrades (e.g., from Stripe redirect)
  useEffect(() => {
    const checkForUpgrade = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const upgradeSuccess = urlParams.get('upgrade')

      if (upgradeSuccess === 'success') {
        // User just upgraded, sync with backend
        syncWithBackend()
      }
    }

    checkForUpgrade()
  }, [syncWithBackend])

  // Auto-refresh quota every 5 minutes
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      syncWithBackend()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, syncWithBackend])

  return (
    <QuotaContext.Provider value={{ quota, isAuthenticated, refreshQuota, updateQuota, syncWithBackend }}>
      {children}
    </QuotaContext.Provider>
  )
}

export function useQuota() {
  const context = useContext(QuotaContext)
  if (context === undefined) {
    throw new Error('useQuota must be used within a QuotaProvider')
  }
  return context
}
