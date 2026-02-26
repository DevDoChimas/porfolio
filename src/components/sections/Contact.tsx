import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Mail, Github, Linkedin, Phone } from 'lucide-react'
import { identity, company, social } from '@/content/config'

export function Contact() {
  const t = useTranslations('contact')

  return (
    <section id="contact" className="py-24 px-6 bg-[rgb(var(--navy))] text-[rgb(var(--cream))]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-mono text-xs tracking-widest uppercase text-amber mb-4">{t('label')}</p>
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">{t('title')}</h2>
        <p className="opacity-60 mb-12 text-lg">{t('subtitle')}</p>

        {/* Social links */}
        <div className="flex justify-center gap-6 flex-wrap mb-16">
          <Link
            href={`mailto:${identity.email}`}
            className="flex items-center gap-2 border border-amber text-amber px-6 py-3 rounded font-mono text-sm hover:bg-amber hover:text-navy transition-all"
          >
            <Mail size={16} />
            {t('email')}
          </Link>
          <Link
            href={social.github}
            target="_blank"
            className="flex items-center gap-2 border border-[rgb(var(--cream)/0.3)] px-6 py-3 rounded font-mono text-sm hover:border-amber hover:text-amber transition-all"
          >
            <Github size={16} />
            GitHub
          </Link>
          <Link
            href={social.linkedin}
            target="_blank"
            className="flex items-center gap-2 border border-[rgb(var(--cream)/0.3)] px-6 py-3 rounded font-mono text-sm hover:border-amber hover:text-amber transition-all"
          >
            <Linkedin size={16} />
            LinkedIn
          </Link>
          <Link
            href={`tel:${identity.phone}`}
            className="flex items-center gap-2 border border-[rgb(var(--cream)/0.3)] px-6 py-3 rounded font-mono text-sm hover:border-amber hover:text-amber transition-all"
          >
            <Phone size={16} />
            {identity.phone}
          </Link>
        </div>

        {/* Company info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-[rgb(var(--cream)/0.1)] pt-12">
          {[
            { label: t('company.cnpj'),    value: company.cnpj },
            { label: t('company.founded'), value: company.founded },
            { label: t('company.status'),  value: t('company.statusValue') },
            { label: t('company.location'),value: identity.location },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-mono text-xs text-amber tracking-widest uppercase mb-1">{item.label}</p>
              <p className="font-mono text-xs opacity-70">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
