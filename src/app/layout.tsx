import type { Metadata } from 'next'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import './globals.css'
import CustomCursor from '@/components/ui/CustomCursor'
import MouseGlow from '@/components/ui/MouseGlow'
import Meteors from '@/components/ui/Meteors'

export const metadata: Metadata = {
  title: 'Sauraj Kumar Singh | DevOps Engineer',
  description: 'DevOps Engineer & Open Source contributor. Building scalable infrastructure with Docker, Kubernetes, Terraform, AWS, and Azure.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white font-body antialiased cursor-none overflow-x-hidden relative">
        <CustomCursor />
        <MouseGlow />
        <Meteors number={12} />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
