'use client'
import { motion } from 'framer-motion'
import TypewriterText from '@/components/ui/TypewriterText'
import FloatingSocials from '@/components/ui/FloatingSocials'
import FloatingDoodles from '@/components/ui/FloatingDoodles'
import { personalInfo, heroPhrases } from '@/data/content'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Hero() {
  return (
    <section id="home" aria-label="Introduction" className="relative min-h-screen flex flex-col justify-center px-8 lg:px-16 pt-24 overflow-hidden">
      {/* Background doodles */}
      <FloatingDoodles count={45} />

      {/* Floating socials spanning the right 55% area absolutely */}
      <div className="absolute right-0 top-0 w-[55vw] h-full pointer-events-none z-20">
        <FloatingSocials />
      </div>

      <motion.div
        data-animate
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl w-full relative z-10 pointer-events-none"
      >
        <motion.div variants={item}
          className="inline-flex items-center gap-3 border border-border px-3 py-1.5 mb-8 pointer-events-auto">
          <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">
            [ {personalInfo.role} ]
          </span>
          <span className="font-mono text-xs text-white/70 tracking-[0.2em]">
            @{personalInfo.handle}
          </span>
        </motion.div>

        <motion.h1 variants={item}
          className="font-display font-bold text-white leading-[1.0] tracking-tight pointer-events-auto"
          style={{ fontSize: 'clamp(52px, 8vw, 120px)' }}>
          Sauraj<br />Kumar Singh
        </motion.h1>

        <motion.p variants={item} className="sr-only">
          Sauraj Kumar Singh, also known online as ksauraj, is a DevOps Engineer
          and open source contributor. This is the official portfolio and website
          of ksauraj.
        </motion.p>

        <motion.div variants={item} className="mt-6 h-8 pointer-events-auto">
          <TypewriterText
            phrases={heroPhrases}
            className="font-mono text-lg text-white/80"
          />
        </motion.div>

        <motion.div variants={item}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-16 text-sm font-mono text-muted pointer-events-auto">
          <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors">
            {personalInfo.email}
          </a>
          <a href="/resume.pdf" download
             className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white hover:text-black font-mono text-xs text-white px-4 py-2 transition-all duration-300 btn-glare animate-flicker-glow">
            <span>[ Download Resume ]</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/40" />
      </motion.div>
    </section>
  )
}
