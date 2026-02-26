import { useTranslations } from 'next-intl'
import { identity, company } from '@/content/config'

export function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[rgb(var(--border)/0.15)] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display font-bold">{identity.brand}</p>
          <p className="font-mono text-xs opacity-40 mt-1">
            {company.name} · {company.cnpj}
          </p>
        </div>

        <div className="text-center">
          <p className="font-mono text-xs opacity-40">{t('madeWith')}</p>
        </div>

        <p className="font-mono text-xs opacity-40">
          © {year} {identity.name}. {t('rights')}
        </p>
      </div>
    </footer>
  )
}
