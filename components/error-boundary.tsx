'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Component Stack:', errorInfo.componentStack)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
                Something went wrong
              </h1>
              <div className="mb-4">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                  Error Message:
                </p>
                <pre className="text-xs bg-red-100 dark:bg-red-950 p-3 rounded overflow-auto max-h-32">
                  {this.state.error?.toString()}
                </pre>
              </div>
              {this.state.error?.stack && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                    Stack Trace:
                  </p>
                  <pre className="text-xs bg-red-100 dark:bg-red-950 p-3 rounded overflow-auto max-h-48">
                    {this.state.error.stack}
                  </pre>
                </div>
              )}
              {this.state.errorInfo?.componentStack && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                    Component Stack:
                  </p>
                  <pre className="text-xs bg-red-100 dark:bg-red-950 p-3 rounded overflow-auto max-h-48">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
