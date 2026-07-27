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

export default function LatestBlogs() {
  const [posts, setPosts] = useState<PostMeta[]>([])

  useEffect(() => {
    fetch('/blog/index.json')
      .then((r) => r.json())
      .catch(() => {
        // Fallback: grab from the page if embedded
        const el = document.getElementById('__BLOG_INDEX__')
        if (el) {
          try {
            setPosts(JSON.parse(el.textContent || '[]').slice(0, 3))
          } catch {
            // silent
          }
        }
      })
      .then((data: PostMeta[]) => setPosts(data.slice(0, 3)))
  }, [])

  if (posts.length === 0) return null

  return (
    <section
      id="latest-blogs"
      aria-label="Latest blog posts"
      className="py-32 px-8 lg:px-16 border-t border-border bg-bg relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex border border-border px-3 py-1.5 mb-8">
                <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">
                  [ Latest Writing ]
                </span>
              </div>
              <h2 className="font-display font-semibold text-fg text-5xl lg:text-6xl leading-tight">
                Notes from<br />the terminal.
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex font-mono text-xs text-muted hover:text-fg border border-border px-4 py-2.5 transition-colors"
            >
              [ View all → ]
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.1}>
              <Link href={`/blog/${post.slug}`} className="block group h-full">
                <article className="card-hover-glare animate-tile-flicker border border-border bg-card p-6 md:p-8 transition-shadow duration-300 h-full flex flex-col"
                  style={{
                    ['--flicker-dur' as string]: `${9 + i * 2}s`,
                    ['--flicker-delay' as string]: `${i * 1.5}s`,
                  } as React.CSSProperties}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs text-muted">
                    <span>{post.date}</span>
                    <span className="text-fg/20">·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="font-display font-semibold text-fg text-xl mb-3 group-hover:text-fg-dim transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed mb-auto line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {post.tags.slice(0, 3).map((t) => (
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

        {/* Mobile "View all" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex font-mono text-xs text-muted hover:text-fg border border-border px-4 py-2.5 transition-colors"
          >
            [ View all posts → ]
          </Link>
        </div>
      </div>
    </section>
  )
}
