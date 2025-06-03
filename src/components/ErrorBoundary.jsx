import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-4 border border-red-300 bg-red-50 rounded-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
          {this.state.error && (
            <p className="text-red-600 mb-2">
              {this.state.error.toString()}
            </p>
          )}
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
          {this.props.showDetail && this.state.errorInfo && (
            <details className="mt-4 p-2 border border-gray-300 rounded">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 p-2 text-sm overflow-auto bg-gray-100 rounded">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;