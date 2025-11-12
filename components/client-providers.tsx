'use client'

import { ReactNode } from 'react'
import { QuotaProvider } from '@/contexts/quota-context'
import { ErrorBoundary } from '@/components/error-boundary'

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QuotaProvider>
        {children}
      </QuotaProvider>
    </ErrorBoundary>
  )
}
