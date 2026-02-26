import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { identity } from '@/content/config'
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
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
