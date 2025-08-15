'use client';

import React, { useState } from 'react';
import LogInButton from './LogInButton';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useUser } from '@auth0/nextjs-auth0';

function CustomLink({ href, className = '', children, ...props }) {
  return (
    <Link
      href={href}
      className={`!no-underline !text-slate-700 hover:!text-slate-900 ${className}`}
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
    <div className="nav-container shadow-md rounded-b-xl">
      <nav className="h-14 bg-gray-100">
        <div className="mx-auto h-14 px-3 flex items-center justify-between gap-2">
          <CustomLink href="/" className="no-underline font-bold text-lg text-baoboox">
            BaoBoox
          </CustomLink>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop search */}
            <div className="hidden md:block">
              <input
                type="text"
                placeholder={t('Search')}
                className="w-72 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-baoboox/40 focus:border-baoboox"
              />
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              <CustomLink href="/explore" className="text-slate-700 hover:text-slate-900">
                {t('Explore')}
              </CustomLink>

              {user ? (
                <CustomLink href="/studio" className="text-slate-700 hover:text-slate-900">
                  {t('MyStudio')}
                </CustomLink>
              ) : (
                <button type="button" className="text-slate-700 hover:text-slate-900">
                  Write Now
                </button>
              )}

              <CustomLink href="/continue" className="text-slate-700 hover:text-slate-900">
                {t('Continue')}
              </CustomLink>

              <div className="flex items-center">
                <LocaleSwitcher />
              </div>

              <LogInButton />
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-gray-200 hover:text-slate-900 md:hidden"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(v => !v)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                className={`h-5 w-5 ${isOpen ? 'hidden' : 'block'}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <svg
                className={`h-5 w-5 ${isOpen ? 'block' : 'hidden'}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <div id="mobile-menu" className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-3 pb-3 pt-2 space-y-2 border-t border-gray-200 bg-gray-100">
            <div>
              <input
                type="text"
                placeholder={t('Search')}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-baoboox/40 focus:border-baoboox"
              />
            </div>

            <CustomLink href="/explore" className="block px-1 py-1.5 text-slate-700 hover:text-slate-900" onClick={() => setIsOpen(false)}>
              {t('Explore')}
            </CustomLink>

            {user ? (
              <CustomLink href="/studio" className="block px-1 py-1.5 text-slate-700 hover:text-slate-900" onClick={() => setIsOpen(false)}>
                {t('MyStudio')}
              </CustomLink>
            ) : (
              <button type="button" className="block w-full text-left px-1 py-1.5 text-slate-700 hover:text-slate-900">
                Write Now
              </button>
            )}

            <CustomLink href="/continue" className="block px-1 py-1.5 text-slate-700 hover:text-slate-900" onClick={() => setIsOpen(false)}>
              {t('Continue')}
            </CustomLink>

            <div className="flex items-center justify-between pt-2">
              <LocaleSwitcher />
              <LogInButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
