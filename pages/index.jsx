import Head from "next/head";
import Banner from "../components/Banner";
import HeroPost from "../components/Post/HeroPost";
import RecentPosts from "../components/Post/RecentPosts";
import Intro from "../components/Intro";
import Layout from "../components/Layout";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  getLandingPageBySlug,
  getRecentPosts,
  getAllCategoriesWithSlug,
} from "../lib/api";
import Container from "../components/@shared/Container";
import CategoriesList from "../components/Category/CategoriesList";

const indexPage = (props) => {
  const { pageContent, recentPosts, categories, preview } = props;

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

      case "CategoriesListComponent":
        return (
          <CategoriesList
            key={component.sys.id}
            title={component.title}
            categories={categories && categories.length > 0 && categories}
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
      <Layout preview={preview}>
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

export const getStaticProps = async ({ locale, locales, preview = false }) => {
  console.log("locale:", locale);
  const pageContent =
    (await getLandingPageBySlug("/", { locale, preview })) ?? {};
  // Hard limit by 20 posts.
  const recentPosts = (await getRecentPosts({ locale, limit: 20 })) ?? {};
  const categories = (await getAllCategoriesWithSlug({ locale })) ?? {};
  return {
    props: {
      pageContent,
      recentPosts,
      categories,
      locale,
      locales,
      preview,
    },
  };
};

export default indexPage;
