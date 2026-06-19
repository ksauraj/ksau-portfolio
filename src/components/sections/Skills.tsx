'use client'
import { useEffect, useRef, useState } from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import Marquee from '@/components/ui/Marquee'
import FloatingTechIcons from '@/components/ui/FloatingTechIcons'
import TerminalSkills from '@/components/ui/TerminalSkills'
import { marqueeItems } from '@/data/content'

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [terminalRect, setTerminalRect] = useState<{ left: number; top: number; right: number; bottom: number } | null>(null)

  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current || !terminalRef.current) return
      const sectionRect = sectionRef.current.getBoundingClientRect()
      const tRect = terminalRef.current.getBoundingClientRect()
      setTerminalRect({
        left: tRect.left - sectionRect.left,
        top: tRect.top - sectionRect.top,
        right: tRect.right - sectionRect.left,
        bottom: tRect.bottom - sectionRect.top
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (terminalRef.current) ro.observe(terminalRef.current)
    if (sectionRef.current) ro.observe(sectionRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="relative py-20 px-8 lg:px-16 border-t border-border bg-black">
      <div className="opacity-40">
        <FloatingTechIcons terminalRect={terminalRect} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="inline-flex border border-border px-3 py-1.5 mb-8">
            <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ Technical Skills ]</span>
          </div>
          <h2 className="font-display font-semibold text-white text-3xl lg:text-4xl leading-tight mb-14">
            Ask my terminal, not my resume.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="font-mono text-xs text-white/40 mb-3 text-left">
            {"This isn't a demo — it's running live. Switch to manual mode from bottom-right corner, and type a command if you want."}
          </div>
          <div ref={terminalRef}>
            <TerminalSkills />
          </div>
        </ScrollReveal>
      </div>

      <div className="relative z-10 mt-20">
        <Marquee items={marqueeItems} />
      </div>
    </section>
  )
}
