'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'dark' | 'light'
type ThemeContextValue = { theme: Theme; toggleTheme: () => void }

const ThemeContext = createContext<ThemeContextValue | null>(null)

function binaryStream(length = 220) {
  return Array.from({ length }, () => (Math.random() > 0.5 ? '1' : '0')).join('')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [transitionKey, setTransitionKey] = useState(0)
  const [bits, setBits] = useState('')

  useEffect(() => {
    const stored = window.localStorage.getItem('ksau-theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      document.documentElement.dataset.theme = stored
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setBits(binaryStream())
    setTransitionKey((key) => key + 1)
    setTheme(next)
    document.documentElement.dataset.theme = next
    window.localStorage.setItem('ksau-theme', next)
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <div key={transitionKey} aria-hidden="true" className={transitionKey ? 'theme-transition' : 'theme-transition theme-transition--idle'}>
        <div className="theme-transition__glare" />
        <div className="theme-transition__bits">{bits}</div>
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
