/**
 * Shared site constants. Safe to import from both server and client
 * components - deliberately has no `server-only` guard.
 */
export const SITE_URL = 'https://ksauraj.eu.org'

/** The blog is a separate site; the portfolio links out to it. */
export const BLOG_URL = 'https://blog.ksauraj.eu.org'

/** Blog RSS feed, read at build time to populate the homepage cards. */
export const BLOG_FEED_URL =
  process.env.BLOG_FEED_URL || `${BLOG_URL}/feed.xml`
