'use client'
import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { experiences } from '@/data/content'

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-8 lg:px-16 border-t border-border bg-black">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="inline-flex border border-border px-3 py-1.5 mb-8">
            <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ Experience ]</span>
          </div>
          <h2 className="font-display font-semibold text-white text-5xl lg:text-6xl leading-tight mb-16">
            Where I&apos;ve shipped<br />real infrastructure.
          </h2>
        </ScrollReveal>

        <div className="space-y-6 tile-group">
          {experiences.map((exp, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card-hover-glare animate-tile-flicker border border-border bg-card p-8 transition-shadow duration-300"
                style={{
                  ['--flicker-dur' as string]: `${7 + (i % 3) * 2}s`,
                  ['--flicker-delay' as string]: `${(i * 1.7 + 0.5) % 8}s`,
                } as React.CSSProperties}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
                  <div>
                    <h3 className="font-display font-semibold text-white text-xl">{exp.role}</h3>
                    <p className="font-mono text-sm text-muted mt-1">{exp.company} · {exp.type}</p>
                  </div>
                  <span className="font-mono text-xs text-muted border border-border px-3 py-1.5 shrink-0">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-2">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} className="font-body text-sm text-muted flex gap-3">
                      <span className="text-white/20 shrink-0">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
