'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BinaryPixelTransition from '@/components/ui/BinaryPixelTransition'

type Theme = 'dark' | 'light'
type ThemeContextValue = { theme: Theme; toggleTheme: (origin?: { x: number; y: number }) => void }
type TransitionState = { theme: Theme; origin: { x: number; y: number }; phase: 'reveal' | 'ripple' }
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

  const toggleTheme = useCallback((pointerOrigin?: { x: number; y: number }) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const origin = pointerOrigin ?? {
      x: window.innerWidth / 2,
      y: 32,
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

    setTransition({ theme: next, origin, phase: 'reveal' })
    const viewTransition = doc.startViewTransition(applyTheme)
    viewTransition.finished.then(
      () => setTransition((current) => current ? { ...current, phase: 'ripple' } : null),
      () => setTransition(null),
    )
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return (
    <ThemeContext.Provider value={value}>
      {children}
      <BinaryPixelTransition
        active={transition !== null}
        phase={transition?.phase ?? 'reveal'}
        theme={transition?.theme ?? theme}
        origin={transition?.origin}
        onComplete={() => setTransition(null)}
      />
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
