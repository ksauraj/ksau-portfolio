'use client'

import { useEffect, useRef } from 'react'

interface BinaryPixelTransitionProps {
  active: boolean
  phase: 'reveal' | 'ripple'
  theme: 'dark' | 'light'
  origin?: { x: number; y: number }
  onComplete?: () => void
}

const MIN_DURATION = 2500
const MAX_DURATION = 3000
const RIPPLE_DURATION = 1800
const DESKTOP_CELL_SIZE = 11
const MOBILE_CELL_SIZE = 16

export default function BinaryPixelTransition({ active, phase, theme, origin, onComplete }: BinaryPixelTransitionProps) {
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
    const width = window.innerWidth
    const height = window.innerHeight
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
    const CELL_SIZE = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
    const originX = origin?.x ?? width / 2
    const originY = origin?.y ?? 32
    const columns = Math.ceil(width / CELL_SIZE) + 1
    const rows = Math.ceil(height / CELL_SIZE) + 1
    const bits = new Uint8Array(columns * rows)
    for (let i = 0; i < bits.length; i++) bits[i] = Math.random() > 0.5 ? 1 : 0
    const rippleCenters = phase === 'ripple'
      ? Array.from({ length: 7 }, () => ({
          x: width * (0.12 + Math.random() * 0.76),
          y: height * (0.12 + Math.random() * 0.76),
          delay: Math.random() * 260,
        }))
      : []


    canvas.width = Math.ceil(width * dpr)
    canvas.height = Math.ceil(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.font = "700 9px 'Space Mono', monospace"
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    let lastFrameAt = 0
    const draw = (now: number) => {
      if (isMobile && now - lastFrameAt < 1000 / 30) {
        frame = requestAnimationFrame(draw)
        return
      }
      lastFrameAt = now
      const rawProgress = Math.min((now - startedAt) / (phase === 'ripple' ? RIPPLE_DURATION : duration), 1)
      const progress = phase === 'reveal' ? 1 - (1 - rawProgress) ** 4 : rawProgress
      const maxRadius = Math.hypot(
        Math.max(originX, width - originX),
        Math.max(originY, height - originY),
      )
      const waveRadius = progress * maxRadius
      const waveWidth = phase === 'ripple'
        ? Math.max(CELL_SIZE * 3, Math.min(110, maxRadius * 0.1))
        : Math.max(CELL_SIZE * 3, Math.min(120, maxRadius * 0.12))
      context.clearRect(0, 0, width, height)

      for (let row = 0; row < rows; row++) {
        const y = row * CELL_SIZE + CELL_SIZE / 2
        for (let column = 0; column < columns; column++) {
          const x = column * CELL_SIZE + CELL_SIZE / 2
          const distance = Math.hypot(x - originX, y - originY)
          // Keep glyphs behind the reveal boundary: the new background arrives
          // first, then the binary crest follows it like the wake of a ripple.
          let waveGlow = 0
          if (phase === 'reveal') {
            const distanceToWave = waveRadius - distance
            if (distanceToWave < 0 || distanceToWave > waveWidth) continue
            waveGlow = Math.sin((distanceToWave / waveWidth) * Math.PI)
          } else {
            for (const centre of rippleCenters) {
              const rippleProgress = Math.max(0, Math.min(1, (now - startedAt - centre.delay) / RIPPLE_DURATION))
              const rippleRadius = rippleProgress * Math.hypot(
                Math.max(centre.x, width - centre.x),
                Math.max(centre.y, height - centre.y),
              )
              const distanceToRipple = rippleRadius - Math.hypot(x - centre.x, y - centre.y)
              if (distanceToRipple >= 0 && distanceToRipple <= waveWidth) {
                waveGlow = Math.max(waveGlow, Math.sin((distanceToRipple / waveWidth) * Math.PI))
              }
            }
            if (waveGlow === 0) continue
          }
          const baseAlpha = phase === 'ripple' ? waveGlow * 0.72 : 0.035 + waveGlow * 0.9
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
