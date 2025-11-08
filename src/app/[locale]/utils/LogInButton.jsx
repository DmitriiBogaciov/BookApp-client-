'use client';

import React, { use } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { NavLink } from 'reactstrap';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const LogInButton = () => {
    const { user, isLoading } = useUser();
    const t = useTranslations('Nav')
    const pathname = usePathname();

    if (isLoading) {
        return (
            <NavLink className='text-slate-300!' color='light'>
                {t('Login')}
            </NavLink>
        );
    }

    

    if (!user) {
        return (
            <NavLink href={`/auth/login?returnTo=${pathname}`} className="no-underline! text-slate-700! dark:text-slate-300! hover:text-slate-900! dark:hover:text-slate-200! 
        hover:bg-slate-100! dark:hover:bg-slate-600! rounded-lg transition-all duration-800" color='light'>
                {t('Login')}
            </NavLink>
        );
    }

    if (user) {
        return (
            <NavLink href="/auth/logout" className="no-underline! text-slate-700! dark:text-slate-300! hover:text-slate-900! dark:hover:text-slate-200! 
        hover:bg-slate-100! dark:hover:bg-slate-600! rounded-lg transition-all duration-800" color='light'>
                {t('Logout')}
            </NavLink>

        );
    }

    return null;
};

export default LogInButton;