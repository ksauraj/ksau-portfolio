'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Meteors({ number = 15 }: { number?: number }) {
  const [meteorCount, setMeteorCount] = useState(0)

  useEffect(() => {
    setMeteorCount(number)
  }, [number])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: meteorCount }).map((_, idx) => {
        const randomTop = Math.random() * 80
        const randomDelay = Math.random() * 10
        const randomDuration = Math.random() * 5 + 3
        const scale = Math.random() * 0.6 + 0.4

        return (
          <motion.span
            key={idx}
            className="absolute w-[180px] h-[1.5px] bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none before:content-[''] before:absolute before:right-0 before:w-1 before:h-1 before:bg-white before:rounded-full before:shadow-[0_0_12px_#fff]"
            style={{
              top: `${randomTop}%`,
              right: '-200px',
              transform: `scale(${scale}) rotate(-30deg)`,
            }}
            animate={{
              x: ['0vw', '-130vw'],
              y: ['0vh', '75vh'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )
      })}
    </div>
  )
}
