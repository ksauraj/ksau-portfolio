'use client'
import { useEffect, useRef } from 'react'
import {
  SiDocker, SiKubernetes, SiTerraform, SiPrometheus, SiGrafana,
  SiGo, SiPython, SiLinux, SiNginx, SiGithubactions, SiAnsible,
  SiHelm, SiMysql, SiGit, SiGooglecloud, SiHashicorp, SiGitlab,
  SiVim, SiYaml, SiJavascript, SiHtml5, SiAndroid
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { VscAzure } from 'react-icons/vsc'

const TECH_ICONS = [
  { id: 'docker',     Icon: SiDocker },
  { id: 'kubernetes', Icon: SiKubernetes },
  { id: 'terraform',  Icon: SiTerraform },
  { id: 'aws',        Icon: FaAws },
  { id: 'azure',      Icon: VscAzure },
  { id: 'gcp',        Icon: SiGooglecloud },
  { id: 'prometheus', Icon: SiPrometheus },
  { id: 'grafana',    Icon: SiGrafana },
  { id: 'go',         Icon: SiGo },
  { id: 'python',     Icon: SiPython },
  { id: 'linux',      Icon: SiLinux },
  { id: 'nginx',      Icon: SiNginx },
  { id: 'ghactions',  Icon: SiGithubactions },
  { id: 'ansible',    Icon: SiAnsible },
  { id: 'helm',       Icon: SiHelm },
  { id: 'mysql',      Icon: SiMysql },
  { id: 'git',        Icon: SiGit },
  { id: 'vault',      Icon: SiHashicorp },
  { id: 'gitlab',     Icon: SiGitlab },
  { id: 'vim',        Icon: SiVim },
  { id: 'yaml',       Icon: SiYaml },
  { id: 'js',         Icon: SiJavascript },
  { id: 'html',       Icon: SiHtml5 },
  { id: 'android',    Icon: SiAndroid },
]

const NODE_SIZE = 72
const ICON_SIZE = NODE_SIZE * 0.72
const MIN_DIST = NODE_SIZE * 1.7   // minimum gap between icon centers
// Marquee strip height + section pb-32 (128px) ≈ 56 + 128 = 184px from section bottom.
// Add extra breathing room → icons must stay above y = h - BOTTOM_GUARD.
const BOTTOM_GUARD = 200
const TOP_GUARD = NODE_SIZE / 2

interface TechNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  glowPhase: 'idle' | 'in' | 'hold' | 'out'
  glowAlpha: number
  glowTimer: number
}

function buildGrid(n: number, w: number, h: number): { x: number; y: number }[] {
  const usableH = h - TOP_GUARD - BOTTOM_GUARD
  if (usableH <= 0) return Array.from({ length: n }, () => ({ x: w / 2, y: h / 2 }))

  // Aspect-ratio-aware column count so cells are roughly square
  const cols = Math.max(1, Math.round(Math.sqrt(n * (w / usableH))))
  const rows = Math.ceil(n / cols)
  const cellW = w / cols
  const cellH = usableH / rows

  return Array.from({ length: n }, (_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    // Jitter within 60% of the cell, centred, so icons don't land on cell edges
    const jitterX = (Math.random() - 0.5) * cellW * 0.6
    const jitterY = (Math.random() - 0.5) * cellH * 0.6
    return {
      x: cellW * (col + 0.5) + jitterX,
      y: TOP_GUARD + cellH * (row + 0.5) + jitterY,
    }
  })
}

