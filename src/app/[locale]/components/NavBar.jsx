'use client';

import React, { useState } from 'react';
import LogInButton from '../utils/LogInButton';
import LocaleSwitcher from '../utils/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import ThemeSwitcher from '../utils/ThemeSwither';

function CustomLink({ href, className = '', children, onClick, ...props }) {
  return (
    <Link
      href={href}
      className={`no-underline text-slate-700 dark:text-slate-300 hover:text-baoboox-600 dark:hover:text-baoboox-400 transition-colors duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
}

const NavBar = () => {
  const t = useTranslations('Nav');
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative w-full h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-slate-800">
      <div className="flex h-full items-center justify-between px-4">
        {/* Logo */}
        <CustomLink href="/" className="font-bold text-lg text-baoboox-600 dark:text-baoboox-400 hover:text-baoboox-700 dark:hover:text-baoboox-300">
          BaoBoox
        </CustomLink>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop search */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder={t('Search')}
              className="w-72 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-baoboox-500/40 dark:focus:ring-baoboox-400/40 focus:border-baoboox-500 dark:focus:border-baoboox-400 transition-all"
            />
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-3">
            <CustomLink href="/explore">
              {t('Explore')}
            </CustomLink>

            {user ? (
              <CustomLink href="/studio">
                {t('MyStudio')}
              </CustomLink>
            ) : (
              <button
                type="button"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Write Now
              </button>
            )}

            <CustomLink href="/continue">
              {t('Continue')}
            </CustomLink>

            <LocaleSwitcher />
            <ThemeSwitcher />
            <LogInButton />
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(v => !v)}
          >
            <span className="sr-only">Toggle menu</span>

            {/* Hamburger icon */}
            <svg
              className={isOpen ? 'hidden' : 'block h-5 w-5'}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>

            {/* Close icon */}
            <svg
              className={isOpen ? 'block h-5 w-5' : 'hidden'}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — появляется под navbar через absolute */}
      {isOpen && (
        <>
          {/* Backdrop для закрытия по клику вне меню */}
          <div
            className="fixed inset-0 bg-black/30 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile menu panel */}
          <div
            id="mobile-menu"
            className="absolute left-0 right-0 top-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl md:hidden"
          >
            <div className="px-4 py-3 space-y-2">
              {/* Mobile search */}
              <input
                type="text"
                placeholder={t('Search')}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-baoboox-500/40 dark:focus:ring-baoboox-400/40 focus:border-baoboox-500 dark:focus:border-baoboox-400 transition-all"
              />

              {/* Mobile navigation links */}
              <CustomLink
                href="/explore"
                className="block px-2 py-1.5"
                onClick={() => setIsOpen(false)}
              >
                {t('Explore')}
              </CustomLink>

              {user ? (
                <CustomLink
                  href="/studio"
                  className="block px-2 py-1.5"
                  onClick={() => setIsOpen(false)}
                >
                  {t('MyStudio')}
                </CustomLink>
              ) : (
                <button
                  type="button"
                  className="block w-full text-left px-2 py-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Write Now
                </button>
              )}

              <CustomLink
                href="/continue"
                className="block px-2 py-1.5"
                onClick={() => setIsOpen(false)}
              >
                {t('Continue')}
              </CustomLink>

              {/* Mobile bottom actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <LocaleSwitcher />
                <ThemeSwitcher />
                <LogInButton />
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
