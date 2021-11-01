import React from 'react'
import { NavLink as Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import styled from "styled-components";

const NavLink = styled(Link)`
    font-size:  14px;
    margin: 10px;
    cursor: pointer;
    text-decoration: none;
    color: #CBCBCB;
    height: 50px;
    border-radius: 6px;    
    display: flex;
    align-items: center;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none; 
            user-select: none; 
    
    &:hover {
        background-color: #383838;
    }
    &.active {
        background-color: #EF7D00;
        font-weight: bold;
        color: white;
    }`;

const NavButton = (props) => {
    const { icon, text, width, to, isSignOut } = props
    const { signout } = useAuth()

    const handleSignOut = () => {
        if (typeof isSignOut !== 'undefined' && isSignOut !== null && isSignOut === true) {
            signout()
        }
    }

    return (
        <NavLink exact to={to ?? "/"} onClick={handleSignOut}>
            <div style={{ width: '140px', textAlign: 'left', marginLeft: '15px' }}>
                {icon}
                <div style={{ display: 'inline', marginLeft: '10px' }}>
                    {text}
                </div>
            </div>
        </NavLink>
    )
}

export default NavButton
