'use client'

import { useEffect, useRef } from 'react'

interface BinaryPixelTransitionProps {
  active: boolean
  phase: 'reveal' | 'ripple'
  theme: 'dark' | 'light'
  origin?: { x: number; y: number }
  onComplete?: () => void
}

type RingCell = { x: number; y: number; distance: number; bit: 0 | 1; shimmer: number }
type RingField = { cells: RingCell[]; maxRadius: number; delay: number }

const MIN_DURATION = 1400
const MAX_DURATION = 1400
const RIPPLE_DURATION = 1200
const RIPPLE_CENTRES = 7
const DESKTOP_CELL_SIZE = 13
const MOBILE_CELL_SIZE = 18
const FRAME_INTERVAL = 1000 / 30

// Matches CSS cubic-bezier(0.22, 1, 0.36, 1). Solving x(t) first keeps
// the canvas crest on the compositor-driven View Transition boundary.
function cubicBezierProgress(progress: number) {
  const sample = (t: number, a: number, b: number) => {
    const mt = 1 - t
    return 3 * mt * mt * t * a + 3 * mt * t * t * b + t * t * t
  }
  let low = 0
  let high = 1
  for (let i = 0; i < 8; i++) {
    const middle = (low + high) / 2
    if (sample(middle, 0.22, 0.36) < progress) low = middle
    else high = middle
  }
  return sample((low + high) / 2, 1, 1)
}

function lowerBound(cells: RingCell[], distance: number) {
  let low = 0
  let high = cells.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if (cells[middle].distance < distance) low = middle + 1
    else high = middle
  }
  return low
}

function createRingField(
  center: { x: number; y: number },
  width: number,
  height: number,
  cellSize: number,
  delay = 0,
): RingField {
  const cells: RingCell[] = []
  const columns = Math.ceil(width / cellSize) + 1
  const rows = Math.ceil(height / cellSize) + 1
  for (let row = 0; row < rows; row++) {
    const y = row * cellSize + cellSize / 2
    for (let column = 0; column < columns; column++) {
      const x = column * cellSize + cellSize / 2
      cells.push({
        x,
        y,
        distance: Math.hypot(x - center.x, y - center.y),
        bit: Math.random() > 0.5 ? 1 : 0,
        shimmer: 0.68 + (((column * 17 + row * 31) % 7) / 7) * 0.32,
      })
    }
  }
  cells.sort((a, b) => a.distance - b.distance)
  return {
    cells,
    delay,
    maxRadius: Math.hypot(
      Math.max(center.x, width - center.x),
      Math.max(center.y, height - center.y),
    ),
  }
}

export default function BinaryPixelTransition({ active, phase, theme, origin, onComplete }: BinaryPixelTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !context) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      completeRef.current?.()
      return
    }

    const width = window.innerWidth
    const height = window.innerHeight
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
    const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25)
    const startedAt = performance.now()
    const requestedDuration = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--theme-transition-duration'),
    )
    const duration = Math.min(MAX_DURATION, Math.max(MIN_DURATION, requestedDuration || MIN_DURATION))

    const revealCenter = { x: origin?.x ?? width / 2, y: origin?.y ?? 32 }
    // Stratified jitter gives random centres without accidental clustering that
    // can make the effect appear absent over large parts of the viewport.
    const rippleCenters = Array.from({ length: RIPPLE_CENTRES }, (_, index) => {
      const column = index % 3
      const row = Math.floor(index / 3)
      return {
        x: width * ((column + 0.2 + Math.random() * 0.6) / 3),
        y: height * ((row + 0.2 + Math.random() * 0.6) / 3),
      }
    })
    const fields = phase === 'reveal'
      ? [createRingField(revealCenter, width, height, cellSize)]
      : rippleCenters.map((center, index) => createRingField(
          center,
          width,
          height,
          cellSize,
          (index % 3) * 70,
        ))

    canvas.width = Math.ceil(width * dpr)
    canvas.height = Math.ceil(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.font = `700 ${isMobile ? 9 : 10}px 'Space Mono', monospace`
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    const waveWidth = cellSize * (phase === 'ripple' ? 3 : 4)
    const rgb = theme === 'dark' ? '255,255,255' : '17,24,39'
    let frame = 0
    let lastFrameAt = -Infinity

    const drawRing = (field: RingField, radius: number, peakAlpha: number) => {
      const from = lowerBound(field.cells, Math.max(0, radius - waveWidth))
      const to = lowerBound(field.cells, radius)
      for (let index = from; index < to; index++) {
        const cell = field.cells[index]
        const crestPosition = (radius - cell.distance) / waveWidth
        const alpha = Math.sin(crestPosition * Math.PI) * peakAlpha * cell.shimmer
        if (alpha < 0.05) continue
        context.fillStyle = `rgba(${rgb},${alpha})`
        context.fillText(cell.bit ? '1' : '0', cell.x, cell.y)
      }
    }

    const draw = (now: number) => {
      if (now - lastFrameAt < FRAME_INTERVAL) {
        frame = requestAnimationFrame(draw)
        return
      }
      lastFrameAt = now
      context.clearRect(0, 0, width, height)
      const elapsed = now - startedAt
      const totalDuration = phase === 'ripple' ? RIPPLE_DURATION : duration
      const rawProgress = Math.min(elapsed / totalDuration, 1)

      for (const field of fields) {
        const localProgress = Math.max(0, Math.min(1, (elapsed - field.delay) / totalDuration))
        if (localProgress <= 0) continue
        const easedProgress = phase === 'reveal' ? cubicBezierProgress(localProgress) : localProgress
        drawRing(field, easedProgress * field.maxRadius, phase === 'ripple' ? 0.68 : 0.95)
      }

      if (rawProgress < 1) frame = requestAnimationFrame(draw)
      else {
        context.clearRect(0, 0, width, height)
        completeRef.current?.()
      }
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [active, phase, theme, origin?.x, origin?.y])

  if (!active) return null
  return <canvas ref={canvasRef} aria-hidden="true" className="binary-pixel-transition" />
}
