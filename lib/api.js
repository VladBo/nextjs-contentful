/**
 * This class constructs GraphQL queries for blog posts, page content and other data
 * and calls out to the Contentful GraphQL API.
 *
 * Contentful GraphQL API docs:
 * https://www.contentful.com/developers/docs/references/graphql/
 *
 * Explore the GraphQL API in depth in the GraphQL Playground:
 * https://graphql.contentful.com/content/v1/spaces/{SPACE_ID}/explore?access_token={ACCESS_TOKEN}
 *
 */

const defaultOptions = {
  preview: false,
  limit: 20,
  defaultLocale: "en-US",
};

const IMAGE_FIELDS = `
  url
  title
  contentType
  width
  height
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

export async function getPostBySlug(slug, options = defaultOptions) {
  options = { ...defaultOptions, ...options };
  const query = `query {
    postCollection(where: { slug: "${slug}" }, locale: "${options.locale}", preview: ${options.preview}, limit: 1) {
      items {
        slug
        title
        sys {
          id
        }
        coverImage(locale: "${options.defaultLocale}") {
          ${IMAGE_FIELDS}
        }
        date
        author {
          name
          picture(locale: "${options.defaultLocale}") {
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
      }
    }
  }`;
  const response = await fetchGraphQL(query, options.preview);
  return response?.data?.postCollection?.items?.[0];
}

export async function getAllPostsWithSlug(options = defaultOptions) {
  options = { ...defaultOptions, ...options };
  const query = `query {
    postCollection(locale: "${options.locale}", where: { slug_exists: true }, order: date_DESC) {
      items {
        slug
        title
        sys {
          id
        }
        coverImage(locale: "${options.defaultLocale}") {
          ${IMAGE_FIELDS}
        }
        date
        author {
          name
          picture(locale: "${options.defaultLocale}") {
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
      }
    }
  }`;
  const response = await fetchGraphQL(query);
  return response?.data?.postCollection?.items;
}

export async function getRecentPosts(options = defaultOptions) {
  options = { ...defaultOptions, ...options };
  const query = `query {
    postCollection(locale: "${options.locale}", limit: ${options.limit}, order: date_DESC) {
      items {
        slug
        title
        sys {
          id
        }
        coverImage(locale: "${options.defaultLocale}") {
          ${IMAGE_FIELDS}
        }
        date
        author {
          name
          picture(locale: "${options.defaultLocale}") {
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
      }
    }
  }`;
  const response = await fetchGraphQL(query);
  return response?.data?.postCollection?.items;
}

export async function getLandingPageBySlug(slug, options = defaultOptions) {
  options = { ...defaultOptions, ...options };
  const query = `query {
    landingPage: landingPageCollection(where: { slug: "${slug}" }, locale: "${options.locale}", preview: ${options.preview}, limit: 1) {
      items {
        title
        subtitle
        slug
        components: componentsCollection {
          items {
            __typename
            ... on Post {
              slug
              title
              sys {
                id
              }
              coverImage(locale: "${options.defaultLocale}") {
                ${IMAGE_FIELDS}
              }
              date
              author {
                name
                picture(locale: "${options.defaultLocale}") {
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
            }
            ... on Banner {
              sys {
                id
              }
              image(locale: "${options.defaultLocale}") {
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
            }
            ... on RecentPostsComponent {
              sys {
                id
              }
              title
              limit
            }
            ... on CategoriesListComponent {
              sys {
                id
              }
              title
            }
          }
        }
      }
    }
  }`;
  const response = await fetchGraphQL(query, options.preview);
  return response?.data?.landingPage?.items?.[0];
}

export async function getAllCategoriesWithSlug(options = defaultOptions) {
  options = { ...defaultOptions, ...options };
  const query = `query {
    categoryCollection(locale: "${options.locale}") {
      items {
        slug
        title
        description
        sys {
          id
        }
      }
    }
  }`;
  const response = await fetchGraphQL(query);
  return response?.data?.categoryCollection?.items;
}

export async function getCategoryBySlug(slug, options = defaultOptions) {
  options = { ...defaultOptions, ...options };
  const query = `query {
    categoryCollection(where: { slug: "${slug}" }, locale: "${options.locale}", preview: ${options.preview}, limit: 1) {
      items {
        slug
        title
        description
        sys {
          id
        }
        linkedFrom {
          postCollection(locale: "${options.defaultLocale}") {
            total
            items {
              slug
              title(locale: "${options.locale}")
              sys {
                id
              }
              coverImage(locale: "${options.defaultLocale}") {
                ${IMAGE_FIELDS}
              }
              date
              author {
                name
                picture(locale: "${options.defaultLocale}") {
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
            }
          }
        }
      }
    }
  }`;

  const response = await fetchGraphQL(query, options.preview);
  return response?.data?.categoryCollection?.items?.[0];
}
