import React, { useEffect, useState } from 'react';
import "./Navbar.css"
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../assets/logo.png";
import User from "../../assets/user.png";
import Bell from "../../assets/bell.png";
import Chat from "../../assets/chat.png";
import NotificationMenu from '../NotificationMenu/NotificationMenu';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showUsermenu, setShowUsermenu] = useState(false);
    const [showNotificationMenu, setShowNotificationMenu] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/home`)
        .then(result => {
            if (result.data === "Success") {
                setIsAuthenticated(true);
                axios.get(`${process.env.REACT_APP_API_URL}/user`)
                    .then(res => {
                        setUserId(res.data._id); 
                    })
                    .catch(err => console.log(err));
            } else {
                setIsAuthenticated(false);
            }
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('.show-user-menu') || event.target.closest('.user-menu')) {
                return;
            }
            setShowUsermenu(false); 

            if (event.target.closest('.bell') || event.target.closest('.notification-menu')) {
                return;
            }
            setShowNotificationMenu(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const toggleUserMenu = () => {
        setShowUsermenu(prev => !prev); 
        setShowNotificationMenu(false);
    };

    const toggleNotificationMenu = () => {
        setShowNotificationMenu (prev => !prev);
        setShowUsermenu(false); 
    }

    const handleLogout = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/logout`) 
        .then(() => {
            setIsAuthenticated(false); 
            navigate('/home'); 
        })
        .catch(err => console.log(err));
    };

    return (
        <div className='navbar'>
            <Link to="/home">
                <div className='logo-container'>
                    <img src={Logo} alt='logo' className='logo' />
                    <h1 className='logo-text'>Devora</h1>
                </div>
            </Link>
            <div className='right-part-nav'>
                <div>
                    <img src={Bell} alt='bell' className='bell' onClick={toggleNotificationMenu} />
                    {showNotificationMenu ? (
                        <NotificationMenu />
                    ) : null}
                </div>
                <div>
                    <Link to={`/chat/${userId}`}>
                        <img src={Chat} alt='chat' className='chat' />
                    </Link>
                </div>
                {isAuthenticated ? (
                    <>
                        <button onClick={toggleUserMenu} className='show-user-menu'>
                            <img src={User} alt='user' className='user-icon' />
                        </button>
                        {showUsermenu ? (
                            <div className='user-menu'>
                                <Link to={`/user/${userId}`} className='user-menu-link' onClick={toggleUserMenu}>Your profile</Link>
                                <button onClick={handleLogout} className='user-menu-button'>Log out</button>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <Link to="/login">
                        <button className='navbar-login'>Login</button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Navbar