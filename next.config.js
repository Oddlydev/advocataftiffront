const { withFaust } = require("@faustwp/core");

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
  images: {
    // Allow optimizing images from the WP Engine host
    domains: ["advocataftifda.wpenginepowered.com"],
    // Serve modern formats to supported browsers
    formats: ["image/avif", "image/webp"],
  },
  trailingSlash: true,

  async headers() {
    return [
      {
        // Strong caching for static public assets
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async rewrites() {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://advocataftifda.wpenginepowered.com'

    return [
      // Keep the category slug in the URL, but render the base pages
      { source: "/datasets/:slug*", destination: "/datasets/" },
      { source: "/insights/:slug*", destination: "/insights/" },
      // Serve PNG favicon for legacy /favicon.ico requests
      { source: "/favicon.ico", destination: "/assets/images/favicon.png" },

      // Route /robots.txt → our API proxy
      { source: "/robots.txt", destination: "/api/robots" },

      // Route /sitemap.xml and related Yoast sitemap routes → WordPress backend
      { source: "/sitemap.xml", destination: `${wpUrl}/sitemap_index.xml` },
      { source: "/sitemap_index.xml", destination: `${wpUrl}/sitemap_index.xml` },
      // Match any Yoast sitemap like /post-sitemap.xml, /page-sitemap2.xml, etc.
      { source: "/:file(sitemap-.*\\.xml)", destination: `${wpUrl}/:file` },
    ];
  },
});
