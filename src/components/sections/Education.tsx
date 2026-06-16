'use client'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { aboutContent } from '@/data/content'

export default function Education() {
  return (
    <section id="education" className="py-32 px-8 lg:px-16 border-t border-border bg-black relative z-10">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="inline-flex border border-border px-3 py-1.5 mb-8">
            <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ Education ]</span>
          </div>
          <h2 className="font-display font-semibold text-white text-5xl lg:text-6xl leading-tight mb-16">
            Academic<br />Foundation.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <motion.div
            whileHover={{ borderColor: '#444' }}
            className="border border-border bg-card p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-white text-2xl mb-2">
                  {aboutContent.education.degree}
                </h3>
                <p className="font-body text-base text-fg-dim">
                  {aboutContent.education.major}
                </p>
                <p className="font-mono text-sm text-muted mt-4">
                  {aboutContent.education.institution}
                </p>
              </div>
              <div className="font-mono text-sm text-muted border border-border px-4 py-2 self-start md:self-center">
                {aboutContent.education.period}
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  )
}
