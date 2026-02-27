import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

// ─── Types ──────────────────────────────────────────────────────────────────

export type Identity = {
  name: string
  brand: string
  role: string
  email: string
  phone: string
  location: string
  logo: string
}

export type Company = {
  name: string
  cnpj: string
  founded: string
  status: string
}

export type Social = {
  github: string
  linkedin: string
  twitter?: string
}

export type Skill = {
  name: string
  level: number
  icon?: string
}

export type SkillCategory = {
  key: string
  skills: Skill[]
}

export type Experience = {
  period: string
  role: string
  company: string
  companyUrl?: string
  tags: string[]
}

export type Project = {
  key: string
  url?: string
  github?: string
  tags: string[]
  status: 'live' | 'beta' | 'wip' | 'closed'
  featured?: boolean
}

export type WorkflowStep = {
  key: string
  icon: string
  step: number
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const contentDir = path.join(process.cwd(), 'content')

function readFrontmatter<T>(file: string): T {
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8')
  const { data } = matter(raw)
  return data as T
}

// ─── Identity file ──────────────────────────────────────────────────────────

type IdentityFile = {
  identity: Identity
  company: Company
  social: Social
  heroRoles: Record<string, string[]>
}

function getIdentityFile() {
  return readFrontmatter<IdentityFile>('identity.md')
}

export function getIdentity(): Identity {
  return getIdentityFile().identity
}

export function getCompany(): Company {
  return getIdentityFile().company
}

export function getSocial(): Social {
  return getIdentityFile().social
}

export function getHeroRoles(): Record<string, string[]> {
  return getIdentityFile().heroRoles
}

// ─── Skills file ────────────────────────────────────────────────────────────

type SkillsFile = {
  skillCategories: SkillCategory[]
  techStack: string[]
}

function getSkillsFile() {
  return readFrontmatter<SkillsFile>('skills.md')
}

export function getSkillCategories(): SkillCategory[] {
  return getSkillsFile().skillCategories
}

export function getTechStack(): string[] {
  return getSkillsFile().techStack
}

// ─── Experience file ────────────────────────────────────────────────────────

export function getExperiences(): Experience[] {
  return readFrontmatter<{ experiences: Experience[] }>('experience.md').experiences
}

// ─── Projects file ──────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  return readFrontmatter<{ projects: Project[] }>('projects.md').projects
}

// ─── Workflow file ──────────────────────────────────────────────────────────

export function getWorkflowSteps(): WorkflowStep[] {
  return readFrontmatter<{ workflowSteps: WorkflowStep[] }>('workflow.md').workflowSteps
}

// ─── Locale messages ────────────────────────────────────────────────────────

export function getMessages(locale: string): Record<string, unknown> {
  return readFrontmatter<Record<string, unknown>>(`locales/${locale}.md`)
}
