import Head from "next/head";
import { GetServerSideProps } from "next";
import axios from "axios";
import Typography from "@material-ui/core/Typography";

interface IArticle {
  headline: string;
  paragraphs: string[];
  imageAndCaptionLinks: { imageLink: string; caption: string }[];
}

export default function Post({
  article,
  hasError,
}: {
  article?: IArticle;
  hasError: boolean;
}) {
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
        {article.paragraphs.map((paragraph, i) => (
          <Typography key={i} component="p" variant="body1" gutterBottom>
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
