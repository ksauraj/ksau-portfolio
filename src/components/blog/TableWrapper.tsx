'use client'
import { useRef, useState } from 'react'

export default function TableWrapper({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & { children?: React.ReactNode }) {
  const tableRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [glare, setGlare] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const copyTable = async () => {
    if (!tableRef.current) return
    // Extract the table as plain-text markdown-ish format
    const table = tableRef.current.querySelector('table')
    if (!table) return
    const rows = table.querySelectorAll('tr')
    const lines: string[] = []
    rows.forEach((row, i) => {
      const cells = row.querySelectorAll('th, td')
      const values = Array.from(cells).map((c) => c.textContent?.trim() ?? '')
      lines.push(`| ${values.join(' | ')} |`)
      // Add separator after header row
      if (i === 0) {
        lines.push(`|${values.map(() => ' --- ').join('|')}|`)
      }
    })
    const text = lines.join('\n')
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

  return (
    <div className="table-wrapper-container relative group my-6">
      <button
        type="button"
        onClick={copyTable}
        aria-label={copied ? 'Copied' : 'Copy table'}
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
      {/* Glare sweep on copy */}
      {glare && (
        <span
          className="absolute left-0 top-0 w-full h-full z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 0%, rgb(255 255 255 / 0.08) 30%, rgb(255 255 255 / 0.18) 50%, rgb(255 255 255 / 0.08) 70%, transparent 100%)',
            transform: 'skewX(-20deg)',
            animation: 'copy-sweep 0.7s ease-out forwards',
          }}
        />
      )}
      <div ref={tableRef} className="table-scroll">
        <table {...props}>{children}</table>
      </div>
    </div>
  )
}
