import {
  getCategoryBySlug,
  getLandingPageBySlug,
  getPostBySlug,
} from "../../lib/api";

export default async function preview(req, res) {
  const { secret, slug, contentType } = req.query;

  if (
    secret !== process.env.CONTENTFUL_PREVIEW_SECRET ||
    !slug ||
    !contentType
  ) {
    return res.status(401).json({ message: "Invalid options" });
  }

  // Fetch the page or blog content by slug using the Contentful Preview API.
  let preview = null;
  let redirectPrefix = "";

  switch (contentType) {
    case "post":
      redirectPrefix = "/posts/";
      preview = await getPostBySlug(slug, { preview: true, locale: "" });
      break;

    case "category":
      redirectPrefix = "/category/";
      preview = await getCategoryBySlug(slug, {
        preview: true,
        locale: "",
      });
      break;

    case "landingPage":
      preview = await getLandingPageBySlug(slug, {
        preview: true,
        locale: "",
      });
      break;

    default:
      preview = null;
  }

  // Prevent Next.js preview mode from being enabled if the content doesn't exist.
  if (!preview) {
    return res.status(401).json({ message: "Invalid slug" });
  }

  /**
   * res.setPreviewData({}) sets some cookies on the browser
   * which turns on the preview mode. Any requests to Next.js
   * containing these cookies will be considered as the preview
   * mode, and the behavior for statically generated pages
   * will change.
   *
   * To end Next.js preview mode, navigate to /api/endpreview.
   */

  res.setPreviewData({});

  /*
   * Redirect to the path from the fetched post.
   * We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities.
   */
  const url = `${redirectPrefix}${preview.slug}`;

  res.setHeader("Content-Type", "text/html");
  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${url}" />
    <script>window.location.href = '${url}'</script>
    </head>
    </html>`
  );
  res.end();
}
