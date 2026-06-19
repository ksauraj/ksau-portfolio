'use client'
import { useEffect, useRef } from 'react'
import {
  SiDocker, SiKubernetes, SiTerraform, SiPrometheus, SiGrafana,
  SiGo, SiPython, SiLinux, SiNginx, SiGithubactions, SiAnsible,
  SiHelm, SiMysql, SiGit, SiGooglecloud, SiHashicorp, SiGitlab,
  SiVim, SiYaml, SiJavascript, SiHtml5, SiAndroid,
  SiTypescript, SiPostgresql, SiRedis, SiCloudflare,
  SiNextdotjs, SiNodedotjs, SiReact, SiTailwindcss, SiOpenai,
  SiPostman, SiMongodb
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { VscAzure } from 'react-icons/vsc'

const TECH_ICONS = [
  { id: 'docker', Icon: SiDocker },
  { id: 'kubernetes', Icon: SiKubernetes },
  { id: 'terraform', Icon: SiTerraform },
  { id: 'aws', Icon: FaAws },
  { id: 'azure', Icon: VscAzure },
  { id: 'gcp', Icon: SiGooglecloud },
  { id: 'prometheus', Icon: SiPrometheus },
  { id: 'grafana', Icon: SiGrafana },
  { id: 'go', Icon: SiGo },
  { id: 'python', Icon: SiPython },
  { id: 'linux', Icon: SiLinux },
  { id: 'nginx', Icon: SiNginx },
  { id: 'ghactions', Icon: SiGithubactions },
  { id: 'ansible', Icon: SiAnsible },
  { id: 'helm', Icon: SiHelm },
  { id: 'mysql', Icon: SiMysql },
  { id: 'git', Icon: SiGit },
  { id: 'vault', Icon: SiHashicorp },
  { id: 'gitlab', Icon: SiGitlab },
  { id: 'vim', Icon: SiVim },
  { id: 'yaml', Icon: SiYaml },
  { id: 'js', Icon: SiJavascript },
  { id: 'html', Icon: SiHtml5 },
  { id: 'android', Icon: SiAndroid },
  { id: 'typescript', Icon: SiTypescript },
  { id: 'postgresql', Icon: SiPostgresql },
  { id: 'redis', Icon: SiRedis },
  { id: 'cloudflare', Icon: SiCloudflare },
  { id: 'nextjs', Icon: SiNextdotjs },
  { id: 'nodejs', Icon: SiNodedotjs },
  { id: 'react', Icon: SiReact },
  { id: 'tailwindcss', Icon: SiTailwindcss },
  { id: 'openai', Icon: SiOpenai },
  { id: 'postman', Icon: SiPostman },
  { id: 'mongodb', Icon: SiMongodb },
]

const NODE_SIZE = 36
const ICON_SIZE = NODE_SIZE * 0.72
const MIN_DIST = NODE_SIZE * 2.4

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

interface Props {
  terminalRect?: { left: number; top: number; right: number; bottom: number } | null
}

export default function FloatingTechIcons({ terminalRect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<TechNode[]>([])
  const elementRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const rafRef = useRef<number>(0)
  const sizeRef = useRef({ w: 0, h: 0 })
  const tRectRef = useRef(terminalRect)

  // Sync ref to avoid closing physics closure
  useEffect(() => { tRectRef.current = terminalRect }, [terminalRect])

  const initNodes = (w: number, h: number, tRect: typeof terminalRect) => {
    const pad = NODE_SIZE / 2
    nodesRef.current = TECH_ICONS.map((icon, i) => {
      let x = Math.random() * (w - 2 * pad) + pad
      let y = Math.random() * (h - 2 * pad) + pad

      if (tRect) {
        let attempts = 0
        const leftBound = tRect.left - pad
        const rightBound = tRect.right + pad
        const topBound = tRect.top - pad
        const bottomBound = tRect.bottom + pad

        while (x > leftBound && x < rightBound && y > topBound && y < bottomBound && attempts < 35) {
          x = Math.random() * (w - 2 * pad) + pad
          y = Math.random() * (h - 2 * pad) + pad
          attempts++
        }
      }

      return {
        id: icon.id,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        glowPhase: 'idle' as const,
        glowAlpha: 0,
        glowTimer: Math.floor(100 + i * 30 + Math.random() * 180),
      }
    })
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const measure = () => {
      const rect = container.getBoundingClientRect()
      const w = rect.width || 800
      const h = rect.height || 600
      if (Math.abs(w - sizeRef.current.w) > 20 || Math.abs(h - sizeRef.current.h) > 20) {
        sizeRef.current = { w, h }
        initNodes(w, h, tRectRef.current)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-initialize once terminal rect is measured
  useEffect(() => {
    if (!terminalRect) return
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const w = rect.width || 800
    const h = rect.height || 600
    sizeRef.current = { w, h }
    initNodes(w, h, terminalRect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminalRect])

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
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave) }
  }, [])

  useEffect(() => {
    const tick = () => {
      const container = containerRef.current
      if (!container || nodesRef.current.length === 0) { rafRef.current = requestAnimationFrame(tick); return }
      const rect = container.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const pad = NODE_SIZE / 2
      const mouse = mouseRef.current
      const REPEL_RADIUS = 120
      const REPEL_FORCE = 0.16
      const nodes = nodesRef.current
      const tRect = tRectRef.current

      const fx = new Float32Array(nodes.length)
      const fy = new Float32Array(nodes.length)

      // Node-to-node physics spacing
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
          if (dist < MIN_DIST) {
            const push = ((MIN_DIST - dist) / MIN_DIST) * 0.26
            const nx = dx / dist; const ny = dy / dist
            fx[i] += nx * push; fy[i] += ny * push
            fx[j] -= nx * push; fy[j] -= ny * push
          } else if (dist < MIN_DIST * 3) {
            const ideal = MIN_DIST * 2.0
            const drift = ((dist - ideal) / ideal) * 0.009
            const nx = dx / dist; const ny = dy / dist
            fx[i] -= nx * drift; fy[i] -= ny * drift
            fx[j] += nx * drift; fy[j] -= ny * drift
          }
        }
      }

      nodesRef.current = nodes.map((node, idx) => {
        let { vx, vy, x, y, glowPhase, glowAlpha, glowTimer } = node

        vx += (Math.random() - 0.5) * 0.018
        vy += (Math.random() - 0.5) * 0.018
        vx += fx[idx]; vy += fy[idx]

        // Mouse repulsion
        if (mouse.active) {
          const dx = x - mouse.x; const dy = y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < REPEL_RADIUS && dist > 1) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE
            vx += (dx / dist) * force; vy += (dy / dist) * force
          }
        }

        vx *= 0.97; vy *= 0.97
        const speed = Math.sqrt(vx * vx + vy * vy)
        if (speed > 0.65) { vx = (vx / speed) * 0.65; vy = (vy / speed) * 0.65 }

        x += vx; y += vy

        // Border constraints
        if (x < pad) { x = pad; vx = Math.abs(vx) * 0.7 }
        else if (x > w - pad) { x = w - pad; vx = -Math.abs(vx) * 0.7 }
        if (y < pad) { y = pad; vy = Math.abs(vy) * 0.7 }
        else if (y > h - pad) { y = h - pad; vy = -Math.abs(vy) * 0.7 }

        // Bouncing off the terminal container box
        if (tRect) {
          const leftBound = tRect.left - pad
          const rightBound = tRect.right + pad
          const topBound = tRect.top - pad
          const bottomBound = tRect.bottom + pad

          if (x > leftBound && x < rightBound && y > topBound && y < bottomBound) {
            const dLeft = x - leftBound
            const dRight = rightBound - x
            const dTop = y - topBound
            const dBottom = bottomBound - y

            const minDist = Math.min(dLeft, dRight, dTop, dBottom)
            if (minDist === dLeft) {
              x = leftBound
              vx = -Math.abs(vx) * 0.7
            } else if (minDist === dRight) {
              x = rightBound
              vx = Math.abs(vx) * 0.7
            } else if (minDist === dTop) {
              y = topBound
              vy = -Math.abs(vy) * 0.7
            } else {
              y = bottomBound
              vy = Math.abs(vy) * 0.7
            }
          }
        }

        // Glow phase animation logic
        if (glowPhase === 'idle') {
          if (--glowTimer <= 0) glowPhase = 'in'
        } else if (glowPhase === 'in') {
          glowAlpha += 0.03
          if (glowAlpha >= 1) { glowAlpha = 1; glowPhase = 'hold'; glowTimer = 25 + Math.floor(Math.random() * 35) }
        } else if (glowPhase === 'hold') {
          if (--glowTimer <= 0) glowPhase = 'out'
        } else if (glowPhase === 'out') {
          glowAlpha -= 0.02
          if (glowAlpha <= 0) { glowAlpha = 0; glowPhase = 'idle'; glowTimer = 200 + Math.floor(Math.random() * 550) }
        }

        const el = elementRefs.current[idx]
        if (el) {
          el.style.transform = `translate3d(${x - pad}px, ${y - pad}px, 0)`
          let proximityBoost = 0
          if (mouse.active) {
            const dx = x - mouse.x; const dy = y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < REPEL_RADIUS) proximityBoost = (1 - dist / REPEL_RADIUS) * 0.25
          }
          el.style.opacity = String(Math.min(0.85, 0.08 + glowAlpha * 0.42 + proximityBoost))
          const si = Math.min(1, glowAlpha + proximityBoost * 1.4)
          el.style.filter = si > 0.05
            ? `drop-shadow(0 0 ${Math.round(si * 14)}px rgba(255,255,255,${(si * 0.7).toFixed(2)}))`
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
            position: 'absolute', left: 0, top: 0,
            width: `${NODE_SIZE}px`, height: `${NODE_SIZE}px`,
            willChange: 'transform, opacity, filter',
            opacity: 0.08, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <icon.Icon size={ICON_SIZE} />
        </div>
      ))}
    </div>
  )
}
