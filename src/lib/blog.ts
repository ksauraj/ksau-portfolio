import 'server-only'

/**
 * Blog posts live on the separate blog site (blog.ksauraj.eu.org). The
 * portfolio keeps no local markdown, so this module reads the blog's RSS
 * feed at build time and maps each item to card metadata.
 *
 * The site is statically exported (`output: 'export'`), so the fetch runs
 * during `next build` and the result is inlined into the static HTML - no
 * runtime request, no CORS, no client fetch.
 */
import { BLOG_FEED_URL, BLOG_URL } from './site'

export { BLOG_URL }

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  url: string
}

/**
 * Last-resort cards, used only when the feed cannot be reached at build
 * time, so the homepage section never vanishes on a network blip.
 */
const FALLBACK: PostMeta[] = [
  {
    slug: 'kubernetes-probes-complete-guide',
    title: 'Liveness, Readiness, and Startup Probes: The Complete Guide',
    date: '2026-06-03',
    excerpt:
      'How Kubernetes knows if a container is actually working - the history of probes, how each handler type works under the hood, and production patterns for reliability.',
    tags: ['kubernetes', 'probes', 'devops'],
    url: `${BLOG_URL}/posts/2026/06/03/kubernetes-probes-complete-guide/`,
  },
  {
    slug: 'csi-drivers',
    title: 'How CSI Drivers Actually Work in Kubernetes',
    date: '2026-07-25',
    excerpt:
      'A ground-up deep dive into the Container Storage Interface - the gRPC contract, the controller/node split, and the full provision-attach-mount lifecycle.',
    tags: ['kubernetes', 'storage', 'devops'],
    url: `${BLOG_URL}/posts/2026/07/25/csi-drivers/`,
  },
  {
    slug: 'nat-explained',
    title: 'NAT, Demystified: From Your Home Router to Docker and Kubernetes',
    date: '2026-07-26',
    excerpt:
      'One idea - rewriting addresses in flight - quietly powers your home Wi-Fi, every Docker container, and the pod network in Kubernetes.',
    tags: ['networking', 'nat', 'kubernetes'],
    url: `${BLOG_URL}/posts/2026/07/26/nat-explained/`,
  },
]

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function stripHtml(value: string): string {
  return decodeEntities(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tagValues(block: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi')
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(block)) !== null) out.push(m[1])
  return out
}

function toIsoDate(pubDate: string | undefined): string {
  if (!pubDate) return ''
  const d = new Date(pubDate)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

function slugFromUrl(url: string): string {
  return url.replace(/[#?].*$/, '').replace(/\/+$/, '').split('/').pop() || url
}

function parseFeed(xml: string): PostMeta[] {
  const posts: PostMeta[] = []
  const itemRe = /<item\b[\s\S]*?<\/item>/gi
  let match: RegExpExecArray | null

  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[0]
    const rawLink = tagValues(block, 'link')[0] || ''
    const title = stripHtml(tagValues(block, 'title')[0] || '')
    const link = stripHtml(rawLink)
    if (!link || !title) continue

    const url = link.startsWith('http') ? link : `${BLOG_URL}${link}`
    const tags = tagValues(block, 'category').map(stripHtml).filter(Boolean)

    posts.push({
      slug: slugFromUrl(url),
      title,
      date: toIsoDate(stripHtml(tagValues(block, 'pubDate')[0] || '')),
      excerpt: stripHtml(tagValues(block, 'description')[0] || ''),
      tags,
      url,
    })
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    const res = await fetch(BLOG_FEED_URL, {
      headers: { 'user-agent': 'ksau-portfolio (build)' },
    })
    if (!res.ok) throw new Error(`feed responded ${res.status}`)
    const posts = parseFeed(await res.text())
    if (posts.length === 0) throw new Error('feed contained no items')
    return posts
  } catch {
    return FALLBACK
  }
}