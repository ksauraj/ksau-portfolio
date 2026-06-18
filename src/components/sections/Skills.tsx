'use client'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import Marquee from '@/components/ui/Marquee'
import FloatingTechIcons from '@/components/ui/FloatingTechIcons'
import { skills, marqueeItems } from '@/data/content'

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 px-8 lg:px-16 border-t border-border bg-black">
      <FloatingTechIcons />
      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="inline-flex border border-border px-3 py-1.5 mb-8">
            <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ Technical Skills ]</span>
          </div>
          <h2 className="font-display font-semibold text-white text-5xl lg:text-6xl leading-tight mb-16">
            Tools I use to build<br />things that don&apos;t break.
          </h2>
        </ScrollReveal>

        <div className="space-y-10 mb-20">
          {Object.entries(skills).map(([category, items], ci) => (
            <ScrollReveal key={category} delay={ci * 0.05}>
              <div>
                <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: si * 0.02, duration: 0.3 }}
                      whileHover={{ borderColor: '#555', scale: 1.05 }}
                      className="font-mono text-sm text-fg-dim border border-border bg-surface px-3 py-1.5 cursor-default select-none transition-colors duration-200"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Marquee items={marqueeItems} />
    </section>
  )
}
