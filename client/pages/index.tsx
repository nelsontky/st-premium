import Head from "next/head";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { GetStaticProps } from "next";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>Straits Times Premium Reader</title>
      </Head>
      <Container maxWidth="sm" className={classes.root}>
        <Box textAlign="center">
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
              <TextField
                variant="outlined"
                fullWidth
                label="Enter article URL"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary">
                Read now!
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
