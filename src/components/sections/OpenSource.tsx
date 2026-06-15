'use client'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { openSource } from '@/data/content'

export default function OpenSource() {
  return (
    <section id="opensource" className="py-32 px-8 lg:px-16 border-t border-border bg-black">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="inline-flex border border-border px-3 py-1.5 mb-8">
            <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ Open Source Contributions ]</span>
          </div>
          <h2 className="font-display font-semibold text-white text-5xl lg:text-6xl leading-tight mb-16">
            Where I contribute back<br />to the developer community.
          </h2>
        </ScrollReveal>

        <div className="space-y-6">
          {openSource.map((contrib, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, borderColor: '#444' }}
                className="border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,255,255,0.04)]"
              >
                {/* Mock terminal chrome */}
                <div className="bg-surface border-b border-border px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <span className="font-mono text-xs text-muted ml-3 select-none">
                    ~/opensource/{contrib.title.toLowerCase().replace(/\s+/g, '-')}
                  </span>
                </div>
                {/* Terminal output */}
                <div className="bg-[#050505] px-6 py-5 font-mono text-xs text-white/50 leading-relaxed min-h-[80px]">
                  {contrib.terminal.split('\n').map((line, li) => (
                    <div key={li} className={li === 0 ? 'text-white/80' : ''}>{line}</div>
                  ))}
                </div>
                {/* Card content */}
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {contrib.stack.map((s) => (
                      <span key={s} className="font-mono text-xs border border-border text-muted px-2 py-1 select-none">{s}</span>
                    ))}
                    <span className="font-mono text-xs text-white/20 ml-auto self-center select-none">{contrib.year}</span>
                  </div>
                  <h3 className="font-display font-semibold text-white text-2xl mb-3">{contrib.title}</h3>
                  <p className="font-body text-sm text-muted leading-relaxed mb-6">{contrib.description}</p>
                  <div className="flex gap-4">
                    {contrib.links.map((link) => (
                      <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-xs text-white/60 hover:text-white border border-border hover:border-white/40 px-4 py-2 transition-all duration-200">
                        [{link.label}]
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
