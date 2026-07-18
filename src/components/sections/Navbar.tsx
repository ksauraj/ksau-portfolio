'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { personalInfo } from '@/data/content'

const links = ['Home', '< Projects >', 'Experience', 'Skills', 'Education', 'Contact']

export default function Navbar() {
  const { scrollY } = useScroll()
  const bg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)'])
  const blur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(12px)'])

  return (
    <motion.nav
      aria-label="Primary navigation"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/5"
      style={{ backgroundColor: bg, backdropFilter: blur }}
    >
      <div className="font-mono text-sm text-white leading-tight">
        <div>{personalInfo.logoName}</div>
        <div>{personalInfo.logoSub}</div>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <a key={link} href={`#${link.replace(/[^a-z]/gi,'').toLowerCase()}`}
            className="font-body text-sm text-white/70 hover:text-white transition-colors duration-200 relative group">
            {link}
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
          </a>
        ))}
      </div>
      <a href="#contact"
        className="bg-white text-black text-sm font-body font-medium px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors">
        Contact
      </a>
    </motion.nav>
  )
}
