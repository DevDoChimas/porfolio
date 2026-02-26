import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import { projects } from '@/content/config'

const STATUS_COLORS = {
  live:   'bg-green-500/20 text-green-400 border-green-500/30',
  beta:   'bg-amber/20 text-amber border-amber/30',
  wip:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export function Projects() {
  const t = useTranslations('projects')

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-amber mb-2">{t('label')}</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-12">{t('title')}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const name = t(`${project.key}.name`)
            const description = t(`${project.key}.description`)

            return (
              <div
                key={project.key}
                className="group border border-[rgb(var(--border)/0.15)] rounded-lg p-6 hover:border-amber/40 transition-all hover:-translate-y-1 flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-xl font-bold">{name}</h3>
                  <span className={`font-mono text-xs border px-2 py-0.5 rounded-full ${STATUS_COLORS[project.status]}`}>
                    {t(`status.${project.status}`)}
                  </span>
                </div>

                {/* Description */}
                <p className="opacity-70 text-sm leading-relaxed flex-1">{description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-xs bg-[rgb(var(--surface))] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-2 border-t border-[rgb(var(--border)/0.1)]">
                  {project.url && (
                    <Link
                      href={project.url}
                      target="_blank"
                      className="flex items-center gap-1.5 font-mono text-xs opacity-60 hover:opacity-100 hover:text-amber transition-all"
                    >
                      <ExternalLink size={12} />
                      {t('viewProject')}
                    </Link>
                  )}
                  {project.github && (
                    <Link
                      href={project.github}
                      target="_blank"
                      className="flex items-center gap-1.5 font-mono text-xs opacity-60 hover:opacity-100 hover:text-amber transition-all"
                    >
                      <Github size={12} />
                      {t('viewCode')}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
