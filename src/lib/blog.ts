import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export { formatDate } from './date'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  cover?: string
  readingTime: string
}

export interface Post extends PostMeta {
  content: string
}

function ensureDir(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    // Skip docs/drafts: README and any _-prefixed file are not posts.
    .filter((f) => !/^_/.test(f) && !/^readme.mdx?$/i.test(f))
}

export function getAllPostSlugs(): string[] {
  return ensureDir().map((f) => f.replace(/\.mdx?$/, ''))
}

export function getPostBySlug(slug: string): Post {
  const files = ensureDir()
  const file =
    files.find((f) => f.replace(/\.mdx?$/, '') === slug) ?? `${slug}.md`
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
  const { data, content } = matter(raw)
  const rt =
    (data.readingTime as string) || readingTime(content).text

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? '',
    excerpt: (data.excerpt as string) ?? '',
    tags: (data.tags as string[]) ?? [],
    cover: (data.cover as string) || undefined,
    readingTime: rt,
    content,
  }
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...meta } = getPostBySlug(slug)
      return meta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}
