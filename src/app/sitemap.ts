import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * Blog posts are no longer hosted here - they live on the blog site
 * (blog.ksauraj.eu.org) and are listed in its own sitemap. This sitemap
 * covers the portfolio's own pages only.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}