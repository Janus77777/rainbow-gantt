import React from 'react';
import ReactDOM from 'react-dom/client';
import AppV2 from './AppV2';
import './index.css';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-slate-800">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <pre className="bg-slate-100 p-4 rounded text-sm overflow-auto">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppV2 />
    </ErrorBoundary>
  </React.StrictMode>,
);