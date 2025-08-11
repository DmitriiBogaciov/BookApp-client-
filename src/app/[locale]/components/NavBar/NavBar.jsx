'use client';

import React, { useState } from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  Nav, 
  NavItem, 
  NavLink, 
  Input, 
  NavbarToggler, 
  Collapse 
} from 'reactstrap';
import LogInButton from './LogInButton';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useUser } from '@auth0/nextjs-auth0';

const NavBar = () => {
  const t = useTranslations('Nav');
  const { user, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="nav-container shadow-md rounded-b-xl">
      <Navbar light expand="md" className="h-14 bg-gray-100 px-0 mx-0">
        {/* Используйте NavbarBrand как Link напрямую */}
        <Link className="no-underline font-bold text-lg !text-baoboox navbar-brand" href={`/`}>
          BaoBoox
        </Link>
        
        <NavbarToggler onClick={toggle} className="border-0" />
        
        <Collapse isOpen={isOpen} navbar>
          <Nav className="flex-grow-1" navbar>
            <NavItem>
              <Link className="no-underline nav-link" href={`/explore`}>
                {t('Explore')}
              </Link>
            </NavItem>
            <NavItem className="flex-1">
              <Input type="text" placeholder={t('Search')} className="w-full" />
            </NavItem>
            <NavItem>
              {user ? (
                <Link className="no-underline nav-link" href={`/studio`}>
                  {t('MyStudio')}
                </Link>
              ) : (
                <NavLink>Write Now</NavLink>
              )}
            </NavItem>
            <NavItem>
              <Link className="no-underline nav-link" href={`/continue`}>
                {t('Continue')}
              </Link>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <LocaleSwitcher />
              </NavLink>
            </NavItem>
            <NavItem>
              <LogInButton />
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
