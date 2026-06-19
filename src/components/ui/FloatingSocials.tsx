'use client'
import { useEffect, useRef } from 'react'
import { personalInfo, animationConfig } from '@/data/content'

interface SocialNode {
  name: string
  link: string
  icon: React.ReactNode
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

const socialIcons: Record<string, React.ReactNode> = {
  github: <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>,
  telegram: <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/></svg>,
  youtube: <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  gitlab: <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M22.65 14.39L12 22.13 1.35 14.39a.83.83 0 0 1-.3-.92l2.36-7.26a.83.83 0 0 1 .79-.58h3.31l2.92 9h3.14l2.92-9h3.31a.83.83 0 0 1 .79.58l2.36 7.26a.83.83 0 0 1-.3.92z"/></svg>,
  gmail: <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.664 0-8.43-3.766-8.43-8.43s3.766-8.43 8.43-8.43c2.257 0 4.3.82 5.89 2.41l3.18-3.18C18.665 1.583 15.65.6 12.24.6 5.866.6.69 5.776.69 12.15s5.176 11.55 11.55 11.55c6.666 0 11.087-4.686 11.087-11.282 0-.765-.082-1.344-.224-2.133H12.24z"/></svg>,
  twitter: <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  instagram: <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  linkedin: <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
  website: <svg className="w-8 h-8 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
}

const socialData = personalInfo.socials.map((s) => ({
  name: s.label,
  link: s.href,
  icon: socialIcons[s.label.toLowerCase()] || socialIcons['website'],
}))

function getDistanceToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const l2 = dx * dx + dy * dy
  if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)
  let t = ((px - x1) * dx + (py - y1) * dy) / l2
  t = Math.max(0, Math.min(1, t))
  return Math.sqrt((px - (x1 + t * dx)) ** 2 + (py - (y1 + t * dy)) ** 2)
}

