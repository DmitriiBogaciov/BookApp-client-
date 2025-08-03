import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import NavBar from './components/NavBar/NavBar'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { ApolloClientProvider } from '../providers/apollo-provider';
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html className="h-full" lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        />
      </head>
      <body className={clsx(inter.className, 'flex h-full flex-col')}>
        <NextIntlClientProvider messages={messages}>
          <ApolloClientProvider>
            <div className=''>
              <NavBar />
            </div>
            {children}
          </ApolloClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
