'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import FloatingDoodles from '@/components/ui/FloatingDoodles'
import { personalInfo } from '@/data/content'

export default function Footer() {
  return (
    <section id="contact" aria-label="Contact" className="relative min-h-screen flex overflow-hidden bg-black border-t border-border">
      <FloatingDoodles count={45} />
      {/* LEFT: Photo panel */}
      <div className="w-[38%] relative hidden lg:block bg-surface border-r border-border">
        <Image
          src="/sauraj.webp"
          alt={`${personalInfo.name} — ${personalInfo.role}`}
          fill
          priority
          sizes="(max-width: 1024px) 0vw, 38vw"
          className="object-cover object-top grayscale contrast-110"
        />
      </div>

      {/* RIGHT: Content */}
      <div className="flex-1 flex flex-col justify-between p-12 lg:p-16 relative">
        {/* Giant name */}
        <motion.div
          data-animate
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex items-center"
        >
          <h2
            className="font-display font-bold text-white leading-[0.9]"
            style={{ fontSize: 'clamp(50px, 8vw, 120px)' }}
          >
            {personalInfo.logoName}<br />{personalInfo.logoSub}
          </h2>
        </motion.div>

        {/* SVG squiggle decoration */}
        <motion.svg
          className="absolute right-24 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none hidden md:block z-0"
          width="80" height="60" viewBox="0 0 80 60" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <motion.path
            d="M10 30 C20 10, 30 50, 40 30 C50 10, 60 50, 70 30"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* Floating DevOps Doodles */}
        {/* Doodle 1: Kubernetes Wheel */}
        <motion.svg
          className="absolute top-[12%] right-[18%] text-white/5 pointer-events-none w-20 h-20 z-0 hidden md:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="50" cy="50" r="32" />
          <circle cx="50" cy="50" r="10" />
          <line x1="50" y1="18" x2="50" y2="40" />
          <line x1="50" y1="60" x2="50" y2="82" />
          <line x1="18" y1="50" x2="40" y2="50" />
          <line x1="60" y1="50" x2="82" y2="50" />
          <line x1="27" y1="27" x2="43" y2="43" />
          <line x1="57" y1="57" x2="73" y2="73" />
          <line x1="73" y1="27" x2="57" y2="43" />
          <line x1="43" y1="57" x2="27" y2="73" />
        </motion.svg>

        {/* Doodle 2: Database cylinders */}
        <motion.svg
          className="absolute top-[50%] left-[8%] text-white/5 pointer-events-none w-14 h-18 z-0 hidden md:block"
          viewBox="0 0 60 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M10 20 C 10 10, 50 10, 50 20" />
          <path d="M10 20 C 10 30, 50 30, 50 20" />
          <path d="M10 20 V 35 C 10 45, 50 45, 50 35 V 20" />
          <path d="M10 35 C 10 45, 50 45, 50 35" />
          <path d="M10 35 V 50 C 10 60, 50 60, 50 50 V 35" />
          <path d="M10 50 C 10 60, 50 60, 50 50" />
          <path d="M10 50 V 65 C 10 75, 50 75, 50 65 V 50" />
        </motion.svg>

        {/* Doodle 3: Cloud outline */}
        <motion.svg
          className="absolute top-[28%] right-[8%] text-white/5 pointer-events-none w-20 h-16 z-0 hidden md:block"
          viewBox="0 0 100 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M25 60 C 10 60, 10 40, 25 40 C 20 20, 50 10, 65 30 C 80 20, 90 40, 80 55 C 85 70, 65 75, 55 65" />
        </motion.svg>

        {/* Doodle 4: Topology nodes */}
        <motion.svg
          className="absolute bottom-[35%] right-[14%] text-white/5 pointer-events-none w-20 h-20 z-0 hidden md:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.06, 1], y: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <line x1="20" y1="30" x2="50" y2="20" />
          <line x1="50" y1="20" x2="80" y2="40" />
          <line x1="80" y1="40" x2="60" y2="80" />
          <line x1="60" y1="80" x2="20" y2="70" />
          <line x1="20" y1="70" x2="20" y2="30" />
          <line x1="20" y1="30" x2="60" y2="80" />
          <line x1="50" y1="20" x2="60" y2="80" />
          <circle cx="20" cy="30" r="4" fill="currentColor" />
          <circle cx="50" cy="20" r="4" fill="currentColor" />
          <circle cx="80" cy="40" r="4" fill="currentColor" />
          <circle cx="60" cy="80" r="4" fill="currentColor" />
          <circle cx="20" cy="70" r="4" fill="currentColor" />
        </motion.svg>

        {/* Contact info */}
        <div className="mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <a href={`mailto:${personalInfo.email}`}
              className="font-mono text-sm text-muted hover:text-white transition-colors">
              {personalInfo.email}
            </a>
            <a href="/resume.pdf" download
               className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white hover:text-black font-mono text-xs text-white px-4 py-2 transition-all duration-300 btn-glare animate-flicker-glow">
              <span>[ Download Resume ]</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
            {personalInfo.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs text-muted hover:text-white transition-colors tracking-widest uppercase">
                {s.label}
              </a>
            ))}
          </div>

          <p className="font-mono text-xs text-muted/50 tracking-widest">
            © {new Date().getFullYear()} Sauraj Kumar Singh (@{personalInfo.handle}) · Built in India
          </p>
        </div>
      </div>
    </section>
  )
}
