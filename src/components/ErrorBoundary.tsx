import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // En el futuro: enviar a Sentry / posthog / etc.
    console.error('App crashed:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-full items-center justify-center bg-cream px-5 py-10">
        <div className="max-w-sm rounded-card bg-white p-7 shadow-card">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">Algo se rompió</h1>
          <p className="mt-2 text-sm text-ink/60">
            La app se topó con un error inesperado. Probá refrescar la página. Si sigue pasando,
            avísale al equipo.
          </p>

          {import.meta.env.DEV && (
            <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-rose-50 p-3 text-xs text-danger">
              {this.state.error.message}
            </pre>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={this.handleReload}
              className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Recargar
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              className="flex-1 rounded-xl bg-brand-50 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100"
            >
              Intentar otra vez
            </button>
          </div>
        </div>
      </div>
    );
  }
}
