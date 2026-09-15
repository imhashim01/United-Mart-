import { Component } from "react";

// React error boundaries must be class components — this is a hard
// requirement, hooks cannot catch render errors. Without this wrapping the
// app, ANY single component throwing an uncaught error (a malformed
// product, a bad image, anything) unmounts the ENTIRE site to a blank
// white page, with no way to recover except a manual reload. This catches
// that instead and shows a friendly, recoverable screen.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
            fontFamily: "sans-serif",
            background: "#F7F0EB",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#173A2E", marginBottom: "8px" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "14px", color: "#5B5B52", marginBottom: "20px", maxWidth: "320px" }}>
            We hit an unexpected error on this page. Please go back to the homepage and try again.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              height: "44px",
              padding: "0 24px",
              borderRadius: "8px",
              background: "#173A2E",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;