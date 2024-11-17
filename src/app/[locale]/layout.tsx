import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { ReactNode } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
// import MainNavBar from '../components/NavBar/MainNavBar';
import { locales } from '@/config';
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: Omit<Props, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('title')
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

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
          <UserProvider>
              <div className=''>
                {/* <MainNavBar /> */}
              </div>
              {children}
          </UserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
