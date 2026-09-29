import ScrollReveal from '@/components/ui/ScrollReveal'
import { getAllPosts } from '@/lib/blog'
import { BLOG_URL } from '@/lib/site'
import { formatDate } from '@/lib/date'

/**
 * Homepage "Latest Writing" cards. Server component: the posts are read
 * from the blog's RSS feed at build time and baked into the static HTML.
 * Each card links out to the post on the blog site.
 */
export default async function LatestBlogs() {
  const posts = await getAllPosts()
  if (posts.length === 0) return null

  const latest = posts.slice(0, 3)

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
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex font-mono text-xs text-muted hover:text-fg border border-border px-4 py-2.5 transition-colors"
            >
              [ View all → ]
            </a>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {latest.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.1}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group h-full"
              >
                <article
                  className="card-hover-glare animate-tile-flicker border border-border bg-card p-6 md:p-8 transition-shadow duration-300 h-full flex flex-col"
                  style={{
                    ['--flicker-dur' as string]: `${9 + i * 2}s`,
                    ['--flicker-delay' as string]: `${i * 1.5}s`,
                  } as React.CSSProperties}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs text-muted">
                    <span>{formatDate(post.date)}</span>
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
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile "View all" link */}
        <div className="mt-8 text-center sm:hidden">
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-mono text-xs text-muted hover:text-fg border border-border px-4 py-2.5 transition-colors"
          >
            [ View all posts → ]
          </a>
        </div>
      </div>
    </section>
  )
}
