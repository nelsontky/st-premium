import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    textAlign: "center",
  },
}));

export default function Home() {
  const classes = useStyles();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | boolean>(false);
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setError(false);
    try {
      setError(false);
      const { pathname, hostname } = new URL(url);

      if (
        hostname !== "www.straitstimes.com" &&
        hostname !== "straitstimes.com"
      ) {
        throw new Error();
      }

      router.push(pathname);
    } catch {
      setError(
        "Invalid URL! Make sure that the input URL is a valid Straits Times link with the https://"
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Straits Times Premium Reader</title>
      </Head>
      <Container maxWidth="sm" className={classes.root}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h4">Straits Times Premium Reader</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              Read premium Straits Times articles for free
            </Typography>
          </Grid>
          <Grid item>
            <form onSubmit={onSubmit}>
              <TextField
                value={url}
                onChange={onChange}
                variant="outlined"
                fullWidth
                label="Enter article URL"
                error={error !== false}
                helperText={error ? error : undefined}
              />
            </form>
          </Grid>
          <Grid item>
            <Button onClick={onSubmit} variant="contained" color="primary">
              Read now!
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
