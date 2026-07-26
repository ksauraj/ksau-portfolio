import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/date'

const SITE_URL = 'https://ksauraj.eu.org'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing on DevOps, Kubernetes, cloud infrastructure, SRE, and automation by Sauraj Kumar Singh (ksauraj).',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blog`,
    title: 'Blog | ksauraj',
    description:
      'Writing on DevOps, Kubernetes, cloud infrastructure, SRE, and automation.',
    images: ['/og-image.jpg'],
  },
}

export default function BlogIndex() {
  const posts = getAllPosts()

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: 'ksauraj — Blog',
    description:
      'Writing on DevOps, Kubernetes, cloud infrastructure, SRE, and automation.',
    author: { '@id': `${SITE_URL}/#person` },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      keywords: p.tags.join(', '),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <main className="relative min-h-screen bg-bg text-fg">
        <Navbar />
        <section className="pt-40 pb-32 px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="inline-flex border border-border px-3 py-1.5 mb-8">
                <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">
                  [ Blog ]
                </span>
              </div>
              <h1 className="font-display font-semibold text-fg text-5xl lg:text-6xl leading-tight mb-6">
                Notes from the terminal.
              </h1>
              <p className="font-body text-lg text-muted max-w-2xl mb-16">
                Deep dives on DevOps, Kubernetes, cloud infra, and the things I
                automate so nobody has to wake up at 3 AM.
              </p>
            </ScrollReveal>

            {posts.length === 0 ? (
              <p className="font-mono text-sm text-muted">
                No posts yet. Check back soon.
              </p>
            ) : (
              <div className="space-y-6 tile-group">
                {posts.map((post, i) => (
                  <ScrollReveal key={post.slug} delay={i * 0.08}>
                    <Link href={`/blog/${post.slug}`} className="block group">
                      <article className="card-hover-glare animate-tile-flicker border border-border bg-card p-8 transition-shadow duration-300">
                        <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs text-muted">
                          <span>{formatDate(post.date)}</span>
                          <span className="text-fg/20">·</span>
                          <span>{post.readingTime}</span>
                        </div>
                        <h2 className="font-display font-semibold text-fg text-2xl lg:text-3xl mb-3 group-hover:text-fg-dim transition-colors">
                          {post.title}
                        </h2>
                        <p className="font-body text-base text-muted leading-relaxed mb-6">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-xs border border-border text-muted px-2 py-1 select-none"
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
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
