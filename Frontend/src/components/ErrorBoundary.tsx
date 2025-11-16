import { Box, Button, Typography } from "@mui/material";
import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Error logging removed for production
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
            direction: "rtl",
            p: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, color: "error.main" }}>
            אופס! משהו השתבש
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            אירעה שגיאה לא צפויה. אנא רענן את הדף או נסה שוב מאוחר יותר.
          </Typography>
          {import.meta.env.DEV && this.state.error && (
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.8rem",
                maxWidth: "600px",
                overflow: "auto",
              }}
            >
              {this.state.error.toString()}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={() =>
              typeof window !== "undefined" && window.location.reload()
            }
          >
            רענן דף
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
