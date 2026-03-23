import type { NextApiRequest, NextApiResponse } from "next";

function resolveWordPressOrigin(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_WP_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;

  if (!raw) return null;

  try {
    const url = new URL(raw);

    if (url.pathname.endsWith("/graphql")) {
      url.pathname = url.pathname.slice(0, -"/graphql".length) || "/";
    }

    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function resolveFrontendOrigin(req: NextApiRequest): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }

  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host || "localhost:3000";
  return `${proto}://${host}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const wpOrigin = resolveWordPressOrigin();
  const frontendOrigin = resolveFrontendOrigin(req);
  const headerPath = req.headers["x-sitemap-path"];
  const rawPath =
    typeof headerPath === "string"
      ? headerPath
      : Array.isArray(headerPath)
        ? headerPath[0]
        : Array.isArray(req.query.path)
          ? req.query.path[0]
          : req.query.path;
  const path =
    typeof rawPath === "string"
      ? `/${rawPath.replace(/^\/+/, "").replace(/\/+$/, "")}`
      : null;

  if (!wpOrigin || !path || !/\.xml$/i.test(path)) {
    res.status(400).send("Invalid sitemap request");
    return;
  }

  try {
    const upstreamUrl = `${wpOrigin}${path}`;
    const upstreamRes = await fetch(upstreamUrl);
    const xml = await upstreamRes.text();

    if (!upstreamRes.ok) {
      res.status(upstreamRes.status).send(xml || `Failed to fetch ${path}`);
      return;
    }

    const normalizedXml = xml
      .replace(/<\?xml-stylesheet[^?]*\?>/i, "")
      .replace(/href="\/\//g, 'href="https://')
      .replaceAll(wpOrigin, frontendOrigin);

    res.status(200);
    res.setHeader(
      "Content-Type",
      upstreamRes.headers.get("content-type") || "application/xml; charset=utf-8",
    );
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.send(normalizedXml);
  } catch (error) {
    console.error("Error fetching sitemap from WordPress:", error);
    res.status(502).send("Failed to fetch sitemap");
  }
}
