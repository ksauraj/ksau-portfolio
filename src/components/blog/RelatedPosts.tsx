'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingTime: string
}

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
}

export default function RelatedPosts({ currentSlug, currentTags }: RelatedPostsProps) {
  const [posts, setPosts] = useState<PostMeta[]>([])

  useEffect(() => {
    // Fetch the full blog index (already served by our JSON route)
    fetch('/blog/index.json')
      .then((r) => r.json() as Promise<PostMeta[]>)
      .then((all) => {
        // Sort by tag overlap, exclude current, take top 2
        const scored = all
          .filter((p) => p.slug !== currentSlug)
          .map((p) => ({
            ...p,
            score: p.tags.filter((t) => currentTags.includes(t)).length,
          }))
          .sort((a, b) => b.score - a.score || (b.date > a.date ? 1 : -1))
          .slice(0, 2)
        setPosts(scored)
      })
      .catch(() => {
        // silent
      })
  }, [currentSlug, currentTags])

  if (posts.length === 0) return null

  return (
    <section className="border-t border-border pt-16 pb-24 mt-16">
      <div className="max-w-3xl mx-auto px-8 lg:px-0">
        <ScrollReveal>
          <div className="inline-flex border border-border px-3 py-1.5 mb-8">
            <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">
              [ Also Read ]
            </span>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.1}>
              <Link href={`/blog/${post.slug}`} className="block group h-full">
                <article className="card-hover-glare animate-tile-flicker border border-border bg-card p-6 transition-shadow duration-300 h-full flex flex-col"
                  style={{
                    ['--flicker-dur' as string]: '8s',
                    ['--flicker-delay' as string]: `${i * 2}s`,
                  } as React.CSSProperties}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3 font-mono text-xs text-muted">
                    <span>{post.date}</span>
                    <span className="text-fg/20">·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="font-display font-semibold text-fg text-lg mb-2 group-hover:text-fg-dim transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed mb-auto line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {post.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] border border-border text-muted px-2 py-0.5 select-none"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex font-mono text-xs text-muted hover:text-fg border border-border px-4 py-2.5 transition-colors"
          >
            [ Browse all posts → ]
          </Link>
        </div>
      </div>
    </section>
  )
}
