import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const rewriteUrl = request.nextUrl.clone();
  const requestPath =
    request.nextUrl.pathname === "/sitemap.xml"
      ? "/sitemap_index.xml"
      : request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-sitemap-path", requestPath);

  rewriteUrl.pathname = "/api/sitemap";
  rewriteUrl.search = "";

  return NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/:path((?:.*-)?sitemap.*\\.xml)",
  ],
};
