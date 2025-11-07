import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import NavBar from './components/NavBar'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ApolloClientProvider } from '../providers/apollo-provider';
import { ThemeProvider } from '../providers/theme-provider';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        />
      </head>
      <body className={clsx(inter.className, 'flex flex-col w-screen h-screen overflow-hidden')}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <ApolloClientProvider>
              {/* Фиксированный header */}
              <nav className='h-12 relative z-100 shrink-0'>
                <NavBar />
              </nav>

              {/* Прокручиваемый контент */}
              <main className="flex-1 overflow-hidden">
                {children}
              </main>
            </ApolloClientProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

