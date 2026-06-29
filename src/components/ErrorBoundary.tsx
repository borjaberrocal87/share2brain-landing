import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`[ErrorBoundary] ${this.props.name || 'Island'}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            fontSize: '14px',
            textAlign: 'center',
          }}
          role="alert"
        >
          <p style={{ margin: 0 }}>Something went wrong loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
