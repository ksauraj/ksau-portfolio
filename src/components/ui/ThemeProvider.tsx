'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'dark' | 'light'
type ThemeContextValue = { theme: Theme; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextValue | null>(null)

function matrixColumns(count = 12, rows = 18) {
  return Array.from({ length: count }, (_, column) => ({
    id: `${column}-${Date.now()}`,
    text: Array.from({ length: rows }, () => (Math.random() > 0.5 ? '1' : '0')).join(' '),
    delay: `${(column * 0.07).toFixed(2)}s`,
  }))
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [transitionKey, setTransitionKey] = useState(0)
  const [columns, setColumns] = useState<ReturnType<typeof matrixColumns>>([])

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
    setColumns(matrixColumns())
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
        <div className="theme-transition__rain">
          {columns.map((column) => <span key={column.id} style={{ animationDelay: column.delay }}>{column.text}</span>)}
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
