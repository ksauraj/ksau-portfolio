# Sauraj Kumar Singh — DevOps Portfolio Website
## Build Prompt: Next.js 14 + Framer Motion + Tailwind CSS
### Inspired by: Devolio Framer Developer Portfolio Template

---

## ⚠️ CRITICAL: FRAMEWORK MANDATE

**This project MUST be built with:**
- **Next.js 14** (App Router) — the React framework
- **Framer Motion** (`framer-motion` npm package) — for ALL animations, transitions, scroll effects, cursor
- **Tailwind CSS** — for ALL styling (no vanilla CSS files, no inline style objects)
- **TypeScript** — all files `.tsx` or `.ts`
- **shadcn/ui** — for base UI primitives if needed

**ABSOLUTELY NO:**
- ❌ Vanilla JavaScript `.js` files
- ❌ Plain HTML/CSS files
- ❌ jQuery or any DOM manipulation
- ❌ `document.querySelector`, `document.addEventListener` directly in components
- ❌ Inline `style={{}}` objects (use Tailwind classes instead)
- ❌ CSS files (use Tailwind only)

**Every interactive effect — cursor, typewriter, marquee, glow, scroll animation — must be a React component using Framer Motion hooks.**

---

## TECH STACK (Exact)

```bash
# Initialize project
npx create-next-app@latest sauraj-portfolio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd sauraj-portfolio

# Install ALL dependencies upfront
npm install framer-motion
npm install @fontsource/space-grotesk @fontsource/space-mono @fontsource/inter
npm install lucide-react
npm install clsx tailwind-merge
npm install react-intersection-observer
```

**`package.json` dependencies must include:**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^11.0.0",
    "tailwind-merge": "^2.0.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.400.0",
    "@fontsource/space-grotesk": "^5.0.0",
    "@fontsource/space-mono": "^5.0.0",
    "@fontsource/inter": "^5.0.0",
    "react-intersection-observer": "^9.0.0"
  }
}
```

---

## PROJECT FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts + cursor
│   ├── page.tsx            # Single page, imports all sections
│   └── globals.css         # Tailwind directives ONLY (no custom CSS)
├── components/
│   ├── ui/
│   │   ├── CustomCursor.tsx
│   │   ├── TypewriterText.tsx
│   │   ├── Marquee.tsx
│   │   ├── MouseGlow.tsx
│   │   ├── CountUp.tsx
│   │   ├── ScrollReveal.tsx
│   │   └── SkillPill.tsx
│   └── sections/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Skills.tsx
│       ├── Experience.tsx
│       ├── Projects.tsx
│       ├── OpenSource.tsx
│       └── Footer.tsx
├── lib/
│   └── utils.ts            # cn() helper
└── data/
    └── content.ts          # All text content in one file
```

---

## DESIGN SPECIFICATION

### Colour Tokens (add to `tailwind.config.ts`)

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      bg: '#000000',
      surface: '#0D0D0D',
      card: '#080808',
      border: '#1A1A1A',
      'border-hover': '#444444',
      muted: '#888888',
      'muted-dark': '#444444',
      fg: '#FFFFFF',
      'fg-dim': '#CCCCCC',
    },
    fontFamily: {
      display: ['Space Grotesk', 'sans-serif'],
      mono: ['Space Mono', 'monospace'],
      body: ['Inter', 'sans-serif'],
    },
  }
}
```

### Typography Scale
- Hero name: `text-[clamp(56px,8vw,120px)]` — Space Grotesk, weight 700
- Section heading: `text-5xl lg:text-6xl` — Space Grotesk, weight 600
- Subheading: `text-2xl lg:text-3xl`
- Body: `text-base` (16px) — Inter
- Labels/tags: `text-xs tracking-widest uppercase` — Space Mono
- Monospace body: `text-lg` — Space Mono

---

## COMPONENT IMPLEMENTATIONS (React + Framer Motion)

### `components/ui/CustomCursor.tsx`

```tsx
'use client'
import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40 })
  const outerX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const outerY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mouseX, mouseY])

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ x: springX, y: springY }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-white/30 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{ x: outerX, y: outerY }}
      />
    </>
  )
}
```

### `components/ui/MouseGlow.tsx`

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MouseGlow() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 80, damping: 30 })
  const springY = useSpring(y, { stiffness: 80, damping: 30 })

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="fixed pointer-events-none z-0 w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2"
      style={{
        x: springX,
        y: springY,
        background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
      }}
    />
  )
}
```

