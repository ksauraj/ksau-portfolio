'use client'
import { useEffect, useRef, useState, useCallback, KeyboardEvent } from 'react'

function delay(ms: number) { return new Promise<void>(res => setTimeout(res, ms)) }
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

// ─── Agent Quote Stream Data ──────────────────────────────────────────────────
const LOCAL_QUOTES = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Complexity is the enemy of reliability.", author: "Tony Hoare" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Abelson & Sussman" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Automation applied to an efficient operation will magnify the efficiency.", author: "Bill Gates" },
  { text: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.", author: "Edsger W. Dijkstra" },
  { text: "Computers are good at following instructions, but not at reading your mind.", author: "Donald Knuth" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Software is a great combination of artistry and engineering.", author: "Bill Gates" },
  { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
  { text: "The digital revolution is far more significant than the invention of writing or even of printing.", author: "Douglas Engelbart" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "If you think technology can solve your security problems, then you don't understand the problems and you don't understand the technology.", author: "Bruce Schneier" },
  { text: "One of my most productive days was throwing away 1000 lines of code.", author: "Ken Thompson" },
  { text: "The function of good software is to make the complex appear simple.", author: "Grady Booch" },
  { text: "Security is not a product, but a process.", author: "Bruce Schneier" }
]

interface AgentDashboardProps {
  mode: 'auto' | 'manual'
  activeCategory: string | null
  auditedCategories: string[]
  ctxUsed: number
  ctxPct: number
  tokensIn: number
  tokensOut: number
  quote: string
  quoteAuthor: string
}

function AgentDashboard({
  mode,
  activeCategory,
  auditedCategories,
  ctxUsed,
  ctxPct,
  tokensIn,
  tokensOut,
  quote,
  quoteAuthor,
}: AgentDashboardProps) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      borderLeft: '1px solid #111',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 14px',
      boxSizing: 'border-box',
    }}>
      {/* 1. Mode status / warning banner */}
      {mode === 'auto' ? (
        <div style={{
          border: '1px solid #222',
          background: '#0d0d0d',
          borderRadius: '4px',
          padding: '6px 8px',
          marginBottom: '8px',
        }}>
          <div style={{ color: '#aaa', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#888', animation: 'blink 0.8s step-end infinite' }} />
            agent: fully auto
          </div>
          <div style={{ color: '#666', fontSize: '10px', lineHeight: '1.4' }}>
            Running autonomously. Switch to <strong>manual</strong> at bottom-right for full terminal access.
          </div>
        </div>
      ) : (
        <div style={{
          border: '1px solid #222',
          background: '#0d0d0d',
          borderRadius: '4px',
          padding: '6px 8px',
          marginBottom: '8px',
        }}>
          <div style={{ color: '#aaa', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#888' }} />
            system: manual control
          </div>
          <div style={{ color: '#666', fontSize: '10px', lineHeight: '1.4' }}>
            Manual session override active. Type `help` to see list of available terminal commands.
          </div>
        </div>
      )}

      {/* 2. Developer prompt */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>developer prompt</div>
        <div style={{ border: '1px solid #0f0f0f', background: '#050505', borderRadius: '4px', padding: '4px 6px', fontSize: '10px', color: '#666', lineHeight: '1.4', fontStyle: 'italic' }}>
          &quot;Automate the flow for user to check skills and evaluate DevOps capabilities.&quot;
        </div>
      </div>

      {/* 3. Task Pipeline */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>execution pipeline</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#666' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: mode === 'auto' ? '#444' : '#666' }}>
            <span style={{ color: '#888' }}>✔</span>
            <span>resolve identity (whoami)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: auditedCategories.length > 0 || mode === 'manual' ? '#888' : '#333' }}>
              {auditedCategories.length > 0 || mode === 'manual' ? '✔' : '○'}
            </span>
            <span style={{ color: auditedCategories.length > 0 || mode === 'manual' ? '#666' : '#333' }}>scan namespaces (ls)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: activeCategory ? '#fff' : (auditedCategories.length >= ALL_CATS.length || mode === 'manual' ? '#888' : '#333') }}>
              {activeCategory ? '▶' : (auditedCategories.length >= ALL_CATS.length || mode === 'manual' ? '✔' : '○')}
            </span>
            <span style={{ color: activeCategory ? '#fff' : (auditedCategories.length >= ALL_CATS.length || mode === 'manual' ? '#666' : '#333') }}>
              audit domains {activeCategory && <span style={{ color: '#444', fontSize: '10px' }}>({activeCategory})</span>}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: auditedCategories.length >= ALL_CATS.length || mode === 'manual' ? '#888' : '#333' }}>
              {auditedCategories.length >= ALL_CATS.length || mode === 'manual' ? '✔' : '○'}
            </span>
            <span style={{ color: auditedCategories.length >= ALL_CATS.length || mode === 'manual' ? '#666' : '#333' }}>verify workspace paths (pwd)</span>
          </div>
        </div>
      </div>

      {/* 4. Domain checklist */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>domain checklist</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px' }}>
          {ALL_CATS.map(cat => {
            const isActive = activeCategory === cat
            const isAudited = auditedCategories.includes(cat) || mode === 'manual'
            return (
              <div key={cat} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? '#fff' : (isAudited ? '#555' : '#222'),
                fontWeight: isActive ? 'bold' : 'normal',
                transition: 'color 0.2s',
              }}>
                <span style={{ color: isActive ? '#fff' : (isAudited ? '#888' : '#222'), fontSize: '10px' }}>
                  {isActive ? '▶' : (isAudited ? '☒' : '☐')}
                </span>
                <span style={{ fontSize: '10px' }}>{cat}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Cognitive Metrics */}
      <div style={{ marginBottom: '8px', borderTop: '1px dashed #151515', paddingTop: '6px' }}>
        <div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>cognitive metrics</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '10px', color: '#555', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#333' }}>MODEL:</span>
            <span style={{ color: '#666' }}>gemini-3.5-flash-high</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#333' }}>TEMP:</span>
            <span style={{ color: '#666' }}>0.2 (deterministic)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#333' }}>CTX LIMIT:</span>
            <span style={{ color: '#666' }}>128,000 tok</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#333' }}>CTX USED:</span>
            <span style={{ color: '#666' }}>{ctxUsed.toLocaleString()} ({ctxPct.toFixed(1)}%)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#333' }}>TOKENS IN:</span>
            <span style={{ color: '#666' }}>{tokensIn.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#333' }}>TOKENS OUT:</span>
            <span style={{ color: '#666' }}>{tokensOut.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 6. Quote stream */}
      <div style={{ borderTop: '1px dashed #151515', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
        <div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>cognitive quote stream</span>
          <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: '#444', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
        <div style={{ color: '#666', fontSize: '10px', fontStyle: 'italic', lineHeight: '1.3', minHeight: '30px', display: 'flex', alignItems: 'center' }}>
          &quot;{quote}&quot;
        </div>
        <div style={{ color: '#2a2a2a', fontSize: '9px', textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          — {quoteAuthor}
        </div>
      </div>
    </div>
  )
}

// ─── Skill Data ───────────────────────────────────────────────────────────────
interface Skill { name: string; icon: string }
interface Category { icon: string; label: string; skills: Skill[] }

const CATS: Record<string, Category> = {
  languages: { icon: 'ti ti-code', label: 'languages', skills: [
    { name: 'Go', icon: 'devicon-go-original' },
    { name: 'Python', icon: 'devicon-python-plain' },
    { name: 'Bash', icon: 'devicon-bash-plain' },
    { name: 'C', icon: 'devicon-c-plain' },
    { name: 'JavaScript', icon: 'devicon-javascript-plain' },
    { name: 'HTML/CSS', icon: 'devicon-html5-plain' },
    { name: 'YAML', icon: 'ti ti-file-code' },
    { name: 'SQL', icon: 'ti ti-database' },
  ]},
  devops: { icon: 'ti ti-rocket', label: 'devops', skills: [
    { name: 'Docker', icon: 'devicon-docker-plain' },
    { name: 'Kubernetes', icon: 'devicon-kubernetes-plain' },
    { name: 'Helm', icon: 'devicon-helm-plain' },
    { name: 'GitHub Actions', icon: 'devicon-github-original' },
    { name: 'GitLab CI', icon: 'devicon-gitlab-plain' },
    { name: 'Ansible', icon: 'devicon-ansible-plain' },
    { name: 'Terraform', icon: 'devicon-terraform-plain' },
    { name: 'Makefile', icon: 'ti ti-hammer' },
    { name: 'Docker Compose', icon: 'devicon-docker-plain' },
    { name: 'CI/CD Pipelines', icon: 'ti ti-git-branch' },
    { name: 'IaC', icon: 'ti ti-code-dots' },
  ]},
  cloud: { icon: 'ti ti-cloud', label: 'cloud', skills: [
    { name: 'AWS', icon: 'devicon-amazonwebservices-plain' },
    { name: 'Azure', icon: 'devicon-azure-plain' },
    { name: 'GCP', icon: 'devicon-googlecloud-plain' },
    { name: 'Oracle Cloud', icon: 'devicon-oracle-original' },
    { name: 'Linode', icon: 'ti ti-server' },
    { name: 'Auto Scaling', icon: 'ti ti-arrows-maximize' },
    { name: 'VPC / ALB', icon: 'ti ti-network' },
    { name: 'Microsoft Graph API', icon: 'ti ti-brand-azure' },
  ]},
  monitoring: { icon: 'ti ti-chart-line', label: 'monitoring', skills: [
    { name: 'Prometheus', icon: 'devicon-prometheus-original' },
    { name: 'Grafana', icon: 'devicon-grafana-original' },
    { name: 'Loki', icon: 'ti ti-logs' },
    { name: 'Promtail', icon: 'ti ti-file-search' },
    { name: 'Node Exporter', icon: 'ti ti-cpu' },
    { name: 'cAdvisor', icon: 'ti ti-chart-dots' },
    { name: 'Wazuh', icon: 'ti ti-shield-search' },
  ]},
  networking: { icon: 'ti ti-topology-star', label: 'networking', skills: [
    { name: 'TCP/IP', icon: 'ti ti-network' },
    { name: 'DNS', icon: 'ti ti-world' },
    { name: 'HTTP/HTTPS', icon: 'ti ti-http-connect' },
    { name: 'TLS/SSL', icon: 'ti ti-lock' },
    { name: 'Load Balancing', icon: 'ti ti-arrows-split' },
    { name: 'Reverse Proxies', icon: 'ti ti-replace' },
    { name: 'Routing', icon: 'ti ti-route' },
    { name: 'Subnetting', icon: 'ti ti-binary-tree' },
    { name: 'VPN', icon: 'ti ti-shield-lock' },
    { name: 'API Gateways', icon: 'ti ti-api' },
  ]},
  security: { icon: 'ti ti-shield-check', label: 'security', skills: [
    { name: 'HashiCorp Vault', icon: 'devicon-vault-original' },
    { name: 'Container Security', icon: 'ti ti-container' },
    { name: 'Secret Management', icon: 'ti ti-key' },
    { name: 'SBOM Generation', icon: 'ti ti-list-check' },
    { name: 'Vulnerability Scanning', icon: 'ti ti-bug' },
    { name: 'Security Automation', icon: 'ti ti-robot' },
    { name: 'PCI DSS', icon: 'ti ti-credit-card' },
    { name: 'DDoS Detection', icon: 'ti ti-radar' },
    { name: 'Access Control', icon: 'ti ti-user-check' },
  ]},
  databases: { icon: 'ti ti-database', label: 'databases', skills: [
    { name: 'MySQL', icon: 'devicon-mysql-original' },
    { name: 'Database Design', icon: 'ti ti-table' },
    { name: 'Query Optimization', icon: 'ti ti-zoom-code' },
  ]},
  linux: { icon: 'ti ti-terminal-2', label: 'linux', skills: [
    { name: 'Linux', icon: 'devicon-linux-plain' },
    { name: 'Systemd', icon: 'ti ti-settings-automation' },
    { name: 'Shell Scripting', icon: 'devicon-bash-plain' },
    { name: 'Tmux', icon: 'ti ti-layout-columns' },
    { name: 'Vim', icon: 'devicon-vim-plain' },
    { name: 'Process Management', icon: 'ti ti-cpu' },
    { name: 'Server Administration', icon: 'ti ti-server-cog' },
  ]},
  tools: { icon: 'ti ti-tools', label: 'tools', skills: [
    { name: 'Git', icon: 'devicon-git-plain' },
    { name: 'Nginx', icon: 'devicon-nginx-original' },
    { name: 'Caddy', icon: 'ti ti-server' },
    { name: 'Heroku', icon: 'devicon-heroku-original' },
    { name: 'Railway', icon: 'ti ti-train' },
    { name: 'Kong Gateway', icon: 'ti ti-topology-ring' },
    { name: 'REST APIs', icon: 'ti ti-api' },
    { name: 'Webhooks', icon: 'ti ti-webhook' },
    { name: 'Cirrus CI', icon: 'ti ti-circle-check' },
    { name: 'Android Build System', icon: 'devicon-android-plain' },
  ]},
}

const ALL_COMMANDS = ['ls', 'whoami', 'clear', 'help', 'pwd', 'sudo', 'vim', 'cd', 'rm', 'cat']
const ALL_CATS = Object.keys(CATS)

// ─── Agent narrative pools ────────────────────────────────────────────────────
const TASK_INIT = [
  '⊕ Task received: audit complete skill profile for sauraj',
  '⊕ Objective: enumerate and inspect all technical competencies',
  '⊕ Starting skill audit - full autonomous mode, no confirmation needed',
]

const WHOAMI_THINK = [
  '  ↳ resolving subject identity before proceeding with audit',
  '  ↳ fetching user context from environment',
  '  ↳ need to establish who we\'re profiling before diving in',
]

const LS_THINK = [
  '  ↳ scanning available skill namespaces',
  '  ↳ reading category index - mapping the full stack surface',
  '  ↳ enumerating all competency domains',
]

const CAT_THINK: Record<string, string[]> = {
  languages: [
    '  ↳ inspecting language stack - this is the foundation',
    '  ↳ checking core language fluency',
    '  ↳ reading programming language inventory',
  ],
  devops: [
    '  ↳ devops toolchain is the critical path - checking it next',
    '  ↳ enumerating automation and delivery stack',
    '  ↳ this is where the pipelines live - inspecting',
  ],
  cloud: [
    '  ↳ pulling cloud provider coverage',
    '  ↳ checking multi-cloud footprint',
    '  ↳ reading platform-level infrastructure skills',
  ],
  monitoring: [
    '  ↳ observability stack - the eyes and ears',
    '  ↳ checking what telemetry tools are in play',
    '  ↳ reading monitoring and alerting coverage',
  ],
  networking: [
    '  ↳ networking fundamentals - checking depth here',
    '  ↳ inspecting the network layer knowledge',
    '  ↳ routing, proxies, load balancing - reading it all',
  ],
  security: [
    '  ↳ devsecops posture - important to get this right',
    '  ↳ checking security tooling and practices',
    '  ↳ reading the security domain coverage',
  ],
  databases: [
    '  ↳ checking database layer proficiency',
    '  ↳ reading persistence and query skills',
    '  ↳ inspecting data layer tooling',
  ],
  linux: [
    '  ↳ systems layer - checking low-level proficiency',
    '  ↳ linux and systems administration skills next',
    '  ↳ reading kernel-adjacent and ops tooling',
  ],
  tools: [
    '  ↳ wrapping up - toolchain and ecosystem coverage',
    '  ↳ reading the broader tooling inventory',
    '  ↳ checking remaining tools and integrations',
  ],
}

const CAT_DONE: Record<string, string[]> = {
  languages:  ['  ✓ strong polyglot foundation - Go and Python are production-grade', '  ✓ solid language breadth across systems and scripting domains'],
  devops:     ['  ✓ devops stack is comprehensive - container-native through-and-through', '  ✓ the whole delivery pipeline is covered here, impressive depth'],
  cloud:      ['  ✓ multi-cloud exposure across AWS, Azure, GCP - that\'s rare', '  ✓ solid cloud coverage, not locked into one vendor'],
  monitoring: ['  ✓ observability stack is production-ready - Prometheus + Grafana + Loki is the gold standard', '  ✓ good telemetry coverage, knows how to keep systems transparent'],
  networking: ['  ✓ networking fundamentals are solid - VPN through API gateways covered', '  ✓ good depth on the network layer, not just surface-level'],
  security:   ['  ✓ devsecops posture looks strong - Vault + container security is the right call', '  ✓ security automation is there, which is non-trivial to get right'],
  databases:  ['  ✓ lean but focused - MySQL with design and optimization awareness', '  ✓ db coverage is sufficient for infrastructure-focused work'],
  linux:      ['  ✓ deep linux fluency - systemd, Vim, Tmux, process management. the real deal', '  ✓ strong systems foundation, commands the box'],
  tools:      ['  ✓ ecosystem coverage looks complete - audit done', '  ✓ toolchain is well-rounded, wraps up a thorough profile'],
}

const PWD_THINK = [
  '  ↳ confirming working context before closing audit',
  '  ↳ checking execution environment',
]

// ─── Line Types ───────────────────────────────────────────────────────────────
type Line =
  | { type: 'prompt'; cmd: string }
  | { type: 'text'; text: string; dim?: boolean }
  | { type: 'agent'; text: string }
  | { type: 'ls-header' }
  | { type: 'ls-grid' }
  | { type: 'cat-header'; key: string }
  | { type: 'cat-grid'; key: string }
  | { type: 'spacer' }

// ─── Command Handler ──────────────────────────────────────────────────────────
function runCommand(raw: string): Line[] {
  const trimmed = raw.trim()
  const parts = trimmed.split(/\s+/)
  const cmd = parts[0]?.toLowerCase() ?? ''
  const arg = parts.slice(1).join(' ').toLowerCase()
  if (!cmd) return []

  if (cmd === 'clear') return [{ type: 'prompt', cmd: 'clear' }]
  const out: Line[] = [{ type: 'prompt', cmd: trimmed }]

  if (cmd === 'ls' && !arg) {
    out.push({ type: 'ls-header' })
    out.push({ type: 'ls-grid' })
    out.push({ type: 'spacer' })
    return out
  }

  if (cmd === 'ls' && arg) {
    const key = ALL_CATS.find(k => k === arg || k.startsWith(arg))
    if (!key) {
      out.push({ type: 'text', text: `ls: ${arg}: no such category - try ls`, dim: true })
    } else {
      out.push({ type: 'cat-header', key })
      out.push({ type: 'cat-grid', key })
    }
    out.push({ type: 'spacer' })
    return out
  }

  if (cmd === 'help') {
    out.push({ type: 'text', text: 'available commands:', dim: true })
    out.push({ type: 'text', text: '  ls              list all skill categories' })
    out.push({ type: 'text', text: '  ls <category>   show skills in a category' })
    out.push({ type: 'text', text: '  whoami          about me' })
    out.push({ type: 'text', text: '  clear           clear terminal' })
    out.push({ type: 'text', text: '  pwd             current path' })
    out.push({ type: 'text', text: '' })
    out.push({ type: 'text', text: 'categories: ' + ALL_CATS.join('  '), dim: true })
    out.push({ type: 'spacer' })
    return out
  }

  if (cmd === 'whoami') {
    out.push({ type: 'text', text: 'sauraj - devops engineer & open source contributor' })
    out.push({ type: 'text', text: 'i build pipelines so your load never bursts.' })
    out.push({ type: 'text', text: 'self-healing clusters, zero-downtime deploys,' })
    out.push({ type: 'text', text: 'ci/cd that ships while you sleep.' })
    out.push({ type: 'spacer' })
    return out
  }

  if (cmd === 'pwd') {
    out.push({ type: 'text', text: '/home/sauraj/skills' })
    out.push({ type: 'spacer' })
    return out
  }

  if (cmd === 'sudo') {
    out.push({ type: 'text', text: 'nice try. no root for visitors.', dim: true })
    out.push({ type: 'spacer' })
    return out
  }
  if (cmd === 'vim') {
    out.push({ type: 'text', text: "you can't exit. you know this.", dim: true })
    out.push({ type: 'spacer' })
    return out
  }
  if (cmd === 'cd') {
    out.push({ type: 'text', text: "permission denied: you're already at root.", dim: true })
    out.push({ type: 'spacer' })
    return out
  }
  if (trimmed === 'rm -rf /') {
    out.push({ type: 'text', text: 'lol. nice try. system intact.', dim: true })
    out.push({ type: 'spacer' })
    return out
  }
  if (cmd === 'cat' && arg.includes('resume')) {
    out.push({ type: 'text', text: 'opening resume.pdf...' })
    out.push({ type: 'spacer' })
    return out
  }

  out.push({ type: 'text', text: `command not found: ${cmd} - try help`, dim: true })
  out.push({ type: 'spacer' })
  return out
}

// ─── Sub-renders ──────────────────────────────────────────────────────────────
const FS = '14px'     // base font size for output
const FSS = '12px'    // small labels

function LsHeader() {
  return (
    <div style={{ color: '#3a3a3a', fontSize: FSS, letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: '1px solid #111', paddingBottom: '6px', marginBottom: '8px', fontFamily: 'monospace' }}>
      skill categories
    </div>
  )
}

function LsGrid() {
  const rows: string[][] = []
  for (let i = 0; i < ALL_CATS.length; i += 2) rows.push([ALL_CATS[i], ALL_CATS[i + 1]].filter(Boolean) as string[])
  return (
    <div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '3px' }}>
          {row.map(k => {
            const cat = CATS[k]
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontFamily: 'monospace' }}>
                <i className={cat.icon} style={{ fontSize: '14px', color: '#555', width: '16px', textAlign: 'center', flexShrink: 0 }} />
                <span style={{ color: '#aaa', fontSize: FS }}>{cat.label}/</span>
                <span style={{ color: '#444', fontSize: FSS }}>({cat.skills.length})</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function CatHeader({ catKey }: { catKey: string }) {
  const cat = CATS[catKey]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3a3a3a', fontSize: FSS, letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: '1px solid #111', paddingBottom: '6px', marginBottom: '8px', fontFamily: 'monospace' }}>
      <i className={cat.icon} style={{ fontSize: '13px' }} />
      {cat.label}
    </div>
  )
}

function CatGrid({ catKey }: { catKey: string }) {
  const cat = CATS[catKey]
  const rows: Skill[][] = []
  for (let i = 0; i < cat.skills.length; i += 2) rows.push([cat.skills[i], cat.skills[i + 1]].filter(Boolean) as Skill[])
  return (
    <div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          {row.map(skill => (
            <div
              key={skill.name}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 6px', cursor: 'default', borderRadius: '2px', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0d0d0d')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <i
                className={skill.icon}
                style={{ fontSize: '15px', color: '#666', flexShrink: 0, transition: 'color 0.15s, filter 0.15s', filter: skill.icon.startsWith('devicon') ? 'grayscale(1) brightness(0.6)' : 'none' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; if (skill.icon.startsWith('devicon')) el.style.filter = 'grayscale(1) brightness(1.2)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#666'; if (skill.icon.startsWith('devicon')) el.style.filter = 'grayscale(1) brightness(0.6)' }}
              />
              <span
                style={{ fontSize: FS, color: '#999', fontFamily: 'monospace', transition: 'color 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#999')}
              >{skill.name}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Spinner + Progress ───────────────────────────────────────────────────────
function SpinningArc() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'inline-block', verticalAlign: 'middle', animation: 'spin 1.1s linear infinite', flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
      <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FillingCircle({ progress }: { progress: number }) {
  const r = 5; const circ = 2 * Math.PI * r
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="7" cy="7" r={r} fill="none" stroke="#1e1e1e" strokeWidth="1.5" />
      <circle cx="7" cy="7" r={r} fill="none" stroke="#666" strokeWidth="1.5"
        strokeDasharray={`${circ * progress} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 7 7)" style={{ transition: 'stroke-dasharray 0.25s ease' }} />
    </svg>
  )
}

// ─── Counters ─────────────────────────────────────────────────────────────────
function useTokenCounter(running: boolean) {
  const [tokens, setTokens] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setTokens(t => t + rand(6, 28)), 220)
    return () => clearInterval(id)
  }, [running])
  return tokens
}

function useElapsed(running: boolean) {
  const [ms, setMs] = useState(0)
  const startRef = useRef(0)
  useEffect(() => {
    if (!running) { setMs(0); return }
    startRef.current = Date.now()
    const id = setInterval(() => setMs(Date.now() - startRef.current), 500)
    return () => clearInterval(id)
  }, [running])
  const s = Math.floor(ms / 1000); const m = Math.floor(s / 60)
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}

// ─── Auto-mode engine ─────────────────────────────────────────────────────────
const AUTO_SEQUENCE = ['whoami', 'ls', ...ALL_CATS.map(c => `ls ${c}`), 'pwd']

// Type text character by character into the line set - slow for thinking, fast for commands
async function typewriterAppend(
  text: string,
  msPerChar: number,
  setTyping: (t: string) => void,
  cancelled: () => boolean,
) {
  for (let i = 1; i <= text.length; i++) {
    if (cancelled()) return
    setTyping(text.slice(0, i))
    await delay(msPerChar + rand(-10, 10))
  }
}

function useAutoMode(
  active: boolean,
  setLines: React.Dispatch<React.SetStateAction<Line[]>>,
  setTyping: React.Dispatch<React.SetStateAction<string>>,
  setThinkText: React.Dispatch<React.SetStateAction<string>>,
  setAgentProgress: React.Dispatch<React.SetStateAction<number>>,
  scrollToBottom: () => void,
  setActiveCategory: (cat: string | null) => void,
  setAuditedCategories: React.Dispatch<React.SetStateAction<string[]>>,
  markCommandStart: () => void,
  scrollToCommandStart: () => void,
) {
  const seqRef = useRef(0)
  const firstRunRef = useRef(true)

  useEffect(() => {
    if (!active) { setTyping(''); setThinkText(''); return }
    let dead = false
    const cancelled = () => dead

    async function run() {
      // One-time task init message on very first run
      if (firstRunRef.current) {
        firstRunRef.current = false
        const initMsg = pick(TASK_INIT)
        setLines(prev => [...prev, { type: 'agent', text: initMsg }])
        scrollToBottom()
        await delay(1800)
        if (cancelled()) return
        setLines(prev => [...prev, { type: 'spacer' }])
      }

      while (!cancelled()) {
        const cmd = AUTO_SEQUENCE[seqRef.current % AUTO_SEQUENCE.length]
        if (seqRef.current % AUTO_SEQUENCE.length === 0) {
          setAuditedCategories([])
        }
        seqRef.current++
        const cat = cmd.startsWith('ls ') ? cmd.slice(3) : null

        setActiveCategory(cat)
        markCommandStart()

        // 1. Pick and typewrite the thinking line (slow, like agent narrating)
        let thinkMsg = ''
        if (cmd === 'whoami') thinkMsg = pick(WHOAMI_THINK)
        else if (cmd === 'ls' && !cat) thinkMsg = pick(LS_THINK)
        else if (cat && CAT_THINK[cat]) thinkMsg = pick(CAT_THINK[cat])
        else if (cmd === 'pwd') thinkMsg = pick(PWD_THINK)

        if (thinkMsg) {
          setThinkText('')
          await typewriterAppend(thinkMsg, 56, t => { setThinkText(t); scrollToCommandStart() }, cancelled)
          if (cancelled()) return
          await delay(rand(1000, 1800))
          if (cancelled()) return
          setLines(prev => [...prev, { type: 'agent', text: thinkMsg }])
          setThinkText('')
          scrollToCommandStart()
          await delay(rand(600, 1200))
          if (cancelled()) return
        }

        // 2. Typewrite the command (fast - commands always snap in)
        for (let i = 0; i <= cmd.length; i++) {
          if (cancelled()) return
          setTyping(cmd.slice(0, i))
          scrollToCommandStart()
          await delay(55 + rand(-10, 15))
        }
        await delay(640)
        if (cancelled()) return
        setTyping('')

        // 3. Animate progress fill while "executing"
        for (let p = 0; p <= 12; p++) {
          if (cancelled()) return
          setAgentProgress(p / 12)
          await delay(180)
        }
        if (cancelled()) return

        // 4. Append results
        const result = runCommand(cmd)
        const withoutPrompt = result.filter(l => l.type !== 'prompt')
        const tokensUsed = rand(1200, 5800)
        const ctxPct = rand(8, 22)

        setLines(prev => { const next = [...prev, { type: 'prompt', cmd } as Line, ...withoutPrompt]; return next.length > 80 ? next.slice(-80) : next; })
        setAgentProgress(0)
        scrollToBottom()

        if (cat) {
          setAuditedCategories(prev => [...prev, cat])
        }

        await delay(rand(800, 1400))
        if (cancelled()) return

        // 5. Post-command commentary - typewrite slowly
        const doneMsg = cat && CAT_DONE[cat] ? pick(CAT_DONE[cat]) : null
        const crunched = `  ✻ Crunched for ${rand(1, 8)}s · ${tokensUsed.toLocaleString()} tokens · ctx ${ctxPct}%`

        if (doneMsg) {
          setThinkText('')
          await typewriterAppend(doneMsg, 44, t => { setThinkText(t); scrollToCommandStart() }, cancelled)
          if (cancelled()) return
          await delay(400)
          setLines(prev => { const n: Line[] = [...prev, { type: 'agent' as const, text: doneMsg }]; return n.length > 80 ? n.slice(-80) : n; })
          setThinkText('')
          scrollToCommandStart()
          await delay(600)
          if (cancelled()) return
        }

        // Crunch line always appears
        setLines(prev => { const n: Line[] = [...prev, { type: 'agent' as const, text: crunched }]; return n.length > 80 ? n.slice(-80) : n; })
        scrollToBottom()

        // 6. Pause before next command - slow it way down
        const pause = cmd.startsWith('ls ') ? rand(7000, 10000) : rand(4000, 6400)
        await delay(pause)
      }
    }

    run()
    return () => { dead = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}

// ─── Error popup ──────────────────────────────────────────────────────────────
function ErrorPopup({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return (
    <div style={{
      position: 'absolute', bottom: '52px', left: '50%', transform: 'translateX(-50%)',
      background: '#0d0d0d', border: '1px solid #333', borderRadius: '6px',
      padding: '10px 18px', zIndex: 50, fontFamily: 'monospace', fontSize: '13px', color: '#999',
      display: 'flex', alignItems: 'center', gap: '10px',
      animation: 'slideUp 0.22s ease-out', boxShadow: '0 4px 24px rgba(0,0,0,0.9)',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#666', fontSize: '15px' }}>⚠</span>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '15px', lineHeight: 1, padding: '0 0 0 8px' }}>×</button>
    </div>
  )
}

// ─── Icon buttons ─────────────────────────────────────────────────────────────
function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ background: 'transparent', border: '1px solid #333', borderRadius: '4px', color: '#666', width: '28px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#0d0d0d' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent' }}
    >{children}</button>
  )
}

function PowerIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" /><line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  )
}

function VolumeOffIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

// ─── Mode toggle button ───────────────────────────────────────────────────────
function ModeToggle({ mode, onClick }: { mode: 'auto' | 'manual'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: mode === 'auto' ? '#0d0d0d' : 'transparent',
        border: `1px solid ${mode === 'auto' ? '#444' : '#333'}`,
        borderRadius: '4px',
        color: mode === 'auto' ? '#bbb' : '#666',
        fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.06em',
        padding: '3px 12px', cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: '5px',
        animation: mode === 'auto' ? 'buttonGlowPulse 2.5s infinite' : 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = '#eee' }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = mode === 'auto' ? '#444' : '#333'
        e.currentTarget.style.color = mode === 'auto' ? '#bbb' : '#666'
      }}
    >
      {mode === 'auto'
        ? <><SpinnerDot /><span>auto</span></>
        : <><span style={{ color: '#555' }}>$</span><span>manual</span></>
      }
    </button>
  )
}

function SpinnerDot() {
  return <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#666', display: 'inline-block', animation: 'pulse 1.4s ease-in-out infinite' }} />
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TerminalSkills() {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [lines, setLines] = useState<Line[]>([])
  const [typingText, setTypingText] = useState('')    // command being typed
  const [thinkText, setThinkText] = useState('')      // thinking narration being typed
  const [agentProgress, setAgentProgress] = useState(0)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [booted, setBooted] = useState(false)
  const [popup, setPopup] = useState<string | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalContainerRef = useRef<HTMLDivElement>(null)

  // Agent states
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [auditedCategories, setAuditedCategories] = useState<string[]>([])
  const [quote, setQuote] = useState("Initializing cognitive processes...")
  const [quoteAuthor, setQuoteAuthor] = useState("System")

  const tokens = useTokenCounter(mode === 'auto')
  const elapsed = useElapsed(mode === 'auto')

  // Calculate dynamic input/output tokens based on running total
  const tokensIn = mode === 'auto' ? Math.floor(tokens * 0.72) + 2150 : 8420
  const tokensOut = mode === 'auto' ? Math.floor(tokens * 0.28) + 680 : 3410
  const ctxUsed = tokensIn + tokensOut
  const ctxPct = Math.min(100, (ctxUsed / 128000) * 100)

  const cmdStartIndexRef = useRef(0)

  const markCommandStart = useCallback(() => {
    setLines(prev => {
      cmdStartIndexRef.current = prev.length
      return prev
    })
  }, [])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight })
  }, [])

  const scrollToCommandStart = useCallback(() => {
    requestAnimationFrame(() => {
      const index = cmdStartIndexRef.current
      const container = outputRef.current
      const target = container?.querySelector(`#terminal-line-${index}`) as HTMLElement
      if (container && target) {
        container.scrollTo({
          top: Math.max(0, target.offsetTop - 16),
          behavior: 'smooth'
        })
      }
    })
  }, [])

  const loadRandomQuote = useCallback(async () => {
    try {
      const res = await fetch('https://api.adviceslip.com/advice', { cache: 'no-store' })
      if (!res.ok) throw new Error('API down')
      const data = await res.json()
      if (data && data.slip && data.slip.advice) {
        setQuote(data.slip.advice)
        setQuoteAuthor("Cognitive Engine")
        return
      }
    } catch {
      // Fallback handled below
    }
    const picked = pick(LOCAL_QUOTES)
    setQuote(picked.text)
    setQuoteAuthor(picked.author)
  }, [])

  useEffect(() => {
    loadRandomQuote()
    const interval = setInterval(loadRandomQuote, 15000)
    return () => clearInterval(interval)
  }, [loadRandomQuote])

  useEffect(() => {
    if (booted) return
    setBooted(true)
    setLines([{ type: 'text', text: 'skills.sh v1.0 - autonomous audit mode', dim: true }, { type: 'spacer' }])
  }, [booted])

  useAutoMode(
    mode === 'auto',
    setLines,
    setTypingText,
    setThinkText,
    setAgentProgress,
    scrollToBottom,
    setActiveCategory,
    setAuditedCategories,
    markCommandStart,
    scrollToCommandStart,
  )

  useEffect(() => {
    if (mode === 'manual' && booted) {
      setTypingText(''); setThinkText(''); setActiveCategory(null)
      const lsLines = runCommand('ls')
      setLines(prev => prev.some(l => l.type === 'prompt') ? prev : [...prev, ...lsLines])
      setTimeout(scrollToBottom, 50)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const appendLines = useCallback((newLines: Line[]) => {
    setLines(prev => {
      const first = newLines[0]
      if (first?.type === 'prompt' && (first as { type: 'prompt'; cmd: string }).cmd === 'clear') return []
      const next = [...prev, ...newLines]; return next.length > 80 ? next.slice(-80) : next
    })
    scrollToBottom()
  }, [scrollToBottom])

  const submit = useCallback((cmd: string) => {
    const trimmed = cmd.trim()
    setInput(''); setHistoryIdx(-1)
    if (trimmed) setHistory(prev => [trimmed, ...prev.slice(0, 49)])
    if (trimmed.toLowerCase().startsWith('cat') && trimmed.toLowerCase().includes('resume')) {
      const a = document.createElement('a'); a.href = '/resume.pdf'; a.download = 'resume.pdf'; a.click()
    }
    appendLines(runCommand(trimmed))
  }, [appendLines])

  const handleKey = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { submit(input); return }
    if (e.key === 'Tab') {
      e.preventDefault()
      const val = input.trim()
      if (val.startsWith('ls ')) {
        const match = ALL_CATS.find(c => c.startsWith(val.slice(3)))
        if (match) setInput('ls ' + match)
      } else {
        const match = ALL_COMMANDS.find(c => c.startsWith(val) && c !== val)
        if (match) setInput(match)
      }
      return
    }
    if (e.key === 'ArrowUp') { e.preventDefault(); const idx = Math.min(historyIdx + 1, history.length - 1); setHistoryIdx(idx); setInput(history[idx] ?? ''); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); const idx = Math.max(historyIdx - 1, -1); setHistoryIdx(idx); setInput(idx === -1 ? '' : (history[idx] ?? '')) }
  }, [input, history, historyIdx, submit])

  const renderLine = (line: Line, i: number) => {
    const id = `terminal-line-${i}`
    switch (line.type) {
      case 'prompt':
        return (
          <div id={id} key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontFamily: 'monospace', fontSize: FS }}>
            <span style={{ color: '#555' }}>visitor@portfolio:~$</span>
            <span style={{ color: '#fff' }}>{line.cmd}</span>
          </div>
        )
      case 'agent':
        return (
          <div id={id} key={i} style={{ fontFamily: 'monospace', fontSize: '13px', color: '#3a3a3a', padding: '1px 0', whiteSpace: 'pre-wrap' }}>
            {line.text}
          </div>
        )
      case 'text':
        return <div id={id} key={i} style={{ fontFamily: 'monospace', fontSize: FS, color: line.dim ? '#3a3a3a' : '#999', padding: '1px 0', whiteSpace: 'pre-wrap' }}>{line.text || ' '}</div>
      case 'spacer': return <div id={id} key={i} style={{ height: '10px' }} />
      case 'ls-header': return <div id={id} key={i}><LsHeader /></div>
      case 'ls-grid': return <div id={id} key={i}><LsGrid /></div>
      case 'cat-header': return <div id={id} key={i}><CatHeader catKey={line.key} /></div>
      case 'cat-grid': return <div id={id} key={i}><CatGrid catKey={line.key} /></div>
      default: return null
    }
  }

  return (
    <>
      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes slideUp  { from{opacity:0;transform:translate(-50%,8px)} to{opacity:1;transform:translate(-50%,0)} }
        @keyframes pulse    { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes fillPulse{ 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes buttonGlowPulse {
          0%, 100% {
            border-color: #333;
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.05);
          }
          50% {
            border-color: #666;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
            color: #fff;
          }
        }
      `}</style>

      <div ref={terminalContainerRef} role="region" aria-label="Skills terminal" style={{ background: '#000', border: '1px solid #2a2a2a', borderRadius: '10px', overflow: 'hidden', fontFamily: 'monospace', position: 'relative' }}>

        {/* Title bar */}
        <div style={{ background: '#0d0d0d', borderBottom: '1px solid #151515', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2a2a2a', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2a2a2a', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2a2a2a', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: '#444', fontSize: '11px', letterSpacing: '0.08em', margin: '0 auto', fontFamily: 'monospace' }}>portfolio - skills.sh</span>
          {mode === 'auto' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <SpinningArc />
              <span style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace', animation: 'fillPulse 2s ease-in-out infinite' }}>{elapsed}</span>
              <span style={{ color: '#2a2a2a' }}>·</span>
              <span style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace', animation: 'fillPulse 2s ease-in-out infinite', animationDelay: '0.4s' }}>{tokens.toLocaleString()} tok</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ display: 'flex' }}>
          <div
            style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', cursor: mode === 'manual' ? 'text' : 'default' }}
            onClick={() => mode === 'manual' && inputRef.current?.focus()}
          >
            <div ref={outputRef} role="log" aria-live="polite"
              style={{ padding: '16px', height: '420px', overflowY: 'auto', position: 'relative', scrollbarWidth: 'thin', scrollbarColor: '#222 #000' }}
            >
              {lines.map((line, i) => renderLine(line, i))}

              {/* Typewriter: thinking narration (slow) */}
              {mode === 'auto' && thinkText && (
                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#2e2e2e', padding: '1px 0' }}>
                  {thinkText}<span style={{ display: 'inline-block', width: '6px', height: '12px', background: '#333', verticalAlign: 'middle', animation: 'blink 0.9s step-end infinite', marginLeft: '2px' }} />
                </div>
              )}

              {/* Typewriter: command being typed (fast, at the prompt) */}
              {mode === 'auto' && !thinkText && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontSize: FS }}>
                  <span style={{ color: '#555' }}>visitor@portfolio:~$</span>
                  <span style={{ color: '#fff' }}>{typingText}</span>
                  <span style={{ display: 'inline-block', width: '7px', height: '14px', background: '#fff', opacity: 0.7, animation: 'blink 1s step-end infinite' }} />
                </div>
              )}
            </div>

            {/* Manual input */}
            {mode === 'manual' && (
              <div style={{ borderTop: '1px solid #151515', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#555', fontSize: FS, fontFamily: 'monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>visitor@portfolio:~$</span>
                <input
                  ref={inputRef} aria-label="Terminal input" value={input}
                  onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  spellCheck={false} autoCapitalize="off" autoCorrect="off" autoFocus
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: FS, fontFamily: 'monospace', width: '100%', caretColor: '#fff' }}
                  placeholder="try: ls  or  ls devops"
                />
              </div>
            )}
          </div>

          {/* ASCII panel */}
          <div className="hidden md:block" style={{ width: '35%', minWidth: '220px', flexShrink: 0 }}>
            <AgentDashboard
              mode={mode}
              activeCategory={activeCategory}
              auditedCategories={auditedCategories}
              ctxUsed={ctxUsed}
              ctxPct={ctxPct}
              tokensIn={tokensIn}
              tokensOut={tokensOut}
              quote={quote}
              quoteAuthor={quoteAuthor}
            />
          </div>
        </div>

        {/* Bottom toolbar */}
        <div style={{ background: '#060606', borderTop: '1px solid #111', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            {mode === 'auto' ? (
              <>
                <FillingCircle progress={agentProgress} />
                <span className="hidden sm:inline" style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace', animation: 'fillPulse 2.2s ease-in-out infinite', whiteSpace: 'nowrap' }}>
                  agent running · full auto · <span style={{ color: '#777' }}>switch to manual for control</span>
                </span>
                <span className="inline sm:hidden" style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace', animation: 'fillPulse 2.2s ease-in-out infinite', whiteSpace: 'nowrap' }}>
                  agent running
                </span>
              </>
            ) : (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333', display: 'inline-block', flexShrink: 0 }} />
                <span className="hidden sm:inline" style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  manual mode · type a command above
                </span>
                <span className="inline sm:hidden" style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  manual mode
                </span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <ModeToggle mode={mode} onClick={() => { setLines([]); setMode(m => m === 'auto' ? 'manual' : 'auto') }} />
            <IconBtn onClick={() => setPopup('server in agentic mode - powering off requires sudo privileges')} title="Power">
              <PowerIcon />
            </IconBtn>
            <IconBtn onClick={() => setPopup('audio subsystem locked - unmuting requires sudo privileges')} title="Volume">
              <VolumeOffIcon />
            </IconBtn>
          </div>

          {popup && <ErrorPopup msg={popup} onClose={() => setPopup(null)} />}
        </div>
      </div>
    </>
  )
}
