'use client'

import { Globe, Moon, Sun } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Identity } from '@/lib/content'

const NAV_LINKS = ['about', 'skills', 'experience', 'projects', 'contact'] as const

export function Navbar({ identity }: { identity: Identity }) {
  const t = useTranslations('nav')
  const { theme, setTheme } = useTheme()
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleLocale() {
    const next: Locale = locale === 'pt-BR' ? 'en' : 'pt-BR'
    router.replace(pathname, { locale: next })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 backdrop-blur-md bg-[rgb(var(--background)/0.85)] border-b border-[rgb(var(--border)/0.15)] shadow-sm'
          : 'py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="font-display font-bold text-lg tracking-tight hover:text-amber transition-colors"
        >
          {identity.brand}
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="font-mono text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:text-amber transition-all"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            type="button"
            onClick={toggleLocale}
            title={t('toggleLang')}
            className="p-2 rounded-full hover:bg-[rgb(var(--surface))] transition-colors"
          >
            <Globe size={16} className="opacity-70" />
          </button>

          {/* Theme toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={t('toggleTheme')}
              className="p-2 rounded-full hover:bg-[rgb(var(--surface))] transition-colors"
            >
              {theme === 'dark' ? (
                <Sun size={16} className="opacity-70" />
              ) : (
                <Moon size={16} className="opacity-70" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
