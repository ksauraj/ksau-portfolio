'use client'
import { useState } from 'react'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import OpenSource from '@/components/sections/OpenSource'
import Footer from '@/components/sections/Footer'
import Loader from '@/components/ui/Loader'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <Loader onComplete={() => setIsLoading(false)} />
      {!isLoading && (
        <main className="relative min-h-screen bg-black text-white">
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <OpenSource />
          <Footer />
        </main>
      )}
    </>
  )
}
