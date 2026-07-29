'use client'

import { useEffect, useRef } from 'react'

interface BinaryPixelTransitionProps {
  active: boolean
  theme: 'dark' | 'light'
  origin?: { x: number; y: number }
  onComplete?: () => void
}

type Cell = {
  x: number
  y: number
  distance: number
  revealDistance: number
  bit: 0 | 1
  shimmer: number
  collisionFade: number
}

type Ripple = {
  x: number
  y: number
  band: number
  delay: number
  maxDistance: number
  cells: Cell[]
}

type RippleSeed = Pick<Ripple, 'x' | 'y' | 'band' | 'delay'>

const TRANSITION_DURATION = 1800
const RIPPLE_CENTRES = 7
const MIN_RIPPLE_BAND_CELLS = 12
const MAX_RIPPLE_BAND_CELLS = 20
const WAVE_SPEED = 0.28
const COLLISION_FADE_DISTANCE = 18
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
      cells.push({
        x,
        y,
        distance: Math.hypot(x - center.x, y - center.y),
        revealDistance: 0,
        bit: Math.random() > 0.5 ? 1 : 0,
        shimmer: 0.72 + (((column * 17 + row * 31) % 7) / 7) * 0.28,
        collisionFade: 1,
      })
    }
  }
  cells.sort((a, b) => a.distance - b.distance)
  return cells
}

function createCollisionFields(
  seeds: RippleSeed[],
  origin: { x: number; y: number },
  width: number,
  height: number,
  cellSize: number,
) {
  const ripples: Ripple[] = seeds.map((seed) => ({ ...seed, maxDistance: 0, cells: [] }))
  const columns = Math.ceil(width / cellSize) + 1
  const rows = Math.ceil(height / cellSize) + 1

  for (let row = 0; row < rows; row++) {
    const y = row * cellSize + cellSize / 2
    for (let column = 0; column < columns; column++) {
      const x = column * cellSize + cellSize / 2
      let ownerIndex = 0
      let ownerDistance = Infinity
      let firstArrival = Infinity
      let secondArrival = Infinity

      for (let index = 0; index < seeds.length; index++) {
        const distance = Math.hypot(x - seeds[index].x, y - seeds[index].y)
        const arrivalTime = seeds[index].delay + distance / WAVE_SPEED
        if (arrivalTime < firstArrival) {
          secondArrival = firstArrival
          firstArrival = arrivalTime
          ownerIndex = index
          ownerDistance = distance
        } else if (arrivalTime < secondArrival) {
          secondArrival = arrivalTime
        }
      }

      const collisionGap = (secondArrival - firstArrival) * WAVE_SPEED
      const cell: Cell = {
        x,
        y,
        distance: ownerDistance,
        revealDistance: Math.hypot(x - origin.x, y - origin.y),
        bit: Math.random() > 0.5 ? 1 : 0,
        shimmer: 0.72 + (((column * 17 + row * 31) % 7) / 7) * 0.28,
        collisionFade: Math.min(1, collisionGap / COLLISION_FADE_DISTANCE),
      }
      ripples[ownerIndex].cells.push(cell)
      ripples[ownerIndex].maxDistance = Math.max(ripples[ownerIndex].maxDistance, ownerDistance)
    }
  }

  for (const ripple of ripples) {
    ripple.cells.sort((a, b) => a.distance - b.distance)
  }
  return ripples
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

    const rippleSeeds: RippleSeed[] = Array.from({ length: RIPPLE_CENTRES }, (_, index) => {
      const column = index % 3
      const row = Math.floor(index / 3)
      const x = width * ((column + 0.2 + Math.random() * 0.6) / 3)
      const y = height * ((row + 0.2 + Math.random() * 0.6) / 3)
      const distanceFromOrigin = Math.hypot(x - center.x, y - center.y)
      const revealArrival = transitionArrival(Math.min(1, distanceFromOrigin / maxRevealRadius))
      const bandCells = MIN_RIPPLE_BAND_CELLS
        + Math.random() * (MAX_RIPPLE_BAND_CELLS - MIN_RIPPLE_BAND_CELLS)
      return {
        x,
        y,
        band: bandCells * cellSize,
        delay: revealArrival * TRANSITION_DURATION,
      }
    })
    const rippleCenters = createCollisionFields(rippleSeeds, center, width, height, cellSize)

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

    const drawLocalRipple = (ripple: Ripple, elapsed: number, revealedRadius: number) => {
      const localElapsed = elapsed - ripple.delay
      if (localElapsed <= 0) return
      const rippleRadius = localElapsed * WAVE_SPEED
      const from = lowerBound(ripple.cells, Math.max(0, rippleRadius - ripple.band))
      const to = lowerBound(ripple.cells, rippleRadius)
      for (let index = from; index < to; index++) {
        const cell = ripple.cells[index]
        if (cell.revealDistance > revealedRadius) continue
        const offset = rippleRadius - cell.distance
        const intensity = Math.sin((offset / ripple.band) * Math.PI)
        const alpha = intensity * cell.shimmer * cell.collisionFade * 0.95
        if (alpha < 0.08) continue
        context.fillStyle = `rgba(${rgb},${alpha})`
        context.fillText(cell.bit ? '1' : '0', cell.x, cell.y)
      }
    }

    const latestRippleEnd = Math.max(
      ...rippleCenters.map((ripple) => ripple.delay + (ripple.maxDistance + ripple.band) / WAVE_SPEED),
    )
    const animationEnd = Math.max(TRANSITION_DURATION, latestRippleEnd)

    const draw = (now: number) => {
      if (now - lastFrameAt < FRAME_INTERVAL) {
        frame = requestAnimationFrame(draw)
        return
      }
      lastFrameAt = now
      const elapsed = now - startedAt
      const progress = Math.min(elapsed / TRANSITION_DURATION, 1)
      const revealedRadius = transitionProgress(progress) * maxRevealRadius
      context.clearRect(0, 0, width, height)
      if (elapsed < TRANSITION_DURATION) drawMainReveal(revealedRadius)
      for (const ripple of rippleCenters) drawLocalRipple(ripple, elapsed, revealedRadius)
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
