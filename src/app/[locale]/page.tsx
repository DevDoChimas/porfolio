import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Workflow } from '@/components/sections/Workflow'
import { getHeroRoles, getIdentity, getSkillCategories } from '@/lib/content'

export default function HomePage() {
  const identity = getIdentity()
  const heroRoles = getHeroRoles()
  const skillCategories = getSkillCategories()

  return (
    <>
      <Navbar identity={identity} />
      <main>
        <Hero identity={identity} heroRoles={heroRoles} />
        <Marquee />
        <About />
        <Skills skillCategories={skillCategories} />
        <Experience />
        <Projects />
        <Workflow />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
