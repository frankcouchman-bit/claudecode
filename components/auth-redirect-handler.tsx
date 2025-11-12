'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { captureTokensFromURL, isAuthed } from '@/lib/auth'

export function AuthRedirectHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleAuth = async () => {
      try {
        console.log('[AUTH REDIRECT] Checking for tokens in URL')

        // Check if there are tokens in the URL (query params or hash)
        const hadTokens = captureTokensFromURL()

        if (hadTokens) {
          console.log('[AUTH REDIRECT] Tokens captured, redirecting to dashboard')
          // Give a moment for localStorage to sync
          await new Promise(resolve => setTimeout(resolve, 300))

          // Redirect to dashboard
          router.push('/dashboard')
          return
        }

        // Check if user is already authenticated
        if (isAuthed()) {
          console.log('[AUTH REDIRECT] User is authenticated')
        }

        setChecking(false)
      } catch (error) {
        console.error('[AUTH REDIRECT] Error during auth check:', error)
        setChecking(false)
      }
    }

    handleAuth()
  }, [router, mounted])

  // Don't render children until mounted (prevent hydration mismatch)
  if (!mounted) {
    return null
  }

  // While checking, show loading spinner
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return <>{children}</>
}
