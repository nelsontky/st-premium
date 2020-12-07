import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
});

export default function Home() {
  const classes = useStyles();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setError(false);
    setIsLoading(true);
    try {
      const { pathname, hostname } = new URL(url);

      if (
        hostname !== "www.straitstimes.com" &&
        hostname !== "straitstimes.com"
      ) {
        throw new Error();
      }

      router.push(pathname);
    } catch {
      setIsLoading(false);
      setError(
        "Invalid URL! Make sure that the input URL is a valid Straits Times link with the https://"
      );
    }
  };

  return (
    <div className={classes.root}>
      <Head>
        <title>Straits Times Premium Reader</title>
      </Head>
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
              disabled={isLoading}
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
          {isLoading ? (
            <LinearProgress />
          ) : (
            <Button
              disabled={isLoading}
              onClick={onSubmit}
              variant="contained"
              color="primary"
            >
              Read now!
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
