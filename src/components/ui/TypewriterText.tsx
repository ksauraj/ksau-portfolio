'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  phrases: string[]
  className?: string
}

export default function TypewriterText({ phrases, className }: TypewriterTextProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    const currentPhrase = phrases[phraseIndex]

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayed((prev) => prev.slice(0, -1))
      }, 40)
    } else {
      timer = setTimeout(() => {
        setDisplayed((prev) => currentPhrase.slice(0, prev.length + 1))
      }, 80)
    }

    if (!isDeleting && displayed === currentPhrase) {
      clearTimeout(timer)
      timer = setTimeout(() => setIsDeleting(true), 2500)
    } else if (isDeleting && displayed === '') {
      clearTimeout(timer)
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }

    return () => clearTimeout(timer)
  }, [displayed, isDeleting, phraseIndex, phrases])

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-0.5 h-[1em] bg-white ml-0.5 align-middle"
      />
    </span>
  )
}
