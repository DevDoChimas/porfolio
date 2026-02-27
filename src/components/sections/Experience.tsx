import { useTranslations } from 'next-intl'
import { experiences } from '@/content/config'

export function Experience() {
  const t = useTranslations('experience')

  return (
    <section id="experience" className="content-auto py-24 px-6 bg-[rgb(var(--surface))]">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-amber mb-2">{t('label')}</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-16">{t('title')}</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[rgb(var(--border)/0.2)]" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <div key={i} className="relative pl-12">
                {/* Dot */}
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-2 border-amber bg-[rgb(var(--background))] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber" />
                </div>

                <p className="font-mono text-xs text-amber mb-1">{exp.period}</p>
                <h3 className="font-display text-xl font-bold">{exp.role}</h3>
                <p className="opacity-60 text-sm mb-3">{exp.company}</p>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs border border-[rgb(var(--border)/0.2)] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
