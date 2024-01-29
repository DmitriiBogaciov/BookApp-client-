'use client';

import React, { useState } from 'react';
import {
  Container,
  Nav,
  NavItem,
  Navbar,
  Collapse,
  NavbarToggler,
  UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import { useUser } from '@auth0/nextjs-auth0/client';
import TokenModal from './TokenModal';

const NavBar = () => {
  const { user, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen)
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  const openTokenModal = () => setTokenModalOpen(true);
  const closeTokenModal = () => setTokenModalOpen(false);

  return (
    <div className="nav-container" data-testid="navbar">
      <Navbar color="light" light expand="md">
        <Container>
          <NavbarToggler onClick={toggle}/>
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <a href="/" className="nav-link">
                  Home
                </a>
              </NavItem>
              {user && (
                <NavItem>
                  <button onClick={openTokenModal} className="nav-link">ShowToken</button>
                  <TokenModal isOpen={tokenModalOpen} onClose={closeTokenModal}/>
                </NavItem>
              )}
            </Nav>
            {/*Navbar-login-desktop*/}
            <Nav className="d-none d-md-block" navbar>
              {!isLoading && !user && (
                <NavItem id="qsLoginBtn">
                  <a href="/api/auth/login" className="nav-link">
                    Log in
                  </a>
                </NavItem>
              )}
              {user && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="40"
                      height="40"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>
                      {user.name}
                    </DropdownItem>
                    <DropdownItem>
                      <a href="/api/auth/logout">
                        Log out
                      </a>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {/*Navbar-login-mobile*/}
            {!isLoading && !user && (
              <Nav className="d-md-none" navbar>
                <a href="/api/auth/login">
                  Log in
                </a>
              </Nav>
            )}
            {user && (
              <Nav className="d-md-none justify-content-between" navbar>
                <NavItem>
                            <span className="user-info">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={user.picture}
                                alt="Profile"
                                className="nav-user-profile d-inline-block rounded-circle mr-3"
                                width="50"
                                height="50"
                              />
                              <h6 className="d-inline-block">
                                {user.name}
                              </h6>
                            </span>
                </NavItem>
                <NavItem>
                  <a href="/api/auth/logout">
                    Log out
                  </a>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;