import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCwIcon, HomeIcon } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  errorMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static defaultProps: Partial<ErrorBoundaryProps> = {
    errorMessage: 'Something went wrong. Please try again.',
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { hasError } = this.state;
    const { children, errorMessage } = this.props;

    if (hasError) {
      return (
        <div
          className="p-4 max-w-md mx-auto text-center bg-white rounded-lg shadow-sm border border-gray-100"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Oops, an error occurred!</h2>
          <p className="text-xs text-red-500 mb-4">{errorMessage}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={this.resetError}
              className="flex items-center gap-1 bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
              aria-label="Retry"
            >
              <RefreshCwIcon className="w-4 h-4" />
              Retry
            </button>
            <Link
              to="/"
              className="flex items-center gap-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs hover:bg-gray-300 focus:ring-2 focus:ring-gray-500"
              aria-label="Return to Home"
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;