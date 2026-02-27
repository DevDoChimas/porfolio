import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { identity } from '@/content/config'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-family-display',
  display: 'swap',
})

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-family-body',
  display: 'swap',
})

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-family-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${identity.brand} — ${identity.name}`,
  description:
    'Full-Stack Developer especializado em Python, TypeScript e Next.js. Florianópolis, SC.',
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
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
