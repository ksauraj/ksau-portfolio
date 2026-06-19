export const personalInfo = {
  name: 'Sauraj Kumar Singh',
  role: 'DevOps Engineer',
  email: 'ksauraj1@gmail.com',
  location: 'India',
  logoName: 'Sauraj/>',
  logoSub: 'DevOps Engineer',
  mbti: {
    type: 'INTP',
    description: 'Introverted, Intuitive, Thinking, Perceiving'
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/ksauraj' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/sauraj-kumar-singh-807295226' },
    { label: 'Telegram', href: 'https://ksauraj.t.me' },
    { label: 'Twitter', href: 'https://twitter.com/k_sauraj' },
    { label: 'Instagram', href: 'https://instagram.com/ksauraj__' },
    { label: 'GitLab', href: 'https://gitlab.com/ksauraj' },
    { label: 'YouTube', href: 'https://www.youtube.com/c/SaurajGaming' },
    { label: 'Website', href: 'https://ksauraj.eu.org' }
  ]
}

// Animation Configurations
export const animationConfig = {
  // Centralized duration in milliseconds for the stats counting animation.
  // Set to a lower number (e.g., 1500) to speed up, or a higher number (e.g., 2500) to slow down.
  statsDuration: 2000,
  socials: {
    layoutRadius: 250,           // Base radius / spacing for initial layouts
    maxConnectionDist: 320,      // Max distance (in px) between nodes to draw connecting lines
    maxSimultaneousGlows: 4,     // Maximum number of lines that can glow randomly at once (n/2)
    glowSpawnProbability: 0.03,  // Probability per frame of spawning a new random line glow
    baseLineOpacity: 0.08,       // Base opacity of the static connection lines
    mouseSegmentThreshold: 150,  // Distance (in px) from cursor to line segment to activate it
    mouseGlowIntensity: 0.40,    // Extra line opacity added when cursor is near
    randomGlowIntensity: 0.45,   // Extra line opacity added during a random line glow
  }
}

export const heroPhrases = [
  '> Automating Infrastructure at Scale',
  '> Building Secure DevOps Pipelines',
  '> Kubernetes · Docker · Terraform',
  '> AWS & Azure Cloud Architecture',
  '> Optimizing CI/CD Speed & Stability',
  '> Designing Resilient Observability Stacks'
]

export const aboutContent = {
  bio: "I build pipelines so your load never bursts. Self-healing clusters, zero-downtime deploys, CI/CD that ships while you sleep — and monitoring stacks that catch fires before your users ever notice. Open source contributor by habit, automation-first by nature.",
  education: {
    degree: 'Bachelor of Technology (B.Tech.)',
    major: 'Information Technology',
    institution: 'AKTU',
    period: '2023 – 2027'
  },
  stats: [
    { value: 2, label: 'Yrs Open Source', suffix: '+' },
    { value: 2, label: 'Internships', suffix: '' },
    { value: 20, label: 'Projects', suffix: '+' },
    { value: 40, label: 'Cloud Tools', suffix: '+' }
  ]
}

export const skills = {
  'Languages': ['Go', 'Python', 'Bash', 'C', 'JavaScript', 'HTML', 'YAML', 'SQL'],
  'DevOps & Automation': ['Docker', 'Kubernetes', 'Helm', 'GitHub Actions', 'GitLab CI', 'Ansible', 'Terraform', 'Docker Compose', 'CI/CD Pipelines', 'IaC', 'Makefile'],
  'Cloud & Platforms': ['AWS', 'Azure', 'GCP', 'Oracle Cloud', 'Linode', 'Microsoft Graph API'],
  'Observability & Monitoring': ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'Node Exporter', 'cAdvisor', 'Wazuh', 'Log Aggregation', 'Alerting'],
  'Networking': ['TCP/IP', 'DNS', 'HTTP/HTTPS', 'TLS/SSL', 'Load Balancing', 'Reverse Proxies', 'Routing', 'Subnetting', 'VPN', 'API Gateways'],
  'Security & DevSecOps': ['HashiCorp Vault', 'Container Security', 'Secret Management', 'SBOM Generation', 'Vulnerability Scanning', 'Security Automation', 'PCI DSS', 'DDoS Detection', 'Access Control'],
  'Databases': ['MySQL', 'Database Design', 'Query Optimization'],
  'Linux & Systems': ['Linux', 'Systemd', 'Shell Scripting', 'Tmux', 'Vim', 'Process Management', 'Server Administration'],
  'Tools & Technologies': ['Git', 'Nginx', 'Caddy', 'Heroku', 'Railway', 'Kong API Gateway', 'REST APIs', 'Webhooks', 'Cirrus CI', 'Android Build System']
}

export const marqueeItems = [
  'Docker', 'Kubernetes', 'Terraform', 'AWS', 'Azure', 'Prometheus', 'Grafana', 'Vault', 'Go', 'Python', 'Bash', 'Linux', 'Nginx', 'GitLab CI', 'Ansible'
]

