'use client'

import { useEffect, useState } from 'react'

interface ViewCounterProps {
  slug: string
}

const API_BASE = 'https://api.countapi.xyz'
const NAMESPACE = 'ksauraj-portfolio'

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const key = `blog-${slug}`

    // Try to increment. If the key doesn't exist, countapi auto-creates it.
    fetch(`${API_BASE}/hit/${NAMESPACE}/${key}`)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.value === 'number') setCount(data.value)
      })
      .catch(() => {
        // API unavailable — silently degrade
      })
  }, [slug])

  if (count === null) return null

  return (
    <span className="font-mono text-xs text-muted flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {count.toLocaleString()} views
    </span>
  )
}
