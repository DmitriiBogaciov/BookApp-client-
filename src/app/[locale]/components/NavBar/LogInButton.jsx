'use client';

import React, { use } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { NavLink } from 'reactstrap';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const LogInButton = () => {
    const { user, isLoading } = useUser();
    const t = useTranslations('Nav')
    const pathname = usePathname();

    if (isLoading) {
        return (
            <NavLink className='!text-slate-300' color='light'>
                {t('Login')}
            </NavLink>
        );
    }

    

    if (!user) {
        return (
            <NavLink href={`/api/auth/login?returnTo=${pathname}`} className="!text-slate-700" color='light'>
                {t('Login')}
            </NavLink>
        );
    }

    if (user) {
        return (
            <NavLink href="/api/auth/logout" className="!text-slate-700" color='light'>
                {t('Logout')}
            </NavLink>

        );
    }

    return null;
};

export default LogInButton;