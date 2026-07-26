'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/ui/ThemeProvider'
import { personalInfo } from '@/data/content'

const links = ['Home', 'Skills', 'Experience', 'Projects', 'Education']
const sectionId = (link: string) => link.replace(/[^a-z]/gi, '').toLowerCase()

export default function Navbar() {
  const pathname = usePathname()
  const onBlog = pathname?.startsWith('/blog') ?? false
  const { scrollY } = useScroll()
  const { theme, toggleTheme } = useTheme()
  const bg = useTransform(scrollY, [0, 80], ['rgb(var(--theme-nav) / 0)', 'rgb(var(--theme-nav) / 0.88)'])
  const blur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(12px)'])
  const [active, setActive] = useState('home')

  // Scroll-spy: highlight whichever section is currently in view.
  // Only runs on the homepage — blog routes have no such sections.
  useEffect(() => {
    if (onBlog) return
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
  }, [onBlog])

  return (
    <motion.nav
      aria-label="Primary navigation"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-fg/5"
      style={{ backgroundColor: bg, backdropFilter: blur }}
    >
      <div className="font-mono text-sm text-fg leading-tight">
        <div>{personalInfo.logoName}</div>
        <div>{personalInfo.logoSub}</div>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => {
          const id = sectionId(link)
          // On blog routes nothing in this list is active.
          const isActive = !onBlog && active === id
          return (
            <a
              key={link}
              href={`/#${id}`}
              aria-current={isActive ? 'true' : undefined}
              className={`font-body text-sm transition-colors duration-200 relative group ${
                isActive
                  ? 'text-fg btn-glare px-1'
                  : 'text-fg/70 hover:text-fg'
              }`}
            >
              {isActive ? (
                <span className="font-mono text-fg/50">&lt;&nbsp;</span>
              ) : null}
              {link}
              {isActive ? (
                <span className="font-mono text-fg/50">&nbsp;&gt;</span>
              ) : null}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-fg group-hover:w-full transition-all duration-300" />
            </a>
          )
        })}
        {/* Blog is a separate route, not an in-page anchor. */}
        <a
          href="/blog"
          aria-current={onBlog ? 'true' : undefined}
          className={`font-body text-sm transition-colors duration-200 relative group ${
            onBlog ? 'text-fg btn-glare px-1' : 'text-fg/70 hover:text-fg'
          }`}
        >
          {onBlog ? <span className="font-mono text-fg/50">&lt;&nbsp;</span> : null}
          Blog
          {onBlog ? <span className="font-mono text-fg/50">&nbsp;&gt;</span> : null}
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-fg group-hover:w-full transition-all duration-300" />
        </a>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-pressed={theme === 'light'}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-fg hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors"
        >
          {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
        </button>
        <a
          href="/#contact"
          className="bg-fg text-bg text-sm font-body font-medium px-5 py-2.5 rounded-full hover:bg-fg/90 transition-colors btn-glare"
        >
          Contact
        </a>
      </div>
    </motion.nav>
  )
}
