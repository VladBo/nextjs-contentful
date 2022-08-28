const POST_GRAPHQL_FIELDS = `
slug
title
coverImage {
  url
}
date
author {
  name
  picture {
    url
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

function extractHomepage(fetchResponse) {
  return fetchResponse?.data?.homepage?.items?.[0];
}

function extractPost(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items?.[0];
}

function extractPostEntries(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items;
}

export async function getPostBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractPost(entry);
}

export async function getPreviewPostBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  );
  return extractPost(entry);
}

export async function getAllPostsWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractPostEntries(entries);
}

export async function getRecentPosts(limit) {
  const entries = await fetchGraphQL(
    `query {
      postCollection(order: date_DESC, limit: ${limit}) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractPostEntries(entries);
}

export async function getHomepage() {
  const entry = await fetchGraphQL(
    `query {
      homepage: landingPageCollection(limit: 1, order: sys_publishedAt_DESC) {
        items {
          title
          subtitle
        }
      }
    }    
    `
  );
  return extractHomepage(entry);
}

export async function getHomepageAndComponents() {
  const entry = await fetchGraphQL(
    `query {
      homepage: landingPageCollection(limit: 1, order: sys_publishedAt_DESC) {
        items {
          title
          subtitle
          heroPost {
            ${POST_GRAPHQL_FIELDS}
          }
          recentPosts {
            title
            limit
          }
        }
      }
    }    
    `
  );
  return extractHomepage(entry);
}
