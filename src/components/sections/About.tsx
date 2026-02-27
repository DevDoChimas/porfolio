import { useTranslations } from 'next-intl'
import { identity, company } from '@/content/config'

export function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="content-auto py-24 px-6 bg-[rgb(var(--navy))] text-[rgb(var(--cream))]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* Text */}
        <div className="space-y-6">
          <p className="font-mono text-xs tracking-widest uppercase text-amber">
            {t('label')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            {t('title')}
          </h2>
          <p className="opacity-80 leading-relaxed">{t('bio1')}</p>
          <p className="opacity-80 leading-relaxed">{t('bio2')}</p>
          <blockquote className="border-l-4 border-amber pl-4 font-display italic text-lg opacity-90">
            &ldquo;{t('quote')}&rdquo;
          </blockquote>
        </div>

        {/* Company card */}
        <div className="font-mono text-sm bg-[rgb(var(--navy-dark,_0_0_0)/0.3)] border border-[rgb(var(--cream)/0.1)] rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-4 text-xs opacity-40">{identity.brand}.ts</span>
          </div>

          {[
            ['nome', `"${company.name}"`],
            ['marca', `"${identity.brand}"`],
            ['cnpj', `"${company.cnpj}"`],
            ['fundada', `"${company.founded}"`],
            ['status', `"${company.status}"`],
            ['local', `"${identity.location}"`],
            ['email', `"${identity.email}"`],
          ].map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="text-amber">{key}</span>
              <span className="opacity-40">:</span>
              <span className="text-[rgb(var(--cream)/0.85)]">{value}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
