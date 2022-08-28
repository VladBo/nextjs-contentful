import { useRouter } from "next/router";
import Head from "next/head";
import ErrorPage from "next/error";
import Container from "../../components/Container";
import PostBody from "../../components/Post/PostBody";
import Header from "../../components/Header";
import PostHeader from "../../components/Post/PostHeader";
import SectionSeparator from "../../components/SectionSeparator";
import Layout from "../../components/Layout";
import { getAllPostsWithSlug, getPostBySlug, getHomepage } from "../../lib/api";
import PostTitle from "../../components/Post/PostTitle";

export default function Post({ post, header }) {
  const router = useRouter();

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <Head>
        <title>{header.title}</title>
      </Head>
      <Container>
        <Header title={header.title} />
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
}

export async function getStaticProps({ params }) {
  const data = await getPostBySlug(params.slug);
  const headerSettings = await getHomepage();

  return {
    props: {
      post: data ?? null,
      header: headerSettings ?? null,
    },
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();
  return {
    paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
    fallback: true,
  };
}
