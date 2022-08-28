import Container from "../components/Container";
import RecentPosts from "../components/RecentPosts";
import HeroPost from "../components/HeroPost";
import Intro from "../components/Intro";
import Layout from "../components/Layout";
import { getHomepageAndComponents, getRecentPosts } from "../lib/api";
import Head from "next/head";

export default function Index({ homepage, recentPosts }) {
  return (
    <>
      <Layout>
        <Head>
          <title>{homepage.title}</title>
        </Head>
        <Container>
          <Intro title={homepage.title} subtitle={homepage.subtitle} />
          {homepage.heroPost && (
            <HeroPost
              title={homepage.heroPost.title}
              coverImage={homepage.heroPost.coverImage}
              date={homepage.heroPost.date}
              author={homepage.heroPost.author}
              slug={homepage.heroPost.slug}
              excerpt={homepage.heroPost.excerpt}
            />
          )}
          {recentPosts.length > 0 && (
            <RecentPosts
              title={homepage.recentPosts.title}
              posts={recentPosts}
            />
          )}
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const homepage = (await getHomepageAndComponents()) ?? {};
  const limit = homepage?.recentPosts.limit ?? 4;
  const recentPosts = (await getRecentPosts(limit)) ?? [];
  return {
    props: { homepage, recentPosts },
  };
}
