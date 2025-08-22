import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useAppContext();
    const userName = sessionStorage.getItem('name');
    console.info(`isLoggedIn: ${isLoggedIn}, userName: ${userName}, sessionStorage.getItem('name'): ${sessionStorage.getItem('name')}, sessionStorage.getItem('auth-token'): ${sessionStorage.getItem('auth-token')}`);
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('entering handleLogout()...');
        setIsLoggedIn(false);
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('email');
        console.log('exiting handleLogout()...');
        navigate('/');
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">GiftLink</a>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {/* Task 1: Add links to Home and Gifts below*/}
                    <li className="nav-item">
                        <a className="nav-link" href="/home.html">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app">Gifts</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app/search">Search</a>
                    </li>
                    <div className="collapse navbar-collapse">
                    {isLoggedIn ? (
                        <>
                        <li className="nav-item">
                            <span className="lead">Welcome {userName}</span>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleLogout}>Logout</button>
                        </li>
                        </>
                    ) : (
                        <>
                        <li className="nav-item">
                            <a className="nav-link" href="/app/login">Login</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/app/register">Register</a>
                        </li>
                        </>
                    )}
                    </div>
                </ul>
            </div>
        </nav>
    );
}
