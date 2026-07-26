'use client'
import { useRef, useState } from 'react'

// Wraps rehype-pretty-code's <pre> with a copy button.
// On copy: shows a check + fires a one-shot glare sweep (matches the
// site's card-glare / btn-glare aesthetic).
export default function CodeBlock(
  props: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }
) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const [glare, setGlare] = useState(false)

  const copy = async () => {
    const text = preRef.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // fallback for non-secure contexts
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* noop */
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setGlare(true)
    window.setTimeout(() => setGlare(false), 700)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="code-block group relative my-6">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className={`absolute right-2 top-2 z-10 flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] transition-all duration-200 ${
          copied
            ? 'border-fg/40 text-fg bg-fg/5 opacity-100'
            : 'border-border text-fg/70 bg-card hover:text-fg hover:border-fg/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100'
        }`}
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            copied
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            copy
          </>
        )}
      </button>
      {/* one-shot glare sweep on successful copy */}
      {glare && <span className="code-copy-glare" aria-hidden="true" />}
      <pre ref={preRef} {...props} />
    </div>
  )
}
