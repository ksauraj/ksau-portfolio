import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import OpenSource from '@/components/sections/OpenSource'
import Education from '@/components/sections/Education'
import Footer from '@/components/sections/Footer'
import Loader from '@/components/ui/Loader'
import ResponsiveNotice from '@/components/ui/ResponsiveNotice'

export default function Home() {
  return (
    <>
      <Loader />
      <main className="relative min-h-screen bg-black text-white">
        <Navbar />
        <ResponsiveNotice />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <OpenSource />
        <Education />
        <Footer />
      </main>
    </>
  )
}