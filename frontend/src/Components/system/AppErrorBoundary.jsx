import React from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Application error boundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center px-4">
          <Card className="max-w-lg text-center">
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Something went wrong</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              The page crashed unexpectedly. Reload to continue.
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Reload App
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

