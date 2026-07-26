'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BinaryPixelTransition from '@/components/ui/BinaryPixelTransition'

type Theme = 'dark' | 'light'
type ThemeContextValue = { theme: Theme; toggleTheme: (source?: HTMLElement) => void }
type TransitionState = { theme: Theme; origin: { x: number; y: number } }
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [transition, setTransition] = useState<TransitionState | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('ksau-theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      document.documentElement.dataset.theme = stored
    }
  }, [])

  useEffect(() => {
    const color = theme === 'light' ? '#f6f7f9' : '#000000'
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'theme-color'
      document.head.appendChild(meta)
    }
    meta.content = color
  }, [theme])

  const toggleTheme = useCallback((source?: HTMLElement) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const rect = source?.getBoundingClientRect()
    const origin = {
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : 32,
    }
    const applyTheme = () => {
      setTheme(next)
      document.documentElement.dataset.theme = next
      window.localStorage.setItem('ksau-theme', next)
    }

    const transitionDuration = 2500 + Math.random() * 500
    document.documentElement.style.setProperty('--theme-transition-duration', `${transitionDuration}ms`)
    document.documentElement.style.setProperty('--theme-origin-x', `${origin.x}px`)
    document.documentElement.style.setProperty('--theme-origin-y', `${origin.y}px`)
    const revealRadius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    )
    document.documentElement.style.setProperty('--theme-reveal-radius', `${revealRadius}px`)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> }
    }

    if (reducedMotion || !doc.startViewTransition) {
      applyTheme()
      return
    }

    setTransition({ theme: next, origin })
    const viewTransition = doc.startViewTransition(applyTheme)
    viewTransition.finished.finally(() => setTransition(null))
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return (
    <ThemeContext.Provider value={value}>
      {children}
      <BinaryPixelTransition active={transition !== null} theme={transition?.theme ?? theme} origin={transition?.origin} />
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
