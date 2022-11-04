// @todo: replace with router.defaultLocale
const defaultLocale = "en-US";
const IMAGE_FIELDS = `
  url
  title
  contentType
  width
  height
`;

const POST_GRAPHQL_FIELDS = `
  slug
  title
  sys {
    id
  }
  coverImage(locale: "${defaultLocale}") {
    ${IMAGE_FIELDS}
  }
  date
  author {
    name
    picture(locale: "${defaultLocale}") {
      ${IMAGE_FIELDS}
    }
  }
  excerpt
  content {
    json
    links {
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
`;

const BANNER_GRAPHQL_FIELDS = `
  sys {
    id
  }
  image(locale: "${defaultLocale}") {
    ${IMAGE_FIELDS}
  }
  imageModification
  text {
    json
  }
  callToAction {
    label
    url
  }
`;

const LANDING_PAGE_GRAPHQL_FIELDS = `
  title
  subtitle
  components: componentsCollection {
    items {
      __typename
      ... on Post {
        ${POST_GRAPHQL_FIELDS}
      }
      ... on Banner {
        ${BANNER_GRAPHQL_FIELDS}
      }
      ... on RecentPostsComponent {
        sys {
          id
        }
        title
        limit
      }
    }
  }
`;

async function fetchGraphQL(query, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json());
}

export async function getPostBySlug(slug, locale) {
  const response = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, locale: "${locale}", limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return response?.data?.postCollection?.items?.[0];
}

export async function getPreviewPostBySlug(slug) {
  const response = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  );
  return response?.data?.postCollection?.items?.[0];
}

export async function getAllPostsWithSlug(locale) {
  const response = await fetchGraphQL(
    `query {
      postCollection(locale: "${locale}", where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return response?.data?.postCollection?.items;
}

export async function getRecentPosts(locale, limit) {
  const response = await fetchGraphQL(
    `query {
      postCollection(locale: "${locale}", limit: ${limit}, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return response?.data?.postCollection?.items;
}

export async function getLandingPageBySlug(slug, locale) {
  const response = await fetchGraphQL(
    `query {
      landingPage: landingPageCollection(where: { slug: "${slug}" }, locale: "${locale}", limit: 1) {
        items {
          ${LANDING_PAGE_GRAPHQL_FIELDS}
        }
      }
    }    
    `
  );
  return response?.data?.landingPage?.items?.[0];
}
