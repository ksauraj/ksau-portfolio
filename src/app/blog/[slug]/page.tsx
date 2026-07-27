import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/sections/Navbar'
import { MarkdownContent } from '@/components/blog/MarkdownContent'
import ShareButton from '@/components/blog/ShareButton'
import ViewCounter from '@/components/blog/ViewCounter'
import RelatedPosts from '@/components/blog/RelatedPosts'
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog'
import { formatDate } from '@/lib/date'

const SITE_URL = 'https://ksauraj.eu.org'

export const dynamicParams = false

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  let post
  try {
    post = getPostBySlug(params.slug)
  } catch {
    return {}
  }
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags,
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      tags: post.tags,
      images: [post.cover || '/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.cover || '/og-image.jpg'],
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  let post
  try {
    post = getPostBySlug(params.slug)
  } catch {
    notFound()
  }

  const url = `${SITE_URL}/blog/${post.slug}`
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: url,
    image: post.cover ? `${SITE_URL}${post.cover}` : `${SITE_URL}/og-image.jpg`,
    keywords: post.tags.join(', '),
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` },
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <main className="relative min-h-screen bg-bg text-fg">
        <Navbar />
        <article className="pt-40 pb-16 px-8 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="font-mono text-xs text-muted hover:text-fg transition-colors inline-block mb-10"
            >
              [ ← back to blog ]
            </Link>

            <header className="mb-12 border-b border-border pb-10">
              <div className="flex flex-wrap items-center gap-3 mb-6 font-mono text-xs text-muted">
                <span>{formatDate(post.date)}</span>
                <span className="text-fg/20">·</span>
                <span>{post.readingTime}</span>
                <span className="text-fg/20 hidden sm:inline">·</span>
                <span className="hidden sm:inline">
                  <ViewCounter slug={post.slug} />
                </span>
                <span className="ml-auto">
                  <ShareButton url={url} title={post.title} />
                </span>
              </div>

              {/* Mobile view counter */}
              <div className="sm:hidden mb-4 font-mono text-xs text-muted">
                <ViewCounter slug={post.slug} />
              </div>

              <h1 className="font-display font-semibold text-fg text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
                {post.title}
              </h1>
              <p className="font-body text-base sm:text-lg text-muted leading-relaxed mb-6">
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
            </header>

            <div className="prose-blog">
              <MarkdownContent source={post.content} />
            </div>
          </div>
        </article>

        {/* Recommendations — replaces the normal footer on blog pages */}
        <RelatedPosts currentSlug={post.slug} currentTags={post.tags} />
      </main>
    </>
  )
}
