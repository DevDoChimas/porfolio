/**
 * ╔══════════════════════════════════════════════════╗
 * ║           CONTEÚDO DO PORTFOLIO                  ║
 * ║  Edite este arquivo para atualizar o site        ║
 * ╚══════════════════════════════════════════════════╝
 *
 * Textos longos (bio, descrições) ficam em:
 *   messages/pt-BR.json  →  Português
 *   messages/en.json     →  English
 *
 * Dados estruturados (links, skills, projetos) ficam aqui.
 */

// ─── Identidade ─────────────────────────────────────────────────────────────

export const identity = {
  name: 'Jean Carlos Londero',
  brand: 'Dev do Chimas',
  role: 'Full-Stack Developer',
  email: 'contato@devdochimas.com.br',
  phone: '+55 (46) 3300-2670',
  location: 'Florianópolis, SC — Brasil',
  logo: '/images/logo.png', // coloque o logo em public/images/logo.png
} as const

// ─── Links sociais ───────────────────────────────────────────────────────────

export const social = {
  github: 'https://github.com/SEU_USUARIO',
  linkedin: 'https://linkedin.com/in/SEU_USUARIO',
  // twitter: 'https://twitter.com/SEU_USUARIO', // descomente se quiser
} as const

// ─── Empresa ─────────────────────────────────────────────────────────────────

export const company = {
  name: 'Londero Soluções em Tecnologia Ltda',
  cnpj: '49.110.591/0001-49',
  founded: '2023',
  status: 'Ativa',
} as const

// ─── Typewriter roles (hero) ──────────────────────────────────────────────────
// Aparece como animação de texto no hero. Use a chave i18n (messages/*.json)
// ou coloque o texto direto aqui como fallback.

export const heroRoles = {
  'pt-BR': [
    'Arquiteto de Software',
    'Dev Full-Stack',
    'Entusiasta de IA',
    'Fazedor de Soluções',
  ],
  en: [
    'Software Architect',
    'Full-Stack Dev',
    'AI Enthusiast',
    'Problem Solver',
  ],
} as const

// ─── Skills ──────────────────────────────────────────────────────────────────

export type Skill = {
  name: string
  level: number // 0–100
  icon?: string // emoji ou caminho de imagem
}

export type SkillCategory = {
  key: string // chave para tradução (messages.skills.categories.<key>)
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    key: 'frontend',
    skills: [
      { name: 'React / Next.js', level: 92 },
      { name: 'TypeScript',      level: 88 },
      { name: 'Tailwind CSS',    level: 90 },
      { name: 'Framer Motion',   level: 75 },
    ],
  },
  {
    key: 'backend',
    skills: [
      { name: 'Python / FastAPI', level: 90 },
      { name: 'Node.js',          level: 82 },
      { name: 'Django',           level: 78 },
      { name: 'REST / GraphQL',   level: 85 },
    ],
  },
  {
    key: 'infra',
    skills: [
      { name: 'PostgreSQL',    level: 85 },
      { name: 'Docker',        level: 80 },
      { name: 'Oracle Cloud',  level: 72 },
      { name: 'Redis',         level: 70 },
    ],
  },
]

// ─── Tech stack (marquee) ─────────────────────────────────────────────────────

export const techStack = [
  'React', 'Next.js', 'TypeScript', 'Python', 'FastAPI',
  'Django', 'Node.js', 'PostgreSQL', 'Docker', 'Redis',
  'Tailwind CSS', 'Framer Motion', 'Oracle Cloud', 'shadcn/ui',
]

// ─── Experiência ──────────────────────────────────────────────────────────────

export type Experience = {
  period: string
  role: string          // chave i18n ou texto direto
  company: string
  companyUrl?: string
  tags: string[]
}

export const experiences: Experience[] = [
  {
    period: '2023 – hoje',
    role: 'Fundador & Dev Full-Stack',
    company: 'Londero Soluções em Tecnologia (Dev do Chimas)',
    tags: ['Next.js', 'FastAPI', 'PostgreSQL', 'Oracle Cloud', 'IA'],
  },
  {
    period: '2021 – 2023',
    role: 'Desenvolvedor Full-Stack Sênior',
    company: 'ADICIONE SUA EMPRESA',
    tags: ['React', 'Node.js', 'Python', 'Docker'],
  },
  {
    period: '2019 – 2021',
    role: 'Desenvolvedor Full-Stack Pleno',
    company: 'ADICIONE SUA EMPRESA',
    tags: ['Vue.js', 'Django', 'PostgreSQL'],
  },
  {
    period: '2018 – 2019',
    role: 'Desenvolvedor Junior',
    company: 'ADICIONE SUA EMPRESA',
    tags: ['JavaScript', 'PHP', 'MySQL'],
  },
]

// ─── Projetos ─────────────────────────────────────────────────────────────────

export type Project = {
  key: string          // chave i18n para nome/descrição (messages.projects.<key>)
  url?: string
  github?: string
  tags: string[]
  status: 'live' | 'beta' | 'wip' | 'closed'
  featured?: boolean
}

export const projects: Project[] = [
  {
    key: 'supercota',
    url: 'https://ADICIONE_URL',
    tags: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
    status: 'live',
    featured: true,
  },
  {
    key: 'jusdocs',
    url: 'https://jusdocs.com',
    tags: ['Next.js', 'TypeScript', 'Elastic Search'],
    status: 'live',
    featured: true,
  },
  {
    key: 'cacheta',
    url: 'https://ADICIONE_URL',
    tags: ['Node.js', 'Colyseus', 'React', 'WebSocket'],
    status: 'beta',
    featured: true,
  },
]

// ─── Workflow (processo de trabalho) ─────────────────────────────────────────

export const workflowSteps = [
  { key: 'discovery',    icon: '🔍', step: 1 },
  { key: 'architecture', icon: '🏗️',  step: 2 },
  { key: 'development',  icon: '💻', step: 3 },
  { key: 'review',       icon: '🔄', step: 4 },
  { key: 'deploy',       icon: '🚀', step: 5 },
  { key: 'evolution',    icon: '📈', step: 6 },
]
