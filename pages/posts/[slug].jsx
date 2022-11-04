import { useRouter } from "next/router";
import Head from "next/head";
import ErrorPage from "next/error";
import Container from "../../components/@shared/Container";
import PostBody from "../../components/Post/PostBody";
import Header from "../../components/Header";
import PostHeader from "../../components/Post/PostHeader";
import Layout from "../../components/Layout";
import {
  getAllPostsWithSlug,
  getPostBySlug,
  getLandingPageBySlug,
} from "../../lib/api";
import PostTitle from "../../components/Post/PostTitle";
import SectionSeparator from "../../components/@shared/SectionSeparator";

const Post = (props) => {
  const router = useRouter();
  const { isFallback } = router;
  const { post, title, subtitle } = props;

  if (!isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <Head>{title && <title>{title}</title>}</Head>
      <Container>
        {title && <Header title={title} subtitle={subtitle} />}
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>{post.title}</title>
                <meta property="og:image" content={post.coverImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
            <SectionSeparator />
          </>
        )}
      </Container>
    </Layout>
  );
};

export async function getStaticProps({ params, locale, locales }) {
  const post = await getPostBySlug(params.slug, locale);
  const { title, subtitle } = (await getLandingPageBySlug("/", locale)) ?? {};

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: post,
      title: title,
      subtitle: subtitle,
      locale: locale,
      locales: locales,
    },
  };
}

export async function getStaticPaths({ locales = [] }) {
  const paths = [];

  for (const locale of locales) {
    let posts = await getAllPostsWithSlug(locale);
    for (const post of posts) {
      paths.push({
        params: { slug: `/posts/${post.slug}` },
        locale,
      });
    }
  }
  return {
    paths: paths,
    fallback: true,
  };
}

export default Post;
