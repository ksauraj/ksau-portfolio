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
import { personalInfo } from '@/data/content'

const SITE_URL = 'https://ksauraj.eu.org'
const TITLE = 'Sauraj Kumar Singh | DevOps Engineer'
const DESCRIPTION =
  'DevOps Engineer & Open Source contributor. Building scalable infrastructure with Docker, Kubernetes, Terraform, AWS, and Azure.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Sauraj Kumar Singh',
  },
  description: DESCRIPTION,
  applicationName: 'Sauraj Kumar Singh — Portfolio',
  authors: [{ name: personalInfo.name, url: SITE_URL }],
  creator: personalInfo.name,
  publisher: personalInfo.name,
  keywords: [
    'Sauraj Kumar Singh',
    'DevOps Engineer',
    'Site Reliability Engineer',
    'Kubernetes',
    'Docker',
    'Terraform',
    'AWS',
    'Azure',
    'CI/CD',
    'Open Source',
    'Infrastructure as Code',
    'Cloud Engineer',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Sauraj Kumar Singh — Portfolio',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sauraj Kumar Singh — DevOps Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@k_sauraj',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  category: 'technology',
}

// Structured data: identifies the person + site for search engines and AI engines.
const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: personalInfo.name,
  url: SITE_URL,
  image: `${SITE_URL}/sauraj.webp`,
  email: `mailto:${personalInfo.email}`,
  jobTitle: personalInfo.role,
  description: DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressLocality: 'Noida, India',
  },
  knowsAbout: [
    'DevOps',
    'Kubernetes',
    'Docker',
    'Terraform',
    'AWS',
    'Azure',
    'CI/CD',
    'Infrastructure as Code',
    'Observability',
    'Site Reliability Engineering',
  ],
  sameAs: personalInfo.socials
    .filter((s) => s.label !== 'Website')
    .map((s) => s.href),
}

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#person` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/devicon.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.45.0/dist/tabler-icons.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {/* No-JS resilience: reveal animated content and hide the JS loader overlay
            when JavaScript is disabled or not executed (e.g. some AI crawlers). */}
        <noscript>
          <style>{`
            .js-loader-overlay { display: none !important; }
            [data-animate], [data-animate] * { opacity: 1 !important; transform: none !important; }
          `}</style>
        </noscript>
      </head>
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
