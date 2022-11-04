import Head from "next/head";
import Banner from "../components/Banner";
import HeroPost from "../components/Post/HeroPost";
import RecentPosts from "../components/Post/RecentPosts";
import Intro from "../components/Intro";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { getLandingPageBySlug, getRecentPosts } from "../lib/api";
import Container from "../components/@shared/Container";

const indexPage = (props) => {
  const { pageContent, recentPosts } = props;

  const renderComponent = (component) => {
    switch (component.__typename) {
      case "Banner":
        return (
          <Banner
            key={component.sys.id}
            image={component.image}
            content={component.text}
            cta={component.callToAction}
            modification={component.imageModification}
          />
        );
        break;

      case "RecentPostsComponent":
        return (
          <RecentPosts
            key={component.sys.id}
            title={component.title}
            posts={
              recentPosts &&
              recentPosts.length > 0 &&
              recentPosts.slice(0, component.limit)
            }
          />
        );

      case "Post":
        return (
          <HeroPost
            key={component.sys.id}
            title={component.title}
            coverImage={component.coverImage}
            date={component.date}
            author={component.author}
            slug={component.slug}
            excerpt={component.excerpt}
          />
        );
    }
  };

  return (
    <>
      <Layout>
        <Head>
          <title>{pageContent.title}</title>
        </Head>
        <Container>
          <Intro title={pageContent.title} subtitle={pageContent.subtitle} />
          <div className="text-right">
            <LanguageSwitcher />
          </div>
          <>
            {pageContent.components.items.map((component) =>
              renderComponent(component)
            )}
          </>
        </Container>
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale, locales }) {
  const pageContent = (await getLandingPageBySlug("/", locale)) ?? {};
  // Hard limit by 20 posts.
  const recentPosts = (await getRecentPosts(locale, 20)) ?? {};
  return { props: { pageContent, recentPosts, locale, locales } };
}

export default indexPage;
