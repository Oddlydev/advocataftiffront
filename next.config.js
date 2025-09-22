const { withFaust } = require("@faustwp/core");

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
  images: {
    domains: ["advocataftifda.wpenginepowered.com/"],
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
