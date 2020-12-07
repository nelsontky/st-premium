import React from "react";
import { AppProps } from "next/app";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export default function App({ Component, pageProps }: AppProps) {
  const classes = useStyles();

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
        <Container maxWidth="sm" className={classes.root}>
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>
    </>
  );
}