export default function FloatingTechIcons() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<TechNode[]>([])
  const elementRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const rafRef = useRef<number>(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  const initNodes = (w: number, h: number) => {
    const positions = buildGrid(TECH_ICONS.length, w, h)
    nodesRef.current = TECH_ICONS.map((icon, i) => ({
      id: icon.id,
      x: positions[i].x,
      y: positions[i].y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      glowPhase: 'idle' as const,
      glowAlpha: 0,
      glowTimer: Math.floor(120 + i * 35 + Math.random() * 200),
    }))
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const rect = container.getBoundingClientRect()
      const w = rect.width || 800
      const h = rect.height || 600
      // Re-init only if size changed significantly (e.g. first real layout)
      if (Math.abs(w - sizeRef.current.w) > 20 || Math.abs(h - sizeRef.current.h) > 20) {
        sizeRef.current = { w, h }
        initNodes(w, h)
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
    }
    const onLeave = () => { mouseRef.current.active = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      const container = containerRef.current
      if (!container || nodesRef.current.length === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const rect = container.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const pad = NODE_SIZE / 2
      const mouse = mouseRef.current
      const REPEL_RADIUS = 180
      const REPEL_FORCE = 0.2
      const nodes = nodesRef.current

      // Bottom bound: above the marquee strip
      const bottomBound = h - BOTTOM_GUARD
      // Top bound
      const topBound = TOP_GUARD

      // Inter-node forces (O(n²), n=24 → 276 pairs ≈ trivial)
      const fx = new Float32Array(nodes.length)
      const fy = new Float32Array(nodes.length)

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01

          if (dist < MIN_DIST) {
            // Hard push-apart to prevent overlap
            const push = ((MIN_DIST - dist) / MIN_DIST) * 0.28
            const nx = dx / dist
            const ny = dy / dist
            fx[i] += nx * push; fy[i] += ny * push
            fx[j] -= nx * push; fy[j] -= ny * push
          } else if (dist < MIN_DIST * 3) {
            // Soft spread to keep max distance roughly even
            const ideal = MIN_DIST * 2.0
            const drift = ((dist - ideal) / ideal) * 0.010
            const nx = dx / dist
            const ny = dy / dist
            fx[i] -= nx * drift; fy[i] -= ny * drift
            fx[j] += nx * drift; fy[j] += ny * drift
          }
        }
      }

      nodesRef.current = nodes.map((node, idx) => {
        let { vx, vy, x, y, glowPhase, glowAlpha, glowTimer } = node

        vx += (Math.random() - 0.5) * 0.022
        vy += (Math.random() - 0.5) * 0.022
        vx += fx[idx]
        vy += fy[idx]

        if (mouse.active) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < REPEL_RADIUS && dist > 1) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE
            vx += (dx / dist) * force
            vy += (dy / dist) * force
          }
        }

        vx *= 0.97; vy *= 0.97
        const speed = Math.sqrt(vx * vx + vy * vy)
        const maxSpeed = 0.8
        if (speed > maxSpeed) { vx = (vx / speed) * maxSpeed; vy = (vy / speed) * maxSpeed }

        x += vx; y += vy

        // Hard bounds — left/right use pad, top uses TOP_GUARD, bottom uses BOTTOM_GUARD
        if (x < pad)          { x = pad;          vx = Math.abs(vx) * 0.7 }
        else if (x > w - pad) { x = w - pad;      vx = -Math.abs(vx) * 0.7 }
        if (y < topBound)     { y = topBound;     vy = Math.abs(vy) * 0.7 }
        else if (y > bottomBound) { y = bottomBound; vy = -Math.abs(vy) * 0.7 }

        // Glow state machine
        if (glowPhase === 'idle') {
          if (--glowTimer <= 0) glowPhase = 'in'
        } else if (glowPhase === 'in') {
          glowAlpha += 0.035
          if (glowAlpha >= 1) { glowAlpha = 1; glowPhase = 'hold'; glowTimer = 30 + Math.floor(Math.random() * 40) }
        } else if (glowPhase === 'hold') {
          if (--glowTimer <= 0) glowPhase = 'out'
        } else if (glowPhase === 'out') {
          glowAlpha -= 0.022
          if (glowAlpha <= 0) { glowAlpha = 0; glowPhase = 'idle'; glowTimer = 180 + Math.floor(Math.random() * 500) }
        }

        const el = elementRefs.current[idx]
        if (el) {
          el.style.transform = `translate3d(${x - pad}px, ${y - pad}px, 0)`

          let proximityBoost = 0
          if (mouse.active) {
            const dx = x - mouse.x; const dy = y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < REPEL_RADIUS) proximityBoost = (1 - dist / REPEL_RADIUS) * 0.28
          }

          el.style.opacity = String(Math.min(0.9, 0.1 + glowAlpha * 0.45 + proximityBoost))

          const si = Math.min(1, glowAlpha + proximityBoost * 1.5)
          el.style.filter = si > 0.05
            ? `drop-shadow(0 0 ${Math.round(si * 22)}px rgba(255,255,255,${(si * 0.8).toFixed(2)})) drop-shadow(0 0 ${Math.round(si * 8)}px rgba(255,255,255,${(si * 0.5).toFixed(2)}))`
            : 'none'
        }

        return { ...node, x, y, vx, vy, glowPhase, glowAlpha, glowTimer }
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {TECH_ICONS.map((icon, idx) => (
        <div
          key={icon.id}
          ref={(el) => { elementRefs.current[idx] = el }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${NODE_SIZE}px`,
            height: `${NODE_SIZE}px`,
            willChange: 'transform, opacity, filter',
            opacity: 0.1,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <icon.Icon size={ICON_SIZE} />
        </div>
      ))}
    </div>
  )
}
