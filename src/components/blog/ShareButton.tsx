'use client'

import { useRef, useState } from 'react'

interface ShareButtonProps {
  url: string
  title: string
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [glare, setGlare] = useState(false)
  const [supportsShare, setSupportsShare] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useState(() => {
    setSupportsShare(!!navigator.share)
  })

  const handleShare = async () => {
    if (supportsShare) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      return
    }
    setCopied(true)
    setGlare(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setGlare(false)
      setCopied(false)
    }, 1500)
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Link copied' : 'Share this post'}
      className="relative overflow-hidden font-mono text-xs text-muted hover:text-fg border border-border px-3 py-1.5 transition-colors duration-200 group"
    >
      <span className="relative z-10 flex items-center gap-1.5">
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </>
        )}
      </span>
      {/* Glare sweep on copy */}
      {glare && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 0%, rgb(255 255 255 / 0.08) 30%, rgb(255 255 255 / 0.18) 50%, rgb(255 255 255 / 0.08) 70%, transparent 100%)',
            transform: 'skewX(-20deg)',
            animation: 'copy-sweep 0.7s ease-out forwards',
          }}
        />
      )}
    </button>
  )
}
