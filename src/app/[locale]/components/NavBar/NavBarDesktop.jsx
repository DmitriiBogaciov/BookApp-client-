'use client';

import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Input } from 'reactstrap';
import LogInButton from './LogInButton';
import LocaleSwitcher from '../LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { useUser } from '@auth0/nextjs-auth0/client'

const NavBar = () => {
  const t = useTranslations('Nav');
  const { user, error, isLoading } = useUser();

  return (
    <div className="nav-container hidden-md-up">
      <Navbar color="light" light expand="md" className="justify-content-center bg-gray-500">
        <NavbarBrand >
          <Link className='no-underline !text-baoboox font-bold text-lg' href={`/`}>BaoBoox</Link>
        </NavbarBrand>
        <Nav className="mr-auto flex-grow-1 justify-content-end" navbar>
          <NavItem>
            <Link className='no-underline' href={`/explore`} passHref>
              <NavLink>
                {t('Explore')}
              </NavLink>
            </Link>
          </NavItem>
          <NavItem className='flex-1'>
            <Input type="text" placeholder={t('Search')} className="" />
          </NavItem>
          <NavItem>
            {user ? (
              <Link className='no-underline' href={`/studio`} passHref>
                <NavLink>
                  {t('MyStudio')}
                </NavLink>
              </Link>
            ) : (
              <NavLink>Write Now</NavLink>
            )}
          </NavItem>
          <NavItem>
            <Link className='no-underline' href={`/continue`} passHref>
              <NavLink>
                {t('Continue')}
              </NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="">
              <LocaleSwitcher />
            </NavLink>
          </NavItem>
          <NavItem className='flex content-center'>
            <LogInButton />
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavBar;
