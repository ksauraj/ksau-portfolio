'use client'
import { useRef, useState } from 'react'

interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string
  label: string
  copiedLabel?: string
  icon?: React.ReactNode
  copiedIcon?: React.ReactNode
  className?: string
}

export default function CopyButton({
  text,
  label,
  copiedLabel = 'Copied',
  icon,
  copiedIcon,
  className = '',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [glare, setGlare] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text)
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

  const defaultIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )

  const defaultCopiedIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? copiedLabel : label}
      className={`relative overflow-hidden font-mono text-xs text-muted hover:text-fg border border-border px-3 py-1.5 transition-colors duration-200 group ${className}`}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        {copied ? (
          <>{copiedIcon || defaultCopiedIcon} {copiedLabel}</>
        ) : (
          <>{icon || defaultIcon} {label}</>
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
