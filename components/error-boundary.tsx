"use client"

import { Component, ReactNode } from "react"

type ErrorBoundaryProps = {
  fallbackRender: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode
  resetKeys?: unknown[]
  children: ReactNode
}

type ErrorBoundaryState = { error: Error | null }

function arrayChanged(a: unknown[] = [], b: unknown[] = []) {
  if (a.length !== b.length) return true
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return true
  }
  return false
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Client UI crashed:", error, info)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && this.props.resetKeys && arrayChanged(this.props.resetKeys, prevProps.resetKeys)) {
      this.resetErrorBoundary()
    }
  }

  resetErrorBoundary = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return this.props.fallbackRender({ error: this.state.error, resetErrorBoundary: this.resetErrorBoundary })
    }

    return this.props.children
  }
}

