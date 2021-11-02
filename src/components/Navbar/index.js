import React from 'react'
import NavButton from './NavButton'
import { Container, Row, Col } from 'react-grid-system'
import { useAuth } from '../../contexts/AuthContext'
import LuminusLogo from '../LuminusLogo'
import { PackageIcon, GraphIcon, PeopleIcon, BellIcon, PersonIcon, SignOutIcon } from '@primer/octicons-react';
import './navBar.css'

const NavBar = () => {
    const { isProf } = useAuth()

    return (
        <div id="NBarBox">
            <div className="NBarLogoSpacer" />
            <LuminusLogo isInvert />
            <div className="NBarLogoSpacer" />
            <nav>
                <Col>
                    <Row>
                        <NavButton text="Dashboard" to="/dashboard" icon={<GraphIcon size={16} />} />
                    </Row>
                    <Row>
                        <NavButton text="Modules" to="/" icon={<PackageIcon size={16} />} />
                    </Row>
                    {isProf && (
                        <Row>
                            <NavButton text="Students" to="/students" icon={<PeopleIcon size={16} />} />
                        </Row>
                    )}
                    <Row>
                        <NavButton text="Notifications" to="/notifs" icon={<BellIcon size={16} />} />
                    </Row>
                    <Row>
                        <NavButton text="Profile" to="/profile" icon={<PersonIcon size={16} />} />
                    </Row>
                    <Row>
                        <NavButton text="Sign-out" to="/auth" isSignOut icon={<SignOutIcon size={16} />} />
                    </Row>
                </Col>
            </nav>
        </div>
    )
}

export default NavBar
