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

  async rewrites() {
    return [
      // Keep the category slug in the URL, but render the base pages
      { source: "/datasets/:slug*", destination: "/datasets/" },
      { source: "/insights/:slug*", destination: "/insights/" },
    ];
  },
});
