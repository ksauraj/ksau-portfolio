'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BinaryPixelTransition from '@/components/ui/BinaryPixelTransition'

type Theme = 'dark' | 'light'
type ThemeContextValue = { theme: Theme; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [transitionTheme, setTransitionTheme] = useState<Theme | null>(null)

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

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const applyTheme = () => {
      setTheme(next)
      document.documentElement.dataset.theme = next
      window.localStorage.setItem('ksau-theme', next)
    }

    const transitionDuration = 2500 + Math.random() * 500
    document.documentElement.style.setProperty('--theme-transition-duration', `${transitionDuration}ms`)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> }
    }

    if (reducedMotion || !doc.startViewTransition) {
      applyTheme()
      return
    }

    setTransitionTheme(next)
    const viewTransition = doc.startViewTransition(applyTheme)
    viewTransition.finished.finally(() => setTransitionTheme(null))
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return (
    <ThemeContext.Provider value={value}>
      {children}
      <BinaryPixelTransition active={transitionTheme !== null} theme={transitionTheme ?? theme} />
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
