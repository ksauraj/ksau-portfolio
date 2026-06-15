'use client'
import React, { useEffect, useState } from 'react'

interface DoodleItem {
  id: number
  top: number
  left: number
  scale: number
  delay: number
  duration: number
  rotationDir: number
  type: number
}

function FloatingDoodlesComponent({ count = 18, isFastGlow = false }: { count?: number; isFastGlow?: boolean }) {
  const [items, setItems] = useState<DoodleItem[]>([])

  useEffect(() => {
    const list = Array.from({ length: count }).map((_, idx) => ({
      id: idx,
      top: Math.random() * 85 + 5,
      left: Math.random() * 85 + 5,
      scale: Math.random() * 0.4 + 0.5,
      delay: Math.random() * 2,
      duration: (Math.random() * 6 + 7) / (isFastGlow ? 2.2 : 1),
      rotationDir: Math.random() > 0.5 ? 1 : -1,
      type: Math.floor(Math.random() * 5),
    }))
    setItems(list)
  }, [count, isFastGlow])

  const renderShape = (type: number) => {
    switch (type) {
      case 0:
        return (
          <svg className="w-8 h-8 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        )
      case 1:
        return (
          <svg className="w-6 h-6 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" />
          </svg>
        )
      case 2:
        return (
          <svg className="w-6 h-6 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
            <polygon points="12,4 4,20 20,20" />
          </svg>
        )
      case 3:
        return (
          <svg className="w-10 h-6 stroke-white fill-none" viewBox="0 0 40 20" strokeWidth="1.5">
            <path d="M5 10 Q 12 4, 20 10 T 35 10" />
          </svg>
        )
      case 4:
        return (
          <svg className="w-8 h-8 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
            <path d="M8 4 H4 V20 H8" />
            <path d="M16 4 H20 V20 H16" />
          </svg>
        )
      default:
        return null
    }
  }

  const animationName = isFastGlow ? 'float-glow-fast' : 'float-glow-normal'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-glow-normal {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0.03;
          }
          50% {
            transform: translate3d(10px, -20px, 0) rotate(180deg);
            opacity: 0.16;
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(360deg);
            opacity: 0.03;
          }
        }
        @keyframes float-glow-fast {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0.03;
          }
          50% {
            transform: translate3d(12px, -24px, 0) rotate(180deg);
            opacity: 0.22;
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(360deg);
            opacity: 0.03;
          }
        }
      `}} />
      
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            transform: `scale(${item.scale})`,
            animation: `${animationName} ${item.duration}s ease-in-out ${item.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        >
          {renderShape(item.type)}
        </div>
      ))}
    </div>
  )
}

export const FloatingDoodles = React.memo(FloatingDoodlesComponent)
FloatingDoodles.displayName = 'FloatingDoodles'
export default FloatingDoodles
