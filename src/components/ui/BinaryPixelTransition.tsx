'use client'

import { useEffect, useRef } from 'react'

interface BinaryPixelTransitionProps {
  active: boolean
  theme: 'dark' | 'light'
  origin?: { x: number; y: number }
  onComplete?: () => void
}

type Cell = { x: number; y: number; distance: number; bit: 0 | 1; shimmer: number }
type Ripple = { x: number; y: number; maxRadius: number; band: number; delay: number; cells: Cell[] }

const TRANSITION_DURATION = 1800
const RIPPLE_DURATION = 760
const RIPPLE_CENTRES = 7
const MIN_RIPPLE_RADIUS = 25
const MAX_RIPPLE_RADIUS = 30
const MIN_RIPPLE_BAND = 10
const MAX_RIPPLE_BAND = 15
const MAIN_DESKTOP_CELL_SIZE = 12
const MAIN_MOBILE_CELL_SIZE = 16
const DESKTOP_CELL_SIZE = 6
const MOBILE_CELL_SIZE = 8
const FRAME_INTERVAL = 1000 / 30

// Medium start, near-pause through the middle, fast finish.
function transitionProgress(progress: number) {
  if (progress < 0.35) return progress * 0.9
  if (progress < 0.7) return 0.315 + (progress - 0.35) * 0.12
  return 0.357 + ((progress - 0.7) / 0.3) ** 0.55 * 0.643
}

function transitionArrival(revealProgress: number) {
  if (revealProgress < 0.315) return revealProgress / 0.9
  if (revealProgress < 0.357) return 0.35 + (revealProgress - 0.315) / 0.12
  return 0.7 + ((revealProgress - 0.357) / 0.643) ** (1 / 0.55) * 0.3
}

function lowerBound(cells: Cell[], distance: number) {
  let low = 0
  let high = cells.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if (cells[middle].distance < distance) low = middle + 1
    else high = middle
  }
  return low
}

function createMainField(center: { x: number; y: number }, width: number, height: number, cellSize: number) {
  const cells: Cell[] = []
  const columns = Math.ceil(width / cellSize) + 1
  const rows = Math.ceil(height / cellSize) + 1
  for (let row = 0; row < rows; row++) {
    const y = row * cellSize + cellSize / 2
    for (let column = 0; column < columns; column++) {
      const x = column * cellSize + cellSize / 2
      cells.push({ x, y, distance: Math.hypot(x - center.x, y - center.y), bit: Math.random() > 0.5 ? 1 : 0, shimmer: 0.72 + (((column * 17 + row * 31) % 7) / 7) * 0.28 })
    }
  }
  cells.sort((a, b) => a.distance - b.distance)
  return cells
}

function createRipple(
  center: { x: number; y: number },
  width: number,
  height: number,
  cellSize: number,
  delay: number,
): Ripple {
  const maxRadius = MIN_RIPPLE_RADIUS + Math.random() * (MAX_RIPPLE_RADIUS - MIN_RIPPLE_RADIUS)
  const band = MIN_RIPPLE_BAND + Math.random() * (MAX_RIPPLE_BAND - MIN_RIPPLE_BAND)
  const cells: Cell[] = []
  const padding = cellSize * 1.5
  const left = Math.max(0, center.x - maxRadius - padding)
  const right = Math.min(width, center.x + maxRadius + padding)
  const top = Math.max(0, center.y - maxRadius - padding)
  const bottom = Math.min(height, center.y + maxRadius + padding)

  for (let y = top; y <= bottom; y += cellSize) {
    for (let x = left; x <= right; x += cellSize) {
      const distance = Math.hypot(x - center.x, y - center.y)
      if (distance <= maxRadius + band) {
        cells.push({
          x,
          y,
          distance,
          bit: Math.random() > 0.5 ? 1 : 0,
          shimmer: 0.72 + Math.random() * 0.28,
        })
      }
    }
  }
  return { ...center, maxRadius, band, delay, cells }
}

