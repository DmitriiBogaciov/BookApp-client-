'use client';

import React from 'react';
import {
    Container,
    Nav,
    NavItem,
    Navbar
} from 'reactstrap'
import { useUser } from '@auth0/nextjs-auth0/client';

const NavBar = () => {
    const { user, isLoading } = useUser();

    return (
        <div className="nav-container" data-testid="navbar">
            <Navbar color="light">
                <Container>
                    <Nav>
                        <NavItem>
                            <a href="/" className="nav-link" testId="navbar-home">
                                Home
                            </a>
                        </NavItem>
                        {!isLoading && !user && (
                            <NavItem id="qsLoginBtn">
                                <a href="/api/auth/login" className="nav-link" >Log in</a>
                            </NavItem>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavBar;