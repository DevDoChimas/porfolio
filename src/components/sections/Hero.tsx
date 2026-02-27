'use client'

import { ArrowDown } from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { heroRoles, identity } from '@/content/config'
import type { Locale } from '@/i18n/routing'

export function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale() as Locale
  const roles = heroRoles[locale] ?? heroRoles['pt-BR']

  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Typewriter effect
  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false)
        setRoleIndex((i) => (i + 1) % roles.length)
      }, 0)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIndex, roles])

  return (
    <section id="hero" className="min-h-screen flex items-center pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* ── Text ── */}
        <div className="space-y-6">
          <p className="font-mono text-xs tracking-widest uppercase text-amber">{t('greeting')}</p>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
            {identity.name.split(' ')[0]}
            <br />
            <span className="text-amber">{identity.name.split(' ').slice(1).join(' ')}</span>
          </h1>

          {/* Typewriter */}
          <div className="font-display text-2xl md:text-3xl font-semibold min-h-[2rem]">
            {displayed}
            <span className="inline-block w-0.5 h-7 bg-amber ml-1 animate-pulse" />
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            {[
              { value: '6+', label: t('stats.years') },
              { value: '30+', label: t('stats.projects') },
              { value: '∞', label: t('stats.coffee') },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-amber">{s.value}</p>
                <p className="font-mono text-xs opacity-60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <a
            href="#about"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity mt-4"
          >
            <ArrowDown size={14} className="animate-bounce" />
            {t('scrollHint')}
          </a>
        </div>

        {/* ── Avatar ── */}
        <div className="flex justify-center items-center">
          <div className="relative w-72 h-72 md:w-80 md:h-80">
            {/* Rotating rings */}
            <div
              className="absolute inset-0 rounded-full border-2 border-amber/30 animate-spin-slow"
              style={{ animationDuration: '20s' }}
            />
            <div
              className="absolute inset-4 rounded-full border border-terracotta/20 animate-spin-slow"
              style={{ animationDuration: '35s', animationDirection: 'reverse' }}
            />

            {/* Logo circle */}
            <div className="absolute inset-8 rounded-full bg-[rgb(var(--surface))] flex items-center justify-center overflow-hidden border border-[rgb(var(--border)/0.15)]">
              <Image
                src={identity.logo}
                alt={identity.brand}
                width={200}
                height={200}
                className="object-contain w-[85%] h-[85%]"
                priority
              />
            </div>

            {/* Floating badges */}
            <div className="absolute -bottom-2 -left-4 bg-amber text-navy font-mono text-xs font-bold px-3 py-1.5 rounded animate-float">
              {t('badge.available')}
            </div>
            <div
              className="absolute -top-2 -right-4 bg-[rgb(var(--surface))] border border-[rgb(var(--border)/0.15)] font-mono text-xs px-3 py-1.5 rounded animate-float"
              style={{ animationDelay: '0.5s' }}
            >
              📍 {t('badge.location')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
