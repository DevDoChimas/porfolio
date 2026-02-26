import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { identity } from '@/content/config'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: `${identity.brand} — ${identity.name}`,
  description: 'Full-Stack Developer especializado em Python, TypeScript e Next.js. Florianópolis, SC.',
  keywords: ['desenvolvedor', 'full-stack', 'python', 'typescript', 'nextjs', 'florianópolis'],
  openGraph: {
    title: `${identity.brand} — ${identity.name}`,
    siteName: identity.brand,
    locale: 'pt_BR',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <NextIntlClientProvider>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
