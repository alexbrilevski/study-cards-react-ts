import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import Button from '../Button/Button';

type ErrorBoundaryProps = PropsWithChildren<{
  resetKey?: unknown;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
  resetKey?: unknown;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, resetKey: this.props.resetKey };

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): Partial<ErrorBoundaryState> | null {
    if (props.resetKey !== state.resetKey) {
      return { hasError: false, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="card form-container" role="alert">
        <div className="form-header">
          <h1>Something went wrong</h1>
        </div>
        <p className="form-note text-center">
          The page failed to load. Try again or reload the page.
        </p>
        <div className="form-actions">
          <Button variant={'contained'} color={'primary'} onClick={this.handleReset}>
            Try again
          </Button>
          <Button variant={'contained'} color={'white'} onClick={this.handleReload}>
            Reload page
          </Button>
        </div>
      </div>
    );
  }
}
