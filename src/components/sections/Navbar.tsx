'use client'
import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { personalInfo } from '@/data/content'

const links = ['Home', 'Skills', 'Experience', 'Projects', 'Education']
const sectionId = (link: string) => link.replace(/[^a-z]/gi, '').toLowerCase()

export default function Navbar() {
  const { scrollY } = useScroll()
  const bg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)'])
  const blur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(12px)'])
  const [active, setActive] = useState('home')

  // Scroll-spy: highlight whichever section is currently in view.
  useEffect(() => {
    const ids = links.map(sectionId)
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
        {links.map((link) => {
          const id = sectionId(link)
          const isActive = active === id
          return (
            <a
              key={link}
              href={`#${id}`}
              aria-current={isActive ? 'true' : undefined}
              className={`font-body text-sm transition-colors duration-200 relative group ${
                isActive
                  ? 'text-white btn-glare px-1'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {isActive ? (
                <span className="font-mono text-white/50">&lt;&nbsp;</span>
              ) : null}
              {link}
              {isActive ? (
                <span className="font-mono text-white/50">&nbsp;&gt;</span>
              ) : null}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
            </a>
          )
        })}
      </div>
      <a
        href="#contact"
        className="bg-white text-black text-sm font-body font-medium px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors btn-glare"
      >
        Contact
      </a>
    </motion.nav>
  )
}
