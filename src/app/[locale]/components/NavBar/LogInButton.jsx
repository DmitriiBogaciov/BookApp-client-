'use client';

import React, { use } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { NavLink } from 'reactstrap';
import { useTranslations } from 'next-intl';

const LogInButton = () => {
    const { user, isLoading } = useUser();
    const t = useTranslations('Nav')

    if (isLoading) {
        return (
            <NavLink href="/api/auth/login" className='!text-slate-300' color='light'>
                {t('Login')}
            </NavLink>
        );
    }

    if (!user) {
        return (
            <NavLink href="/api/auth/login" className="!text-slate-700" color='light'>
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