export default function BinaryPixelTransition({ active, theme, origin, onComplete }: BinaryPixelTransitionProps) {
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
    const mainCellSize = isMobile ? MAIN_MOBILE_CELL_SIZE : MAIN_DESKTOP_CELL_SIZE
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25)
    const startedAt = performance.now()
    const center = { x: origin?.x ?? width / 2, y: origin?.y ?? 32 }
    const maxRevealRadius = Math.hypot(
      Math.max(center.x, width - center.x),
      Math.max(center.y, height - center.y),
    )
    const rippleCenters = Array.from({ length: RIPPLE_CENTRES }, (_, index) => {
      const column = index % 3
      const row = Math.floor(index / 3)
      const x = width * ((column + 0.2 + Math.random() * 0.6) / 3)
      const y = height * ((row + 0.2 + Math.random() * 0.6) / 3)
      // A local ripple begins after the main reveal reaches its centre.
      const distanceFromOrigin = Math.hypot(x - center.x, y - center.y)
      const ripple = createRipple({ x, y }, width, height, cellSize, 0)
      const revealArrival = transitionArrival(Math.min(1, (distanceFromOrigin + ripple.maxRadius) / maxRevealRadius))
      ripple.delay = revealArrival * TRANSITION_DURATION
      return ripple
    })

    canvas.width = Math.ceil(width * dpr)
    canvas.height = Math.ceil(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.font = `700 ${isMobile ? 8 : 9}px 'Space Mono', monospace`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    const rgb = theme === 'dark' ? '255,255,255' : '17,24,39'
    let frame = 0
    let lastFrameAt = -Infinity

    const mainCells = createMainField(center, width, height, mainCellSize)
    const drawMainReveal = (radius: number) => {
      const revealBand = mainCellSize * 3
      const from = lowerBound(mainCells, Math.max(0, radius - revealBand))
      const to = lowerBound(mainCells, radius)
      for (let index = from; index < to; index++) {
        const cell = mainCells[index]
        const offset = radius - cell.distance
        const alpha = Math.sin((offset / revealBand) * Math.PI) * 0.7 * cell.shimmer
        if (alpha < 0.05) continue
        context.fillStyle = `rgba(${rgb},${alpha})`
        context.fillText(cell.bit ? '1' : '0', cell.x, cell.y)
      }
    }

    const drawLocalRipple = (ripple: Ripple, elapsed: number) => {
      const localElapsed = elapsed - ripple.delay
      if (localElapsed <= 0) return
      const rippleProgress = Math.min(localElapsed / RIPPLE_DURATION, 1)
      const rippleRadius = rippleProgress * ripple.maxRadius
      for (const cell of ripple.cells) {
        const offset = rippleRadius - cell.distance
        if (offset < 0 || offset > ripple.band) continue
        const intensity = Math.sin((offset / ripple.band) * Math.PI)
        const alpha = intensity * cell.shimmer * 0.95
        if (alpha < 0.08) continue
        context.fillStyle = `rgba(${rgb},${alpha})`
        context.fillText(cell.bit ? '1' : '0', cell.x, cell.y)
      }
    }

    const latestRippleEnd = Math.max(...rippleCenters.map((ripple) => ripple.delay + RIPPLE_DURATION))
    const animationEnd = Math.max(TRANSITION_DURATION, latestRippleEnd)

    const draw = (now: number) => {
      if (now - lastFrameAt < FRAME_INTERVAL) {
        frame = requestAnimationFrame(draw)
        return
      }
      lastFrameAt = now
      const elapsed = now - startedAt
      const progress = Math.min(elapsed / TRANSITION_DURATION, 1)
      context.clearRect(0, 0, width, height)
      drawMainReveal(transitionProgress(progress) * maxRevealRadius)
      for (const ripple of rippleCenters) drawLocalRipple(ripple, elapsed)
      if (elapsed < animationEnd) frame = requestAnimationFrame(draw)
      else {
        context.clearRect(0, 0, width, height)
        completeRef.current?.()
      }
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [active, theme, origin?.x, origin?.y])

  if (!active) return null
  return <canvas ref={canvasRef} aria-hidden="true" className="binary-pixel-transition" />
}
