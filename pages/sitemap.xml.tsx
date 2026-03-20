import { getSitemapProps } from "@faustwp/core";
import { GetServerSidePropsContext } from "next"; // Import GetServerSidePropsContext

export default function Sitemap() {}

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  const proto = (ctx.req.headers["x-forwarded-proto"] as string) || "https";
  const host = ctx.req.headers.host || "localhost:3000";
  const frontendUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`;

  return getSitemapProps(ctx, {
    frontendUrl,
    sitemapIndexPath: "/sitemap_index.xml",
    // sitemapPathsToIgnore: ['/wp-sitemap-users-*'],
  });
}
