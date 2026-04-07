"use client"

import * as Sentry from "@sentry/nextjs"
import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    Sentry.captureException(error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <p className="py-3 text-sm text-red-500">
          Something went wrong. Please refresh and try again.
        </p>
      )
    }
    return this.props.children
  }
}