export const experiences = [
  {
    role: 'Software Engineer Intern - DevOps',
    company: 'ES Magico AI Studio',
    period: 'May 2025 – Present',
    type: 'Remote',
    bullets: [
      'Led deployment setup across multiple projects using Docker and GitHub Actions',
      'Set up scalable monitoring and load balancing with multi-instance support inside custom VPCs',
      'Migrated DNS infrastructure from Route 53 to Cloudflare and integrated Kong API Gateway for multiple projects',
      'Integrated a comprehensive security pipeline into the main DevOps workflow, automating threat detection, password strength validation, and DDoS monitoring using custom scripts and tools',
      'Automated provisioning and infrastructure using Terraform, Ansible, and Make-based workflows',
      'Designed and implemented Azure infrastructure including Virtual Networks (VNet), Application Gateway, and Virtual Machine Scale Sets (VMSS) for high availability and controlled traffic routing',
      'Built and managed AWS infrastructure with VPC design, Application Load Balancers (ALB), and Auto Scaling Groups to support horizontally scalable services',
      'Developed custom scripts to manage and inject environment variables securely using HashiCorp Vault across multiple environments',
      'Performed load and stress testing on production-like environments to validate scalability, fault tolerance, and traffic handling limits'
    ]
  },
  {
    role: 'Backend Developer Intern',
    company: 'Welmun-Tech India Pvt Ltd',
    period: 'Feb 2025 – June 2025',
    type: 'Remote',
    bullets: [
      'Contributed to DevOps practices including CI/CD pipelines, containerization using Docker, and basic Kubernetes orchestration',
      'Assisted in architecting microservices and applying event-driven design patterns for modular services'
    ]
  }
]

export const projects = [
  {
    title: 'ksau CLI/Web Tool',
    stack: ['Go', 'Bash', 'Microsoft Graph API'],
    year: '2021–2025',
    description: 'CLI and web tool for file uploads to OneDrive using Microsoft Graph API. Migrated from Bash to Go for concurrency, performance, and maintainability. Backend API powers ksau-py and the web version.',
    links: [
      { label: 'GitHub', href: 'https://github.com/global-index-source/ksau-go' },
      { label: 'Live', href: 'https://ksau.ksauraj.eu.org' }
    ],
    terminal: '$ ksau upload --remote "OneDrive:/backup" ./infra\n✓ Uploading terraform.tfstate [2.3MB]\n✓ Upload complete in 1.2s'
  },
  {
    title: 'K8au Shell Analyzer',
    stack: ['Go', 'TUI', 'LLM', 'AI'],
    year: '2024',
    description: 'Interactive terminal tool that analyzes shell command history to discover behavioral patterns using LLM-based NLP to cluster and summarize usage insights.',
    links: [
      { label: 'GitHub', href: 'https://github.com/ksauraj/k8au-shell-analyzer' }
    ],
    terminal: '$ k8au analyze --history ~/.zsh_history\nAnalyzing 4,231 commands...\nTop patterns: docker (34%) · git (28%) · kubectl (18%)'
  },
  {
    title: 'JEE Counsellor',
    stack: ['Python', 'Terminal UX'],
    year: '2023',
    description: 'Terminal tool to help students navigate JEE counselling. Parses official seat allotment data and provides personalized college suggestions via interactive terminal UI.',
    links: [
      { label: 'GitHub', href: 'https://github.com/ksauraj/jee_counsellor' }
    ],
    terminal: '$ jee-counsellor --rank 8500 --category OBC-NCL\nTop matches: NIT Warangal · NIT Trichy · IIIT Hyderabad'
  },
  {
    title: 'Android Automation',
    stack: ['Python', 'GitHub API', 'GitLab API', 'Telegram API'],
    year: '2022',
    description: 'Telegram Bot-powered service that automates Android firmware dumps, recovery creation, and repo setup. Streamlines custom ROM contributions with minimal manual input.',
    links: [
      { label: 'GitHub', href: 'https://github.com/autoandroida' }
    ],
    terminal: '$ /dump RMX2151 --upload --create-repo\n✓ Firmware dumped (4.2GB)\n✓ Repo created: github.com/autoandroida/RMX2151'
  },
  {
    title: 'Telegram Bash Bot',
    stack: ['Bash', 'Telegram API'],
    year: '2022',
    description: 'Full-featured Telegram bot built entirely in Bash, capable of performing API-driven tasks. Used as a base template for Bash-based bot development.',
    links: [
      { label: 'GitHub', href: 'https://github.com/ksauraj/telegram-bash-bot' }
    ],
    terminal: '$ bash bot.sh --token $TG_TOKEN\nBot running... Listening for updates\n✓ Command /ping → responded in 142ms'
  }
]

export const openSource = [
  {
    title: 'CipherOS Maintainer',
    stack: ['Android', 'CI/CD', 'GitHub Actions', 'YAML'],
    year: '2021–2022',
    description: 'Maintained device tree for RMX2151 and handled CI/CD workflows to automate Android build releases. Managed project automation via GitHub Actions and optimized pipeline performance.',
    links: [
      { label: 'Website', href: 'https://cipheros.online' }
    ],
    terminal: '$ git clone https://github.com/CipherOS/manifest.git -b twelve\n✓ Fetching manifest...\n✓ Building CipherOS for RMX2151\n✓ Build successful! Uploading release...'
  },
  {
    title: 'PixelPlusUI Maintainer',
    stack: ['Android', 'Bash', 'OTA Updates', 'AOSP'],
    year: '2021–2022',
    description: 'Maintained Android ROM builds for RMX2151 and provided timely OTA updates to the community. Authored utility scripts to streamline test builds and automated file uploads for CI-based workflows.',
    links: [
      { label: 'XDA Thread', href: 'https://xdaforums.com/t/rom-official-11-0-rmx2151-pixelplus-ui-3-9-aosp-2021-09-12.4283233/' },
      { label: 'Website', href: 'https://ppui.site' }
    ],
    terminal: '$ make ppui -j$(nproc)\n✓ Compilation completed\n✓ OTA package generated\n✓ Uploading to sourceforge...'
  }
]
