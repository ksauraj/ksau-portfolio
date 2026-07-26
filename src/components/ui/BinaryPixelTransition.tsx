'use client'

import { useEffect, useRef } from 'react'

interface BinaryPixelTransitionProps {
  active: boolean
  theme: 'dark' | 'light'
  origin?: { x: number; y: number }
  onComplete?: () => void
}

const MIN_DURATION = 2500
const MAX_DURATION = 3000
const CELL_SIZE = 11

export default function BinaryPixelTransition({ active, theme, origin, onComplete }: BinaryPixelTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      completeRef.current?.()
      return
    }

    let frame = 0
    const startedAt = performance.now()
    const requestedDuration = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--theme-transition-duration'),
    )
    const duration = Math.min(MAX_DURATION, Math.max(MIN_DURATION, requestedDuration || 2750))
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = window.innerWidth
    const height = window.innerHeight
    const originX = origin?.x ?? width / 2
    const originY = origin?.y ?? 32
    const columns = Math.ceil(width / CELL_SIZE) + 1
    const rows = Math.ceil(height / CELL_SIZE) + 1
    const bits = new Uint8Array(columns * rows)
    for (let i = 0; i < bits.length; i++) bits[i] = Math.random() > 0.5 ? 1 : 0


    canvas.width = Math.ceil(width * dpr)
    canvas.height = Math.ceil(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.font = "700 9px 'Space Mono', monospace"
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    const draw = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const maxRadius = Math.hypot(
        Math.max(originX, width - originX),
        Math.max(originY, height - originY),
      )
      const waveRadius = progress * maxRadius
      const waveWidth = Math.max(CELL_SIZE * 3, Math.min(120, maxRadius * 0.12))
      context.clearRect(0, 0, width, height)

      for (let row = 0; row < rows; row++) {
        const y = row * CELL_SIZE + CELL_SIZE / 2
        for (let column = 0; column < columns; column++) {
          const x = column * CELL_SIZE + CELL_SIZE / 2
          const distance = Math.hypot(x - originX, y - originY)
          // Keep glyphs behind the reveal boundary: the new background arrives
          // first, then the binary crest follows it like the wake of a ripple.
          const distanceToWave = waveRadius - distance
          if (distanceToWave < 0 || distanceToWave > waveWidth) continue
          const waveGlow = Math.sin((distanceToWave / waveWidth) * Math.PI)
          const baseAlpha = 0.035 + waveGlow * 0.9
          if (baseAlpha < 0.045) continue
          const bit = bits[row * columns + column]
          const shimmer = ((column * 17 + row * 31) % 7) / 7
          const alpha = Math.min(0.98, baseAlpha * (0.68 + shimmer * 0.32))
          context.fillStyle = theme === 'dark'
            ? `rgba(255,255,255,${alpha})`
            : `rgba(17,24,39,${alpha})`
          context.fillText(bit ? '1' : '0', x, y)
        }
      }

      if (progress < 1) frame = requestAnimationFrame(draw)
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