### `components/ui/TypewriterText.tsx`

```tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TypewriterTextProps {
  phrases: string[]
  className?: string
}

export default function TypewriterText({ phrases, className }: TypewriterTextProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]
    const speed = isDeleting ? 40 : 80

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1))
        if (displayed.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1))
        if (displayed.length === 0) {
          setIsDeleting(false)
          setPhraseIndex((i) => (i + 1) % phrases.length)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, phraseIndex, phrases])

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-0.5 h-[1em] bg-white ml-0.5 align-middle"
      />
    </span>
  )
}
```

### `components/ui/Marquee.tsx`

```tsx
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
```

### `components/ui/ScrollReveal.tsx`

```tsx
'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### `components/ui/CountUp.tsx`

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(end / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [inView, end])

  return <span ref={ref}>{count}{suffix}</span>
}
```

---

## SECTION IMPLEMENTATIONS

### `components/sections/Navbar.tsx`

```tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const links = ['Home', '< Projects >', 'Experience', 'Skills', 'Contact']

export default function Navbar() {
  const { scrollY } = useScroll()
  const bg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)'])
  const blur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(12px)'])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{ backgroundColor: bg, backdropFilter: blur }}
    >
      <div className="font-mono text-sm text-white leading-tight">
        <div>Sauraj/&gt;</div>
        <div>DevOps</div>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <a key={link} href={`#${link.replace(/[^a-z]/gi,'').toLowerCase()}`}
            className="font-body text-sm text-white/70 hover:text-white transition-colors duration-200 relative group">
            {link}
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
          </a>
        ))}
      </div>
      <a href="#contact"
        className="bg-white text-black text-sm font-body font-medium px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors">
        Contact
      </a>
    </motion.nav>
  )
}
```

### `components/sections/Hero.tsx`

```tsx
'use client'
import { motion } from 'framer-motion'
import TypewriterText from '@/components/ui/TypewriterText'

const phrases = [
  '> Automating Infrastructure at Scale',
  '> Building Secure DevOps Pipelines',
  '> Kubernetes · Docker · Terraform',
  '> AWS & Azure Cloud Architect',
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center px-8 lg:px-16 pt-24">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl">
        <motion.div variants={item}
          className="inline-flex items-center border border-border px-3 py-1.5 mb-8">
          <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">
            [ DevOps Engineer ]
          </span>
        </motion.div>

        <motion.h1 variants={item}
          className="font-display font-bold text-white leading-[1.0]"
          style={{ fontSize: 'clamp(52px, 8vw, 120px)' }}>
          Sauraj<br />Kumar Singh
        </motion.h1>

        <motion.div variants={item} className="mt-6 h-8">
          <TypewriterText
            phrases={phrases}
            className="font-mono text-lg text-white/80"
          />
        </motion.div>

        <motion.div variants={item}
          className="mt-16 flex flex-col sm:flex-row gap-4 sm:gap-16 text-sm font-mono text-muted">
          <a href="mailto:ksauraj1@gmail.com" className="hover:text-white transition-colors">
            ksauraj1@gmail.com
          </a>
          <span>+91-8986328898</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/40" />
      </motion.div>
    </section>
  )
}
```

### `components/sections/Skills.tsx`

```tsx
'use client'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import Marquee from '@/components/ui/Marquee'

