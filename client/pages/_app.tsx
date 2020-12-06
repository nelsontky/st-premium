import React from "react";
import { AppProps } from "next/app";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Quattrocento Sans",
    h1: {
      fontFamily: "Work Sans",
    },
    h2: {
      fontFamily: "Work Sans",
    },
    h3: {
      fontFamily: "Work Sans",
    },
    h4: {
      fontFamily: "Work Sans",
    },
    h5: {
      fontFamily: "Work Sans",
    },
    h6: {
      fontFamily: "Work Sans",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
