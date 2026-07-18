'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const [text, setText] = useState('loading')
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const startText = 'loading'
    const targetText = 'ksauraj'
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?'
    let iterations = 0
    let interval: NodeJS.Timeout

    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        setText(() => {
          return targetText
            .split('')
            .map((char, index) => {
              if (index < iterations) {
                return targetText[index]
              }
              if (Math.random() < 0.35) {
                return startText[index] || chars[Math.floor(Math.random() * chars.length)]
              }
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        })

        iterations += 0.2
        if (iterations >= targetText.length + 1) {
          clearInterval(interval)
          setText(targetText)
          setTimeout(() => {
            setIsFinished(true)
            setTimeout(() => onComplete?.(), 800)
          }, 1000)
        }
      }, 50)
    }, 1200)

    return () => {
      clearTimeout(startTimeout)
      if (interval) clearInterval(interval)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="js-loader-overlay fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center select-none"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative flex flex-col items-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-3xl md:text-5xl font-bold tracking-[0.25em] text-white uppercase"
            >
              [ <span className="text-white/95">{text}</span> ]
            </motion.div>
            
            <div className="w-48 h-[2px] bg-white/10 mt-8 relative overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