const skills = {
  'Languages': ['Go', 'Python', 'Bash', 'C', 'JavaScript', 'HTML/CSS', 'YAML', 'SQL'],
  'DevOps & Automation': ['Docker', 'Kubernetes', 'Helm', 'GitHub Actions', 'GitLab CI', 'Ansible', 'Terraform', 'Makefile', 'Docker Compose', 'CI/CD', 'IaC'],
  'Cloud & Platforms': ['AWS EC2', 'S3', 'IAM', 'ECS', 'Fargate', 'VPC', 'ALB', 'Auto Scaling', 'CloudFront', 'CloudWatch', 'Azure VNet', 'VMSS', 'App Gateway', 'GCP', 'Oracle Cloud', 'Linode'],
  'Observability': ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'Node Exporter', 'cAdvisor', 'Wazuh'],
  'Networking': ['TCP/IP', 'DNS', 'HTTP/HTTPS', 'TLS/SSL', 'Load Balancing', 'Reverse Proxy', 'API Gateway', 'VPN'],
  'Security & DevSecOps': ['HashiCorp Vault', 'SBOM', 'Container Security', 'Secret Management', 'Vulnerability Scanning', 'PCI DSS', 'DDoS Detection'],
  'Linux & Systems': ['Linux', 'Systemd', 'Shell Scripting', 'Tmux', 'Vim', 'Process Management', 'Server Admin'],
  'Tools': ['Git', 'REST APIs', 'Webhooks', 'Kong API Gateway', 'Nginx', 'Caddy', 'Railway', 'Heroku', 'Cirrus CI'],
}

const marqueeItems = ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Azure', 'Prometheus', 'Grafana', 'Vault', 'Go', 'Python', 'Bash', 'Linux', 'Nginx', 'GitLab CI', 'Ansible']

export default function Skills() {
  return (
    <section id="skills" className="py-32 px-8 lg:px-16">
      <ScrollReveal>
        <div className="inline-flex border border-border px-3 py-1.5 mb-8">
          <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ Technical Skills ]</span>
        </div>
        <h2 className="font-display font-semibold text-white text-5xl lg:text-6xl leading-tight mb-16">
          Tools I use to build<br />things that don&apos;t break.
        </h2>
      </ScrollReveal>

      <div className="space-y-10 mb-20">
        {Object.entries(skills).map(([category, items], ci) => (
          <ScrollReveal key={category} delay={ci * 0.05}>
            <div>
              <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: si * 0.03, duration: 0.3 }}
                    whileHover={{ borderColor: '#555', scale: 1.05 }}
                    className="font-mono text-xs text-fg-dim border border-border bg-surface px-3 py-1.5 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <Marquee items={marqueeItems} />
    </section>
  )
}
```

### `components/sections/Experience.tsx`

```tsx
'use client'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'

