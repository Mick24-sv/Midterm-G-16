import { Component, type ReactNode } from 'react'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { hasError: true, message }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="eb-wrapper">
            <div className="eb-card">
              <span className="eb-icon" aria-hidden="true">💥</span>
              <h2 className="eb-title">Something went wrong</h2>
              <p className="eb-message">{this.state.message}</p>
              <button className="eb-btn" onClick={this.handleReset}>
                Try Again
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

