'use client'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function CountUp({
  end,
  suffix = '',
  duration = 1000,
}: {
  end: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    const frameDuration = 30
    const totalFrames = Math.max(1, Math.round(duration / frameDuration))
    const step = end / totalFrames

    let frame = 0
    const timer = setInterval(() => {
      frame++
      const nextCount = Math.round(step * frame)
      if (nextCount >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(nextCount)
      }
    }, frameDuration)

    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}
