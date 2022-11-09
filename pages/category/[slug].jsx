import { useRouter } from "next/router";
import Head from "next/head";
import ErrorPage from "next/error";
import Container from "../../components/@shared/Container";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import {
  getAllCategoriesWithSlug,
  getCategoryBySlug,
  getLandingPageBySlug,
} from "../../lib/api";
import RecentPosts from "../../components/Post/RecentPosts";
import PageTitle from "../../components/@shared/PageTitle";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const Category = (props) => {
  const router = useRouter();
  const { isFallback } = router;
  const { category, title, subtitle, preview } = props;

  if (!isFallback && !category) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={preview}>
      <Head>{title && <title>{title}</title>}</Head>
      <Container>
        {title && <Header title={title} subtitle={subtitle} />}
        {router.isFallback ? (
          <PageTitle>Loading…</PageTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>{category.title}</title>
              </Head>
              <div className="text-right">
                <LanguageSwitcher />
              </div>
              <PageTitle>{category.title}</PageTitle>
              <p className="text-lg leading-relaxed mb-4">
                {category.description}
              </p>
              <RecentPosts
                title="Stories"
                posts={
                  category.linkedFrom.postCollection.items &&
                  category.linkedFrom.postCollection.items.length > 0 &&
                  category.linkedFrom.postCollection.items
                }
              />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
};

export async function getStaticProps({
  params,
  locale,
  locales,
  preview = false,
}) {
  const category = await getCategoryBySlug(params.slug, { locale, preview });
  const { title, subtitle } =
    (await getLandingPageBySlug("/", { locale })) ?? {};

  if (!category) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category: category,
      title: title,
      subtitle: subtitle,
      locale: locale,
      locales: locales,
      preview,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths({ locales = [] }) {
  const paths = [];
  for (const locale of locales) {
    let categories = await getAllCategoriesWithSlug({ locale });
    if (categories) {
      for (const category of categories) {
        paths.push({
          params: { slug: `/category/${category.slug}` },
        });
      }
    }
  }
  return {
    paths: paths,
    fallback: true,
  };
}

export default Category;
