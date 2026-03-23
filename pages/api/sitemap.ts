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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const wpOrigin = resolveWordPressOrigin();
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
    const xmlRes = await fetch(`${wpOrigin}${path}`);
    const xml = await xmlRes.text();

    if (!xmlRes.ok) {
      res.status(xmlRes.status).send(xml || `Failed to fetch ${path}`);
      return;
    }

    const plainXml = xml.replace(/<\?xml-stylesheet[^?]*\?>\s*/i, "");

    res.setHeader("Content-Type", "text/xml");
    res.write(plainXml);
    res.end();
  } catch (error) {
    console.error("Error fetching sitemap from WordPress:", error);
    res.status(502).send("Failed to fetch sitemap");
  }
}
