"use client"

import React from "react"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  message?: string
}

/**
 * Error boundary dedicated to generation output. If a malformed API payload
 * or unexpected client condition bubbles up, we catch it and surface a
 * friendly retry panel instead of crashing the entire page.
 */
export class GenerationErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Generation render failed", error, info)
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: undefined })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="py-6 flex flex-col gap-4 items-start">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-200">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Something went wrong while displaying the article.</p>
                <p className="text-sm text-muted-foreground">{this.state.message || "Please try generating again."}</p>
              </div>
            </div>
            <Button onClick={this.handleReset} variant="outline" className="gap-2">
              <RefreshCcw className="w-4 h-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

