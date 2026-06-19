'use client'
import { useState, useEffect } from 'react'

export default function ResponsiveNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      const dismissed = sessionStorage.getItem('desktop-notice-dismissed')
      setVisible(window.innerWidth < 1024 && !dismissed)
    }

    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem('desktop-notice-dismissed', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(13, 13, 13, 0.9)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid #222',
      color: '#aaa',
      fontFamily: 'monospace',
      fontSize: '11px',
      padding: '12px 16px',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxShadow: '0 -4px 30px rgba(0,0,0,0.9)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <span style={{ fontSize: '14px', flexShrink: 0 }}>💻</span>
        <span style={{ lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <strong>Notice:</strong> This site is best experienced on a desktop. Mobile devices are not fully supported.
        </span>
      </div>
      <button
        onClick={handleDismiss}
        style={{
          background: '#1c1c1c',
          border: '1px solid #333',
          color: '#fff',
          cursor: 'pointer',
          padding: '4px 10px',
          fontFamily: 'monospace',
          fontSize: '11px',
          borderRadius: '4px',
          flexShrink: 0,
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#666'
          e.currentTarget.style.background = '#252525'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#333'
          e.currentTarget.style.background = '#1c1c1c'
        }}
      >
        Dismiss
      </button>
    </div>
  )
}
