import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import type { PluggableList } from 'unified'
import Mermaid from './Mermaid'
import CodeBlock from './CodeBlock'

// Custom components available inside every markdown post.
// Lets posts embed YouTube videos, raw video files, and callouts
// without writing JSX in the .md file (via directives/HTML passthrough).
const components = {
  // Native <video> passthrough keeps controls + lazy loading.
  video: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => (
    <video
      controls
      preload="metadata"
      className="w-full rounded-lg border border-border my-8"
      {...props}
    />
  ),
  // YouTube/embed iframes get a responsive 16:9 wrapper.
  iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => (
    <span className="block relative w-full my-8 rounded-lg overflow-hidden border border-border" style={{ paddingTop: '56.25%' }}>
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe className="absolute inset-0 w-full h-full" loading="lazy" {...props} />
    </span>
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // Static export → images stay plain <img>; unoptimized per next.config.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      loading="lazy"
      decoding="async"
      className="w-full rounded-lg border border-border my-8"
      alt={props.alt || ''}
      {...props}
    />
  ),
  // Every code block gets a copy button (with copy-glare effect).
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <CodeBlock {...props} />,
  // Wrap tables so they scroll horizontally on narrow screens instead of
  // overflowing off the viewport.
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
}

const prettyCodeOptions = {
  theme: { dark: 'github-dark', light: 'github-light' },
  keepBackground: false,
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      // Cast avoids a vfile version-mismatch typing clash between
      // rehype-pretty-code's bundled vfile and the top-level one.
      [rehypePrettyCode, prettyCodeOptions],
    ] as PluggableList,
  },
}

// Split the raw markdown on ```mermaid fenced blocks. Anything between them
// is normal markdown (rendered via MDXRemote); the mermaid blocks become
// <Mermaid> client diagrams. Doing the split on the raw source — before MDX
// runs — is bulletproof against rehype-pretty-code reshaping the code block.
const MERMAID_FENCE = /```mermaid\s*\n([\s\S]*?)```/g

interface Segment {
  type: 'md' | 'mermaid'
  content: string
}

function splitMermaid(source: string): Segment[] {
  const segments: Segment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  MERMAID_FENCE.lastIndex = 0
  while ((match = MERMAID_FENCE.exec(source)) !== null) {
    const before = source.slice(lastIndex, match.index)
    if (before.trim()) segments.push({ type: 'md', content: before })
    segments.push({ type: 'mermaid', content: match[1] })
    lastIndex = match.index + match[0].length
  }
  const rest = source.slice(lastIndex)
  if (rest.trim()) segments.push({ type: 'md', content: rest })
  return segments
}

export function MarkdownContent({ source }: { source: string }) {
  const segments = splitMermaid(source)
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'mermaid' ? (
          <Mermaid key={i} chart={seg.content} />
        ) : (
          <MDXRemote key={i} source={seg.content} components={components} options={mdxOptions} />
        )
      )}
    </>
  )
}
