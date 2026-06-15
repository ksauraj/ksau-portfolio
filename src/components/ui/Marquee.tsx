'use client'
import { motion } from 'framer-motion'

interface MarqueeProps {
  items: string[]
}

export default function Marquee({ items }: MarqueeProps) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-border py-4">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="font-mono text-sm text-muted tracking-widest uppercase shrink-0">
            {item} <span className="text-white/20 mx-2">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
