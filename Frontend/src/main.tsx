import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import rtlPlugin from "stylis-plugin-rtl";
import App from "./App.tsx";
import { config } from "./config/config";
import store from "./store/store";
import "./Styles/index.css";
import theme from "./theme/theme";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GoogleOAuthProvider
          clientId={config.GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID"}
        >
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>
);
