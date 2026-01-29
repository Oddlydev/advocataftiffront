import type { NextApiRequest, NextApiResponse } from "next";

const ALLOWED_HOSTS = (() => {
  const hosts = new Set<string>();
  const addHost = (raw?: string) => {
    if (!raw) return;
    try {
      const parsed = new URL(raw);
      if (parsed.hostname) hosts.add(parsed.hostname);
    } catch {
      // ignore invalid env entries
    }
  };
  addHost(process.env.NEXT_PUBLIC_WP_URL);
  addHost(process.env.NEXT_PUBLIC_WORDPRESS_URL);
  return hosts;
})();

function isAllowedHost(hostname: string): boolean {
  if (!ALLOWED_HOSTS.size) return false;
  for (const allowed of ALLOWED_HOSTS) {
    if (hostname === allowed || hostname.endsWith(`.${allowed}`)) {
      return true;
    }
  }
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.query;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing url" });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid url" });
  }

  if (!/^https?:$/.test(target.protocol)) {
    return res.status(400).json({ error: "Invalid url protocol" });
  }

  if (!isAllowedHost(target.hostname)) {
    return res.status(403).json({ error: "Host not allowed" });
  }

  try {
    const response = await fetch(target.toString(), { cache: "no-store" });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch dataset" });
    }

    const text = await response.text();
    const contentType =
      response.headers.get("content-type") || "text/csv; charset=utf-8";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: "Internal proxy error" });
  }
}
