// pages/api/robots.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https'
  const host = req.headers.host || 'localhost:3000'
  const requestOrigin = `${proto}://${host}`
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || requestOrigin).replace(/\/$/, '')

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteOrigin}/sitemap.xml
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(robotsTxt)
}

