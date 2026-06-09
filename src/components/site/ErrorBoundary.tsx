import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorPage } from "./ErrorPage";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Top-level React error boundary. Catches render-time errors thrown by
 * any descendant component (outside the router's per-route boundaries)
 * and shows the themed ErrorPage instead of letting the whole app crash.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surface render errors to the console so they're visible in dev tools
    // and any attached logging without leaking details into the UI.
    console.error("Render error caught by ErrorBoundary:", error, info);
  }

  private handleRetry = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return <ErrorPage error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}