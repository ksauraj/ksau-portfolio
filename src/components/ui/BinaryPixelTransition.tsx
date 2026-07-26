'use client'

import { useEffect, useRef } from 'react'

interface BinaryPixelTransitionProps {
  active: boolean
  theme: 'dark' | 'light'
  onComplete?: () => void
}

const DURATION = 1450
const CELL_SIZE = 11

export default function BinaryPixelTransition({ active, theme, onComplete }: BinaryPixelTransitionProps) {
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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = window.innerWidth
    const height = window.innerHeight
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
      const progress = Math.min((now - startedAt) / DURATION, 1)
      const waveY = -height * 0.15 + progress * height * 1.3
      const waveWidth = Math.max(95, height * 0.13)
      context.clearRect(0, 0, width, height)

      for (let row = 0; row < rows; row++) {
        const y = row * CELL_SIZE + CELL_SIZE / 2
        const distance = Math.abs(y - waveY)
        const waveGlow = Math.max(0, 1 - distance / waveWidth)
        const baseAlpha = 0.035 + waveGlow * 0.72
        if (baseAlpha < 0.045) continue
        for (let column = 0; column < columns; column++) {
          const x = column * CELL_SIZE + CELL_SIZE / 2
          const bit = bits[row * columns + column]
          const shimmer = ((column * 17 + row * 31) % 7) / 7
          const alpha = Math.min(0.9, baseAlpha * (0.55 + shimmer * 0.45))
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
  }, [active, theme])

  if (!active) return null
  return <canvas ref={canvasRef} aria-hidden="true" className="binary-pixel-transition" />
}
