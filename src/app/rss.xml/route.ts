import { getAllPosts } from '@/lib/blog'

const SITE_URL = 'https://ksauraj.eu.org'

export const dynamic = 'force-static'

// Static RSS feed generated at build time → served at /rss.xml
export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${p.date ? new Date(p.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
${p.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join('\n')}
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ksauraj — Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Writing on DevOps, Kubernetes, cloud infrastructure, SRE, and automation by Sauraj Kumar Singh (ksauraj).</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