export default function FloatingSocials() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elementRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const nodesRef = useRef<SocialNode[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const activeGlowsRef = useRef<{
    n1Index: number
    n2Index: number
    alpha: number
    phase: 'in' | 'out'
  }[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const w = rect.width || 500
    const h = rect.height || 500

    const R = animationConfig.socials.layoutRadius
    const leftBound = Math.max(80 / 2, (1 / 11) * w)
    const rightBound = Math.min(w - 80 / 2, (9 / 11) * w)

    // Center of bounds
    const boundsCenterX = (leftBound + rightBound) / 2
    const boundsCenterY = h / 2

    const n = socialData.length
    const offsets: { dx: number; dy: number }[] = []

    if (n % 2 === 0) {
      // Even number of nodes: Dual centers (first 2 nodes) + Elliptical outer ring (n - 2 nodes)
      const d = R * 0.4 // distance of focus points from center
      offsets.push({ dx: -d, dy: 0 })
      offsets.push({ dx: d, dy: 0 })

      const outerCount = n - 2
      const a = R * 1.2 // Horizontal radius of the ellipse
      const b = R * 0.9 // Vertical radius of the ellipse
      for (let k = 0; k < outerCount; k++) {
        const angle = (k * 2 * Math.PI) / outerCount
        offsets.push({
          dx: a * Math.cos(angle),
          dy: b * Math.sin(angle),
        })
      }
    } else {
      // Odd number of nodes: Single center (first node) + Circular outer ring (n - 1 nodes)
      offsets.push({ dx: 0, dy: 0 })

      const outerCount = n - 1
      for (let k = 0; k < outerCount; k++) {
        const angle = (k * 2 * Math.PI) / outerCount
        offsets.push({
          dx: R * Math.cos(angle),
          dy: R * Math.sin(angle),
        })
      }
    }

    // Centering calculations
    let minDx = 0
    let maxDx = 0
    let minDy = 0
    let maxDy = 0
    offsets.forEach(off => {
      if (off.dx < minDx) minDx = off.dx
      if (off.dx > maxDx) maxDx = off.dx
      if (off.dy < minDy) minDy = off.dy
      if (off.dy > maxDy) maxDy = off.dy
    })

    const hcCenterX = (minDx + maxDx) / 2
    const hcCenterY = (minDy + maxDy) / 2

    const cx = boundsCenterX - hcCenterX
    const cy = boundsCenterY - hcCenterY

    const initialNodes = socialData.map((d, index) => {
      const offset = offsets[index] || { dx: (Math.random() - 0.5) * R, dy: (Math.random() - 0.5) * R }
      const x = cx + offset.dx
      const y = cy + offset.dy

      return {
        ...d,
        x,
        y,
        vx: 0, // start static in clean structure
        vy: 0,
        size: 80,
      }
    })
    nodesRef.current = initialNodes

    initialNodes.forEach((node, idx) => {
      const el = elementRefs.current[idx]
      if (el) {
        el.style.transform = `translate3d(${node.x - node.size / 2}px, ${node.y - node.size / 2}px, 0)`
      }
    })
  }, [])

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const padding = 150
      if (
        x >= -padding &&
        x <= rect.width + padding &&
        y >= -padding &&
        y <= rect.height + padding
      ) {
        mouseRef.current = { x, y, active: true }
      } else {
        mouseRef.current.active = false
      }
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove)
  }, [])

  useEffect(() => {
    let animationId: number

    const updatePhysics = () => {
      if (!containerRef.current || nodesRef.current.length === 0) {
        animationId = requestAnimationFrame(updatePhysics)
        return
      }

      const rect = containerRef.current.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const mouse = mouseRef.current
      const nodes = nodesRef.current

      let closestIdx = -1
      let minDist = Infinity

      if (mouse.active) {
        nodes.forEach((node, idx) => {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < minDist) {
            minDist = dist
            closestIdx = idx
          }
        })
      }

      const maxGlows = animationConfig.socials.maxSimultaneousGlows
      const activeGlows = activeGlowsRef.current

      // Spawn a new glow if under the limit
      if (activeGlows.length < maxGlows && Math.random() < animationConfig.socials.glowSpawnProbability) {
        const candidatePairs: [number, number][] = []
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x
            const dy = nodes[i].y - nodes[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < animationConfig.socials.maxConnectionDist) {
              const isAlreadyGlowing = activeGlows.some(
                g => (g.n1Index === i && g.n2Index === j) || (g.n1Index === j && g.n2Index === i)
              )
              if (!isAlreadyGlowing) {
                candidatePairs.push([i, j])
              }
            }
          }
        }
        if (candidatePairs.length > 0) {
          const [p1, p2] = candidatePairs[Math.floor(Math.random() * candidatePairs.length)]
          activeGlows.push({
            n1Index: p1,
            n2Index: p2,
            alpha: 0,
            phase: 'in'
          })
        }
      }

      // Update active random line glow animation
      activeGlowsRef.current = activeGlows.map(glow => {
        const n1 = nodes[glow.n1Index]
        const n2 = nodes[glow.n2Index]
        if (!n1 || !n2) return null

        const dx = n1.x - n2.x
        const dy = n1.y - n2.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > animationConfig.socials.maxConnectionDist) return null

        if (glow.phase === 'in') {
          glow.alpha += 0.016
          if (glow.alpha >= animationConfig.socials.randomGlowIntensity) {
            glow.alpha = animationConfig.socials.randomGlowIntensity
            glow.phase = 'out'
          }
        } else {
          glow.alpha -= 0.012
          if (glow.alpha <= 0) return null
        }
        return glow
      }).filter((g): g is NonNullable<typeof g> => g !== null)

      // Draw mesh lines connecting nodes on the canvas
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w
            canvas.height = h
          }
          ctx.clearRect(0, 0, w, h)

          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const n1 = nodes[i]
              const n2 = nodes[j]
              const dx = n1.x - n2.x
              const dy = n1.y - n2.y
              const dist = Math.sqrt(dx * dx + dy * dy)

              if (dist < animationConfig.socials.maxConnectionDist) {
                const proximity = 1 - dist / animationConfig.socials.maxConnectionDist
                let alpha = proximity * animationConfig.socials.baseLineOpacity
                let lineWidth = 0.5

                if (mouse.active) {
                  const mouseDist = getDistanceToSegment(mouse.x, mouse.y, n1.x, n1.y, n2.x, n2.y)
                  // If cursor is near this line segment, activate it
                  if (mouseDist < animationConfig.socials.mouseSegmentThreshold) {
                    const glowFactor = 1 - mouseDist / animationConfig.socials.mouseSegmentThreshold
                    alpha += glowFactor * animationConfig.socials.mouseGlowIntensity
                    lineWidth = 0.5 + glowFactor * 1.0
                  }
                }

                // Apply active random line glow if it matches the current segment
                const currentGlows = activeGlowsRef.current
                const match = currentGlows.find(
                  g => (g.n1Index === i && g.n2Index === j) || (g.n1Index === j && g.n2Index === i)
                )
                if (match) {
                  alpha += match.alpha
                  lineWidth = Math.max(lineWidth, 0.5 + (match.alpha / animationConfig.socials.randomGlowIntensity) * 1.0)
                }

                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
                ctx.lineWidth = lineWidth
                ctx.beginPath()
                ctx.moveTo(n1.x, n1.y)
                ctx.lineTo(n2.x, n2.y)
                ctx.stroke()
              }
            }
          }
        }
      }

      nodesRef.current = nodes.map((node, idx) => {
        let vx = node.vx
        let vy = node.vy

        vx += (Math.random() - 0.5) * 0.04
        vy += (Math.random() - 0.5) * 0.04

        let isAttracted = false
        if (idx === closestIdx && mouse.active) {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const threshold = 220

          if (dist < threshold && dist > 10) {
            isAttracted = true
            const force = (threshold - dist) / threshold * 0.22
            vx += (dx / dist) * force
            vy += (dy / dist) * force
          }
        }

        vx *= 0.98
        vy *= 0.98

        const speed = Math.sqrt(vx * vx + vy * vy)
        const baseMaxSpeed = 0.8
        const maxSpeed = isAttracted ? baseMaxSpeed * 2.5 : baseMaxSpeed
        if (speed > maxSpeed) {
          vx = (vx / speed) * maxSpeed
          vy = (vy / speed) * maxSpeed
        }

        let x = node.x + vx
        let y = node.y + vy

        const pad = node.size / 2
        // Restrict horizontal bounds to 50% left screen and 90% right screen
        const leftBound = Math.max(pad, (1 / 11) * w)
        const rightBound = Math.min(w - pad, (9 / 11) * w)

        if (x < leftBound) {
          x = leftBound
          vx = Math.abs(vx) * 0.8
        } else if (x > rightBound) {
          x = rightBound
          vx = -Math.abs(vx) * 0.8
        }

        if (y < pad) {
          y = pad
          vy = Math.abs(vy) * 0.8
        } else if (y > h - pad) {
          y = h - pad
          vy = -Math.abs(vy) * 0.8
        }

        const el = elementRefs.current[idx]
        if (el) {
          el.style.transform = `translate3d(${x - node.size / 2}px, ${y - node.size / 2}px, 0)`
        }

        return { ...node, x, y, vx, vy }
      })

      animationId = requestAnimationFrame(updatePhysics)
    }

    animationId = requestAnimationFrame(updatePhysics)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div
      ref={containerRef}
      className="hidden md:block absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {socialData.map((node, idx) => (
        <a
          key={node.name}
          ref={(el) => {
            elementRefs.current[idx] = el
          }}
          href={node.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '80px',
            height: '80px',
            willChange: 'transform',
            zIndex: 10,
          }}
          className="rounded-full bg-white/5 border border-white/10 hover:border-white/50 hover:bg-white hover:text-black flex items-center justify-center text-white/60 transition-colors duration-300 backdrop-blur-[2px] shadow-sm pointer-events-auto cursor-pointer"
          title={node.name}
        >
          {node.icon}
        </a>
      ))}
    </div>
  )
}
