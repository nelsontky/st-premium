import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

interface IArticle {
  headline: string;
  paragraphs: string[];
  imageLinkAndCaption: { imageLink: string; caption: string };
}

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    marginBottom: theme.spacing(1),
  },
  image: {
    maxWidth: "100%",
  },
}));

export default function Post({
  article,
  hasError,
}: {
  article?: IArticle;
  hasError: boolean;
}) {
  const classes = useStyles();

  if (hasError) {
    return (
      <div>
        <Head>
          <title>Straits Times Premium Reader</title>
        </Head>
        <Typography variant="h6">An error was encountered</Typography>
        <Typography variant="body1">This may be due to:</Typography>
        <ul>
          <Typography variant="body1" component="li">
            Article is not available on this site.
          </Typography>
          <Typography variant="body1" component="li">
            Invalid Straits Times link was provided.
          </Typography>
          <Typography variant="body1" component="li">
            Article is too old.
          </Typography>
        </ul>
        <Typography component={Link} href="/" variant="body1">
          Back to home
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{article.headline}</title>
      </Head>
      <article>
        <Typography variant="h6" gutterBottom>
          {article.headline}
        </Typography>
        {article.imageLinkAndCaption.imageLink && (
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              src={article.imageLinkAndCaption.imageLink}
            />
            <Typography variant="caption" gutterBottom>
              {article.imageLinkAndCaption.caption}
            </Typography>
          </div>
        )}
        {article.paragraphs.map((paragraph, i) => (
          <Typography
            key={"paragraph" + i}
            component="p"
            variant="body1"
            gutterBottom
          >
            {paragraph}
          </Typography>
        ))}
      </article>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const pathname = Array.isArray(params.slug)
      ? params.slug.join("/")
      : params.slug;

    const article: IArticle = (
      await axios.get(`http://localhost:5000/api/v1?pathname=/${pathname}`)
    ).data;

    return {
      props: {
        article,
        hasError: false,
      },
    };
  } catch {
    return {
      props: {
        hasError: true,
      },
    };
  }
};
