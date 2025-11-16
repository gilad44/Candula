import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    // Add custom breakpoints while keeping defaults
    "3xs": true;
    "2xs": true;
    "2xl": true;
    // Keep all default breakpoints (xs, sm, md, lg, xl are already defined)
  }
}

const theme = createTheme({
  direction: "rtl",
  breakpoints: {
    values: {
      "3xs": 0,
      "2xs": 320,
      xs: 480,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },
  // Optional: Add your candle shop brand colors
  palette: {
    primary: {
      main: "#7f6000", // Your brown/gold color
    },
    secondary: {
      main: "#f2df3b", // Your yellow color
    },
  },
  // Optional: Add typography customizations
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // You can add Hebrew font support here if needed
  },
});

export default theme;
