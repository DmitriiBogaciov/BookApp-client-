'use client'

import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Input } from 'reactstrap';
import LogInButton from './LogInButton';
import LocaleSwitcher from '../LocaleSwitcher';
import {useTranslations} from 'next-intl';

const NavBar = () => {
  const n = useTranslations('Nav')

  return (
    <div className="nav-container hidden-md-up ">
      <Navbar color="light" light expand="md" className="justify-content-center bg-gray-500">
        <NavbarBrand href='/' className='no-underline !text-baoboox font-bold text-lg'>
          BaoBoox
        </NavbarBrand>
        <Nav className="mr-auto flex-grow-1 justify-content-end" navbar>
          <NavItem>
            <NavLink href="#" className="">
              {n('Explore')}
            </NavLink>
          </NavItem>
          <NavItem className='flex-1'>
            <Input type="text" placeholder={n('Search')} className="" />
          </NavItem>
          <NavItem>
            <NavLink href="#" className="">
              {n('MyStudio')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="">
              {n('Continue')}
            </NavLink>
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
