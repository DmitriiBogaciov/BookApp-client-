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
import { Link } from '@/navigation';
import { useUser } from '@auth0/nextjs-auth0';

const NavBar = () => {
  const t = useTranslations('Nav');
  const { user, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false); // Для управления открытием/закрытием меню

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md" className="bg-gray-500">
        <NavbarBrand>
          <Link className="no-underline font-bold text-lg !text-baoboox" href={`/`}>
            BaoBoox
          </Link>
        </NavbarBrand>
        
        <NavbarToggler onClick={toggle} className="border-0" />
        
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto flex-grow-1 justify-content-end" navbar>
            <NavItem>
              <Link className="no-underline" href={`/explore`} passHref>
                <NavLink>{t('Explore')}</NavLink>
              </Link>
            </NavItem>
            <NavItem className="flex-1">
              <Input type="text" placeholder={t('Search')} className="w-full" />
            </NavItem>
            <NavItem>
              {user ? (
                <Link className="no-underline" href={`/studio`} passHref>
                  <NavLink>{t('MyStudio')}</NavLink>
                </Link>
              ) : (
                <NavLink>Write Now</NavLink>
              )}
            </NavItem>
            <NavItem>
              <Link className="no-underline" href={`/continue`} passHref>
                <NavLink>{t('Continue')}</NavLink>
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
