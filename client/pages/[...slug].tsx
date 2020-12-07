import Head from "next/head";
import { GetServerSideProps } from "next";

export default function Post({ params }: { params: { slug: [string] } }) {
  return (
    <div>
      <Head>
        <title>Hello</title>
      </Head>
      <article>{params.slug.join("/")}</article>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      params,
    },
  };
};
