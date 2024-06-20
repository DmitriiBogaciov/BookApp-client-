'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { NavLink } from 'reactstrap';

const LogInButton = () => {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return (
            <NavLink href="/api/auth/login" className='!text-slate-300' color='light'>
                Log in
            </NavLink>
        );
    }

    if (!user) {
        return (
            <NavLink href="/api/auth/login" className="!text-slate-700" color='light'>
                Log in
            </NavLink>
        );
    }

    return null;
};

export default LogInButton;