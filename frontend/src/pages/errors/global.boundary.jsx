import React from "react";
import ErrorPage from "@/components/error-page";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can map error types dynamically if needed
      return (
        <ErrorPage
          errorType="500" // fallback type, like "Internal Server Error"
          customTitle="Ups, terjadi kesalahan!"
          customMessage={this.state.error?.message || "Silakan coba lagi."}
          customActions={["refresh", "home"]}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
