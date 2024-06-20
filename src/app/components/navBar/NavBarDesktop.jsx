import React from 'react';
import { useTranslation } from 'next-i18next';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Input } from 'reactstrap';
import LogInButton from './LogInButton';

const NavBar = () => {
  const { t } = useTranslation();

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md" className="justify-content-center">
        <NavbarBrand href='/' className='no-underline !text-baoboox font-bold text-lg'>
          {t('BaoBoox')}
        </NavbarBrand>
        <Nav className="mr-auto flex-grow-1 justify-content-end" navbar>
          <NavItem>
            <NavLink href="#" className="">
              {t('Explore')}
            </NavLink>
          </NavItem>
          <NavItem className='flex-1'>
            <Input type="text" placeholder="Search..." className="" />
          </NavItem>
          <NavItem>
            <NavLink href="#" className="">
              {t('My studio')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="">
              {t('Continue')}
            </NavLink>
          </NavItem>
          <NavItem>
            <LogInButton />
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavBar;
