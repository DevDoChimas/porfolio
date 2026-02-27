import { useTranslations } from 'next-intl'
import { workflowSteps } from '@/content/config'

export function Workflow() {
  const t = useTranslations('workflow')

  return (
    <section className="content-auto py-24 px-6 bg-[rgb(var(--surface))]">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-amber mb-2">{t('label')}</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-12">{t('title')}</h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {workflowSteps.map((step) => (
            <div
              key={step.key}
              className="group border border-[rgb(var(--border)/0.15)] rounded-lg p-5 hover:border-amber/40 transition-all hover:-translate-y-1 text-center"
            >
              <div className="text-3xl mb-3">{step.icon}</div>
              <div className="font-mono text-xs text-amber mb-2">0{step.step}</div>
              <h3 className="font-display font-bold text-sm mb-2">{t(`steps.${step.key}.name`)}</h3>
              <p className="font-mono text-xs opacity-60 leading-relaxed">
                {t(`steps.${step.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
