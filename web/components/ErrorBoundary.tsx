'use client'

import React, { Component, ReactNode, ErrorInfo } from 'react'
import { Card } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EventCard Error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="p-6 border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-500/10">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Event Card Error</h3>
          </div>
          
          <p className="text-sm text-red-300 mb-4">
            There was an issue displaying this event card. This might be due to an image loading problem or invalid data.
          </p>

          {this.props.showDetails && this.state.error && (
            <details className="mb-4">
              <summary className="text-xs text-red-400 cursor-pointer">Error Details</summary>
              <pre className="text-xs text-red-300 mt-2 p-2 bg-red-900/20 rounded overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}

          <Button
            onClick={this.handleRetry}
            variant="outline"
            size="sm"
            className="border-red-400/50 text-red-300 hover:bg-red-500/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Card>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary