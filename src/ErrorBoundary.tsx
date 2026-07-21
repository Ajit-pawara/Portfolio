import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  handleReset = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px',
          background: '#0a0a0f',
          color: '#00d9ff',
          fontFamily: "'IBM Plex Mono', monospace",
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠</div>
          <h1 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#ff6b6b' }}>
            RUNTIME ERROR
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#888', maxWidth: '480px', marginBottom: '24px', lineHeight: 1.5 }}>
            The application encountered an error, likely due to outdated cached data from a previous version.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: 'transparent',
              border: '1px solid #00d9ff',
              color: '#00d9ff',
              padding: '10px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.85rem',
            }}
          >
            RESET LOCAL DATA & RELOAD
          </button>
          {this.state.error && (
            <details style={{ marginTop: '24px', fontSize: '0.7rem', color: '#666', maxWidth: '480px' }}>
              <summary>Error details</summary>
              <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