const experiences = [
  {
    role: 'Software Engineer Intern — DevOps',
    company: 'ES Magico AI Studio',
    period: 'May 2025 – Present',
    type: 'Remote',
    bullets: [
      'Led deployment setup across multiple projects using Docker and GitHub Actions',
      'Set up scalable monitoring and load balancing with multi-instance support inside custom VPCs',
      'Migrated DNS infrastructure from Route 53 to Cloudflare + integrated Kong API Gateway',
      'Integrated security pipeline automating threat detection, password validation, DDoS monitoring',
      'Automated provisioning using Terraform, Ansible, and Make-based workflows',
      'Designed Azure infrastructure: VNet, Application Gateway, VMSS for high availability',
      'Built AWS infrastructure: VPC design, ALBs, Auto Scaling Groups',
      'Developed scripts to manage environment variables securely using HashiCorp Vault',
      'Performed load and stress testing to validate scalability and fault tolerance',
    ],
  },
  {
    role: 'Backend Developer Intern',
    company: 'Welmun-Tech India Pvt Ltd',
    period: 'Feb 2025 – June 2025',
    type: 'Remote',
    bullets: [
      'Contributed to CI/CD pipelines, containerization using Docker, and basic Kubernetes orchestration',
      'Assisted in architecting microservices and applying event-driven design patterns',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-8 lg:px-16">
      <ScrollReveal>
        <div className="inline-flex border border-border px-3 py-1.5 mb-8">
          <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ Experience ]</span>
        </div>
        <h2 className="font-display font-semibold text-white text-5xl lg:text-6xl leading-tight mb-16">
          Where I&apos;ve shipped<br />real infrastructure.
        </h2>
      </ScrollReveal>

      <div className="space-y-6">
        {experiences.map((exp, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <motion.div
              whileHover={{ borderColor: '#444' }}
              className="border border-border bg-card p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-display font-semibold text-white text-xl">{exp.role}</h3>
                  <p className="font-mono text-sm text-muted mt-1">{exp.company} · {exp.type}</p>
                </div>
                <span className="font-mono text-xs text-muted border border-border px-3 py-1.5 shrink-0">
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-2">
                {exp.bullets.map((b, bi) => (
                  <li key={bi} className="font-body text-sm text-muted flex gap-3">
                    <span className="text-white/20 shrink-0">·</span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

### `components/sections/Projects.tsx`

```tsx
'use client'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import TypewriterText from '@/components/ui/TypewriterText'

const projects = [
  {
    title: 'ksau CLI/Web Tool',
    stack: ['Go', 'Bash', 'Microsoft Graph API'],
    year: '2021–2025',
    description: 'CLI and web tool for file uploads to OneDrive using Microsoft Graph API. Migrated from Bash to Go for concurrency, performance, and maintainability. Backend API powers ksau-py and the web version.',
    links: [{ label: 'GitHub', href: 'https://github.com/global-index-source/ksau-go' }, { label: 'Live', href: 'https://ksau.ksauraj.eu.org' }],
    terminal: '$ ksau upload --remote "OneDrive:/backup" ./infra\n✓ Uploading terraform.tfstate [2.3MB]\n✓ Upload complete in 1.2s',
  },
  {
    title: 'K8au Shell Analyzer',
    stack: ['Go', 'TUI', 'LLM', 'AI'],
    year: '2024',
    description: 'Interactive terminal tool that analyzes shell command history to discover behavioral patterns using LLM-based NLP to cluster and summarize usage insights.',
    links: [{ label: 'GitHub', href: 'https://github.com/ksauraj/k8au-shell-analyzer' }],
    terminal: '$ k8au analyze --history ~/.zsh_history\n📊 Analyzing 4,231 commands...\n🔍 Top patterns: docker (34%) · git (28%) · kubectl (18%)',
  },
  {
    title: 'JEE Counsellor',
    stack: ['Python', 'Terminal UX'],
    year: '2023',
    description: 'Terminal tool to help students navigate JEE counselling. Parses official seat allotment data and provides personalized college suggestions via interactive terminal UI.',
    links: [{ label: 'GitHub', href: 'https://github.com/ksauraj/jee_counsellor' }],
    terminal: '$ jee-counsellor --rank 8500 --category OBC-NCL\n🎓 Top matches: NIT Warangal · NIT Trichy · IIIT Hyderabad',
  },
  {
    title: 'Android Automation',
    stack: ['Python', 'GitHub API', 'GitLab API', 'Telegram API'],
    year: '2022',
    description: 'Telegram Bot-powered service that automates Android firmware dumps, recovery creation, and repo setup. Streamlines custom ROM contributions with minimal manual input.',
    links: [{ label: 'GitHub', href: 'https://github.com/autoandroida' }],
    terminal: '$ /dump RMX2151 --upload --create-repo\n✓ Firmware dumped (4.2GB)\n✓ Repo created: github.com/autoandroida/RMX2151',
  },
  {
    title: 'Telegram Bash Bot',
    stack: ['Bash', 'Telegram API'],
    year: '2022',
    description: 'Full-featured Telegram bot built entirely in Bash, capable of performing API-driven tasks. Used as a base template for Bash-based bot development.',
    links: [{ label: 'GitHub', href: 'https://github.com/ksauraj/telegram-bash-bot' }],
    terminal: '$ bash bot.sh --token $TG_TOKEN\n🤖 Bot running... Listening for updates\n✓ Command /ping → responded in 142ms',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-8 lg:px-16">
      <ScrollReveal>
        <div className="inline-flex border border-border px-3 py-1.5 mb-8">
          <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ Selected Projects ]</span>
        </div>
        <h2 className="font-display font-semibold text-white text-5xl lg:text-6xl leading-tight mb-16">
          <TypewriterText
            phrases={["Stuff I've built and", "Things I've automated,"]}
            className="block"
          />
          <span className="block">had fun breaking.</span>
        </h2>
      </ScrollReveal>

      <div className="space-y-6">
        {projects.map((project, i) => (
          <ScrollReveal key={i} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -4, borderColor: '#444' }}
              className="border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,255,255,0.04)]"
            >
              {/* Mock terminal chrome */}
              <div className="bg-surface border-b border-border px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <span className="font-mono text-xs text-muted ml-3">
                  ~/projects/{project.title.toLowerCase().replace(/\s+/g, '-')}
                </span>
              </div>
              {/* Terminal output */}
              <div className="bg-[#050505] px-6 py-5 font-mono text-xs text-white/50 leading-relaxed min-h-[80px]">
                {project.terminal.split('\n').map((line, li) => (
                  <div key={li} className={li === 0 ? 'text-white/80' : ''}>{line}</div>
                ))}
              </div>
              {/* Card content */}
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((s) => (
                    <span key={s} className="font-mono text-xs border border-border text-muted px-2 py-1">{s}</span>
                  ))}
                  <span className="font-mono text-xs text-white/20 ml-auto self-center">{project.year}</span>
                </div>
                <h3 className="font-display font-semibold text-white text-2xl mb-3">{project.title}</h3>
                <p className="font-body text-sm text-muted leading-relaxed mb-6">{project.description}</p>
                <div className="flex gap-4">
                  {project.links.map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="font-mono text-xs text-white/60 hover:text-white border border-border hover:border-white/40 px-4 py-2 transition-all duration-200">
                      [{link.label}]
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

### `components/sections/Footer.tsx`

```tsx
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Footer() {
  return (
    <section id="contact" className="relative min-h-screen flex overflow-hidden bg-black">
      {/* LEFT: Photo panel — add your photo to /public/sauraj.jpg */}
      <div className="w-[38%] relative hidden lg:block">
        <Image
          src="/sauraj.jpg"
          alt="Sauraj Kumar Singh"
          fill
          className="object-cover object-top grayscale contrast-110"
          style={{ objectPosition: 'center top' }}
        />
      </div>

      {/* RIGHT: Content */}
      <div className="flex-1 flex flex-col justify-between p-12 lg:p-16 relative">
        {/* Giant name */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex items-center"
        >
          <h2
            className="font-display font-bold text-white leading-[0.9]"
            style={{ fontSize: 'clamp(60px, 10vw, 160px)' }}
          >
            Sauraj/&gt;<br />DevOps
          </h2>
        </motion.div>

        {/* SVG squiggle decoration */}
        <motion.svg
          className="absolute right-24 top-1/2 -translate-y-1/2 text-white/20"
          width="80" height="60" viewBox="0 0 80 60" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <motion.path
            d="M10 30 C20 10, 30 50, 40 30 C50 10, 60 50, 70 30"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* Contact info */}
        <div className="mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <a href="mailto:ksauraj1@gmail.com"
              className="font-mono text-sm text-muted hover:text-white transition-colors">
              ksauraj1@gmail.com
            </a>
            <span className="font-mono text-sm text-muted">+91-8986328898</span>
          </div>

          <div className="flex gap-6 mb-8">
            {[
              { label: 'GitHub', href: 'https://github.com/ksauraj' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/sauraj-kumar-singh-807295226' },
              { label: 'Website', href: 'https://ksauraj.eu.org' },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs text-muted hover:text-white transition-colors tracking-widest uppercase">
                {s.label}
              </a>
            ))}
          </div>

          <p className="font-mono text-xs text-muted/50 tracking-widest">
            © 2025 Sauraj Kumar Singh · Built in Noida, India
          </p>
        </div>
      </div>
    </section>
  )
}
```

### `app/layout.tsx`

```tsx
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

export const metadata: Metadata = {
  title: 'Sauraj Kumar Singh | DevOps Engineer',
  description: 'DevOps Engineer & Open Source contributor. Building scalable infrastructure with Docker, Kubernetes, Terraform, AWS, and Azure.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white font-body antialiased cursor-none overflow-x-hidden">
        <CustomCursor />
        <MouseGlow />
        {children}
      </body>
    </html>
  )
}
```

### `app/page.tsx`

```tsx
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import OpenSource from '@/components/sections/OpenSource'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <OpenSource />
      <Footer />
    </main>
  )
}
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Tailwind directives ONLY — no custom CSS below this line */
```

### `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#0D0D0D',
        card: '#080808',
        border: '#1A1A1A',
        'border-hover': '#444444',
        muted: '#888888',
        'muted-dark': '#444444',
        fg: '#FFFFFF',
        'fg-dim': '#CCCCCC',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

---

## COLOUR SCHEME REFERENCE

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#000000` | Page, sections |
| Surface | `#0D0D0D` | Skill pills, card headers |
| Card | `#080808` | Experience + project cards |
| Border | `#1A1A1A` | All borders, dividers |
| Border hover | `#444444` | Card hover state |
| Muted | `#888888` | Secondary text, tags |
| White | `#FFFFFF` | Primary text, headings |
| Contact button | `#FFFFFF` bg + `#000000` text | Nav CTA |

---

## PHOTO INSTRUCTIONS (for Footer)

1. Add your photo as `/public/sauraj.jpg`
2. It renders in the Footer left panel with:
   - `className="object-cover grayscale contrast-110"`
   - Bottom-anchored, fills the full left column
   - No border, no border-radius — bleeds to edge
3. If no photo yet: replace `<Image>` with a `<div className="w-full h-full bg-surface" />` placeholder

---

## OPEN SOURCE SECTION

Build `components/sections/OpenSource.tsx` following the same card pattern as Projects:
- **CipherOS** — Android ROM for RMX2151, GitHub Actions CI/CD, cipheros.online
- **PixelPlusUI** — Android ROM builds, OTA updates, ppui.site, XDA thread

Use the same `motion.div` card with terminal chrome mockup.

---

## ABOUT SECTION

Build `components/sections/About.tsx`:
- Left 60%: Large paragraph `Space Grotesk 28–36px` — "I'm a DevOps Engineer & Open Source contributor based in Noida, India..."
- Right 40%: MBTI badge `[ INTP ]` + stat cards using `<CountUp>` component
  - `2+` yrs Open Source
  - `2` Internships
  - `5+` Projects
  - `10+` Cloud tools

---

## CHECKLIST BEFORE SHIPPING

- [ ] `cursor: none` on `body` (hide default cursor)
- [ ] `CustomCursor` and `MouseGlow` rendered at root layout level
- [ ] All sections use `ScrollReveal` wrapper for entrance animations
- [ ] `Marquee` has `overflow-hidden` parent
- [ ] Fonts loaded from `@fontsource` packages (not Google CDN link)
- [ ] `Image` component used (not `<img>`) for photo
- [ ] `'use client'` directive on every component using hooks or Framer Motion
- [ ] All motion components import from `framer-motion` npm package
- [ ] Zero vanilla JS, zero CSS files, zero `style={{}}` inline objects
- [ ] Deploy to Vercel: `vercel --prod`