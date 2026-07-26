'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40 })
  const outerX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const outerY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  // Only enable the custom cursor on devices with a fine pointer (mouse/trackpad)
  // and a wide enough screen — never on phones/tablets/touch.
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const update = () => {
      setEnabled(mq.matches)
      document.body.classList.toggle('cursor-none', mq.matches)
    }
    update()
    mq.addEventListener('change', update)
    return () => {
      mq.removeEventListener('change', update)
      document.body.classList.remove('cursor-none')
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [enabled, mouseX, mouseY])

  if (!enabled) return null

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ x: springX, y: springY }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-white/30 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{ x: outerX, y: outerY }}
      />
    </>
  )
}
