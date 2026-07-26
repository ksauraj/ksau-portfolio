'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'

// Client-side Mermaid renderer, themed to match the portfolio:
// pure-black canvas, white/grey strokes, Space Mono labels, subtle borders.
// Interactive: vertical resize, zoom buttons, pan (drag), wheel/pinch zoom.
let mermaidPromise: Promise<typeof import('mermaid').default> | null = null

function loadMermaid() {
  if (!mermaidPromise) mermaidPromise = import('mermaid').then((m) => m.default)
  return mermaidPromise
}

const diagramTheme = (theme: 'dark' | 'light') => {
  const light = theme === 'light'
  return {
    background: light ? '#F6F7F9' : '#000000',
    primaryColor: light ? '#FFFFFF' : '#0D0D0D',
    primaryBorderColor: light ? '#9CA3AF' : '#444444',
    primaryTextColor: light ? '#111827' : '#FFFFFF',
    secondaryColor: light ? '#EEF0F3' : '#080808',
    secondaryBorderColor: light ? '#D3D6DC' : '#1A1A1A',
    secondaryTextColor: light ? '#374151' : '#CCCCCC',
    tertiaryColor: light ? '#F6F7F9' : '#050505',
    tertiaryBorderColor: light ? '#D3D6DC' : '#1A1A1A',
    lineColor: light ? '#4B5563' : '#888888',
    textColor: light ? '#374151' : '#CCCCCC',
    mainBkg: light ? '#FFFFFF' : '#0D0D0D',
    nodeBorder: light ? '#9CA3AF' : '#444444',
    nodeTextColor: light ? '#111827' : '#FFFFFF',
    clusterBkg: light ? '#F6F7F9' : '#050505',
    clusterBorder: light ? '#D3D6DC' : '#1A1A1A',
    edgeLabelBackground: light ? '#F6F7F9' : '#000000',
    actorBkg: light ? '#FFFFFF' : '#0D0D0D',
    actorBorder: light ? '#9CA3AF' : '#444444',
    actorTextColor: light ? '#111827' : '#FFFFFF',
    signalColor: light ? '#4B5563' : '#888888',
    signalTextColor: light ? '#374151' : '#CCCCCC',
    labelBoxBkgColor: light ? '#FFFFFF' : '#0D0D0D',
    labelBoxBorderColor: light ? '#9CA3AF' : '#444444',
    labelTextColor: light ? '#111827' : '#FFFFFF',
    loopTextColor: light ? '#374151' : '#CCCCCC',
    noteBkgColor: light ? '#EEF0F3' : '#1A1A1A',
    noteBorderColor: light ? '#9CA3AF' : '#444444',
    noteTextColor: light ? '#111827' : '#FFFFFF',
    fontSize: '14px',
  }
}

let idCounter = 0

export default function Mermaid({ chart }: { chart: string }) {
  const { theme } = useTheme()
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [id] = useState(() => `mmd-${++idCounter}`)

  // transform state — scale=1 means "natural fit" (SVG fills container width via CSS)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const pinch = useRef<{ dist: number; scale: number } | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    loadMermaid()
      .then((mermaid) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          fontFamily: "'Space Mono', monospace",
          themeVariables: diagramTheme(theme),
        })
        return mermaid.render(`${id}-${theme}`, chart.trim())
      })
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg)
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message || e))
      })
    return () => {
      cancelled = true
    }
  }, [chart, id, theme])

  const clampScale = (s: number) => Math.min(4, Math.max(0.3, s))
  const zoomBy = useCallback((factor: number) => setScale((s) => clampScale(s * factor)), [])
  const reset = useCallback(() => {
    setScale(1)
    setTx(0)
    setTy(0)
  }, [])

  // Wheel: ctrl/cmd+wheel or trackpad pinch → zoom; plain wheel scrolls page.
  const onWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      setScale((s) => clampScale(s * factor))
    }
  }, [])

  // Pointer drag → pan
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setTx((v) => v + dx)
    setTy((v) => v + dy)
  }
  const endDrag = (e: React.PointerEvent) => {
    dragging.current = false
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
  }

  // Touch pinch-zoom (two fingers)
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]]
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      pinch.current = { dist, scale }
    }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinch.current) {
      e.preventDefault()
      const [a, b] = [e.touches[0], e.touches[1]]
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      setScale(clampScale(pinch.current.scale * (dist / pinch.current.dist)))
    }
  }
  const onTouchEnd = () => {
    pinch.current = null
  }

  if (error) {
    return (
      <pre className="text-xs text-red-400/80 border border-border bg-card p-4 rounded overflow-x-auto my-8">
        mermaid error: {error}
      </pre>
    )
  }

  return (
    <div className="my-8 border border-border bg-[#050505] rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-surface select-none">
        <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
          diagram
        </span>
        <div className="flex items-center gap-1">
          <ToolBtn label="Zoom out" onClick={() => zoomBy(0.83)}>–</ToolBtn>
          <span className="font-mono text-[11px] text-muted w-10 text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <ToolBtn label="Zoom in" onClick={() => zoomBy(1.2)}>+</ToolBtn>
          <ToolBtn label="Reset view" onClick={reset}>⟲</ToolBtn>
        </div>
      </div>

      {/* Resizable (vertical only), zoom/pannable viewport */}
      <div
        ref={viewportRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="mermaid-viewport relative w-full overflow-hidden touch-none"
        style={{
          height: 420,
          resize: 'vertical',
          cursor: dragging.current ? 'grabbing' : 'grab',
        }}
      >
        {svg ? (
          <div
            ref={diagramRef}
            className="mermaid-diagram absolute left-0 top-0 w-full h-full grid place-items-center"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: dragging.current ? 'none' : 'transform 0.08s ease-out',
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted">
            rendering diagram…
          </div>
        )}
      </div>
      <div className="border-t border-border px-3 py-1.5 bg-surface">
        <span className="font-mono text-[10px] text-muted/60">
          drag to pan · ctrl/⌘+scroll or pinch to zoom · drag bottom edge to resize
        </span>
      </div>
    </div>
  )
}

function ToolBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-7 h-7 grid place-items-center border border-border text-fg/70 hover:text-fg hover:border-fg/40 font-mono text-sm transition-colors"
    >
      {children}
    </button>
  )
}
