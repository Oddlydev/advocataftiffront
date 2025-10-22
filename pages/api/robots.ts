// pages/api/robots.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://advocataftifda.wpenginepowered.com'
  const robotsUrl = `${wpUrl.replace(/\/$/, '')}/robots.txt`

  try {
    const response = await fetch(robotsUrl)
    const text = await response.text()

    res.setHeader('Content-Type', 'text/plain')
    // Optional caching for 1 hour at the Vercel edge
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

    res.status(200).send(text)
  } catch (error) {
    console.error('Error fetching robots.txt from WP:', error)
    // Fallback robots.txt if WP is unreachable
    res.setHeader('Content-Type', 'text/plain')
    const proto = (req.headers['x-forwarded-proto'] as string) || 'https'
    const host = req.headers.host || 'localhost:3000'
    const origin = `${proto}://${host}`
    res.status(200).send(`User-agent: *
Allow: /\n\nSitemap: ${origin}/sitemap.xml\n`)
  }
}

