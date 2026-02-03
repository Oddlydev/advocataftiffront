import { getSitemapProps } from "@faustwp/core";
import { GetServerSidePropsContext } from "next"; // Import GetServerSidePropsContext

export default function Sitemap() {}

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Add type for ctx
  return getSitemapProps(ctx, {
    frontendUrl: process.env.NEXT_PUBLIC_WP_URL || "", // Add empty string as fallback
    // sitemapIndexPath: 'sitemap.xml',
    // sitemapPathsToIgnore: ['/wp-sitemap-users-*'],
  });
}
